/* Tested backup import / recovery transaction boundary; preserves v3 schema. */
(function(root,factory){const api=factory(root?.LifeRpgStorage,root?.LifeRpgBackupGuard);if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.LifeRpgBackupRestore=api;})(typeof globalThis!=='undefined'?globalThis:undefined,function(Storage,Guard){
'use strict';
function importBackup(storage,text,validate,saveInfo){
 const backup=Guard.parse(text,validate);
 const next={...backup,saveInfo};
 if(!validate(next))throw Error('対応していないデータ形式です');
 // Validate and serialize before touching the existing data.
 JSON.stringify(next);
 // A failed import must not consume the previous recovery checkpoint.
 const oldRecovery=Storage.read(storage,Storage.RECOVERY_KEY);
 Storage.preserve(storage);
 try {
  Storage.write(storage,next);
 } catch(error) {
  try {
   if(oldRecovery===null)storage.removeItem(Storage.RECOVERY_KEY);
   else storage.setItem(Storage.RECOVERY_KEY,oldRecovery);
   if(Storage.read(storage,Storage.RECOVERY_KEY)!==oldRecovery)throw Error('復元用データのロールバックを確認できませんでした');
  } catch(rollbackError) {
   throw new AggregateError([error,rollbackError],'保存に失敗し、復元用データの保護も確認できませんでした');
  }
  throw error;
 }
 return next;
}
function recover(storage,validate){
 const raw=Storage.read(storage,Storage.RECOVERY_KEY);
 if(raw===null)throw Error('復元前の退避データはありません');
 const restored=Storage.parse(raw,validate);
 Storage.write(storage,restored);
 return restored;
}
return Object.freeze({importBackup,recover});
});
