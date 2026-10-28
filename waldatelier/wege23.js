/* Quiet key markers at reached junctions; keep deliberate-turn input buffering. */
let m23Road=null;
const m23RoadDraw=uRoad;uRoad=function(){const road=m23RoadDraw(...arguments);if(G?.pos.e==null&&road.n?.id===G.pos.n)m23Road={node:G.pos.n,h:G.pos.h,y:(road.yn+road.yf)/2,forward:Math.max(105,road.yf-9)};return road;};
function m23Directions(){if(!G||G.pos.e!=null)return [];const n=G.w.N[G.pos.n];if(n?.t!=='j'||n.place||here().t!=='fork')return [];return o19Directions();}
o19UpdateFork=function(){const dirs=m23Directions(),show=dirs.some(([key])=>key==='f'||key==='j')&&!paused&&!trans&&!qEffect&&!p18ModalActive()&&$('#ov-page').hidden&&$('#ov-done').hidden&&$('#ov-goal').hidden;o19Fork.hidden=!show;if(!show){o19ForkSignature='';return;}
 const road=inDesert()&&m23Road?.node===G.pos.n&&m23Road.h===G.pos.h?m23Road:null,y=road?.y??117,forward=road?.forward??106;
 const sig=[G.pos.n,G.pos.h,y,forward,dirs.map(d=>d[0]).join('')].join(':');if(sig===o19ForkSignature)return;o19ForkSignature=sig;
 o19Fork.innerHTML=dirs.map(([key,,label])=>{const x=key==='f'?60:key==='j'?260:160,yy=key===' '?forward:y,name=key===' '?'Leertaste':key.toUpperCase();return '<span class="route-key23" role="img" aria-label="'+name+': '+label+'" style="left:'+x/W*100+'%;top:'+yy/H*100+'%">'+(key===' '?'␣':name)+'</span>';}).join('');
};

/* Travel between saved worlds: never call enterCave(), which creates a new mine. */
function m23AtShaft(){return !!(G&&inDesert()&&G.phase==='explore'&&!G.city&&!G.puz&&G.pos.e==null&&G.pos.n==='AH');}
function m23StoreEdges(){if(!G||!inCave()||!S.world)return;S.world.mineEdges23=Object.fromEntries(G.w.edges.filter(e=>e.open||e.cleared||e.seen).map(e=>[e.uid,{open:!!e.open,cleared:!!e.cleared,seen:!!e.seen}]));}
const m23Sync=syncWorld;syncWorld=function(){m23Sync();m23StoreEdges();};
const m23CaveGame=caveGame;caveGame=function(){const result=m23CaveGame(...arguments);for(const e of G.w.edges){const flags=S.world.mineEdges23?.[e.uid];if(flags)Object.assign(e,flags);}
 // Older saves have no edge flags. Reaching this ladder proves its roots were cleared.
 if(S.world.returnFromDesert23){const e=G.w.edges.find(e=>e.roots&&(e.a==='AUS'||e.b==='AUS'));if(e)e.cleared=true;}
 renderScene();drawMap();updateControls();return result;
};
function m23Down(){if(!m23AtShaft()||trans||qEffect||G.storm)return;save();startTrans('zoom',1,()=>{
 const travelling=trans;S.wueste=S.world;G=null;S.where='hoehle';if(S.hoehle?.kind==='hoehle'&&S.hoehle.ver===2)S.world=S.hoehle;else newCaveWorld();
 S.world.pos={n:'AUS',e:null,k:0,h:2,arrH:0};S.world.fresh=false;S.world.returnFromDesert23=true;caveGame();
 setCaption(['Du steigst die alte Leiter zurück in die Mine hinunter.',S.inv.includes('spitzhacke')?'Deine bisherigen Wege und Funde sind noch da.':'Die liegen gelassene Spitzhacke kannst du im alten Stollen nachholen.'],true);save();updateControls();trans=travelling;
 },550);}
function m23Up(){const travelling=trans;save();S.hoehle=S.world;G=null;S.where='wueste';S.world=S.wueste;S.world.pos={n:'AH',e:null,k:0,h:1,arrH:1};S.world.fresh=false;desertGame();setCaption(['Du kletterst aus der Mine wieder in die Wüste.','Deine Karte und dein Fortschritt sind erhalten. L: zurück in die Mine.'],true);save();updateControls();trans=travelling;}
const m23Exit=caveExit;caveExit=function(){if(S.wueste?.kind!=='wueste')return m23Exit();if(trans)return;save();startTrans('zoom',1,m23Up,550);};
const m23EnterDesert=enterDesert;enterDesert=function(test){if(!test&&inCave()&&S.wueste?.kind==='wueste')return m23Up();return m23EnterDesert(test);};
const m23DesertOptions=desertOpts;desertOpts=function(){const options=m23DesertOptions();if(m23AtShaft()&&!G.storm)options.push(['l','Leiter hinunter · zurück in die Mine',m23Down]);return options;};DESERT_EX.opts=desertOpts;
const m23DesertLines=desertLines;desertLines=function(){const lines=m23DesertLines(...arguments);if(m23AtShaft()&&!G.storm)return ['Die alte Leiter führt vom Schacht zurück in die Mine.','L: hinuntersteigen. '+(S.inv.includes('spitzhacke')?'':'Dort liegt noch deine Spitzhacke, falls du sie nicht mitgenommen hast. ')+'Über dieselbe Leiter kommst du wieder hierher.'];return lines;};DESERT_EX.lines=desertLines;

sh21Ready.then(()=>{window.forestArt.version='4.7 Waldatelier 24 – Schiffsaufbau und gefluteter Rumpf';});
