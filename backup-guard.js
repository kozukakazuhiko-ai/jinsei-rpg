/* Untrusted JSON backup preflight. Keeps existing v3 backup format unchanged. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.LifeRpgBackupGuard=api;})(typeof globalThis!=='undefined'?globalThis:undefined,function(){
'use strict';
const MAX_BYTES=5_000_000,MAX_DEPTH=32,MAX_NODES=100_000;
function parse(text,validate){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BYTES)throw Error('バックアップファイルが大きすぎます');
 let data;try{data=JSON.parse(text)}catch(_){throw Error('JSONの形式が不正です')}
 const stack=[[data,0]],seen=new Set();let nodes=0;
 while(stack.length){const [value,depth]=stack.pop();if(++nodes>MAX_NODES||depth>MAX_DEPTH)throw Error('バックアップの構造が複雑すぎます');
  if(value&&typeof value==='object'){
   if(seen.has(value))throw Error('循環参照があります');seen.add(value);
   for(const key of Object.keys(value)){
    if(key==='__proto__'||key==='prototype'||key==='constructor')throw Error('危険なキーを含むバックアップです');
    stack.push([value[key],depth+1]);
   }
  }
 }
 if(typeof validate!=='function'||!validate(data))throw Error('対応していないデータ形式です');
 return data;
}
return Object.freeze({parse,MAX_BYTES,MAX_DEPTH,MAX_NODES});
});
