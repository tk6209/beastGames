DROP POLICY IF EXISTS "Users can view all queue entries" ON public.matchmaking_queue;
CREATE POLICY "Users can view waiting queue entries" ON public.matchmaking_queue
  FOR SELECT TO authenticated USING (status = 'waiting' OR auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.enforce_queue_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE l record;
BEGIN
  IF auth.uid() IS NOT NULL THEN
    SELECT league, rating INTO l FROM public.player_leagues WHERE user_id = NEW.user_id;
    NEW.league := COALESCE(l.league, 'bronze');
    NEW.rating := COALESCE(l.rating, 1000);
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.enforce_queue_rating() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_enforce_queue_rating ON public.matchmaking_queue;
CREATE TRIGGER trg_enforce_queue_rating BEFORE INSERT OR UPDATE ON public.matchmaking_queue
  FOR EACH ROW EXECUTE FUNCTION public.enforce_queue_rating();

DROP POLICY IF EXISTS "Authenticated users can create game sessions" ON public.game_sessions;
CREATE POLICY "Authenticated users can create empty waiting sessions" ON public.game_sessions
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() IS NOT NULL AND status = 'waiting' AND COALESCE(current_turn,0) = 0
    AND (state_json IS NULL OR state_json = '{}'::jsonb));