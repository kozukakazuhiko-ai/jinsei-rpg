/* Profession paths are derived from completed Quest skill choices; no save migration. */
(function(root){'use strict';
const PATHS=Object.freeze([
 {id:'scholar',name:'魔導士',symbol:'✧',skills:['学習'],description:'学習Questを重ねる'},
 {id:'guardian',name:'戦士',symbol:'⚔',skills:['健康','挑戦'],description:'健康・挑戦Questを重ねる'},
 {id:'artisan',name:'職人',symbol:'✿',skills:['創作','仕事'],description:'創作・仕事Questを重ねる'},
 {id:'guide',name:'案内人',symbol:'❖',skills:['人間関係','生活'],description:'人間関係・生活Questを重ねる'}
]);
const HYBRIDS=Object.freeze([
 {id:'spellblade',name:'魔法剣士',symbol:'⚔✧',parents:['scholar','guardian'],description:'学習と健康・挑戦の両方を経験'},
 {id:'craftmage',name:'魔導技師',symbol:'✿✧',parents:['scholar','artisan'],description:'学習と創作・仕事の両方を経験'},
 {id:'trailblazer',name:'開拓者',symbol:'⚔❖',parents:['guardian','guide'],description:'健康・挑戦と人間関係・生活の両方を経験'},
 {id:'storyteller',name:'語り部',symbol:'✿❖',parents:['artisan','guide'],description:'創作・仕事と人間関係・生活の両方を経験'}
]);
const RANKS=Object.freeze([{need:1,name:'見習い'},{need:3,name:'一人前'},{need:7,name:'熟練'}]);
function progress(state){const done=(state?.quests||[]).filter(q=>q.status==='completed');return PATHS.map(path=>{const count=done.filter(q=>path.skills.includes(q.skill)).length;const rank=[...RANKS].reverse().find(r=>count>=r.need)||null;const next=RANKS.find(r=>count<r.need)||null;return {...path,count,rank:rank?.name||'未開放',unlocked:!!rank,next,remaining:next?next.need-count:0};});}
function hybridProgress(state){const base=progress(state);return HYBRIDS.map(h=>{const [a,b]=h.parents.map(id=>base.find(p=>p.id===id));const count=Math.min(a.count,b.count);const rank=[...RANKS].reverse().find(r=>count>=r.need)||null;const next=RANKS.find(r=>count<r.need)||null;return {...h,count,rank:rank?.name||'未開放',unlocked:!!rank,next,remaining:next?Math.max(next.need-a.count,0)+Math.max(next.need-b.count,0):0,components:[a.count,b.count]};});}
function activeHybrid(state){return hybridProgress(state).filter(p=>p.unlocked).sort((a,b)=>b.count-a.count||HYBRIDS.findIndex(h=>h.id===a.id)-HYBRIDS.findIndex(h=>h.id===b.id))[0]||null;}
function active(state){const unlocked=progress(state).filter(p=>p.unlocked);return unlocked.sort((a,b)=>b.count-a.count||PATHS.findIndex(p=>p.id===a.id)-PATHS.findIndex(p=>p.id===b.id))[0]||null;}
function lifePaths(state){const base=progress(state);const hybrids=hybridProgress(state);return {experienced:base.filter(p=>p.unlocked),hybrids:hybrids.filter(p=>p.unlocked),untouched:base.filter(p=>!p.unlocked),totalCompleted:(state?.quests||[]).filter(q=>q.status==='completed').length};}
function nextGoal(state){return progress(state).filter(p=>p.next).sort((a,b)=>a.remaining-b.remaining||b.count-a.count)[0]||null;}
root.LifeRpgProfessions={PATHS,HYBRIDS,RANKS,progress,hybridProgress,activeHybrid,active,lifePaths,nextGoal};
})(typeof window!=='undefined'?window:globalThis);
