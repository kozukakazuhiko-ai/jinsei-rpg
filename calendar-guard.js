/* Calendar validation for persisted local-day keys and ISO timestamps. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.LifeRpgCalendarGuard=api;})(typeof globalThis!=='undefined'?globalThis:undefined,function(){
'use strict';
function day(value){
 if(typeof value!=='string'||!/^(\d{4})-(\d{2})-(\d{2})$/.test(value))return false;
 const [year,month,date]=value.split('-').map(Number);
 if(year<1||month<1||month>12||date<1)return false;
 const leap=year%4===0&&(year%100!==0||year%400===0);
 const max=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31][month-1];
 return date<=max;
}
function timestamp(value){return typeof value==='string'&&value.trim().length>0&&Number.isFinite(Date.parse(value));}
return Object.freeze({day,timestamp});
});
