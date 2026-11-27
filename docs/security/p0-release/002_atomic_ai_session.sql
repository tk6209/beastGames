-- STAGED ONLY: do not copy into migration discovery paths or apply to production.
-- Prerequisite: reviewed schema with game_sessions.trust_version and game_players.user_id.
-- This slice creates a waiting session and its owner in ONE database transaction.
-- It deliberately cannot establish reward eligibility or initialize playable state.
BEGIN;
CREATE OR REPLACE FUNCTION public.bg_create_waiting_ai_session(
  p_verified_uid uuid,
  p_join_code text,
  p_monster_id text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
DECLARE
  v_session uuid;
BEGIN
  -- Only the trusted server may call this RPC after verifying the JWT.
  IF p_verified_uid IS NULL THEN
    RAISE EXCEPTION 'auth_required' USING ERRCODE = '22023';
  END IF;
  IF p_join_code IS NULL OR p_join_code !~ '^[A-Z0-9]{5}$' THEN
    RAISE EXCEPTION 'invalid_join_code' USING ERRCODE = '22023';
  END IF;
  IF p_monster_id IS NULL OR p_monster_id !~ '^[a-z][a-z0-9_-]{0,63}$' THEN
    RAISE EXCEPTION 'invalid_monster' USING ERRCODE = '22023';
  END IF;
  -- Fail closed until the canonical active-catalog and starter entitlement
  -- resolver is certified: no implicit starter or client-supplied entitlement.
  PERFORM 1 FROM public.user_inventory
    WHERE user_id = p_verified_uid AND item_type = 'monster'
      AND item_key = p_monster_id
    FOR SHARE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'monster_not_owned' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.game_sessions(join_code, status, state_json, current_turn, trust_version)
    VALUES (p_join_code, 'waiting', '{}'::jsonb, 0, 0)
    RETURNING id INTO STRICT v_session;

  -- Placeholder HP is not a combat state; canonical init is a later gate.
  -- No client slot, HP, deck, power, trust version or reward input is accepted.
  INSERT INTO public.game_players(session_id, user_id, slot, nickname,
    monster_id, hp, max_hp, state_json)
    VALUES (v_session, p_verified_uid, 0, 'Jogador', p_monster_id,
      100, 100, '{}'::jsonb);
  RETURN v_session;
  -- Any exception, including a unique join_code or owner FK violation,
  -- propagates and rolls back both inserts. Never catch and commit half a session.
END;
$function$;
REVOKE ALL ON FUNCTION public.bg_create_waiting_ai_session(uuid,text,text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bg_create_waiting_ai_session(uuid,text,text)
  TO service_role;
COMMENT ON FUNCTION public.bg_create_waiting_ai_session(uuid,text,text) IS
  'Staged atomic waiting AI session, trust_version=0, no reward authority; service-role only.';
COMMIT;
