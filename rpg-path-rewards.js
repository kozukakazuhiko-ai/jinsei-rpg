/* 行動履歴に応じた称号と、装備・成長を結ぶRPG報酬の骨格。 */
(function(root){'use strict';
const TITLES=Object.freeze([
 {id:'scholar',name:'知を紡ぐ者',target:3,description:'学習Questを3件達成'},
 {id:'guardian',name:'挑戦を貫く者',target:3,description:'健康・挑戦Questを3件達成'},
 {id:'artisan',name:'創造を重ねる者',target:3,description:'創作・仕事Questを3件達成'},
 {id:'guide',name:'道を拓く者',target:3,description:'人間関係・生活Questを3件達成'},
 {id:'spellblade',name:'魔法剣士の証',target:3,description:'学習と健康・挑戦を各3件達成'},
 {id:'craftmage',name:'魔導技師の証',target:3,description:'学習と創作・仕事を各3件達成'},
 {id:'trailblazer',name:'開拓者の証',target:3,description:'健康・挑戦と人間関係・生活を各3件達成'},
 {id:'storyteller',name:'語り部の証',target:3,description:'創作・仕事と人間関係・生活を各3件達成'}
]);
function achievements(quests){const state={quests:quests||[]};const routes=[...root.LifeRpgProfessions.progress(state),...root.LifeRpgProfessions.hybridProgress(state)];return TITLES.map(t=>{const route=routes.find(p=>p.id===t.id);const current=route?.count||0;return {name:t.name,description:t.description,current,target:t.target,earned:current>=t.target};});}
root.LifeRpgPathRewards={TITLES,achievements};
})(typeof window!=='undefined'?window:globalThis);
