// Input hygiene for the most frequent action: creating a small daily Quest.
// Pure functions; no storage writes or implicit schema migrations.
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.LifeRpgQuestInput=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function normalize(value){return String(value??'').normalize('NFKC').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/gu,' ').trim();}
 function validate(value,quests=[]){
  const name=normalize(value);
  if(!name)return {ok:false,name,message:'Quest名を入力してください'};
  if([...name].length>100)return {ok:false,name,message:'Quest名は100文字以内にしてください'};
  const key=name.toLocaleLowerCase('ja');
  if(quests.some(q=>!q.archived&&q.status!=='completed'&&q.name&&normalize(q.name).toLocaleLowerCase('ja')===key))return {ok:false,name,message:'同じ名前の未完了Questがあります。今日の一歩から選べます'};
  return {ok:true,name,message:''};
 }
 return Object.freeze({normalize,validate});
});
