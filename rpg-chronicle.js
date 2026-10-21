/* 冒険図鑑: Quest実績を元に毎回再計算。保存形式を変更しない。 */
(function(root){'use strict';
function snapshot(state,level){
 const quests=(state?.quests||[]).filter(q=>q.status==='completed');
 const professions=root.LifeRpgProfessions.progress(state);
 const hybrids=root.LifeRpgProfessions.hybridProgress(state);
 const items=root.LifeRpgCollection.progress(state,level);
 const unlocked=items.filter(i=>i.unlocked);
 const routes=[...professions,...hybrids].map(p=>({id:p.id,name:p.name,rank:p.rank,count:p.count,unlocked:p.unlocked}));
 const history=quests.filter(q=>q.completedAt).slice().sort((a,b)=>a.completedAt.localeCompare(b.completedAt));
 const first=history[0]||null;
 const skills=professions.filter(p=>p.count>0).map(p=>({name:p.name,count:p.count}));
 const next=[...items.filter(i=>!i.unlocked).map(i=>({name:i.name,remaining:Math.max(0,i.need-i.current),kind:'装備・スキン',detail:i.description})),...professions.filter(p=>p.next).map(p=>({name:p.name+' '+p.next.name,remaining:p.remaining,kind:'職業',detail:p.description}))].sort((a,b)=>a.remaining-b.remaining);
 return {quests:quests.length,firstQuest:first?{name:first.name,completedAt:first.completedAt}:null,skills,routes,items:items.length,unlocked:unlocked.length,unlockedItems:unlocked.map(i=>({id:i.id,name:i.name,slot:i.slot})),next:next.slice(0,4)};
}
root.LifeRpgChronicle={snapshot};
})(typeof window!=='undefined'?window:globalThis);
