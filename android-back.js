// Android back navigation policy, isolated for testability.
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.LifeRpgAndroidBack=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function create(actions){let lastHomeBack=-Infinity;return {handle(){
  if(actions.isRewardOpen()){actions.closeReward();lastHomeBack=-Infinity;return 'reward';}
  if(actions.isEditorOpen()){actions.closeEditor();lastHomeBack=-Infinity;return 'editor';}
  if(actions.currentTab()!=='home'){actions.goHome();lastHomeBack=-Infinity;return 'home';}
  const now=actions.now();if(now-lastHomeBack<=2000&&now>=lastHomeBack){lastHomeBack=-Infinity;actions.exit();return 'exit';}
  lastHomeBack=now;actions.notify('もう一度戻るとアプリを終了します');return 'confirm-exit';
 }};}
 return {create};
});
