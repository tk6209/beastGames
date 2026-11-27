-- STAGED ONLY. Never apply to production or automatic migration paths.
-- Nonrewarding candidate. Requires verified server-side engine and JWT ownership.
BEGIN;
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS state_version bigint NOT NULL DEFAULT 0;
CREATE OR REPLACE FUNCTION public.bg_commit_nonrewarding_state(
  p_uid uuid, p_session uuid, p_slot integer, p_expected_version bigint,
  p_next_state jsonb, p_next_turn integer, p_event_type text, p_event jsonb,
  p_finish boolean
) RETURNS bigint LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE v_version bigint; v_status public.game_status; v_trust integer; v_turn integer;
BEGIN
  IF p_uid IS NULL OR p_session IS NULL OR p_slot IS NULL OR p_slot NOT IN (0,1)
     OR p_expected_version IS NULL OR p_expected_version < 0
     OR p_next_state IS NULL OR jsonb_typeof(p_next_state) <> 'object'
     OR p_event IS NULL OR jsonb_typeof(p_event) <> 'object'
     OR p_event_type IS NULL OR length(p_event_type) NOT BETWEEN 1 AND 64
     OR p_next_turn IS NULL OR p_next_turn < 0 OR p_finish IS NULL
     OR octet_length(p_next_state::text) > 262144 OR octet_length(p_event::text) > 65536
  THEN RAISE EXCEPTION 'invalid_transition' USING ERRCODE='22023'; END IF;
  SELECT state_version,status,trust_version,current_turn INTO v_version,v_status,v_trust,v_turn
    FROM public.game_sessions WHERE id=p_session FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'session_not_found' USING ERRCODE='P0002'; END IF;
  PERFORM 1 FROM public.game_players WHERE session_id=p_session AND user_id=p_uid AND slot=p_slot FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'owner_slot_required' USING ERRCODE='42501'; END IF;
  IF v_trust IS DISTINCT FROM 0 OR v_status IS DISTINCT FROM 'active'::public.game_status
  THEN RAISE EXCEPTION 'session_not_eligible' USING ERRCODE='55000'; END IF;
  IF v_version IS DISTINCT FROM p_expected_version
  THEN RAISE EXCEPTION 'stale_state_version' USING ERRCODE='40001'; END IF;
  IF v_turn IS NULL OR p_next_turn < v_turn OR p_next_turn::bigint > v_turn::bigint + 1
  THEN RAISE EXCEPTION 'invalid_turn' USING ERRCODE='22023'; END IF;
  UPDATE public.game_sessions SET state_json=p_next_state,current_turn=p_next_turn,
    state_version=v_version+1,updated_at=statement_timestamp(),
    status=CASE WHEN p_finish THEN 'finished'::public.game_status ELSE 'active'::public.game_status END
    WHERE id=p_session;
  INSERT INTO public.game_events(session_id,player_slot,event_type,payload_json)
    VALUES(p_session,p_slot,p_event_type,p_event);
  RETURN v_version+1;
END;
$$;
REVOKE ALL ON FUNCTION public.bg_commit_nonrewarding_state(uuid,uuid,integer,bigint,jsonb,integer,text,jsonb,boolean) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.bg_commit_nonrewarding_state(uuid,uuid,integer,bigint,jsonb,integer,text,jsonb,boolean) TO service_role;
COMMIT;
