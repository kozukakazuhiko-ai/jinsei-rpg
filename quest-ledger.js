// Pure quest completion ledger. No storage writes or DOM dependencies.
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.LifeRpgQuestLedger=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function activeAward(state,id){let active=null;for(const t of state.expTransactions.filter(t=>t.questId===id)){if(t.kind==='award'){if(active)throw Error('EXP履歴が重複しています');active=t;}else{if(!active||t.relatedTransactionId!==active.transactionId||t.amount!==-active.amount)throw Error('EXP履歴が不整合です');active=null;}}return active;}
 function complete(state,id,reflection,now,transactionId,expFor){const q=state.quests.find(q=>q.id===id);if(!q||q.status==='completed')return false;if(activeAward(state,id))throw Error('EXP履歴が残っています');const amount=expFor(q);if(!Number.isInteger(amount)||amount<=0)throw Error('EXPが不正です');q.reflection=reflection;q.status='completed';q.completedAt=now;q.updatedAt=now;state.expTransactions.push({transactionId,questId:id,kind:'award',amount,createdAt:now,relatedTransactionId:null});return true;}
 function undo(state,id,now,transactionId){const q=state.quests.find(q=>q.id===id);if(!q||q.status!=='completed')return false;const active=activeAward(state,id);if(!active)throw Error('取消対象のEXPがありません');q.status='not_started';q.completedAt=null;q.updatedAt=now;state.expTransactions.push({transactionId,questId:id,kind:'reversal',amount:-active.amount,createdAt:now,relatedTransactionId:active.transactionId});return true;}
 return Object.freeze({activeAward,complete,undo});
});
