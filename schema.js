/* Pure schema compatibility and explicit migration planning. No automatic writes. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.LifeRpgSchema=api;})(typeof globalThis!=='undefined'?globalThis:undefined,function(){
'use strict';
const CURRENT=3;
function inspect(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||!Number.isInteger(value.dataVersion)||value.dataVersion<1)return {status:'invalid',version:null};
 return {status:value.dataVersion===CURRENT?'current':value.dataVersion>CURRENT?'future':'legacy',version:value.dataVersion};
}
function migrate(value,steps={}){
 const initial=inspect(value);
 if(initial.status==='invalid'||initial.status==='future')throw new Error('未対応の保存データ形式です');
 let copy=JSON.parse(JSON.stringify(value));
 for(let v=initial.version;v<CURRENT;v++){
  if(!Object.prototype.hasOwnProperty.call(steps,v)||typeof steps[v]!=='function')throw new Error('移行手順がありません: '+v);
  const next=steps[v](JSON.parse(JSON.stringify(copy)));
  if(!next||inspect(next).version!==v+1||!Number.isInteger(next.dataVersion))throw new Error('移行結果が不正です: '+v);
  copy=JSON.parse(JSON.stringify(next));
 }
 return copy;
}
return Object.freeze({CURRENT,inspect,migrate});
});
