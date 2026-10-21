/* RPG collection loop: deterministic unlocks from completed quests, no new save schema. */
(function(root){'use strict';
const ITEMS=Object.freeze([
 {id:'trail-badge',name:'旅立ちの徽章',need:1,kind:'quest',slot:'chest',symbol:'✦',description:'Questを1件達成'},
 {id:'adventure-scarf',name:'冒険者のスカーフ',need:3,kind:'quest',slot:'neck',symbol:'◆',description:'Questを3件達成'},
 {id:'bronze-crown',name:'若葉の冠',need:5,kind:'level',slot:'head',symbol:'♛',description:'Level 5に到達'},
 {id:'silver-crown',name:'銀の冠',need:15,kind:'level',slot:'head',symbol:'♛',description:'Level 15に到達'},
 {id:'master-crest',name:'熟練の紋章',need:10,kind:'quest',slot:'chest',symbol:'✧',description:'Questを10件達成'},
 {id:'spellblade-crest',name:'魔法剣士の紋章',need:1,kind:'hybrid',path:'spellblade',slot:'chest',symbol:'⚔',description:'学習と健康・挑戦のQuestを各1件達成'},
 {id:'craftmage-pendant',name:'魔導技師のペンダント',need:1,kind:'hybrid',path:'craftmage',slot:'neck',symbol:'⚙',description:'学習と創作・仕事のQuestを各1件達成'},
 {id:'pioneer-cap',name:'開拓者の帽子',need:1,kind:'hybrid',path:'trailblazer',slot:'head',symbol:'✦',description:'健康・挑戦と人間関係・生活のQuestを各1件達成'},
 {id:'scholar-aura',name:'星詠みの光',need:3,kind:'profession',path:'scholar',slot:'aura',symbol:'✧',description:'学習系Questを3件達成'},
 {id:'guardian-aura',name:'不屈の炎',need:3,kind:'profession',path:'guardian',slot:'aura',symbol:'✹',description:'健康・挑戦系Questを3件達成'},
 {id:'artisan-aura',name:'創造の花',need:3,kind:'profession',path:'artisan',slot:'aura',symbol:'✿',description:'創作・仕事系Questを3件達成'},
 {id:'guide-aura',name:'道標の星',need:3,kind:'profession',path:'guide',slot:'aura',symbol:'✦',description:'人間関係・生活系Questを3件達成'},
 {id:'storyteller-charm',name:'語り部の護符',need:1,kind:'hybrid',path:'storyteller',slot:'neck',symbol:'❖',description:'創作・仕事と人間関係・生活のQuestを各1件達成'},
 {id:'archmage-mantle',name:'賢者の肩章',need:7,kind:'profession',path:'scholar',slot:'chest',symbol:'✺',description:'学習Questを7件達成'},
 {id:'hero-shield',name:'勇者の盾章',need:7,kind:'profession',path:'guardian',slot:'chest',symbol:'⬡',description:'健康・挑戦Questを7件達成'},
 {id:'master-crafter',name:'匠の首飾り',need:7,kind:'profession',path:'artisan',slot:'neck',symbol:'✤',description:'創作・仕事Questを7件達成'},
 {id:'wayfinder',name:'導きの冠',need:7,kind:'profession',path:'guide',slot:'head',symbol:'✥',description:'人間関係・生活Questを7件達成'}
]);
function progress(state,level){const count=state.quests.filter(q=>q.status==='completed').length;const hybrids=typeof LifeRpgProfessions!=='undefined'?LifeRpgProfessions.hybridProgress(state):[];const paths=typeof LifeRpgProfessions!=='undefined'?LifeRpgProfessions.progress(state):[];return ITEMS.map(item=>{const current=item.kind==='profession'?(paths.find(p=>p.id===item.path)?.count||0):item.kind==='hybrid'?(hybrids.find(h=>h.id===item.path)?.count||0):item.kind==='level'?level:count;return {...item,unlocked:current>=item.need,current};});}
function equip(state,itemId,level){const item=progress(state,level).find(i=>i.id===itemId&&i.unlocked);if(!item)return false;if(!state.profile.equipment)state.profile.equipment={};state.profile.equipment[item.slot]=item.id;return true;}
function equipped(state,level){const available=progress(state,level);return available.filter(i=>i.unlocked&&state.profile.equipment?.[i.slot]===i.id);}
function nextUnlock(state,level){return progress(state,level).filter(i=>!i.unlocked).sort((a,b)=>(a.kind==='hybrid')-(b.kind==='hybrid')||(a.need-a.current)-(b.need-b.current))[0]||null;}
root.LifeRpgCollection={ITEMS,progress,equip,equipped,nextUnlock};
})(typeof window!=='undefined'?window:globalThis);
