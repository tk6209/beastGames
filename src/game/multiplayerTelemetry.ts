export type MultiplayerEvent = {
  version: 1;
  source: 'client_observed';
  attemptId: string;
  event: 'multiplayer_start_attempt' | 'multiplayer_start_success' | 'multiplayer_init_failure' | 'room_join_attempt' | 'room_join_success' | 'room_join_failure';
  observedAt: number;
  latencyMs?: number;
  failure?: 'auth' | 'timeout' | 'network' | 'invalid_state' | 'unknown';
};
export type TelemetrySink = (event: MultiplayerEvent) => void | Promise<void>;
/** Client-observed only; never treat as authoritative or include room IDs, tokens or player data. */
export async function observeMultiplayer<T>(
  kind: 'multiplayer_start' | 'room_join',
  operation: () => Promise<T>,
  valid: (value: T) => boolean,
  sink: TelemetrySink,
  id: () => string = () => crypto.randomUUID(),
  clock: () => number = () => Date.now()
): Promise<T> {
  let attemptId: string;
  let start: number;
  try {
    attemptId = id();
    start = clock();
    if (!attemptId || !Number.isFinite(start)) return operation();
  } catch {
    return operation();
  }
  const emit = (event: MultiplayerEvent['event'], failure?: MultiplayerEvent['failure']) => {
    try {
      const observedAt = clock();
      if (!Number.isFinite(observedAt)) return;
      void Promise.resolve(sink({
        version: 1, source: 'client_observed', attemptId, event, observedAt,
        ...(event.endsWith('_attempt') ? {} : { latencyMs: Math.max(0, observedAt - start) }),
        ...(failure ? { failure } : {})
      })).catch(() => {});
    } catch { /* telemetry must not block play */ }
  };
  emit(kind === 'room_join' ? 'room_join_attempt' : 'multiplayer_start_attempt');
  const fail = kind === 'room_join' ? 'room_join_failure' : 'multiplayer_init_failure';
  let value: T;
  try {
    value = await operation();
  } catch (error) {
    const name = error instanceof Error ? error.name : '';
    emit(fail, name === 'AbortError' || name === 'TimeoutError' ? 'timeout' : name === 'TypeError' ? 'network' : 'unknown');
    throw error;
  }
  try {
    if (valid(value)) emit(kind === 'room_join' ? 'room_join_success' : 'multiplayer_start_success');
    else emit(fail, 'invalid_state');
  } catch { /* observation failure must not change the operation result */ }
  return value;
}
