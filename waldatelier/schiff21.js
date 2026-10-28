/* A longitudinal, keyboard-driven sailing-ship passage. World positions and
   collision geometry are independent of the optional visual ship roll. */
const SH21={},SH21_W=320,SH21_H=180;
function sh21Level(hold=false){
 const L={hold,end:hold?1650:3670,ground:[],solids:[],ceil:[],water:[],waves:[],climbs:[],rollers:[],gaps:[],checks:[],coins:[],masts:[]};
 const g=(a,b,y)=>L.ground.push({a,b,y}),box=(id,x,y,w,h,kind='barrel')=>L.solids.push({id,x,w,y,top:y-h,h,kind}),ce=(id,a,b,y,clear)=>L.ceil.push({id,a,b,y,clear,kind:clear<20?'crawl':'duck'}),coin=(id,x,y)=>L.coins.push({id,x,y});
 if(!hold){
  g(-100,1248,150);g(1238,1580,108);g(1580,1612,126);g(1612,1644,138);g(1644,2262,150);g(2326,2660,108);g(2660,2690,126);g(2690,2720,138);g(2720,3080,150);g(3090,3310,104);g(3310,3340,122);g(3340,3370,138);g(3370,3720,150);
  box('fragile-first',175,150,23,18,'fragile');ce('sail-boom',305,405,150,24);box('lying-pair',480,150,33,13,'lying');
  L.water.push({id:'first-wade',a:595,b:710,y:150},{id:'upper-wash',a:2820,b:2940,y:150});
  L.waves.push({id:'first-breaker',a:875,b:945,y:150,mast:888},{id:'great-breaker',a:2410,b:2485,y:108,mast:2423});
  L.masts=[{x:-10,y:150,w:18},{x:402,y:150,w:17},{x:888,y:150,w:20},{x:2423,y:108,w:23}];
  L.climbs.push({id:'ladder',key:'l',kind:'ladder',x:1220,y:150,tx:1242,ty:108},{id:'stairs',key:'t',kind:'stairs',x:2250,y:150,tx:2335,ty:108},{id:'net',key:'k',kind:'net',x:3068,y:150,tx:3102,ty:104});
  L.gaps.push({id:'upper-gap',a:1420,b:1452,y:108},{id:'storm-gap',a:2540,b:2578,y:108});
  box('cargo-deck',1840,150,45,44,'cargo');box('barrel-upper',1510,108,24,14,'lying');box('fragile-late',3435,150,23,18,'fragile');
  L.rollers.push({id:'loose-barrel',a:2025,b:2075,y:150},{id:'net-barrel',a:3190,b:3220,y:104});
  L.checks=[{x:35,y:150},{x:755,y:150},{x:1130,y:150},{x:1690,y:150},{x:2170,y:150},{x:2745,y:150},{x:3385,y:150}];
  for(const [i,x,y]of [[0,235,133],[1,263,133],[2,482,112],[3,504,112],[4,1050,131],[5,1080,131],[6,1360,86],[7,1435,72],[8,1490,88],[9,1740,131],[10,1770,131],[11,2000,116],[12,2050,113],[13,2375,86],[14,2550,73],[15,2630,88],[16,2975,130],[17,3005,130],[18,3150,82],[19,3204,69],[20,3480,130]])coin('deck-coin-'+i,x,y);
 }else{
  g(-100,1700,150);ce('fallen-spar',175,285,150,24);ce('crawl-bulkhead',405,530,150,14);ce('last-crawl',1335,1430,150,14);
  L.water.push({id:'hold-flood',a:650,b:790,y:150});box('cargo-hold',925,150,45,44,'cargo');box('hold-fragile',580,150,23,18,'fragile');
  L.rollers.push({id:'hold-roller',a:1125,b:1175,y:150});L.checks=[{x:35,y:150},{x:555,y:150},{x:1025,y:150},{x:1460,y:150}];
  for(const [i,x,y]of [[0,100,133],[1,130,133],[2,320,133],[3,350,133],[4,600,116],[5,830,132],[6,865,132],[7,1080,132],[8,1150,113],[9,1250,133],[10,1280,133],[11,1490,133],[12,1520,133]])coin('hold-coin-'+i,x,y);
 }
 return L;
}
function sh21Active(){return !!(G?.ship21&&G.phase==='ship');}
function sh21State(){return S.ship21;}
function sh21Floor(x,from=-999){let y=999;const L=G.ship21.level;
 for(const g of L.ground)if(x>=g.a&&x<=g.b&&g.y>=from-.5&&!L.gaps.some(z=>x>z.a&&x<z.b&&Math.abs(z.y-g.y)<1))y=Math.min(y,g.y);
 for(const s of L.solids)if(!sh21Removed(s)&&s.kind!=='cargo'&&x>=s.x-2&&x<=s.x+s.w+2&&s.top>=from-.5)y=Math.min(y,s.top);return y;
}
function sh21Removed(s){return !!G.ship21.broken[s.id]||s.kind==='cargo'&&!!G.ship21.cleared[s.id];}
function sh21Height(){const p=G.ship21.p;return p.mode==='crawl'?13:p.mode==='duck'?22:34;}
function sh21Ceil(x){let clear=999;for(const c of G.ship21.level.ceil)if(x+5>c.a&&x-5<c.b)clear=Math.min(clear,c.clear);return clear;}
function sh21NearClimb(){const q=G.ship21,p=q.p;return q.level.climbs.find(c=>Math.hypot(p.x-c.x,p.y-c.y)<27||p.face<0&&Math.hypot(p.x-c.tx,p.y-c.ty)<25);}
function sh21NearWater(){const p=G.ship21.p;return G.ship21.level.water.find(z=>p.x>z.a-25&&p.x<z.b+8&&Math.abs(p.y-z.y)<4);}
function sh21NearWave(){const p=G.ship21.p;return G.ship21.level.waves.find(z=>!G.ship21.cleared[z.id]&&p.x>z.a-65&&p.x<z.b&&Math.abs(p.y-z.y)<5);}
function sh21NearCargo(){const p=G.ship21.p;return G.ship21.level.solids.find(s=>s.kind==='cargo'&&!sh21Removed(s)&&p.x>s.x-65&&p.x<s.x+s.w&&Math.abs(p.y-s.y)<5);}
function sh21Inspectable(){const q=G.ship21,p=q.p,cargo=sh21NearCargo();if(cargo&&!q.known.cargo)return ['cargo','Lose Ladung','Ein Tau führt über einen befestigten Flaschenzug. Z: daran ziehen und die Ladung anheben.'];
 if(q.level.solids.some(s=>s.kind==='fragile'&&!sh21Removed(s)&&s.x-p.x>-5&&s.x-p.x<58)&&!q.known.fragile)return ['fragile','Ein morsches Fass','Die Dauben sind gesprungen. Spring mit S darauf: Das Fass kann zerbrechen.'];
 if(sh21NearWater()&&!q.known.water)return ['water','Übergespültes Deck','Hier steht Wasser zwischen den Planken. W: vorsichtig hindurchwaten.'];
 if(q.level.gaps.some(z=>z.a-p.x>-15&&z.a-p.x<65)||q.stage==='deck'&&p.x>3470){if(!q.known.planks)return ['planks','Beschädigte Planken','Risse und fehlende Bretter. S: auf den festen Abschnitt dahinter springen.'];}return null;
}
function sh21SetCaption(title,text){const sig=title+'|'+text;if(G.ship21?.caption===sig)return;if(G.ship21)G.ship21.caption=sig;setCaption([title,text].filter(Boolean),true);}
function sh21Hint(force=false){if(!sh21Active())return;const q=G.ship21,p=q.p;if(q.stage==='departure'){sh21SetCaption('Du gehst an Bord. Die Leinen fallen ins Wasser.','Das Schiff verlässt den Hafen. Leertaste: die Abfahrt ansehen oder weiter.');return;}
 if(q.stage==='fall'){sh21SetCaption('Du landest – da trifft die nächste Welle das Schiff. Die Balken brechen!','Du stürzt mit den Planken in den Schiffsrumpf.');return;}
 if(q.stage==='sink'){sh21SetCaption('Wasser drückt durch die Bordwand. Das Schiff sinkt.','Blaue Wellen schließen sich über dir. Leertaste: Sequenz weiter.');return;}
 if(q.brace){sh21SetCaption('Du klammerst dich am Mast fest. Die Welle bricht über das Deck.','Du hältst durch, bis der Brecher vorüber ist.');return;}
 if(q.climb){const c=q.level.climbs.find(c=>c.id===q.climb.id);sh21SetCaption(c.kind==='ladder'?'Du kletterst die Leiter.':c.kind==='stairs'?'Du steigst die Treppe.':'Du kletterst im befestigten Wantennetz.',c.key.toUpperCase()+': nächster Schritt · Rücktaste: zum Merkpunkt');return;}
 if(!force&&q.messageUntil>q.t)return;
 const inspect=sh21Inspectable(),wave=sh21NearWave(),water=sh21NearWater(),cargo=sh21NearCargo(),climb=sh21NearClimb(),ceil=q.level.ceil.find(c=>p.x>c.a-48&&p.x<c.b);
 if(inspect){sh21SetCaption('Du entdeckst etwas: '+inspect[1]+'.','I: identifizieren. '+(cargo?'Z: Tau ziehen.':water?'W: waten.':'J: weiter · S: springen.'));return;}
 if(wave){sh21SetCaption('Eine große Welle kommt. Am Mast ist ein Tau befestigt.','Ü: am Mast festhalten und den Brecher überleben.');return;}
 if(water){sh21SetCaption(q.level.hold?'Wasser steigt im Rumpf.':'Eine Welle hat das Deck überspült.','W: Schritt für Schritt waten. F: zurück.');return;}
 if(cargo){sh21SetCaption('Verrutschte Ladung versperrt den Weg.','Z: am Tau ziehen · '+(q.pulls[cargo.id]||0)+'/3 Zugschritte');return;}
 if(climb){sh21SetCaption(climb.kind==='ladder'?'Eine Leiter führt aufs nächste Deck.':climb.kind==='stairs'?'Eine Treppe führt längs aufs höhere Deck.':'Ein Wantennetz ist an den Spieren festgezurrt.',climb.key.toUpperCase()+': '+(climb.kind==='net'?'Netz klettern':climb.kind==='stairs'?'Treppe steigen':'Leiter klettern'));return;}
 if(ceil){sh21SetCaption(ceil.clear<20?'Eingestürzte Balken lassen nur einen schmalen Durchgang frei.':q.level.hold?'Ein gebrochener Balken liegt tief über dem Boden.':'Der gelöste Segelbaum schwingt tief über das Deck.',ceil.clear<20?'K: kriechen · F/J: weiter · K: später aufstehen.':'D: ducken · F/J: weiter · D: später aufstehen.');return;}
 if(q.level.rollers.some(r=>p.x>r.a-60&&p.x<r.b+16)){sh21SetCaption('Ein Fass hat sich losgerissen und rollt über die Planken.','S: darüber springen.');return;}
 if(q.stage==='deck'&&p.x>3470){sh21SetCaption('Das hintere Deck ist großflächig beschädigt. Die Planken knacken.','S: versuch, den festen Abschnitt zu erreichen.');return;}
 sh21SetCaption(q.stage==='hold'?'Über dir knarrt das Schiff. Du suchst einen Weg durch den Rumpf.':p.x<560?'Der Hafen entfernt sich. Noch ist das Meer ruhig.':'Wind zerrt an den Segeln. Du gehst längs über das schwankende Schiff.',p.mode==='crawl'?'F/J: kriechen · K: aufstehen.':p.mode==='duck'?'F/J: geduckt gehen · D: aufstehen.':'F/J: gehen · S: springen · F3: Bildschirmtastatur');
}
function sh21Actions(){const q=G.ship21,p=q.p;if(['departure','sink'].includes(q.stage))return [[' ','weiter']];if(q.stage==='fall'||q.brace)return [];
 if(q.climb){const c=q.level.climbs.find(c=>c.id===q.climb.id);return [[c.key,c.kind==='net'?'weiter im Netz':c.kind==='stairs'?'weiter auf der Treppe':'weiter auf der Leiter'],['Backspace','zum Merkpunkt']];}
 const actions=p.mode==='wade'?[['w','weiterwaten'],['f','zurückwaten']]:[['f',p.mode?'zurück':'nach links'],['j',p.mode?'geduckt weiter':'nach rechts'],['s','springen']];
 const c=sh21NearClimb(),w=sh21NearWater(),wave=sh21NearWave(),cargo=sh21NearCargo();
 if(p.mode!=='wade'){actions.push(['d',p.mode==='duck'?'aufstehen':'ducken']);if(!c||c.key!=='k')actions.push(['k',p.mode==='crawl'?'aufstehen':'kriechen']);}
 if(c)actions.push([c.key,c.kind==='net'?'Netz klettern':c.kind==='stairs'?'Treppe steigen':'Leiter klettern']);
 if(w&&!actions.some(a=>a[0]==='w'))actions.push(['w','waten']);if(wave)actions.push(['ü','am Mast überleben']);if(cargo)actions.push(['z','Tau ziehen']);if(sh21Inspectable())actions.push(['i','identifizieren']);actions.push(['Backspace','zum Merkpunkt']);return actions;
}
function sh21Message(title,text,seconds=2.2){const q=G.ship21;q.caption='';sh21SetCaption(title,text);q.messageUntil=q.t+seconds;}
function sh21Capture(){if(!sh21Active())return;const q=G.ship21,p=q.p,s=sh21State();if(!p.air&&!p.move){q.stable={x:p.x,y:p.y,mode:p.mode,face:p.face};}Object.assign(s,{active:true,stage:q.stage,p:{...q.stable},checkpoint:{...q.checkpoint},collected:{...q.collected},broken:{...q.broken},cleared:{...q.cleared},known:{...q.known},pulls:{...q.pulls},coins:q.coins,paid:{...q.paid},climb:q.climb?{...q.climb,n:Math.max(0,q.climb.n-(p.move?1:0))}:null});}
const sh21SyncWorld=syncWorld;syncWorld=function(){sh21SyncWorld();sh21Capture();};
function sh21Start(resume=false,practice=false){
 if(!G)return;const old=S.ship21,paid=practice?old?.paid||{}:{};
 if(!resume||!old?.active)S.ship21={active:true,stage:'departure',p:{x:35,y:150,mode:null,face:1},checkpoint:{stage:'deck',x:35,y:150},collected:{},broken:{},cleared:{},known:practice?old?.known||{}:{},pulls:{},coins:0,paid};
 const s=S.ship21,hold=['hold','sink'].includes(s.stage);G.ship21={...s,stage:s.stage,level:sh21Level(hold),p:{...s.p,air:false,move:null,anim:0},stable:{...s.p},t:0,cinema:0,last:performance.now(),cam:Math.max(0,s.p.x-80),parts:[],checkIndex:0};
 G.city=null;G.ex=null;G.cave=true;G.phase='ship';G.storm=G.detour=G.sky=null;G.enc=null;G.guide=null;G.puz=null;G.menu=null;trans=pending=qEffect=null;vSky=null;paused=false;p18TutorialQueue=[];
 for(const id of ['#ov-done','#ov-page','#ov-goal','#ov-pause','#tmenu','#abox','#lock','#moss','#snap'])$(id).hidden=true;
 document.body.classList.add('ship21-active');$('#hud-where').textContent='Kapitel 2 · Auf See';$('#clock').hidden=true;sh21SetLayout();renderInv();sh21Hint(true);updateControls();save();sh21Render();
}
boardShip=function(){if(!S.inv.includes('ticket')){notice('Am Steg brauchst du dein Schiffsticket.');return;}S.inv=S.inv.filter(k=>k!=='ticket');S.world.boarded=(S.world.boarded||0)+1;const dep=nextDep(dTime());if(dep)S.world.time=dep;SND.done();sh21Start();};
const sh21NewGame=newGame;newGame=function(){const resume=!!S.ship21?.active,demo=location.hash==='#schiff';sh21NewGame();if(resume)sh21Start(true);else if(demo){if(!inDesert())enterDesert(true);testKit();S.world.time=480;S.world.storms=[];S.settings.goal=120;S.needs={w:DROP_MS*30,f:BERRY_MS*30};sh21Start(false,!!S.ship21?.done);}};
function sh21SetLayout(){const active=sh21Active();document.body.classList.toggle('ship21-active',active);$('#screen-game .hud > div > strong').textContent=active?'Sturmfahrt':'Erwachen';$('#btn-ship21-motion').hidden=!active;$('#btn-ship21-motion').textContent=S.settings.shipMotion===false||reduceMotion?'Schaukeln aus · F7':'Schaukeln an · F7';}
const sh21MotionButton=document.createElement('button');sh21MotionButton.id='btn-ship21-motion';sh21MotionButton.className='btn small';sh21MotionButton.hidden=true;d17Toolbar.append(sh21MotionButton);sh21MotionButton.onclick=()=>{S.settings.shipMotion=!(S.settings.shipMotion!==false);save();sh21SetLayout();};
window.addEventListener('keydown',e=>{if(e.key==='F7'&&sh21Active()){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)sh21MotionButton.click();}},true);
const sh21Layout=d17Layout;d17Layout=function(){const r=sh21Layout();sh21SetLayout();return r;};
const sh21Show=show;show=function(){const r=sh21Show(...arguments);sh21SetLayout();return r;};
const sh21Expected=expected;expected=function(){if(sh21Active()){if(p18ModalActive())return sh21Expected();if(paused||!$('#ov-goal').hidden||!$('#ov-done').hidden)return [];return [...new Set(sh21Actions().map(a=>a[0]))];}return sh21Expected();};
const sh21ActionsNow=actionsNow;actionsNow=function(){return sh21Active()&&!p18ModalActive()?sh21Actions():sh21ActionsNow();};
const sh21OnHit=onHit;onHit=function(ch){if(sh21Active()&&!p18ModalActive()){p18RecordKey(ch);$('#hint').textContent='';sh21Key(ch);return;}return sh21OnHit(ch);};

function sh21Award(id,x,y){const q=G.ship21;if(q.collected[id])return;q.collected[id]=true;if(!q.paid[id]){q.paid[id]=true;S.coins=(S.coins||0)+1;q.coins++;q.parts.push({x,y,t:0,label:'+1'});SND.pick();renderInv('muenzen');}save();}
function sh21Reset(message='Du gehst zum letzten Merkpunkt zurück.'){const q=G.ship21,c=q.checkpoint;q.stage=c.stage;q.level=sh21Level(c.stage==='hold');q.p={x:c.x,y:c.y,face:1,mode:null,air:false,move:null,anim:0};q.stable={x:c.x,y:c.y,face:1,mode:null};q.climb=q.brace=q.queue=null;q.hurt=.65;q.cam=Math.max(0,c.x-80);sh21Message(message,'Am Merkpunkt kannst du es in Ruhe noch einmal versuchen.',3);SND.soft();updateControls();save();}
function sh21Move(x,y,pose='walk',dur=.22){const q=G.ship21,p=q.p;p.move={x0:p.x,y0:p.y,x1:x,y1:y,t:0,dur,pose};p.anim=(p.anim||0)+.08;}
function sh21TryWalk(dir){const q=G.ship21,p=q.p,L=q.level;p.face=dir;const water=sh21NearWater();let nx=Math.max(10,Math.min(L.end-12,p.x+dir*(p.mode==='crawl'?14:p.mode==='duck'?16:22))),ny=p.y,reason='';
 if(p.mode==='wade'){if(dir>0){sh21Message('Hier watest du durch das Wasser.','W: nächster Watschritt. F: zurück.');return;}nx=p.x-12;}
 for(let x=p.x+dir;dir>0?x<=nx:x>=nx;x+=dir){
  if(sh21Ceil(x)<sh21Height()){nx=x-dir*2;reason=sh21Ceil(x)<20?'Der Durchgang ist zu niedrig. K: kriechen.':'Der Segelbaum hängt zu tief. D: ducken.';break;}
  const wet=L.water.find(z=>x>z.a-4&&x<z.b&&Math.abs(p.y-z.y)<4);if(wet&&p.mode!=='wade'){nx=x-dir*2;reason='Wasser auf den Planken. W: hindurchwaten.';break;}
  const wave=L.waves.find(z=>!q.cleared[z.id]&&x>=z.a-12&&x<=z.b&&Math.abs(p.y-z.y)<4);if(wave){nx=x-dir*2;reason='Ein Brecher kommt. Ü: am Mast festhalten.';break;}
  const climb=L.climbs.find(c=>dir>0&&Math.abs(p.y-c.y)<3&&x>c.x+5&&x<c.tx+4);if(climb){nx=x-2;reason=(climb.kind==='net'?'Das Netz':climb.kind==='stairs'?'Die Treppe':'Die Leiter')+' führt hinauf. '+climb.key.toUpperCase()+': aufsteigen.';break;}
  const gap=L.gaps.find(z=>Math.abs(p.y-z.y)<2&&(dir>0?x>=z.a-5&&x<z.b:x<=z.b+5&&x>z.a));if(gap){nx=x-dir*2;reason='Hier fehlen Planken. S: über die Lücke springen.';break;}
  const s=L.solids.find(s=>!sh21Removed(s)&&x+5>s.x&&x-5<s.x+s.w&&p.y>s.top+2&&p.y-sh21Height()<s.y);if(s){nx=x-dir*2;reason=s.kind==='cargo'?'Die Ladung versperrt den Weg. Z: Tau ziehen.':'Ein Fass liegt im Weg. S: darüber springen.';break;}
  if(q.stage==='deck'&&x>3540&&dir>0){nx=x-2;reason='Die Planken sind rissig. S: versuch hinüberzuspringen.';break;}
 }
 if(Math.abs(nx-p.x)>1){const floor=sh21Floor(nx,p.y-1);if(floor<999&&floor-p.y>=0&&floor-p.y<=22)ny=floor;sh21Move(nx,ny,p.mode||'walk',Math.max(.12,Math.abs(nx-p.x)/(p.mode?75:120)));SND.foot();}
 if(reason)sh21Message(reason,'F3: Bildschirmtastatur · Rücktaste: zum Merkpunkt',2.4);
 if(p.mode==='wade'&&(!water||nx<water.a-10))p.mode=null;
}
function sh21Jump(){const q=G.ship21,p=q.p;if(sh21Ceil(p.x)<34||q.level.ceil.some(c=>c.a>p.x&&c.a<p.x+65&&p.y===c.y)){sh21Message('Hier schwingt ein Balken über dem Weg.','D: ducken, oder K: unter dem niedrigen Durchgang kriechen.');return;}
 p.mode=null;p.air=true;p.vy=-175;p.vx=p.face*155;p.fromY=p.y;p.anim=0;
 const target=q.level.solids.find(s=>s.kind==='fragile'&&!sh21Removed(s)&&s.x-p.x>0&&s.x-p.x<65&&Math.abs(s.y-p.y)<2);
 if(target){const dy=p.y-target.top,time=(175+Math.sqrt(175*175-2*500*dy))/500;p.vx=(target.x+target.w/2-p.x)/time;}
 SND.step();
}
function sh21Pose(mode){const q=G.ship21,p=q.p;if(p.mode===mode){if(sh21Ceil(p.x)<34){sh21Message('Hier kannst du dich noch nicht aufrichten.','Geh erst ganz unter dem Balken hindurch.');return;}p.mode=null;sh21Message('Du richtest dich wieder auf.','F/J: weitergehen.',1);}
 else{if(mode==='duck'&&sh21Ceil(p.x)<22){sh21Message('Zum Ducken reicht der Platz nicht.','K: auf Hände und Knie gehen.');return;}p.mode=mode;sh21Message(mode==='duck'?'Du duckst dich unter den Segelbaum.':'Du gehst auf Hände und Knie.',mode==='duck'?'F/J: geduckt weiter. D: später aufstehen.':'F/J: weiterkriechen. K: später aufstehen.',1.4);}}
function sh21Climb(){const q=G.ship21,p=q.p,c=q.level.climbs.find(c=>c.id===q.climb?.id)||sh21NearClimb();if(!c)return;
 if(!q.climb){const down=Math.hypot(p.x-c.tx,p.y-c.ty)<Math.hypot(p.x-c.x,p.y-c.y);q.climb={id:c.id,n:0,total:Math.ceil(Math.hypot(c.tx-c.x,c.ty-c.y)/(c.kind==='net'?7:10)),down};p.mode=null;p.x=down?c.tx:c.x;p.y=down?c.ty:c.y;}
 const cl=q.climb,k=Math.min(1,(cl.n+1)/cl.total),fx=cl.down?c.tx:c.x,fy=cl.down?c.ty:c.y,tx=cl.down?c.x:c.tx,ty=cl.down?c.y:c.ty;cl.n++;sh21Move(fx+(tx-fx)*k,fy+(ty-fy)*k,c.kind==='stairs'?'stairs':'climb',.18);SND.turn();
}
function sh21Wade(){const q=G.ship21,p=q.p,z=sh21NearWater();if(!z)return;p.mode='wade';p.face=1;sh21Move(Math.min(z.b+16,p.x+14),z.y,'wade',.26);SND.water();}
function sh21Key(ch){const q=G.ship21,p=q.p;
 if(q.stage==='departure'){if(ch===' '){q.stage='deck';q.cinema=0;sh21Message('Die Küste bleibt hinter dir zurück.','F/J: längs über das Deck gehen. S: springen.',3);updateControls();save();}return;}
 if(q.stage==='sink'){if(ch===' ')sh21Finish();return;}if(q.stage==='fall'||q.brace||q.hurt>0)return;
 if(ch==='Backspace'){sh21Reset();return;}
 if(p.move||p.air){q.queue=ch;return;}
 if(q.climb){const c=q.level.climbs.find(c=>c.id===q.climb.id);if(ch===c.key)sh21Climb();return;}
 const climb=sh21NearClimb();
 if(climb&&ch===climb.key){sh21Climb();}
 else if(ch==='f'||ch==='j')sh21TryWalk(ch==='f'?-1:1);
 else if(ch==='s')sh21Jump();
 else if(ch==='d')sh21Pose('duck');
 else if(ch==='k')sh21Pose('crawl');
 else if(ch==='w')sh21Wade();
 else if(ch==='i'){const info=sh21Inspectable();if(info){q.known[info[0]]=true;sh21Message(info[1],info[2],4);save();}}
 else if(ch==='z'){const cargo=sh21NearCargo();if(cargo){p.face=1;p.mode=null;q.pullingUntil=q.t+.55;q.pulls[cargo.id]=(q.pulls[cargo.id]||0)+1;q.pullAnim={id:cargo.id,from:(q.pulls[cargo.id]-1)*19,to:q.pulls[cargo.id]*19,t:q.t};if(q.pulls[cargo.id]>=3){q.cleared[cargo.id]=true;sh21Message('Die Ladung hängt sicher am Flaschenzug.','Der Weg darunter ist jetzt frei.',3);}else sh21Message('Du ziehst am Tau. Die Ladung hebt sich.','Z: weiterziehen · '+q.pulls[cargo.id]+'/3',2);SND.turn();save();}}
 else if(ch==='ü'){const wave=sh21NearWave();if(wave){p.face=1;p.mode=null;q.brace={id:wave.id,elapsed:0,from:p.x,target:wave.mast-12};q.queue=null;SND.water();sh21Hint(true);save();}}
 sh21Hint();updateControls();
}
function sh21Landed(s){const q=G.ship21,p=q.p;if(s?.kind==='fragile'&&!q.broken[s.id]){q.broken[s.id]=true;sh21Award('broken-'+s.id,s.x+s.w/2,s.top-8);q.parts.push({x:s.x+s.w/2,y:s.top,t:0,debris:true});SND.find();sh21Message('Krach! Das morsche Fass bricht auseinander.','Darin lag eine Goldmünze.',2);p.air=true;p.vy=0;p.vx=0;save();}}
function sh21Collapse(){const q=G.ship21;q.stage='fall';q.cinema=0;q.queue=null;q.p.move=null;q.p.air=false;q.broken['final-deck']=true;sh21Hint(true);save();}
function sh21EnterHold(){const q=G.ship21;q.stage='hold';q.level=sh21Level(true);q.p={x:35,y:150,face:1,mode:null,air:false,move:null,anim:0};q.stable={x:35,y:150,face:1,mode:null};q.cam=0;q.cinema=0;q.climb=q.brace=q.queue=null;q.checkpoint={stage:'hold',x:35,y:150};sh21Message('Du landest zwischen Säcken und gebrochenen Planken.','Über dir bricht das Deck weiter ein. Suche einen Weg durch den Rumpf.',4);updateControls();save();}
function sh21Tick(dt){const q=G.ship21,p=q.p,L=q.level;q.t+=dt;q.cinema+=dt;if(q.hurt>0){q.hurt=Math.max(0,q.hurt-dt);return;}
 if(q.stage==='departure')return;if(q.stage==='fall'){p.y+=dt*(q.cinema*65);if(q.cinema>2.5)sh21EnterHold();return;}
 if(q.stage==='sink'){if(q.cinema>8)sh21Finish();return;}
 if(q.brace){q.brace.elapsed+=dt;if(q.brace.elapsed<.5){const k=q.brace.elapsed/.5;p.x=q.brace.from+(q.brace.target-q.brace.from)*(k*k*(3-2*k));p.anim+=dt;}else p.x=q.brace.target;if(q.brace.elapsed>2.8){q.cleared[q.brace.id]=true;q.brace=null;sh21Message('Der Brecher zieht weiter. Du lässt das Tau wieder los.','F/J: weiter über das nasse Deck.',2);updateControls();save();}return;}
 if(p.move){const m=p.move;m.t+=dt;const k=Math.min(1,m.t/m.dur),ease=k*k*(3-2*k);p.x=m.x0+(m.x1-m.x0)*ease;p.y=m.y0+(m.y1-m.y0)*ease;p.anim+=dt;
  if(k>=1){p.move=null;if(q.climb&&q.climb.n>=q.climb.total){q.climb=null;sh21Message('Du steigst auf festen Boden.','F/J: weitergehen.',1.2);}if(p.mode==='wade'&&!sh21NearWater())p.mode=null;save();updateControls();}
 }else if(p.air){const oldY=p.y;p.vy+=500*dt;let nx=p.x+p.vx*dt,ny=p.y+p.vy*dt;
  const wall=L.solids.find(s=>!sh21Removed(s)&&nx+5>s.x&&nx-5<s.x+s.w&&ny>s.top+3&&ny-30<s.y);if(wall){nx=p.x;if(p.vy>=0)p.vx=0;}
  p.x=nx;p.y=ny;
  if(p.vy>=0){let landing=null;for(const g of L.ground){if(p.x>=g.a&&p.x<=g.b&&g.y>=oldY-1&&g.y<=ny&&!L.gaps.some(z=>p.x>z.a&&p.x<z.b&&z.y===g.y)&&(!landing||g.y<landing.y))landing={y:g.y};}
   for(const s of L.solids)if(!sh21Removed(s)&&p.x+4>s.x&&p.x-4<s.x+s.w&&s.top>=oldY-1&&s.top<=ny&&(!landing||s.top<landing.y))landing={y:s.top,s};
   if(landing){p.y=landing.y;p.air=false;p.vy=p.vx=0;if(q.stage==='deck'&&p.x>3550){sh21Collapse();return;}sh21Landed(landing.s);updateControls();save();}
  }
  if(p.y>220){sh21Reset('Du rutschst zwischen die beschädigten Planken.');return;}
 }
 if(!p.air&&!p.move&&!q.climb){const floor=sh21Floor(p.x,p.y-1);if(floor>p.y+3){p.air=true;p.vy=0;p.vx=p.face*38;p.fromY=p.y;}}
 for(const r of L.rollers){const x=(r.a+r.b)/2+Math.sin(q.t*1.1+r.a)*(r.b-r.a)/2;if(Math.abs(p.x-x)<12&&p.y>r.y-15&&p.y<r.y+4&&!q.climb){sh21Reset('Das rollende Fass bringt dich aus dem Gleichgewicht.');return;}}
 for(const z of L.water)if(p.x>z.a&&p.x<z.b&&Math.abs(p.y-z.y)<3&&p.mode!=='wade'&&!p.air){sh21Reset('Du landest unvorbereitet im übergespülten Bereich.');return;}
 for(const coin of L.coins)if(!q.collected[coin.id]&&Math.abs(p.x-coin.x)<8&&coin.y>p.y-sh21Height()-4&&coin.y<p.y+4)sh21Award(coin.id,coin.x,coin.y);
 if(!p.air&&!p.move&&!q.climb){for(const cp of L.checks)if(cp.x>q.checkpoint.x&&p.x>=cp.x&&Math.abs(p.y-cp.y)<3){q.checkpoint={stage:q.stage,x:cp.x,y:cp.y};q.checkFlash=q.t;save();}if(q.stage==='hold'&&p.x>1585){q.stage='sink';q.cinema=0;q.queue=null;sh21Hint(true);save();updateControls();return;}}
 q.parts=q.parts.filter(pt=>(pt.t+=dt)<1.1);q.cam=Math.max(0,Math.min(L.end-285,p.x-82));
 if(!p.air&&!p.move){if(q.queue){const key=q.queue;q.queue=null;if(!sh21NearWave()&&!sh21NearCargo()&&!sh21NearClimb()&&sh21Actions().some(a=>a[0]===key))sh21Key(key);}sh21Hint();}
}
function sh21Finish(){if(!sh21Active())return;const q=G.ship21;sh21Capture();S.ship21.active=false;S.ship21.done=true;SND.soft();G.phase='done';paused=false;
 $('#done-card').innerHTML='<p class="eyebrow">Kapitel 2 · Auf See</p><h2>Unter den Wellen</h2><p id="done-story">Das Knarren des Schiffs verstummt. Blaues Licht zieht Kreise um dich. Für einen Moment ist alles still …</p><p>Du hast den Weg über das sturmgepeitschte Deck und durch den Schiffsrumpf geschafft.</p><dl class="stats3"><div><dt>Münzen dieser Fahrt</dt><dd>'+q.coins+'</dd></div><div><dt>Tasten geübt</dt><dd>W · Ü · I · Z · L · T · K</dd></div><div><dt>Fortschritt</dt><dd>Gespeichert</dd></div></dl><div class="row-btns"><button class="btn primary" id="btn-ship21-home">Zum Menü</button><button class="btn" id="btn-ship21-again">Schiff noch einmal üben</button><button class="btn" id="btn-ship21-city">Zur Stadt zum Weiterüben</button></div>';
 $('#ov-done').hidden=false;$('#btn-ship21-home').onclick=()=>show('home');$('#btn-ship21-again').onclick=()=>{q.stage='deck';sh21Start(false,true);};$('#btn-ship21-city').onclick=()=>{$('#ov-done').hidden=true;G.ship21=null;S.world.inCity=true;desertGame();sh21SetLayout();};updateControls();save();sh21SetLayout();
}

/* Illustration renderer. All scenery belonging to the vessel is drawn inside
   one transform; the independent ocean/horizon stays outside that transform. */
function sh21Sprite(sheet,i,x,base,w=null,h=null,ctx=fctx){const a=SH21[sheet],b=S21_BOUNDS[sheet][i];if(!a||!b)return;const scale=w==null?h/b.h:h==null?w/b.w:Math.min(w/b.w,h/b.h),ww=b.w*scale,hh=b.h*scale;ctx.drawImage(a,b.x,b.y,b.w,b.h,x-ww/2,base-hh,ww,hh);return {x:x-ww/2,y:base-hh,w:ww,h:hh};}
function sh21Texture(i,x,y,w,h){const im=SH21.material,b=S21_BOUNDS.material[i];fctx.drawImage(im,b.x,b.y,b.w,b.h,x,y,w,h);}
function sh21Timber(x,y,xx,yy,width=2.6){const len=Math.hypot(xx-x,yy-y),im=SH21.material,b=S21_BOUNDS.material[0];fctx.save();fctx.translate(x,y);fctx.rotate(Math.atan2(yy-y,xx-x));fctx.drawImage(im,b.x,b.y+b.h*.25,b.w,b.h*.13,0,-width/2,len,width);fLine([[0,-width/2],[len,-width/2]],'#d5af74',.35);fLine([[0,width/2],[len,width/2]],'#38291d',.55);fctx.restore();}
function sh21Rope(points,width=.8){fLine(points,'#352e24',width+.6);fLine(points,'#c0a67b',width);}
function sh21Wood(a,b,y){const q=G.ship21;let lo=Math.max(a,q.cam-24),hi=Math.min(b,q.cam+W+24);if(hi<=lo)return;
 for(let x=Math.floor(lo/110)*110;x<hi;x+=110){fctx.save();fctx.beginPath();fctx.rect(lo,y,hi-lo,240-y);fctx.clip();sh21Texture(1,x,y+5,110,92);sh21Texture(0,x,y,110,5.6);fctx.restore();}
 fLine([[lo,y],[hi,y]],'#e3bd81',.65);fLine([[lo,y+5.5],[hi,y+5.5]],'#34291c',.8);
}
function sh21Rail(a,b,y){const q=G.ship21,lo=Math.max(a,q.cam-30),hi=Math.min(b,q.cam+W+30);if(hi<=lo)return;sh21Timber(lo,y-22,hi,y-22,2.5);sh21Timber(lo,y-4,hi,y-4,4);for(let x=Math.ceil(lo/42)*42;x<hi;x+=42){sh21Timber(x,y-23,x,y-3,2.7);fctx.fillStyle='#3e3428';fctx.fillRect(x-2,y-20,4,.8);}}
function sh21Terrain(){const q=G.ship21,L=q.level;for(const g of L.ground){let sections=[[g.a,g.b]];for(const gap of L.gaps.filter(z=>z.y===g.y).concat(q.broken['final-deck']?[{a:3540,b:3720,y:150}]:[])){sections=sections.flatMap(([a,b])=>gap.b<=a||gap.a>=b?[[a,b]]:[[a,Math.max(a,gap.a)],[Math.min(b,gap.b),b]].filter(([x,y])=>y>x));}for(const[a,b]of sections)sh21Wood(a,b,g.y);}
 for(const z of L.gaps.concat(q.broken['final-deck']?[{a:3540,b:3720,y:150}]:[])){if(z.b<q.cam||z.a>q.cam+W)continue;fctx.save();fctx.beginPath();fctx.rect(z.a,z.y,z.b-z.a,180-z.y);fctx.clip();const im=SH21.hold;fctx.drawImage(im,0,0,im.width,im.height,z.a-18,z.y-6,z.b-z.a+36,88);const shade=fctx.createLinearGradient(0,z.y,0,z.y+48);shade.addColorStop(0,'#261c1344');shade.addColorStop(1,'#161916ee');fctx.fillStyle=shade;fctx.fillRect(z.a,z.y,z.b-z.a,72);sh21Timber(z.a-1,z.y+38,z.b+1,z.y+38,3);fctx.restore();sh21Sprite('props',6,z.a,z.y+3,15,7);sh21Sprite('props',6,z.b,z.y+2,15,7);}
}
function sh21ClimbArt(c){if(c.kind==='ladder'){fctx.save();fctx.translate(c.x,c.y);fctx.rotate(.36);sh21Sprite('props',8,0,2,null,c.y-c.ty+5);fctx.restore();sh21Timber(c.tx-5,c.ty,c.tx+10,c.ty,3);}
 else if(c.kind==='stairs'){const n=8;for(let i=0;i<n;i++){const x=c.x+(c.tx-c.x)*i/n,y=c.y+(c.ty-c.y)*i/n;sh21Timber(x-2,y,x+14,y,3.2);}sh21Timber(c.x-5,c.y+4,c.tx+6,c.ty+4,4);sh21Timber(c.x-5,c.y-23,c.tx+4,c.ty-23,2);for(const k of [0,.5,1]){const x=c.x+(c.tx-c.x)*k,y=c.y+(c.ty-c.y)*k;sh21Timber(x,y,x,y-23,2);}}
 else{sh21Sprite('props',9,(c.x+c.tx)/2,c.y+1,c.tx-c.x+25,c.y-c.ty+3);sh21Timber(c.x-10,c.ty-1,c.tx+17,c.ty-1,3);sh21Timber(c.tx+18,c.y+3,c.tx+18,c.ty-75,4);sh21Rope([[c.x-10,c.ty],[c.tx+18,c.ty-65]],.65);sh21Rope([[c.tx+17,c.ty],[c.tx+18,c.ty-45]],.6);}}
function sh21Mast(m){const mb=S21_BOUNDS.props[4];fctx.drawImage(SH21.props,mb.x,mb.y,mb.w,mb.h,m.x-m.w/2,-55,m.w,m.y+57);sh21Rope([[m.x-2,-10],[m.x-65,m.y-5]],.65);sh21Rope([[m.x+3,-5],[m.x+55,m.y-3]],.7);
 if(m.x===402){const z=G.ship21.level.ceil.find(z=>z.id==='sail-boom'),y=z.y-z.clear,tilt=reduceMotion?0:Math.sin(G.ship21.t*.8)*.008;fctx.save();fctx.translate(m.x,y);fctx.rotate(tilt);sh21Timber(z.a-m.x,-4,0,-4,6);fEllipse(-1,-3,2.4,4.2,'#4a4b42');fEllipse(-1,-3,1.2,2.3,'#8e9180');fctx.restore();sh21Rope([[z.a,y-2],[m.x,-4]],.6);}
 else{fctx.save();fctx.beginPath();fctx.moveTo(m.x+7,5);fctx.lineTo(m.x+155,29);fctx.lineTo(m.x+80,-34);fctx.closePath();fctx.clip();sh21Texture(3,m.x+7,-36,150,70);fctx.restore();sh21Timber(m.x+3,4,m.x+155,29,3.6);}
}
function sh21Water(z){const q=G.ship21;fctx.fillStyle='#568f9ba6';fctx.fillRect(z.a,z.y-4,z.b-z.a,5);const p=new Path2D();p.moveTo(z.a,z.y-3);for(let x=z.a;x<=z.b;x+=3)p.lineTo(x,z.y-3+Math.sin(x*.22-q.t*2)*.7);fctx.strokeStyle='#b5d6cd';fctx.lineWidth=.55;fctx.stroke(p);for(let x=z.a+3;x<z.b;x+=13){const off=(q.t*6+x)%12;fLine([[x-off,z.y-1],[x+5-off,z.y-1.4]],'#d5e4d18c',.35);}}
function sh21Breaker(z){const q=G.ship21;if(q.cleared[z.id]||Math.abs(q.p.x-z.a)>180)return;const progress=q.brace?.id===z.id?Math.min(1,q.brace.elapsed/2.3):0,base=z.y-15,x=z.mast+95-progress*90,h=20+Math.sin(progress*Math.PI)*33;
 fctx.save();fctx.globalAlpha=progress?Math.sin(progress*Math.PI)*.65+.2:.48;fctx.beginPath();fctx.moveTo(x-65,base+30);fctx.bezierCurveTo(x-24,base+8,x-10,base-h,x+22,base-h-5);fctx.bezierCurveTo(x+38,base-h+2,x+22,base-h+20,x+9,base-h+16);fctx.bezierCurveTo(x+38,base-10,x+49,base+2,x+88,base+30);fctx.closePath();const g=fctx.createLinearGradient(0,base-h,0,base+30);g.addColorStop(0,'#a8d9d0');g.addColorStop(.3,'#2e8ba2');g.addColorStop(1,'#23526d');fctx.fillStyle=g;fctx.fill();fLine([[x-48,base+15],[x-13,base-h+6,x+22,base-h-5],[x+37,base-h+7,x+11,base-h+15]],'#e4eee1',1.7);for(let i=0;i<22;i++){const xx=x+Math.sin(i*7.3)*38,yy=base-h+(i*11)%32-progress*6;fEllipse(xx,yy,.3+(i%3)*.15,.35,'#e8f1e3');}fctx.restore();}
function sh21Roller(r){const q=G.ship21,x=(r.a+r.b)/2+Math.sin(q.t*1.1+r.a)*(r.b-r.a)/2;fctx.save();fctx.translate(x,r.y-9);fctx.rotate(Math.sin(q.t*1.1+r.a)*.18);sh21Sprite('props',2,0,9,25,18);fctx.restore();}
function sh21Marker(key,x,y){const q=G.ship21;if(x<q.cam-5||x>q.cam+W+5)return;fctx.fillStyle='#1c2b24ed';fctx.strokeStyle='#dcc68f';fctx.lineWidth=.45;fctx.beginPath();fctx.roundRect(x-5,y-8,10,10,1.3);fctx.fill();fctx.stroke();fctx.fillStyle='#ffebad';fctx.font='bold 7px Segoe UI,sans-serif';fctx.textAlign='center';fctx.fillText(key.toUpperCase(),x,y-.1);fctx.textAlign='left';}
function sh21DrawFigure(){const q=G.ship21,p=q.p;if(q.hurt>0&&Math.floor(q.t*12)%2)return;const pose=q.brace&&q.brace.elapsed>=.5||q.pullingUntil>q.t?3:p.air?4:q.climb&&q.level.climbs.find(c=>c.id===q.climb.id).kind!=='stairs'?2:p.mode==='crawl'?1:p.mode==='duck'?0:p.mode==='wade'?5:null;const base=p.y+(p.move&&!p.mode&&!q.climb?Math.sin((p.move.t/p.move.dur)*Math.PI)*-.5:0);
 fctx.save();fctx.translate(p.x,base);fctx.scale(p.face<0?-1:1,1);fEllipse(0,1,7,1.2,'#171e1c55');if(pose==null){const moving=!!p.move||q.climb||q.brace&&q.brace.elapsed<.5;const frame=moving?1+Math.floor((p.anim||0)*19)%8:0;rFrame(fctx,R_HUMAN,frame,0,0,null,34,1);}
 else{const height=[22,13,37,33,32,33][pose],bob=q.climb?Math.sin((p.anim||0)*18)*.5:0;sh21Sprite('poses',pose,0,bob,null,height);}fctx.restore();
 if(p.mode==='wade')for(let i=0;i<3;i++)fLine([[p.x-7+i*5,p.y],[p.x-5+i*5,p.y-1.5],[p.x-2+i*5,p.y]],'#b7e1d6',.55);
}
function sh21Scene(){const q=G.ship21,L=q.level;if(L.hold){for(const x of [718,1515])if(x>q.cam-10&&x<q.cam+W+10)for(let i=0;i<3;i++)fLine([[x+i,55],[x-2+i+Math.sin(q.t*3)*.7,95],[x+3+i,149]],'#a8d9de99',.45);}
 if(!L.hold){for(const z of L.waves)sh21Breaker(z);for(const g of L.ground)sh21Rail(g.a,g.b,g.y);}
 sh21Terrain();
 for(const m of L.masts)if(m.x>q.cam-180&&m.x<q.cam+W+100)sh21Mast(m);
 for(const c of L.climbs)if(c.tx>q.cam-40&&c.x<q.cam+W+40)sh21ClimbArt(c);
 for(const c of L.ceil){if(c.b<q.cam-20||c.a>q.cam+W+20||c.id==='sail-boom')continue;const roof=c.y-c.clear;fctx.save();fctx.beginPath();fctx.moveTo(c.a-12,roof-18);fctx.lineTo(c.a+6,roof-26);fctx.lineTo(c.b+10,roof-20);fctx.lineTo(c.b+7,roof);fctx.lineTo(c.a,roof);fctx.closePath();fctx.clip();sh21Texture(2,c.a-12,roof-30,c.b-c.a+25,37);fctx.restore();sh21Timber(c.a-6,roof-7,c.b+7,roof-4,5);sh21Sprite('props',6,c.a,roof+4,17,8);}
 for(const s of L.solids){if(s.x+s.w<q.cam-30||s.x>q.cam+W+30)continue;if(s.kind==='cargo'){const progress=q.pulls[s.id]||0,pa=q.pullAnim,delta=pa?.id===s.id?pa.from+(pa.to-pa.from)*Math.min(1,(q.t-pa.t)/.6):progress*19,base=s.y-delta;sh21Timber(s.x+s.w+13,s.y,s.x+s.w+13,s.y-95,4);sh21Timber(s.x-5,s.y-95,s.x+s.w+13,s.y-95,4);sh21Sprite('props',5,s.x+s.w/2,s.y-62,10,28);sh21Rope([[s.x+s.w/2,s.y-80],[s.x+s.w/2,base-s.h]],.65);sh21Sprite('props',3,s.x+s.w/2,base,s.w,s.h);sh21Rope([[s.x+s.w/2,s.y-68],q.pullingUntil>q.t?[q.p.x+13,q.p.y-23]:[s.x-20,s.y-4]],.75);}
  else if(q.broken[s.id])sh21Sprite('props',6,s.x+s.w/2,s.y+1,s.w+10,7);else sh21Sprite('props',s.kind==='fragile'?1:s.kind==='lying'?2:0,s.x+s.w/2,s.y,s.w,s.h);
 }
 for(const z of L.water)if(z.b>q.cam&&z.a<q.cam+W)sh21Water(z);
 for(const r of L.rollers)if(r.b>q.cam-20&&r.a<q.cam+W+20)sh21Roller(r);
 for(const cp of L.checks){if(cp.x>q.cam-20&&cp.x<q.cam+W+20){sh21Timber(cp.x-8,cp.y,cp.x-8,cp.y-33,1.8);sh21Sprite('props',7,cp.x-8,cp.y-20,5,10);}}
 for(const coin of L.coins)if(!q.collected[coin.id]&&coin.x>q.cam-10&&coin.x<q.cam+W+10)nCoin(coin.x,coin.y,q.t*1000);
 sh21DrawFigure();
 const wave=sh21NearWave(),climb=sh21NearClimb(),water=sh21NearWater(),cargo=sh21NearCargo(),inspect=sh21Inspectable(),ceil=L.ceil.find(c=>q.p.x>c.a-45&&q.p.x<c.b);
 if(!q.climb&&!q.brace&&!q.p.air){if(wave)sh21Marker('ü',wave.mast,wave.y-48);else if(climb)sh21Marker(climb.key,(climb.x+climb.tx)/2,Math.min(climb.y,climb.ty)-10);else if(cargo)sh21Marker(inspect?'i':'z',cargo.x-10,cargo.top-4);else if(water)sh21Marker(inspect?'i':'w',Math.max(water.a,q.p.x+15),water.y-15);else if(inspect){const s=L.solids.find(s=>s.kind==='fragile'&&!sh21Removed(s)&&s.x>q.p.x-5);sh21Marker('i',s?s.x+s.w/2:q.p.x+35,s?s.top-8:q.p.y-38);}else if(ceil)sh21Marker(ceil.clear<20?'k':'d',(ceil.a+ceil.b)/2,ceil.y-ceil.clear-7);}
 for(const pt of q.parts){if(pt.debris){sh21Sprite('props',6,pt.x,pt.y+pt.t*12,20,8);}else{fctx.fillStyle='#ffdf8b';fctx.font='bold 5px system-ui,sans-serif';fctx.fillText(pt.label,pt.x-3,pt.y-pt.t*15);}}
 if(q.stage==='fall')for(let i=0;i<7;i++){fctx.save();fctx.translate(3545+i*13,153+q.cinema*q.cinema*28+i*2);fctx.rotate(q.cinema*(i%2?.5:-.6));sh21Sprite('props',6,0,0,17,7);fctx.restore();}
}
function sh21SinkArt(){const q=G.ship21,progress=Math.min(1,q.cinema/8);fctx.fillStyle='#217e9d';fctx.fillRect(0,0,W,H);const cx=160,cy=95,phase=q.t*.4;
 for(let i=12;i>=0;i--){const r=12+i*13*(1-progress*.28);fctx.save();fctx.translate(cx,cy);fctx.rotate(phase+i*.27);fctx.scale(1,.43+.22*progress);fctx.beginPath();fctx.arc(0,0,r,.15,Math.PI*1.7);fctx.strokeStyle=['#74c7cc','#397fa8','#b8dfce','#285c85','#64b7c4'][i%5];fctx.lineWidth=3+i*.35;fctx.stroke();fctx.restore();}
 for(let i=0;i<90;i++){const angle=i*2.399+phase,r=(i*17)%170,rr=r*(1-progress*.5),x=cx+Math.cos(angle)*rr,y=cy+Math.sin(angle)*rr*.6;fEllipse(x,y,.4+(i%3)*.15,.35,'#d5ebdc9c');}
 if(progress>.72){fctx.fillStyle='rgba(21,49,78,'+((progress-.72)/.28*.7)+')';fctx.fillRect(0,0,W,H);}
}
function sh21Render(withHud=true){if(!sh21Active()||!SH21.sea)return;const q=G.ship21,hold=q.level.hold,im=SH21.sea,storm=q.stage==='departure'?0:Math.max(0,Math.min(1,(q.p.x-470)/920));fctx.clearRect(0,0,W,H);
 if(q.stage==='sink'){if(q.cinema<2.2){const bg=SH21.hold;fctx.drawImage(bg,0,0,W,H);fctx.save();fctx.translate(160,130);fctx.rotate(S.settings.shipMotion!==false&&!reduceMotion?q.cinema*.018:0);fctx.translate(-160-q.cam,-130);sh21Scene();fctx.restore();fctx.save();fctx.beginPath();const edge=H*(1-q.cinema/2.2);fctx.moveTo(0,edge);for(let x=0;x<=W;x+=4)fctx.lineTo(x,edge+Math.sin(x*.08+q.t*2)*3);fctx.lineTo(W,H);fctx.lineTo(0,H);fctx.closePath();fctx.clip();sh21SinkArt();fctx.restore();}else sh21SinkArt();}
 else{if(hold){const bg=SH21.hold,span=560,off=Math.min(span-W,q.cam/(q.level.end-W)*(span-W));fctx.drawImage(bg,0,0,bg.width,bg.height,-off,0,span,H);}
  else{const a=S21_BOUNDS.sea[0],b=S21_BOUNDS.sea[1],departure=q.stage==='departure'?Math.min(1,q.cinema/4):1,z=1-departure*.08,off=Math.min(50,q.cam*.025)+departure*12;fctx.drawImage(im,a.x,a.y,a.w,a.h,-off,90*(1-z),430*z,H*z);if(storm){fctx.save();fctx.globalAlpha=storm;fctx.drawImage(im,b.x,b.y,b.w,b.h,0,0,W,H);fctx.restore();}for(let i=0;i<10;i++){const yy=100+i*7,xx=(q.t*(2+i*.8)+i*53)%360-20;fLine([[xx,yy],[xx+7+i,yy-.5],[xx+15+i,yy]],storm?'#b8ded66e':'#d3ecdf8c',.4);}}
  const motion=S.settings.shipMotion!==false&&!reduceMotion,roll=motion?Math.sin(q.t*.75)*(.003+storm*.018)+(q.brace?Math.sin(q.brace.elapsed*2.5)*.016:0):0,heave=motion?Math.sin(q.t*1.1)*(hold?.6:.6+storm*1.1):0;
  fctx.save();fctx.translate(160,139+heave);fctx.rotate(roll);fctx.translate(-160,-139);fctx.translate(-q.cam,0);sh21Scene();fctx.restore();
  if(!hold&&storm>.1){fctx.strokeStyle='#c6dce54a';fctx.lineWidth=.25;for(let i=0;i<Math.floor(35*storm);i++){const x=(i*53+q.t*34)%340-10,y=(i*31+q.t*95)%170;fLine([[x,y],[x-3,y+7]],'#bed0d64f',.25);}}
  if(q.stage==='fall'&&q.cinema>1.3){fctx.fillStyle='rgba(29,24,19,'+Math.min(.9,(q.cinema-1.3)/1.2)+')';fctx.fillRect(0,0,W,H);}
 }
 if(withHud){fctx.fillStyle='#14251fe0';fctx.beginPath();fctx.roundRect(6,6,190,15,2);fctx.fill();fctx.fillStyle='#f0ead2';fctx.font='bold 5px system-ui,sans-serif';const title=q.stage==='departure'?'Die Abfahrt':q.stage==='fall'?'Das Deck bricht':q.stage==='sink'?'Unter den Wellen':hold?'Im Schiffsrumpf':storm>.75?'Sturm auf dem Deck':'An Deck';fctx.fillText(title,10,12);fctx.font='4px system-ui,sans-serif';fctx.fillText('L Leiter · T Treppe · K Netz/kriechen · W Waten · Ü Überleben',10,18);
 fctx.fillStyle='#182a24de';fctx.fillRect(240,6,74,15);fctx.fillStyle='#f0dfad';fctx.font='bold 4.5px system-ui,sans-serif';fctx.fillText('Münzen +'+q.coins,245,12);if(S.inv.includes('kamera'))fctx.fillText('Fotos '+p18State().loaded+'/8 · F5',245,18);
 const progress=q.stage==='sink'?1:(hold?3670+q.p.x:q.p.x)/5320;fctx.fillStyle='#cfbe8d';fctx.fillRect(7,23,306*Math.max(0,Math.min(1,progress)),.8);
 if(q.checkFlash!=null&&q.t-q.checkFlash<2.8){fctx.fillStyle='#22372de8';fctx.fillRect(108,27,104,10);fctx.fillStyle='#f2d89d';fctx.font='4.7px system-ui,sans-serif';fctx.fillText('Merkpunkt gespeichert',119,34);}
 }vx.drawImage(F_CANVAS,0,0,1280,720,0,0,W,H);
}
const sh21RenderScene=renderScene;renderScene=function(){if(sh21Active()){sh21Render();return;}return sh21RenderScene(...arguments);};
const sh21Draw=draw;draw=function(now){if(!sh21Active())return sh21Draw(now);const q=G.ship21,dt=Math.max(0,Math.min(.05,(now-q.last)/1000));q.last=now;if(!paused&&$('#ov-goal').hidden&&$('#ov-done').hidden)sh21Tick(dt);if(!sh21Active())return;sh21Render();if(p18Camera)p18DrawCamera();};
const sh21PhotoAllowed=p18PhotoAllowed;p18PhotoAllowed=function(){if(sh21Active())return S.inv.includes('kamera')&&canPhoto()&&['deck','hold'].includes(G.ship21.stage)&&!G.ship21.brace&&!G.ship21.p.air&&!G.ship21.p.move;return sh21PhotoAllowed();};
const sh21AddPhoto=p18AddPhoto;p18AddPhoto=function(src,title,kind){return sh21AddPhoto(src,sh21Active()?(G.ship21.level.hold?'Im Schiffsrumpf':'Auf dem Schiff'):title,kind);};
const sh21Snap=showSnap;showSnap=function(src,title){return sh21Snap(src,sh21Active()?(G.ship21.level.hold?'Im Schiffsrumpf':'Auf dem Schiff'):title);};
const sh21HomeShow=show;show=function(name){const r=sh21HomeShow(...arguments);if(name==='home'&&S.ship21?.active){$('#home-where').textContent='Kapitel 2 · Auf See';$('#home-lead').textContent='Deine Reise auf dem Schiff ist gespeichert. Setze deinen Weg über das Deck und durch den Rumpf fort.';}return r;};
const sh21Ready=Promise.all([p20Ready,...Object.entries(S21_IMAGE_DATA).map(async([key,src])=>{const im=new Image();im.src=src;await im.decode();SH21[key]=im;})]).then(()=>{window.forestArt.version='4.7 Waldatelier 21 – Sturmfahrt';});

const sh21OpenCamera=p18OpenCamera;p18OpenCamera=function(){const result=sh21OpenCamera(...arguments);if(sh21Active()&&p18Camera){sh21Render(false);const c=p18Camera.image;c.getContext('2d').clearRect(0,0,c.width,c.height);c.getContext('2d').drawImage(F_CANVAS,0,0);sh21Render();}return result;};
