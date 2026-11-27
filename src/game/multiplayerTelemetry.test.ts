import { describe, it, expect, vi } from 'vitest';
import { observeMultiplayer, type MultiplayerEvent } from './multiplayerTelemetry';

describe('multiplayer telemetry', () => {
  it('correlates a successful start with its attempt', async () => {
    const events: MultiplayerEvent[] = [];
    let now = 0;
    const result = await observeMultiplayer('multiplayer_start', async () => { now = 42; return { ready: true }; }, x => x.ready, e => { events.push(e); }, () => 'attempt-1', () => now);
    expect(result.ready).toBe(true);
    expect(events.map(e => e.event)).toEqual(['multiplayer_start_attempt','multiplayer_start_success']);
    expect(events.every(e => e.attemptId === 'attempt-1')).toBe(true);
    expect(events[1].latencyMs).toBe(42);
  });
  it('classifies invalid room response without claiming success', async () => {
    const events: MultiplayerEvent[] = [];
    await observeMultiplayer('room_join', async () => false, Boolean, e => { events.push(e); }, () => 'attempt-2');
    expect(events[1]).toMatchObject({event:'room_join_failure',failure:'invalid_state'});
  });
  it('preserves the original failure and never emits the raw error', async () => {
    const events: MultiplayerEvent[] = [];
    const error = new TypeError('private room token');
    await expect(observeMultiplayer('multiplayer_start', async () => {throw error;}, Boolean, e => {events.push(e);}, () => 'attempt-3')).rejects.toBe(error);
    expect(events[1]).toMatchObject({event:'multiplayer_init_failure',failure:'network'});
    expect(JSON.stringify(events)).not.toContain('private room token');
  });
  it('does not block gameplay on synchronous or asynchronous sink failure', async () => {
    const run = vi.fn(async () => true);
    await expect(observeMultiplayer('room_join',run,Boolean,()=>{throw Error('offline');},()=> 'a')).resolves.toBe(true);
    await expect(observeMultiplayer('room_join',run,Boolean,async()=>{throw Error('offline');},()=> 'b')).resolves.toBe(true);
    expect(run).toHaveBeenCalledTimes(2);
  });
});
