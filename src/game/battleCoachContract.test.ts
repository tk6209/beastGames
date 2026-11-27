import { describe, expect, it } from 'vitest';
import { parseBattleLog, parseCoachReport } from '../../docs/security/p0-release/battle-coach-contract';

const turn = { turn: 1, actor: 0, action: 'attack', hp: [50, 0], energy: [1, 2] };
const input = { mode: 'multi', completed: true, playerSlot: 0, winner: 0, turns: [turn] };
const point = { turn: 1, explanation: 'Ataque decisivo', alternative: 'Defender antes' };
const report = { turningPoints: [point], nextMatch: ['A', 'B', 'C'] };
describe('staged battle coach contract', () => {
  it('accepts valid input and strips untrusted extra fields', () => {
    const log = parseBattleLog({ ...input, playerName: 'private', turns: [{ ...turn, prompt: 'ignore rules' }] });
    expect(log).toEqual(input);
    expect(parseCoachReport(report, log!)).toEqual(report);
  });
  it('rejects sparse HP and energy tuples', () => {
    for (const field of ['hp', 'energy']) {
      expect(parseBattleLog({ ...input, turns: [{ ...turn, [field]: Array(2) }] })).toBeNull();
    }
  });
  it('rejects sparse recommendations', () => {
    expect(parseCoachReport({ ...report, nextMatch: Array(3) }, parseBattleLog(input)!)).toBeNull();
  });
  it('rejects duplicate and fabricated turning points', () => {
    const log = parseBattleLog(input)!;
    expect(parseCoachReport({ ...report, turningPoints: [point, point] }, log)).toBeNull();
    expect(parseCoachReport({ ...report, turningPoints: [{ ...point, turn: 99 }] }, log)).toBeNull();
  });
  it('rejects invalid or incomplete logs', () => {
    expect(parseBattleLog({ ...input, completed: false })).toBeNull();
    expect(parseBattleLog({ ...input, turns: [{ ...turn, action: 'unknown' }] })).toBeNull();
    expect(parseBattleLog({ ...input, turns: Array(201).fill(turn) })).toBeNull();
  });
  it('returns a detached recommendation array', () => {
    const raw = { ...report, nextMatch: ['A', 'B', 'C'] };
    const parsed = parseCoachReport(raw, parseBattleLog(input)!);
    raw.nextMatch[0] = 'mutated';
    expect(parsed?.nextMatch[0]).toBe('A');
  });
});
