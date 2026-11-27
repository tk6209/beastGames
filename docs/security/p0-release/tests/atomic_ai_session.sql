\set ON_ERROR_STOP on
-- Disposable synthetic fixture ONLY. The workflow supplies a fresh local database.
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE service_role NOLOGIN;
CREATE TABLE public.game_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), join_code text UNIQUE NOT NULL,
 status text NOT NULL, state_json jsonb, current_turn integer, trust_version integer NOT NULL DEFAULT 0
);
CREATE TABLE public.game_players (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), session_id uuid NOT NULL REFERENCES public.game_sessions(id),
 user_id uuid NOT NULL, slot integer NOT NULL CHECK(slot IN (0,1)), nickname text,
 monster_id text NOT NULL, hp integer, max_hp integer, state_json jsonb,
 UNIQUE(session_id,slot)
);
CREATE TABLE public.user_inventory (user_id uuid, item_type text, item_key text);
GRANT USAGE ON SCHEMA public TO service_role, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.game_sessions,public.game_players,public.user_inventory TO service_role;
INSERT INTO public.user_inventory VALUES
 ('00000000-0000-4000-8000-000000000001','monster','panther'),
 ('00000000-0000-4000-8000-000000000001','monster','rollback');
\ir ../002_atomic_ai_session.sql
DO $$
BEGIN
 IF has_function_privilege('anon','public.bg_create_waiting_ai_session(uuid,text,text)','EXECUTE')
 OR has_function_privilege('authenticated','public.bg_create_waiting_ai_session(uuid,text,text)','EXECUTE')
 OR NOT has_function_privilege('service_role','public.bg_create_waiting_ai_session(uuid,text,text)','EXECUTE')
 THEN RAISE EXCEPTION 'ACL failed'; END IF;
END $$;
SET ROLE service_role;
SELECT public.bg_create_waiting_ai_session('00000000-0000-4000-8000-000000000001','ABCDE','panther');
DO $$
BEGIN
 IF (SELECT count(*) FROM public.game_sessions WHERE status='waiting' AND trust_version=0 AND current_turn=0 AND state_json='{}') <> 1
 OR (SELECT count(*) FROM public.game_players WHERE slot=0 AND user_id='00000000-0000-4000-8000-000000000001') <> 1
 THEN RAISE EXCEPTION 'valid creation failed'; END IF;
 BEGIN
  PERFORM public.bg_create_waiting_ai_session(NULL,'NULL1','panther');
  RAISE EXCEPTION 'null uid accepted';
 EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
 BEGIN
  PERFORM public.bg_create_waiting_ai_session('00000000-0000-4000-8000-000000000002','WRONG','panther');
  RAISE EXCEPTION 'unowned monster accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  PERFORM public.bg_create_waiting_ai_session('00000000-0000-4000-8000-000000000001','ABCDE','panther');
  RAISE EXCEPTION 'duplicate code accepted';
 EXCEPTION WHEN unique_violation THEN NULL; END;
END $$;
RESET ROLE;
ALTER TABLE public.game_players ADD CONSTRAINT fixture_injected_failure CHECK(monster_id <> 'rollback');
SET ROLE service_role;
DO $$
BEGIN
 BEGIN
  PERFORM public.bg_create_waiting_ai_session('00000000-0000-4000-8000-000000000001','ROLL1','rollback');
  RAISE EXCEPTION 'injected failure not raised';
 EXCEPTION WHEN check_violation THEN NULL; END;
 IF (SELECT count(*) FROM public.game_sessions) <> 1 OR (SELECT count(*) FROM public.game_players) <> 1
 THEN RAISE EXCEPTION 'partial creation persisted'; END IF;
END $$;
RESET ROLE;
SET ROLE authenticated;
DO $$
BEGIN
 BEGIN
  PERFORM public.bg_create_waiting_ai_session('00000000-0000-4000-8000-000000000001','DENY1','panther');
  RAISE EXCEPTION 'authenticated bypass';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SET ROLE anon;
DO $$
BEGIN
 BEGIN
  PERFORM public.bg_create_waiting_ai_session('00000000-0000-4000-8000-000000000001','DENY2','panther');
  RAISE EXCEPTION 'anonymous bypass';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SELECT 'PASS: atomic creation, trust zero, ACL, invalid uid, unowned monster, duplicate code, rollback' AS evidence;
