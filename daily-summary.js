// Pure daily quest summary: one source of truth for counts and progress.
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.LifeRpgDailySummary=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function summarize(quests,day,localDay){
 if(!Array.isArray(quests)||typeof day!=='string'||typeof localDay!=='function')throw TypeError('Invalid daily summary input');
 let completed=0;const pending=[];
 for(const q of quests){
  if(!q||q.archived||q.type!=='Daily')continue;
  if(q.status==='completed'){
   if(typeof q.completedAt==='string'&&localDay(q.completedAt)===day)completed++;
  }else if(q.status!=='on_hold')pending.push(q);
 }
 const total=completed+pending.length;
 return {completed,pending,total,percent:total?Math.round(completed/total*100):0};
}
return Object.freeze({summarize});
});
