/* Date-bound view refresh: no writes, no polling while hidden. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LifeRpgDayRollover=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function localDay(now=new Date()){
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
 }
 function create(onChange,clock=()=>new Date()){
  if(typeof onChange!=='function')throw TypeError('onChange must be a function');
  let last=localDay(clock());
  return {check(){const current=localDay(clock());if(current===last)return false;const previous=last;last=current;onChange(current,previous);return true;},get lastDay(){return last;}};
 }
 return Object.freeze({localDay,create});
});
