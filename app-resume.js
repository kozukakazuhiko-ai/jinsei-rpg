// Resume lifecycle coordination for web/PWA and Capacitor Android.
// Never writes persistent data; avoids redundant renders from overlapping lifecycle events.
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.LifeRpgAppResume=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function create(actions){
  let backgroundAt=null,lastRefresh=null;
  return {background(){if(backgroundAt===null)backgroundAt=actions.now();},resume(){
   const now=actions.now();
   const dayChanged=actions.checkDay(); // date rollover owns its own render
   const away=backgroundAt===null?0:Math.max(0,now-backgroundAt);
   backgroundAt=null;
   if(dayChanged){lastRefresh=now;return 'day-changed';}
   if(away>=300000&&(lastRefresh===null||now-lastRefresh>=1000)){actions.refresh();lastRefresh=now;return 'refreshed';}
   return 'unchanged';
  }};
 }
 return {create};
});
