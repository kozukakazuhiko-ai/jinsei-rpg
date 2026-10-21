/* Goal-to-action bridge. Pure suggestions, no save mutations. */
(function(root){'use strict';
const SKILLS={scholar:['学習'],guardian:['健康','挑戦'],artisan:['創作','仕事'],guide:['人間関係','生活']};
const HYBRIDS={spellblade:['学習','健康','挑戦'],craftmage:['学習','創作','仕事'],trailblazer:['健康','挑戦','人間関係','生活'],storyteller:['創作','仕事','人間関係','生活']};
function skillsFor(goal){
 if(!goal||typeof goal.id!=='string')return [];
 if(goal.id.startsWith('item:')){
  const item=root.LifeRpgCollection?.ITEMS?.find(x=>x.id===goal.id.slice(5));
  return item?.kind==='profession'?(SKILLS[item.path]||[]):item?.kind==='hybrid'?(HYBRIDS[item.path]||[]):[];
 }
 if(goal.id.startsWith('route:')){const id=goal.id.slice(6);return SKILLS[id]||HYBRIDS[id]||[];}
 return [];
}
function suggest(state,goal){
 const allSkills=skillsFor(goal);
 let skills=allSkills;
 // For hybrid goals, recommend the parent route that still needs progress.
 const id=String(goal?.id||'');
 const item=id.startsWith('item:')?root.LifeRpgCollection?.ITEMS?.find(x=>x.id===id.slice(5)):null;
 const hybridId=id.startsWith('route:')?id.slice(6):item?.kind==='hybrid'?item.path:null;
 const hybrid=root.LifeRpgProfessions?.HYBRIDS?.find(h=>h.id===hybridId);
 if(hybrid){
  const need=item?.kind==='hybrid'?item.need:(root.LifeRpgProfessions.RANKS.find(r=>r.need>=(root.LifeRpgProfessions.hybridProgress(state).find(h=>h.id===hybridId)?.next?.need||1))?.need||1);
  const base=root.LifeRpgProfessions.progress(state);
  const missing=hybrid.parents.filter(id=>(base.find(p=>p.id===id)?.count||0)<need);
  skills=[...new Set(missing.flatMap(id=>SKILLS[id]||[]))];
 }
 const pending=(state?.quests||[]).filter(q=>q.status!=='completed'&&!q.archived&&q.status!=='on_hold'&&skills.includes(q.skill));
 return {skills,quests:pending.slice(0,3),hasAction:skills.length>0};
}
root.LifeRpgGoalAction={skillsFor,suggest};
})(typeof window!=='undefined'?window:globalThis);
