import { describe, expect, it } from 'vitest';
import { resolveCanonicalDeck } from '../../docs/security/p0-release/canonicalDeck';
const rows = Array.from({length:5}, (_,i)=>({user_id:'a',card_key:'c'+i,quantity:2,card_data:{valor:10+i,nested:{x:1}}}));
const keys = rows.flatMap(r=>[r.card_key,r.card_key]);
describe('canonical staged deck',()=>{
  it('resolves ten cards from trusted inventory',()=>expect(resolveCanonicalDeck('a',keys,rows)?.length).toBe(10));
  it('rejects foreign inventory',()=>expect(resolveCanonicalDeck('b',keys,rows)).toBeNull());
  it('rejects client supplied stats',()=>expect(resolveCanonicalDeck('a',[{card_key:'c0',valor:500},...keys.slice(1)],rows)).toBeNull());
  it('rejects excess copies and insufficient ownership',()=>{
    expect(resolveCanonicalDeck('a',['c0',...keys.slice(0,9)],rows)).toBeNull();
    expect(resolveCanonicalDeck('a',keys,[{...rows[0],quantity:1},...rows.slice(1)])).toBeNull();
  });
  it('rejects unknown, sparse, short and duplicate inventory input',()=>{
    expect(resolveCanonicalDeck('a',['unknown',...keys.slice(1)],rows)).toBeNull();
    expect(resolveCanonicalDeck('a',Array(10),rows)).toBeNull();
    expect(resolveCanonicalDeck('a',keys.slice(1),rows)).toBeNull();
    expect(resolveCanonicalDeck('a',keys,[...rows,rows[0]])).toBeNull();
  });
  it('detaches card snapshots from inventory and each other',()=>{
    const deck=resolveCanonicalDeck('a',keys,rows)!;
    (deck[0].nested as {x:number}).x=9;
    expect(rows[0].card_data.nested.x).toBe(1);
    expect(deck[1].nested).toEqual({x:1});
  });
});
