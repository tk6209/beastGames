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
  it('preserves gameplay when attempt ID generation fails', async () => {
    const run = vi.fn(async () => true);
    const sink = vi.fn();
    await expect(Promise.resolve().then(() => observeMultiplayer('room_join', run, Boolean, sink, () => { throw Error('no crypto'); }))).resolves.toBe(true);
    expect(run).toHaveBeenCalledTimes(1);
    expect(sink).not.toHaveBeenCalled();
  });
  it('preserves gameplay when clock fails', async () => {
    const sink = vi.fn();
    await expect(Promise.resolve().then(() => observeMultiplayer('room_join', async () => true, Boolean, sink, () => 'a', () => { throw Error('clock'); }))).resolves.toBe(true);
    expect(sink).not.toHaveBeenCalled();
  });
  it('does not convert a successful operation into an error when observation fails', async () => {
    const events: MultiplayerEvent[] = [];
    await expect(observeMultiplayer('room_join', async () => true, () => { throw Error('observer'); }, e => { events.push(e); }, () => 'a')).resolves.toBe(true);
    expect(events.map(e => e.event)).toEqual(['room_join_attempt']);
  });
  it('explicitly labels all emitted events as client observed', async () => {
    const events: MultiplayerEvent[] = [];
    await observeMultiplayer('room_join', async () => true, Boolean, e => { events.push(e); }, () => 'a');
    expect(events).toHaveLength(2);
    expect(events.every(e => e.source === 'client_observed')).toBe(true);
  });
  it('does not emit invalid timestamps or empty attempt IDs', async () => {
    const sink = vi.fn();
    await expect(observeMultiplayer('room_join', async () => true, Boolean, sink, () => '')).resolves.toBe(true);
    await expect(observeMultiplayer('room_join', async () => true, Boolean, sink, () => 'a', () => NaN)).resolves.toBe(true);
    expect(sink).not.toHaveBeenCalled();
  });

});
