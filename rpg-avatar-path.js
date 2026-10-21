/* Activity-driven visual identity: purely derived from completed quests, no save migration. */
(function(root){'use strict';
const STYLES=Object.freeze({
 scholar:{name:'魔導士',color:'#8e7ad0',accent:'#d7c7ff',motif:'star'},
 guardian:{name:'戦士',color:'#b65b58',accent:'#ffca90',motif:'shield'},
 artisan:{name:'職人',color:'#b28a48',accent:'#ffe0a0',motif:'gear'},
 guide:{name:'案内人',color:'#438c80',accent:'#b1ebc9',motif:'compass'},
 spellblade:{name:'魔法剣士',color:'#8e617f',accent:'#ffd4e9',motif:'blade'},
 craftmage:{name:'魔導技師',color:'#6178aa',accent:'#a9f1e9',motif:'gear'},
 trailblazer:{name:'開拓者',color:'#8c7652',accent:'#d9e9a8',motif:'compass'},
 storyteller:{name:'語り部',color:'#8774a3',accent:'#ffdbad',motif:'star'}
});
const MOTIFS=Object.freeze({
 star:'<path d="M50 67 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3Z"/>',
 shield:'<path d="M50 67 l11 4 -2 12 -9 9 -9 -9 -2 -12Z"/>',
 gear:'<path d="M46 67 h8 l2 5 5 2 v8 l-5 2 -2 5 h-8 l-2 -5 -5 -2 v-8 l5 -2Z"/><circle cx="50" cy="78" r="4" fill="#364056"/>',
 compass:'<circle cx="50" cy="78" r="11" fill="none" stroke-width="2"/><path d="M50 69 l4 9 -4 9 -4 -9Z"/>',
 blade:'<path d="M50 65 l5 14 -5 14 -5 -14Z"/><path d="M40 83 h20" stroke-width="3"/>'
});
function identity(state,professions){const active=professions.activeHybrid(state)||professions.active(state);return active?{...STYLES[active.id],id:active.id,rank:active.rank,count:active.count,hybrid:!!active.parents}:null;}
function layers(identity){if(!identity)return '';
 const color=identity.color,accent=identity.accent;
 const shoulders='<path d="M24 88 Q19 92 20 109 L28 116 L32 92Z M76 88 Q81 92 80 109 L72 116 L68 92Z" fill="'+color+'" stroke="'+accent+'" stroke-width="1.5"/>';
 const mantle='<path d="M28 84 Q18 103 20 132 L31 132 L35 94Z M72 84 Q82 103 80 132 L69 132 L65 94Z" fill="'+color+'" opacity=".88"/>';
 const emblem='<g fill="'+accent+'" stroke="'+accent+'" stroke-linejoin="round">'+MOTIFS[identity.motif]+'</g>';
 const collar=identity.hybrid?'<path d="M31 88 L50 99 L69 88" fill="none" stroke="'+accent+'" stroke-width="3"/>':'';
 return '<g data-rpg-identity="'+identity.id+'">'+mantle+shoulders+collar+emblem+'</g>';
}
// A journey is not a class lock: all completed activity domains leave visible traces.
function journey(state,professions){
 const base=professions.progress(state).filter(p=>p.unlocked);
 const hybrids=professions.hybridProgress(state).filter(p=>p.unlocked);
 return {base:base.map(p=>({id:p.id,name:p.name,count:p.count,rank:p.rank})),
         hybrids:hybrids.map(p=>({id:p.id,name:p.name,count:p.count,rank:p.rank}))};
}
function journeyLayers(journeyData){
 if(!journeyData||!Array.isArray(journeyData.base))return '';
 // Each route has its own permanent location; adding a new route never hides an old one.
 const positions={scholar:[30,101],guardian:[70,101],artisan:[34,121],guide:[66,121]};
 const fragments=[];
 for(const route of journeyData.base){
  const style=STYLES[route.id],pos=positions[route.id];if(!style||!pos)continue;
  const radius=route.count>=7?10:route.count>=3?8:6;
  fragments.push('<g data-rpg-journey="'+route.id+'" transform="translate('+pos[0]+' '+pos[1]+')">'+
   '<circle r="'+radius+'" fill="'+style.color+'" stroke="'+style.accent+'" stroke-width="2"/>'+
   '<circle r="'+Math.max(2,radius-4)+'" fill="'+style.accent+'"/></g>');
 }
 // Hybrids add a small connecting ornament without replacing their parent paths.
 const hybridPositions={spellblade:[43,106],craftmage:[43,116],trailblazer:[57,116],storyteller:[57,106]};
 for(const route of journeyData.hybrids||[]){
  const style=STYLES[route.id],pos=hybridPositions[route.id];if(!style||!pos)continue;
  fragments.push('<path data-rpg-hybrid="'+route.id+'" d="M'+pos[0]+' '+(pos[1]-4)+' l4 4 -4 4 -4 -4Z" fill="'+style.accent+'" stroke="'+style.color+'" stroke-width="1"/>');
 }
 return '<g data-rpg-journey-layers="true">'+fragments.join('')+'</g>';
}
root.LifeRpgAvatarPath={STYLES,identity,layers,journey,journeyLayers};
})(typeof window!=='undefined'?window:globalThis);
