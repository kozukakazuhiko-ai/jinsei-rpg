/* Pure game rules, independent of UI, storage and monetization. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.LifeRpgCore=api;})(typeof globalThis!=='undefined'?globalThis:undefined,function(){
'use strict';
const DIFFICULTIES=Object.freeze(['easy','normal','hard']);
const REWARDS=Object.freeze({Daily:Object.freeze([10,25,50]),Season:Object.freeze([100,250,500]),Main:Object.freeze([500,1000,2000])});
function expFor(quest){const rewards=quest&&REWARDS[quest.type];const index=DIFFICULTIES.indexOf(quest&&quest.difficulty);if(!rewards||index<0)throw new Error('未対応のQuest種別または難易度です');return rewards[index]}
function totalExp(transactions){if(!Array.isArray(transactions))throw new TypeError('EXP履歴が配列ではありません');let sum=0;for(const item of transactions){if(!item||!Number.isSafeInteger(item.amount))throw new Error('不正なEXP履歴です');sum+=item.amount;if(!Number.isSafeInteger(sum))throw new Error('EXP合計が安全な範囲を超えました')}return Math.max(0,sum)}
function levelForExp(exp){if(!Number.isSafeInteger(exp)||exp<0)throw new Error('不正なEXPです');return Math.floor(Math.sqrt(exp/100))+1}
function levelProgress(exp){const level=levelForExp(exp);const base=100*(level-1)**2;const next=100*level**2;return {level,base,next,remaining:next-exp,percent:Math.max(0,Math.min(100,Math.round((exp-base)/(next-base)*100)))}}
// Convert an ISO timestamp to the device's calendar day, not its UTC day.
// Quest completion is stored in UTC; daily/monthly summaries are local to the player.
function localDay(isoTimestamp){
 if(typeof isoTimestamp!=='string'||!isoTimestamp.trim())return null;
 const d=new Date(isoTimestamp);
 if(!Number.isFinite(d.getTime()))return null;
 return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function skillProgress(count){
 if(!Number.isSafeInteger(count)||count<0)throw new Error('不正なスキル達成数です');
 const level=Math.floor(Math.sqrt(count))+1;
 const previous=(level-1)**2,next=level**2;
 return {level,previous,next,remaining:next-count,percent:Math.round((count-previous)/(next-previous)*100)};
}
function suggestFollowupQuest(completed,quests){
 if(!completed||!Array.isArray(quests))throw new TypeError('Quest情報が不正です');
 const eligible=quests.filter(q=>q&&!q.archived&&q.id!==completed.id&&q.status!=='completed'&&q.status!=='on_hold');
 const related=eligible.filter(q=>completed.sourceWantId&&q.sourceWantId===completed.sourceWantId);
 const candidates=related.length?related:eligible.filter(q=>completed.skill&&completed.skill!=='未設定'&&q.skill===completed.skill);
 return candidates.sort((a,b)=>Number(b.status==='in_progress')-Number(a.status==='in_progress')||(b.priority??2)-(a.priority??2)||(a.createdAt||'').localeCompare(b.createdAt||''))[0]||null;
}
return Object.freeze({DIFFICULTIES,REWARDS,expFor,totalExp,levelForExp,levelProgress,skillProgress,localDay,suggestFollowupQuest});
});
