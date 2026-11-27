import { describe, expect, it } from 'vitest';
import { resolveActiveCatalogDeck } from '../../docs/security/p0-release/canonicalCatalog';
const inventory = Array.from({length:5}, (_,i)=>({user_id:'a',card_key:'c'+i,quantity:2,card_data:{valor:9999}}));
const catalog = inventory.map((r,i)=>({card_key:r.card_key,active:true,card_data:{valor:i+1,nested:{x:1}}}));
const keys = inventory.flatMap(r=>[r.card_key,r.card_key]);
describe('staged active catalog deck',()=>{
  it('uses server catalog values and ignores inventory card_data',()=>{
    const deck=resolveActiveCatalogDeck('a',keys,inventory,catalog);
    expect(deck?.length).toBe(10);
    expect(deck?.[0].valor).toBe(1);
    expect(deck?.[9].valor).toBe(5);
  });
  it('rejects inactive or missing definitions',()=>{
    expect(resolveActiveCatalogDeck('a',keys,inventory,[{...catalog[0],active:false},...catalog.slice(1)])).toBeNull();
    expect(resolveActiveCatalogDeck('a',keys,inventory,catalog.slice(1))).toBeNull();
  });
  it('rejects ambiguous definitions even when duplicated across active and inactive records',()=>{
    expect(resolveActiveCatalogDeck('a',keys,inventory,[...catalog,{...catalog[0],active:false}])).toBeNull();
  });
  it('rejects foreign, duplicate, or insufficient inventory',()=>{
    expect(resolveActiveCatalogDeck('b',keys,inventory,catalog)).toBeNull();
    expect(resolveActiveCatalogDeck('a',keys,[...inventory,inventory[0]],catalog)).toBeNull();
    expect(resolveActiveCatalogDeck('a',keys,[{...inventory[0],quantity:1},...inventory.slice(1)],catalog)).toBeNull();
  });
  it('rejects sparse keys and client objects',()=>{
    expect(resolveActiveCatalogDeck('a',Array(10),inventory,catalog)).toBeNull();
    expect(resolveActiveCatalogDeck('a',[{card_key:'c0'},...keys.slice(1)],inventory,catalog)).toBeNull();
  });
  it('fails closed on uncloneable card data',()=>{
    const invalid=[{...catalog[0],card_data:{valor:1,nested:{x:1},bad:()=>0}},...catalog.slice(1)];
    expect(resolveActiveCatalogDeck('a',keys,inventory,invalid)).toBeNull();
  });
  it('detaches returned copies from catalog and each other',()=>{
    const deck=resolveActiveCatalogDeck('a',keys,inventory,catalog)!;
    (deck[0].nested as {x:number}).x=9;
    expect(catalog[0].card_data.nested.x).toBe(1);
    expect(deck[1].nested).toEqual({x:1});
  });
});
