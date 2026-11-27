const {test}=require('node:test');
const assert=require('node:assert/strict');
const {fields,reconcile,snapshot,hash}=require('./tkflow-watcher.cjs');
const now=Date.parse('2026-11-27T02:00Z');
function event(id,type,session,task,extra='',actor='owner'){return {id,user:{login:actor},body:'PROJECT=BEASTGAMES\nTYPE='+type+'\nSESSION_ID='+session+'\nTASK_ID='+task+'\n'+extra};}
const grant=(id,s,t,p='src/a',lease='2026-11-27T03:00Z')=>event(id,'OWNER_GRANT',s,t,'BRANCH=feat/x\nBASE_SHA=abc\nWRITE_SCOPE='+p+'\nLEASE_UNTIL='+lease);
test('duplicate fields rejected',()=>assert.equal(fields('TYPE=A\nTYPE=B'),null));
test('active and expired claims separated',()=>{const x=reconcile([grant(1,'a','A'),grant(2,'b','B','src/b','2026-11-27T01:00Z')],now);assert.equal(x.active.length,1);assert.equal(x.expired.length,1);});
test('overlapping scope and task flagged',()=>assert.equal(reconcile([grant(1,'a','A','src'),grant(2,'b','B','src/a')],now).conflicts.length,1));
test('handoff from another actor cannot release',()=>assert.equal(reconcile([grant(1,'a','A'),event(2,'HANDOFF','a','A','WRITE_SCOPE_RELEASED=all','other')],now).active.length,1));
test('owner handoff releases',()=>assert.equal(reconcile([grant(1,'a','A'),event(2,'HANDOFF','a','A','WRITE_SCOPE_RELEASED=all')],now).active.length,0));
test('missing checks not marked passed; stable snapshot',()=>{const p=[{number:1,head:{sha:'abc'},draft:true}];const a=snapshot([],p,{},now);assert.deepEqual(a.prs[0].checks,[]);assert.equal(hash(a),hash(snapshot([],p,{},now)));});
