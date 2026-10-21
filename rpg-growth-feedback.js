/* Pure quest completion growth diff: rewards follow real-world actions, not the reverse. */
(function(root){'use strict';
function snapshot(state,level,achievements){
 const items=root.LifeRpgCollection.progress(state,level).filter(x=>x.unlocked).map(x=>({id:x.id,name:x.name,slot:x.slot}));
 const routes=[...root.LifeRpgProfessions.progress(state),...root.LifeRpgProfessions.hybridProgress(state)];
 const titles=(achievements||[]).filter(x=>x.earned).map(x=>x.name);
 const active=root.LifeRpgProfessions.active(state);
 return {level,items,routes:routes.filter(x=>x.unlocked).map(x=>({id:x.id,name:x.name,rank:x.rank,count:x.count})),titles,active:active?{id:active.id,name:active.name,rank:active.rank}:null};
}
function difference(before,after){
 const ids=new Set(before.items.map(x=>x.id));const routeIds=new Set(before.routes.map(x=>x.id));const titleNames=new Set(before.titles);
 const priorRanks=new Map(before.routes.map(x=>[x.id,x.rank]));
 return {levelUp:after.level>before.level,fromLevel:before.level,toLevel:after.level,
  items:after.items.filter(x=>!ids.has(x.id)),titles:after.titles.filter(x=>!titleNames.has(x)),
  professions:after.routes.filter(x=>!routeIds.has(x.id)),
  promotions:after.routes.filter(x=>priorRanks.has(x.id)&&priorRanks.get(x.id)!==x.rank),
  activeChanged:(before.active?.id||null)!==(after.active?.id||null),active:after.active};
}
root.LifeRpgGrowthFeedback={snapshot,difference};
})(typeof window!=='undefined'?window:globalThis);
