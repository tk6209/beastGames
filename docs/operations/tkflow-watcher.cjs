'use strict';
const {createHash}=require('node:crypto');
const REPO='tk6209/beastGames', BOARD=32, MISSION='BG-AAA-CLOSURE-20261126';
function fields(body) {
 const out=Object.create(null);
 for(const line of String(body||'').split(/\r?\n/)){
  const m=/^([A-Z][A-Z_]+)=(.*)$/.exec(line);
  if(m){if(Object.hasOwn(out,m[1])) return null;out[m[1]]=m[2].trim();}
 }
 return out;
}
function reconcile(comments, now) {
 const grants=new Map(), anomalies=[];
 for(const c of [...comments].sort((a,b)=>a.id-b.id)){
  const f=fields(c.body); if(!f||f.PROJECT!=='BEASTGAMES'||!f.SESSION_ID||!f.TASK_ID)continue;
  if(f.MISSION_ID && f.MISSION_ID!==MISSION)continue;
  const key=f.SESSION_ID+'|'+f.TASK_ID;
  if(f.TYPE==='OWNER_GRANT'){
   const lease=Date.parse(f.LEASE_UNTIL);
   const paths=(f.WRITE_SCOPE||'').split(',').map(x=>x.trim()).filter(Boolean);
   if(!Number.isFinite(lease)||!paths.length||!f.BRANCH||!f.BASE_SHA){anomalies.push('Malformed grant '+c.id);continue;}
   grants.set(key,{session:f.SESSION_ID,task:f.TASK_ID,branch:f.BRANCH,paths,lease,id:c.id,actor:c.user?.login,ack:false,released:false});
  }else if(f.TYPE==='TASK_ACK'&&grants.has(key)){grants.get(key).ack=true;}
  else if(/HANDOFF|RELEASE|DONE/.test(f.TYPE||'')&&f.WRITE_SCOPE_RELEASED&&grants.has(key)){
   const g=grants.get(key);if(c.user?.login===g.actor)g.released=true;
  }
 }
 const active=[],expired=[];
 for(const g of grants.values()){if(g.released)continue;(g.lease>now?active:expired).push(g);}
 const conflicts=[];
 for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
  const a=active[i],b=active[j];
  if(a.task===b.task||a.paths.some(p=>b.paths.some(q=>p===q||p.startsWith(q+'/')||q.startsWith(p+'/')))) conflicts.push([a.id,b.id]);
 }
 return {active,expired,conflicts,anomalies};
}
function snapshot(comments,prs,checks,now){
 const state=reconcile(comments,now);
 return {active:state.active.map(g=>({id:g.id,task:g.task,ack:g.ack})),expired:state.expired.map(g=>({id:g.id,task:g.task})),conflicts:state.conflicts,anomalies:state.anomalies,prs:prs.map(p=>({number:p.number,sha:p.head.sha,draft:p.draft,checks:(checks[p.number]||[]).map(c=>({name:c.name,status:c.status,conclusion:c.conclusion})).sort((a,b)=>a.name.localeCompare(b.name))})).sort((a,b)=>a.number-b.number)};
}
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
async function main(){
 if(process.env.GITHUB_REPOSITORY?.toLowerCase()!==REPO.toLowerCase())throw Error('repository mismatch');
 const token=process.env.GH_TOKEN;if(!token)throw Error('missing token');
 async function api(path,method='GET',body){
  const url='https://api.github.com/repos/'+REPO+path;
  const res=await fetch(url,{method,headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},...(body?{body:JSON.stringify(body)}:{})});
  if(!res.ok)throw Error('API '+res.status+' '+path);
  return res.json();
 }
 async function pages(path){const all=[];for(let n=1;n<=100;n++){const v=await api(path+(path.includes('?')?'&':'?')+'per_page=100&page='+n);all.push(...v);if(v.length<100)return all;}throw Error('pagination limit');}
 const comments=await pages('/issues/'+BOARD+'/comments');
 const prs=await pages('/pulls?state=open');
 const checks={};for(const p of prs){const c=await api('/commits/'+p.head.sha+'/check-runs?per_page=100');if(c.total_count>100)throw Error('check pagination limit');checks[p.number]=c.check_runs;}
 const s=snapshot(comments,prs,checks,Date.now()),digest=hash(s);
 console.log(JSON.stringify(s,null,2));
 const marker='<!-- BG-WATCHER:'+digest+' -->';
 const prior=[...comments].reverse().find(c=>c.user?.login==='github-actions[bot]'&&c.body?.includes('<!-- BG-WATCHER:'));
 if(process.env.BG_PUBLISH!=='true'||prior?.body.includes(marker))return;
 const rows=s.prs.map(p=>'#'+p.number+' '+p.sha.slice(0,8)+' '+(p.checks.map(c=>c.name+': '+(c.conclusion||c.status)).join(', ')||'UNVERIFIED')).join('\n');
 await api('/issues/'+BOARD+'/comments','POST',{body:marker+'\nTYPE=WATCHER_SNAPSHOT\nPROJECT=BEASTGAMES\nMISSION_ID='+MISSION+'\nWATCHER=GITHUB_ACTIONS_RUN_'+process.env.GITHUB_RUN_ID+'\nActive grants: '+JSON.stringify(s.active)+'\nExpired (manual reconciliation): '+JSON.stringify(s.expired)+'\nPotential conflicts: '+JSON.stringify(s.conflicts)+'\nMalformed grants: '+JSON.stringify(s.anomalies)+'\n'+rows+'\nAdvisory only: no grants, merges, independent certification or deployment.'});
}
module.exports={fields,reconcile,snapshot,hash};
if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1;});
