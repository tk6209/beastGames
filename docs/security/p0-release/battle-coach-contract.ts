// Staged only. Untrusted player-supplied completed multiplayer logs.
export type BattleTurn = { turn: number; actor: 0 | 1; action: 'attack' | 'defend' | 'heal' | 'power' | 'pass' | 'combo'; hp: [number,number]; energy: [number,number] };
export type BattleLog = { mode: 'multi'; completed: true; playerSlot: 0 | 1; winner: 0 | 1; turns: BattleTurn[] };
export type CoachReport = { turningPoints: {turn:number; explanation:string; alternative:string}[]; nextMatch:string[] };
const object = (v: unknown): v is Record<string,unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const slot = (v: unknown): v is 0|1 => v === 0 || v === 1;
const integer = (v:unknown,max:number):v is number => typeof v==='number'&&Number.isInteger(v)&&v>=0&&v<=max;
const pair = (v:unknown,max:number):v is [number,number] => Array.isArray(v)&&v.length===2&&v.every(x=>integer(x,max));
const actions = ['attack','defend','heal','power','pass','combo'] as const;
export function parseBattleLog(v:unknown):BattleLog|null {
  if(!object(v)||v.mode!=='multi'||v.completed!==true||!slot(v.playerSlot)||!slot(v.winner)||!Array.isArray(v.turns)||v.turns.length<1||v.turns.length>200)return null;
  const turns:BattleTurn[]=[];
  for(const t of v.turns){
    if(!object(t)||!integer(t.turn,1000)||t.turn<1||!slot(t.actor)||typeof t.action!=='string'||!actions.includes(t.action as BattleTurn['action'])||!pair(t.hp,100000)||!pair(t.energy,1000)|| (turns.length>0&&t.turn<turns[turns.length-1].turn))return null;
    turns.push({turn:t.turn,actor:t.actor,action:t.action as BattleTurn['action'],hp:[...t.hp],energy:[...t.energy]});
  }
  return {mode:'multi',completed:true,playerSlot:v.playerSlot,winner:v.winner,turns};
}
const bounded = (v:unknown,max:number):v is string => typeof v==='string'&&v.trim().length>0&&v.length<=max;
export function parseCoachReport(v:unknown,log:BattleLog):CoachReport|null{
  if(!object(v)||!Array.isArray(v.turningPoints)||v.turningPoints.length<1||v.turningPoints.length>3||!Array.isArray(v.nextMatch)||v.nextMatch.length!==3||!v.nextMatch.every(t=>bounded(t,300)))return null;
  const known=new Set(log.turns.map(t=>t.turn));const points:CoachReport['turningPoints']=[];
  for(const p of v.turningPoints){if(!object(p)||typeof p.turn!=='number'||!known.has(p.turn)||!bounded(p.explanation,600)||!bounded(p.alternative,600))return null;points.push({turn:p.turn,explanation:p.explanation,alternative:p.alternative});}
  return {turningPoints:points,nextMatch:v.nextMatch};
}
