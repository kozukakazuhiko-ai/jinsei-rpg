/* RPG骨格: 既存の実績・装備・職業・姿を横断して収集状況と次の目標を集約。保存データは変更しない。 */
(function(root){'use strict';
function snapshot(state,level,achievements){
 const items=root.LifeRpgCollection.progress(state,level);
 const base=root.LifeRpgProfessions.progress(state),hybrids=root.LifeRpgProfessions.hybridProgress(state);
 const routes=[...base,...hybrids];
 const titles=(achievements||[]).map(a=>({name:a.name,unlocked:!!a.earned,current:a.current,target:a.target}));
 const looks=Array.isArray(state?.profile?.appearanceAlbum)?state.profile.appearanceAlbum.length:0;
 const categories=[
  {id:'equipment',name:'装備・スキン',unlocked:items.filter(i=>i.unlocked).length,total:items.length},
  {id:'title',name:'称号・実績',unlocked:titles.filter(i=>i.unlocked).length,total:titles.length},
  {id:'profession',name:'職業・複合職',unlocked:routes.filter(i=>i.unlocked).length,total:routes.length},
  {id:'album',name:'姿アルバム',unlocked:looks,total:null}
 ];
 const goals=[
  ...items.filter(i=>!i.unlocked).map(i=>({id:'item:'+i.id,name:i.name,kind:'装備・スキン',remaining:Math.max(0,i.need-i.current),unit:i.kind==='level'?'レベル':'件',description:i.description})),
  ...titles.filter(i=>!i.unlocked).map(i=>({id:'title:'+i.name,name:i.name,kind:'称号・実績',remaining:Math.max(0,i.target-i.current),unit:'件',description:'Questの達成条件を満たす'})),
  ...routes.filter(i=>i.next).map(i=>({id:'route:'+i.id,name:i.name+' '+i.next.name,kind:'職業・複合職',remaining:i.remaining,unit:'件',description:i.description}))
 ];
 goals.sort((a,b)=>a.remaining-b.remaining||a.kind.localeCompare(b.kind,'ja')||a.name.localeCompare(b.name,'ja'));
 return {categories,goals:goals.slice(0,6),totalGoals:goals.length};
}
root.LifeRpgOverview={snapshot};
})(typeof window!=='undefined'?window:globalThis);
