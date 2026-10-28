/* A longitudinal, keyboard-driven sailing-ship passage. World positions and
   collision geometry are independent of the optional visual ship roll. */
const SH21={},SH21_W=320,SH21_H=180;
function sh21Level(stage='deck'){
 if(stage===true)stage='hold';if(stage===false||stage==='departure'||stage==='fall')stage='deck';if(stage==='sink')stage='hold';
 const L={stage,hold:stage!=='deck',dir:['inside','hold'].includes(stage)?-1:1,end:2200,ground:[],solids:[],ceil:[],water:[],waves:[],climbs:[],rollers:[],gaps:[],checks:[],coins:[],masts:[],hangs:[],exit:null};
 const g=(a,b,y)=>L.ground.push({a,b,y}),box=(id,x,y,w,h,kind='barrel')=>L.solids.push({id,x,w,y,top:y-h,h,kind}),ce=(id,a,b,y,clear)=>L.ceil.push({id,a,b,y,clear,kind:clear<20?'crawl':'duck'}),coins=(prefix,points)=>points.forEach(([x,y],i)=>L.coins.push({id:prefix+i,x,y}));
 if(stage==='deck'){
  g(-100,710,150);g(700,1100,108);for(let i=0;i<4;i++)g(1100+i*28,1128+i*28,120+i*10);g(1210,1625,150);g(1700,1770,126);g(1770,1800,138);g(1800,2250,150);
  box('fragile-first',175,150,23,18,'fragile');ce('sail-boom',305,405,150,24);box('lying-pair',480,150,33,13,'lying');
  L.climbs=[{id:'ladder',key:'l',kind:'ladder',x:680,y:150,tx:710,ty:108},{id:'stairs',key:'t',kind:'stairs',x:1620,y:150,tx:1700,ty:126}];
  L.masts=[{x:402,y:150,w:17},{x:900,y:108,w:23},{x:1860,y:150,w:20}];
  L.waves=[{id:'first-breaker',a:860,b:940,y:108,mast:900},{id:'great-breaker',a:1830,b:1915,y:150,mast:1860}];
  L.gaps=[{id:'upper-gap',a:985,b:1020,y:108},{id:'last-split',a:2045,b:2070,y:150}];L.water=[{id:'first-wade',a:1315,b:1440,y:150}];
  L.rollers=[{id:'loose-barrel',a:1505,b:1540,y:150}];L.breakAt=2080;
  L.checks=[{x:35,y:150},{x:550,y:150},{x:745,y:108},{x:1055,y:108},{x:1240,y:150},{x:1465,y:150},{x:1945,y:150}];
  coins('deck-coin-',[[235,133],[263,133],[482,112],[504,112],[770,89],[800,89],[990,73],[1050,88],[1260,131],[1290,131],[1490,116],[1530,113],[1745,108],[1975,130],[2005,130]]);
 }else if(stage==='inside'){
  // The landing and captain's cabin belong to the same physical cross section.
  // Left: stairs down, then a net up the collapsed ceiling and a sloping handline.
  L.end=2460;g(1110,1710,150);g(1860,1905,108);g(1935,2010,150);g(2070,2150,108);g(2180,2460,90);
  L.climbs=[{id:'landing-stairs',key:'t',kind:'stairs',x:2005,y:150,tx:2075,ty:108},{id:'cabin-stairs',key:'t',kind:'stairs',x:2140,y:108,tx:2185,ty:90},{id:'net',key:'k',kind:'net',x:1960,y:150,tx:1895,ty:108}];
  L.hangs=[{id:'wreck-crossing',a:1710,b:1860,y:150,beam:70,beamEnd:110,startY:108,endY:150}];L.water=[{id:'inside-wade',a:1410,b:1590,y:150,depth:19}];
  ce('fallen-spar',1270,1360,150,14);box('blocked-passage',1105,150,40,65,'barrier');
  L.exit={x:1190,y:150,key:'l',next:'guns',toX:1190,toY:150};
  L.checks=[{x:2100,y:108},{x:1980,y:150},{x:1690,y:150},{x:1380,y:150},{x:1200,y:150}];
  coins('inside-coin-',[[2050,103],[2010,131],[1880,88],[1800,96],[1750,110],[1610,131],[1558,118],[1390,131],[1230,132]]);
 }else if(stage==='guns'){
  g(1110,1760,150);box('gun-deck-barrel',1325,150,29,13,'lying');ce('fallen-ceiling',1430,1510,150,24);
  L.exit={x:1660,y:150,key:'l',next:'hold',toX:1660,toY:150};L.checks=[{x:1190,y:150},{x:1370,y:150},{x:1565,y:150}];
  coins('guns-coin-',[[1225,132],[1260,132],[1345,113],[1540,131],[1595,131]]);
 }else{
  g(1180,1760,150);box('cargo-hold',1520,150,40,44,'cargo');ce('last-crawl',1430,1485,150,14);L.water=[{id:'hold-flood',a:1245,b:1390,y:150,depth:23}];
  L.checks=[{x:1660,y:150},{x:1500,y:150},{x:1410,y:150}];L.sinkAt=1235;
  coins('hold-coin-',[[1620,132],[1590,132],[1505,132],[1407,132]]);
 }
 return L;
}
function sh22Migrate(){const s=S.ship21;if(!s||s.geometry22)return;s.geometry22=true;if(!s.active)return;
 if(['hold'].includes(s.stage)){s.stage='inside';s.p={x:2100,y:150,face:-1,mode:null};s.checkpoint={stage:'inside',x:2100,y:150};}
 else if(['deck','fall'].includes(s.stage)){const progress=Math.min(1,(s.p?.x||35)/3670),checks=sh21Level('deck').checks,cp=[...checks].reverse().find(c=>c.x<=progress*2200)||checks[0];s.stage='deck';s.p={x:cp.x,y:cp.y,face:1,mode:null};s.checkpoint={stage:'deck',...cp};}s.climb=null;s.hang=null;
}

function sh24Migrate(){const s=S.ship21;if(!s)return;if(s.geometry24){if(s.active&&s.stage==='fall'){s.stage='inside';s.p={x:2100,y:108,face:-1,mode:null};s.checkpoint={stage:'inside',x:2100,y:108};s.climb=s.hang=null;}return;}s.geometry24=true;if(!s.active)return;
 if(s.stage==='inside'){s.p={x:2100,y:108,face:-1,mode:null};s.checkpoint={stage:'inside',x:2100,y:108};s.climb=s.hang=null;}
 else if(s.stage==='fall'||s.stage==='deck'&&s.p.x>2010){s.stage='deck';s.p={x:1945,y:150,face:1,mode:null};s.checkpoint={stage:'deck',x:1945,y:150};s.climb=s.hang=null;}
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
function sh21NearClimb(){const q=G.ship21,p=q.p;return q.level.climbs.find(c=>p.face===Math.sign(c.tx-c.x)&&Math.hypot(p.x-c.x,p.y-c.y)<27||p.face===-Math.sign(c.tx-c.x)&&Math.hypot(p.x-c.tx,p.y-c.ty)<27);}
function sh21NearWater(){const p=G.ship21.p,dir=p.face||G.ship21.level.dir;return G.ship21.level.water.find(z=>(p.mode==='wade'?p.x>z.a-14&&p.x<z.b+14:dir>0?p.x>z.a-25&&p.x<z.b+1:p.x>z.a-1&&p.x<z.b+25)&&Math.abs(p.y-z.y)<4);}

function sh21NearWave(){const p=G.ship21.p;return G.ship21.level.waves.find(z=>!G.ship21.cleared[z.id]&&p.x>z.a-65&&p.x<z.b&&Math.abs(p.y-z.y)<5);}
function sh21NearCargo(){const p=G.ship21.p;return G.ship21.level.solids.find(s=>s.kind==='cargo'&&!sh21Removed(s)&&p.x>s.x-35&&p.x<s.x+s.w+35&&Math.abs(p.y-s.y)<5);}
function sh21Inspectable(){const q=G.ship21,p=q.p,cargo=sh21NearCargo();if(cargo&&!q.known.cargo)return ['cargo','Lose Ladung','Ein Tau führt über einen befestigten Flaschenzug. Z: daran ziehen und die Ladung anheben.'];
 if(q.level.solids.some(s=>s.kind==='fragile'&&!sh21Removed(s)&&s.x-p.x>-5&&s.x-p.x<58)&&!q.known.fragile)return ['fragile','Ein morsches Fass','Die Dauben sind gesprungen. Spring mit S darauf: Das Fass kann zerbrechen.'];
 if(sh21NearWater()&&!q.known.water)return ['water',q.level.hold?'Gefluteter Schiffsgang':'Übergespültes Deck','Hier steht Wasser zwischen den Planken. W: vorsichtig hindurchwaten.'];
 if(q.level.gaps.some(z=>z.a-p.x>-15&&z.a-p.x<65)||q.stage==='deck'&&p.x>q.level.breakAt-65){if(!q.known.planks)return ['planks','Beschädigte Planken','Vor dir fehlen Bretter. S: über die Lücke springen. Dahinter wirkt das Holz bereits morsch.'];}return null;
}
function sh21SetCaption(title,text){const sig=title+'|'+text;if(G.ship21?.caption===sig)return;if(G.ship21)G.ship21.caption=sig;setCaption([title,text].filter(Boolean),true);}
function sh21Hint(force=false){if(!sh21Active())return;const q=G.ship21,p=q.p;if(q.stage==='departure'){sh21SetCaption('Du gehst an Bord. Die Leinen fallen ins Wasser.','Das Schiff verlässt den Hafen. Leertaste: die Abfahrt ansehen oder weiter.');return;}
 if(q.stage==='fall'){sh21SetCaption('Beim Landen brechen die morschen Planken unter dir!','Du stürzt auf den Treppenabsatz vor der Kapitänskajüte.');return;}
 if(q.stage==='sink'){sh21SetCaption('Wasser drückt durch die Bordwand. Das Schiff sinkt.','Blaue Wellen schließen sich über dir. Leertaste: Sequenz weiter.');return;}
 if(q.brace){sh21SetCaption('Du klammerst dich am Mast fest. Die Welle bricht über das Deck.','Du hältst durch, bis der Brecher vorüber ist.');return;}
 if(q.hang){sh21SetCaption('Du hangelst über den weggebrochenen Boden.','H: nächster Griff · Rücktaste: zum Merkpunkt');return;}
 if(q.climb){const c=q.level.climbs.find(c=>c.id===q.climb.id);sh21SetCaption(c.kind==='ladder'?'Du kletterst die Leiter.':c.kind==='stairs'?'Du steigst die Treppe.':'Du kletterst im befestigten Wantennetz.',c.key.toUpperCase()+': nächster Schritt · Rücktaste: zum Merkpunkt');return;}
 if(q.stage==='inside'&&p.x>2185){sh21SetCaption('In der Kapitänskajüte · Seekarten, Bücher und ein fest verschraubter Schreibtisch.','F: zurück zum Absatz · T: Treppen steigen.');return;}
 if(!force&&q.messageUntil>q.t)return;
 const exit=sh22NearExit(),hang=sh22NearHang();if(exit){sh21SetCaption('Eine offene Luke mit fest eingebauter Leiter führt eine Ebene tiefer.','L: hinuntersteigen.');return;}if(hang){sh21SetCaption('Vom eingestürzten Deck führt ein befestigter Balken schräg nach unten.','H: greifen und hinunterhangeln.');return;}
 const inspect=sh21Inspectable(),wave=sh21NearWave(),water=sh21NearWater(),cargo=sh21NearCargo(),climb=sh21NearClimb(),ceil=q.level.ceil.find(c=>p.x>c.a-48&&p.x<c.b);
 if(inspect){sh21SetCaption('Du entdeckst etwas: '+inspect[1]+'.','I: identifizieren. '+(cargo?'Z: Tau ziehen.':water?'W: waten.':'J: weiter · S: springen.'));return;}
 if(wave){sh21SetCaption('Eine große Welle kommt. Am Mast ist ein Tau befestigt.','Ü: am Mast festhalten und den Brecher überleben.');return;}
 if(water){sh21SetCaption(q.level.hold?'Wasser steigt im Rumpf.':'Eine Welle hat das Deck überspült.','W: Schritt für Schritt waten. '+((q.waterDir||p.face)<0?'J':'F')+': zurück.');return;}
 if(cargo){sh21SetCaption('Verrutschte Ladung versperrt den Weg.','Z: am Tau ziehen · '+(q.pulls[cargo.id]||0)+'/3 Zugschritte');return;}
 if(climb&&q.stage==='inside'&&climb.kind==='stairs'){sh21SetCaption(climb.id==='cabin-stairs'?'Die rechte Treppe führt in die Kapitänskajüte.':'Die linke Treppe führt vom Absatz zum eingestürzten Zwischendeck.','T: Treppe steigen · F/J: Richtung wählen.');return;}
 if(climb){sh21SetCaption(climb.kind==='ladder'?'Eine Leiter führt aufs nächste Deck.':climb.kind==='stairs'?'Eine Treppe führt längs aufs höhere Deck.':'Ein Wantennetz ist an den Spieren festgezurrt.',climb.key.toUpperCase()+': '+(climb.kind==='net'?'Netz klettern':climb.kind==='stairs'?'Treppe steigen':'Leiter klettern'));return;}
 if(ceil){sh21SetCaption(ceil.clear<20?'Eingestürzte Balken lassen nur einen schmalen Durchgang frei.':q.level.hold?'Ein gebrochener Balken liegt tief über dem Boden.':'Der gelöste Segelbaum schwingt tief über das Deck.',ceil.clear<20?'K: kriechen · F/J: weiter · K: später aufstehen.':'D: ducken · F/J: weiter · D: später aufstehen.');return;}
 if(q.level.rollers.some(r=>p.x>r.a-60&&p.x<r.b+16)){sh21SetCaption('Ein Fass hat sich losgerissen und rollt über die Planken.','S: darüber springen.');return;}
 if(q.stage==='deck'&&p.x>q.level.breakAt-65){sh21SetCaption('Das hintere Deck ist großflächig beschädigt. Die Planken knacken.','S: versuch, den festen Abschnitt zu erreichen.');return;}
 sh21SetCaption(q.level.hold?sh22RoomTitle(q.stage):p.x<560?'Der Hafen entfernt sich. Noch ist das Meer ruhig.':'Wind zerrt an den Segeln. Du gehst längs über das schwankende Schiff.',p.mode==='crawl'?'F/J: kriechen · K: aufstehen.':p.mode==='duck'?'F/J: geduckt gehen · D: aufstehen.':q.level.dir<0?'F: nach links weiter · J: zurück · F3: Bildschirmtastatur':'J: nach rechts weiter · F: zurück · S: springen');
}
function sh21Actions(){const q=G.ship21,p=q.p;if(['departure','sink'].includes(q.stage))return [[' ','weiter']];if(q.stage==='fall'||q.brace||q.transfer)return [];if(q.hang)return [['h','weiterhangeln'],['Backspace','zum Merkpunkt']];
 if(q.climb){const c=q.level.climbs.find(c=>c.id===q.climb.id);return [[c.key,c.kind==='net'?'weiter im Netz':c.kind==='stairs'?'weiter auf der Treppe':'weiter auf der Leiter'],['Backspace','zum Merkpunkt']];}
 const actions=p.mode==='wade'?[['w','weiterwaten'],[(q.waterDir||p.face)<0?'j':'f','zurückwaten']]:[['f',p.mode?'zurück':'nach links'],['j',p.mode?'geduckt weiter':'nach rechts'],['s','springen']];
 const c=sh21NearClimb(),w=sh21NearWater(),wave=sh21NearWave(),cargo=sh21NearCargo();
 if(p.mode!=='wade'){actions.push(['d',p.mode==='duck'?'aufstehen':'ducken']);if(!c||c.key!=='k')actions.push(['k',p.mode==='crawl'?'aufstehen':'kriechen']);}
 const exit=sh22NearExit(),hang=sh22NearHang();if(exit)actions.push(['l','eine Ebene hinunter']);if(hang)actions.push(['h','hangeln']);
 if(c)actions.push([c.key,c.kind==='net'?'Netz klettern':c.kind==='stairs'?'Treppe steigen':'Leiter klettern']);
 if(w&&!actions.some(a=>a[0]==='w'))actions.push(['w','waten']);if(wave)actions.push(['ü','am Mast überleben']);if(cargo)actions.push(['z','Tau ziehen']);if(sh21Inspectable())actions.push(['i','identifizieren']);actions.push(['Backspace','zum Merkpunkt']);return actions;
}
function sh21Message(title,text,seconds=2.2){const q=G.ship21;q.caption='';sh21SetCaption(title,text);q.messageUntil=q.t+seconds;}
function sh21Capture(){if(!sh21Active()||G.ship21.transfer)return;const q=G.ship21,p=q.p,s=sh21State();if(!p.air&&!p.move){q.stable={x:p.x,y:p.y,mode:p.mode,face:p.face};}Object.assign(s,{active:true,stage:q.stage,p:{...q.stable},checkpoint:{...q.checkpoint},collected:{...q.collected},broken:{...q.broken},cleared:{...q.cleared},known:{...q.known},pulls:{...q.pulls},coins:q.coins,paid:{...q.paid},hang:q.hang?{...q.hang,n:Math.max(0,q.hang.n-(p.move?1:0))}:null,climb:q.climb?{...q.climb,n:Math.max(0,q.climb.n-(p.move?1:0))}:null});}
const sh21SyncWorld=syncWorld;syncWorld=function(){sh21SyncWorld();sh21Capture();};
function sh21Start(resume=false,practice=false){
 if(!G)return;const old=S.ship21,paid=practice?old?.paid||{}:{};
 if(!resume||!old?.active)S.ship21={geometry24:true,geometry22:true,active:true,stage:'departure',p:{x:35,y:150,mode:null,face:1},checkpoint:{stage:'deck',x:35,y:150},collected:{},broken:{},cleared:{},known:practice?old?.known||{}:{},pulls:{},coins:0,paid};
 sh22Migrate();sh24Migrate();const s=S.ship21;G.ship21={...s,stage:s.stage,level:sh21Level(s.stage),p:{...s.p,air:false,move:null,anim:0},stable:{...s.p},t:0,cinema:0,last:performance.now(),cam:Math.max(0,s.p.x-80),parts:[],checkIndex:0};
 G.city=null;G.ex=null;G.cave=true;G.phase='ship';G.storm=G.detour=G.sky=null;G.enc=null;G.guide=null;G.puz=null;G.menu=null;trans=pending=qEffect=null;vSky=null;paused=false;p18TutorialQueue=[];
 for(const id of ['#ov-done','#ov-page','#ov-goal','#ov-pause','#tmenu','#abox','#lock','#moss','#snap'])$(id).hidden=true;
 document.body.classList.add('ship21-active');$('#hud-where').textContent='Kapitel 2 · Auf See';$('#clock').hidden=true;sh21SetLayout();renderInv();sh21Hint(true);updateControls();save();sh21Render();
}
boardShip=function(){if(!S.inv.includes('ticket')){notice('Am Steg brauchst du dein Schiffsticket.');return;}S.inv=S.inv.filter(k=>k!=='ticket');S.world.boarded=(S.world.boarded||0)+1;const dep=nextDep(dTime());if(dep)S.world.time=dep;SND.done();sh21Start();};
const sh21NewGame=newGame;newGame=function(){const resume=!!S.ship21?.active,demo=location.hash==='#schiff';sh21NewGame();if(resume)sh21Start(true);else if(demo){if(!inDesert())enterDesert(true);testKit();S.world.time=480;S.world.storms=[];S.settings.goal=120;S.needs={w:DROP_MS*30,f:BERRY_MS*30};sh21Start(false,!!S.ship21?.done);}};
function sh21SetLayout(){const active=sh21Active();document.body.classList.toggle('ship21-active',active);$('#screen-game .hud > div > strong').textContent=active?'Sturmfahrt':'Erwachen';$('#btn-ship21-motion').hidden=!active;$('#btn-ship21-motion').textContent=S.settings.shipMotion===false||reduceMotion?'Schaukeln aus · F7':'Schaukeln an · F7';}
const sh21MotionButton=document.createElement('button');sh21MotionButton.id='btn-ship21-motion';sh21MotionButton.className='btn small';sh21MotionButton.hidden=true;d17Toolbar.append(sh21MotionButton);sh21MotionButton.onclick=()=>{S.settings.shipMotion=!(S.settings.shipMotion!==false);save();sh21SetLayout();};
window.addEventListener('keydown',e=>{if(typeof a25Dialog!=='undefined'&&a25Dialog.open)return;if(e.key==='F7'&&sh21Active()){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)sh21MotionButton.click();}},true);
const sh21Layout=d17Layout;d17Layout=function(){const r=sh21Layout();sh21SetLayout();return r;};
const sh21Show=show;show=function(){const r=sh21Show(...arguments);sh21SetLayout();return r;};
const sh21Expected=expected;expected=function(){if(sh21Active()){if(p18ModalActive())return sh21Expected();if(paused||!$('#ov-goal').hidden||!$('#ov-done').hidden)return [];return [...new Set(sh21Actions().map(a=>a[0]))];}return sh21Expected();};
const sh21ActionsNow=actionsNow;actionsNow=function(){return sh21Active()&&!p18ModalActive()?sh21Actions():sh21ActionsNow();};
const sh21OnHit=onHit;onHit=function(ch){if(sh21Active()&&!p18ModalActive()){p18RecordKey(ch);$('#hint').textContent='';sh21Key(ch);return;}return sh21OnHit(ch);};

function sh21Award(id,x,y){const q=G.ship21;if(q.collected[id])return;q.collected[id]=true;if(!q.paid[id]){q.paid[id]=true;S.coins=(S.coins||0)+1;q.coins++;q.parts.push({x,y,t:0,label:'+1'});SND.pick();renderInv('muenzen');}save();}
function sh21Reset(message='Du gehst zum letzten Merkpunkt zurück.'){const q=G.ship21,c=q.checkpoint;q.stage=c.stage;q.level=sh21Level(c.stage);q.p={x:c.x,y:c.y,face:q.level.dir,mode:null,air:false,move:null,anim:0};q.stable={x:c.x,y:c.y,face:q.level.dir,mode:null};q.climb=q.brace=q.hang=q.transfer=q.queue=null;q.hurt=.65;q.cam=Math.max(0,c.x-80);sh21Message(message,'Am Merkpunkt kannst du es in Ruhe noch einmal versuchen.',3);SND.soft();updateControls();save();}
function sh21Move(x,y,pose='walk',dur=.22){const q=G.ship21,p=q.p;p.move={x0:p.x,y0:p.y,x1:x,y1:y,t:0,dur,pose};p.anim=(p.anim||0)+.08;}
function sh21TryWalk(dir){const q=G.ship21,p=q.p,L=q.level;p.face=dir;const water=sh21NearWater();let nx=Math.max(10,Math.min(L.end-12,p.x+dir*(p.mode==='crawl'?14:p.mode==='duck'?16:22))),ny=p.y,reason='';
 if(p.mode==='wade'){if(dir===(q.waterDir||L.dir)){sh21Message('Hier watest du durch das Wasser.','W: nächster Watschritt. F: zurück.');return;}nx=p.x+dir*12;}
 for(let x=p.x+dir;dir>0?x<=nx:x>=nx;x+=dir){
  if(sh21Ceil(x)<sh21Height()){nx=x-dir*2;reason=sh21Ceil(x)<20?'Der Durchgang ist zu niedrig. K: kriechen.':'Der Segelbaum hängt zu tief. D: ducken.';break;}
  const wet=L.water.find(z=>x>z.a-4&&x<z.b&&Math.abs(p.y-z.y)<4);if(wet&&p.mode!=='wade'){nx=x-dir*2;reason='Wasser auf den Planken. W: hindurchwaten.';break;}
  const wave=L.waves.find(z=>!q.cleared[z.id]&&x>=z.a-12&&x<=z.b&&Math.abs(p.y-z.y)<4);if(wave){nx=x-dir*2;reason='Ein Brecher kommt. Ü: am Mast festhalten.';break;}
  const climb=L.climbs.find(c=>dir===Math.sign(c.tx-c.x)&&Math.abs(p.y-c.y)<3&&(x-c.x)*dir>5&&(x-c.tx)*dir<4||dir===-Math.sign(c.tx-c.x)&&Math.abs(p.y-c.ty)<3&&(x-c.tx)*dir>5&&(x-c.x)*dir<4);if(climb){nx=x-dir*2;reason=(climb.kind==='net'?'Das Netz':climb.kind==='stairs'?'Die Treppe':'Die Leiter')+' führt hinauf. '+climb.key.toUpperCase()+': aufsteigen.';break;}
  const gap=L.gaps.find(z=>Math.abs(p.y-z.y)<2&&(dir>0?x>=z.a-5&&x<z.b:x<=z.b+5&&x>z.a));if(gap){nx=x-dir*2;reason='Hier fehlen Planken. S: über die Lücke springen.';break;}
  const hg=L.hangs.find(z=>x>=z.a-3&&x<=z.b+3);if(hg&&p.y>125){nx=x-dir*2;reason='Der Boden ist weggebrochen. H: am befestigten Balken hangeln.';break;}
  const s=L.solids.find(s=>!sh21Removed(s)&&x+5>s.x&&x-5<s.x+s.w&&p.y>s.top+2&&p.y-sh21Height()<s.y);if(s){nx=x-dir*2;reason=s.kind==='cargo'?'Die Ladung versperrt den Weg. Z: Tau ziehen.':'Ein Fass liegt im Weg. S: darüber springen.';break;}
  if(q.stage==='deck'&&x>L.breakAt&&dir>0){nx=x-2;reason='Die Planken sind rissig. S: versuch hinüberzuspringen.';break;}
 }
 if(Math.abs(nx-p.x)>1){const floor=sh21Floor(nx,p.y-1);if(floor<999&&floor-p.y>=0&&floor-p.y<=22)ny=floor;sh21Move(nx,ny,p.mode||'walk',Math.max(.12,Math.abs(nx-p.x)/(p.mode?75:120)));SND.foot();}
 if(reason)sh21Message(reason,'F3: Bildschirmtastatur · Rücktaste: zum Merkpunkt',2.4);
 if(p.mode==='wade'&&(!water||nx<water.a-14||nx>water.b+14))p.mode=null;
}
function sh21Jump(){const q=G.ship21,p=q.p;if(sh22NearHang()){sh21Message('Der Durchgang ist zu breit und voller Trümmer.','H: den befestigten Balken greifen und hangeln.');return;}if(sh21Ceil(p.x)<34||q.level.ceil.some(c=>(p.face>0?c.a-p.x:p.x-c.b)>0&&(p.face>0?c.a-p.x:p.x-c.b)<65&&p.y===c.y)){sh21Message('Hier schwingt ein Balken über dem Weg.','D: ducken, oder K: unter dem niedrigen Durchgang kriechen.');return;}
 p.mode=null;p.air=true;p.vy=-175;p.vx=p.face*155;p.fromY=p.y;p.anim=0;
 const target=q.level.solids.find(s=>s.kind==='fragile'&&!sh21Removed(s)&&s.x-p.x>0&&s.x-p.x<65&&Math.abs(s.y-p.y)<2);
 if(target){const dy=p.y-target.top,time=(175+Math.sqrt(175*175-2*500*dy))/500;p.vx=(target.x+target.w/2-p.x)/time;}
 SND.step();
}
function sh21Pose(mode){const q=G.ship21,p=q.p;if(p.mode===mode){if(sh21Ceil(p.x)<34){sh21Message('Hier kannst du dich noch nicht aufrichten.','Geh erst ganz unter dem Balken hindurch.');return;}p.mode=null;sh21Message('Du richtest dich wieder auf.','F/J: weitergehen.',1);}
 else{if(mode==='duck'&&sh21Ceil(p.x)<22){sh21Message('Zum Ducken reicht der Platz nicht.','K: auf Hände und Knie gehen.');return;}p.mode=mode;sh21Message(mode==='duck'?'Du duckst dich unter den Segelbaum.':'Du gehst auf Hände und Knie.',mode==='duck'?'F/J: geduckt weiter. D: später aufstehen.':'F/J: weiterkriechen. K: später aufstehen.',1.4);}}
function sh21Climb(){const q=G.ship21,p=q.p,c=q.level.climbs.find(c=>c.id===q.climb?.id)||sh21NearClimb();if(!c)return;
 if(!q.climb){const down=Math.hypot(p.x-c.tx,p.y-c.ty)<Math.hypot(p.x-c.x,p.y-c.y);q.climb={id:c.id,n:0,total:Math.ceil(Math.hypot(c.tx-c.x,c.ty-c.y)/(c.kind==='net'?7:10)),down};p.mode=null;p.x=down?c.tx:c.x;p.y=down?c.ty:c.y;}
 p.face=Math.sign((q.climb.down?c.x:c.tx)-(q.climb.down?c.tx:c.x));
 const cl=q.climb,k=Math.min(1,(cl.n+1)/cl.total),fx=cl.down?c.tx:c.x,fy=cl.down?c.ty:c.y,tx=cl.down?c.x:c.tx,ty=cl.down?c.y:c.ty;cl.n++;sh21Move(fx+(tx-fx)*k,fy+(ty-fy)*k,c.kind==='stairs'?'stairs':'climb',.18);SND.turn();
}
function sh21Wade(){const q=G.ship21,p=q.p,z=sh21NearWater();if(!z)return;const dir=p.mode==='wade'?(q.waterDir||p.face):p.face;q.waterDir=dir;p.mode='wade';p.face=dir;sh21Move(dir>0?Math.min(z.b+22,p.x+14):Math.max(z.a-22,p.x-14),z.y,'wade',.26);SND.water();}
function sh22NearHang(){const q=G.ship21,p=q.p;return q.level.hangs.find(z=>(q.level.dir<0?p.x>z.b-5&&p.x<z.b+28:p.x>z.a-28&&p.x<z.a+5)&&Math.abs(p.y-(q.level.dir<0?(z.startY||150):(z.endY||150)))<12);}
function sh22NearExit(){const q=G.ship21,e=q.level.exit;return e&&Math.abs(q.p.x-e.x)<30&&Math.abs(q.p.y-e.y)<4?e:null;}
function sh22Hang(){const q=G.ship21,p=q.p,z=q.level.hangs.find(z=>z.id===q.hang?.id)||sh22NearHang();if(!z)return;
 if(!q.hang){q.hang={id:z.id,n:0,total:Math.ceil((z.b-z.a+40)/16)};p.mode='hang';p.face=q.level.dir;}
 const hg=q.hang,k=Math.min(1,++hg.n/hg.total),x=q.level.dir<0?z.b+20-(z.b-z.a+40)*k:z.a-20+(z.b-z.a+40)*k;
 const y=hg.n===hg.total?(z.endY||150):z.beam+(z.beamEnd!=null?(z.beamEnd-z.beam)*k:0)+40;sh21Move(x,y,'hang',.23);SND.turn();sh21Message('Du greifst am befestigten Balken weiter.','H: nächster Griff · Rücktaste: zum Merkpunkt',1);save();
}
function sh22EnterStage(stage,x,y=150){const q=G.ship21;q.stage=stage;q.level=sh21Level(stage);q.p={x,y,face:q.level.dir,mode:null,air:false,move:null,anim:0};q.stable={x,y,face:q.level.dir,mode:null};q.checkpoint={stage,x,y};q.cam=Math.max(0,x-160);q.climb=q.brace=q.hang=q.transfer=q.queue=null;q.cinema=0;q.caption='';sh21Message(sh22RoomTitle(stage),q.level.dir<0?'Der Weg führt hier nach links. F: gehen.':'Hier führt der Weg nach rechts weiter. J: gehen.',3);updateControls();save();}
function sh22RoomTitle(stage){return {inside:'Treppenabsatz vor der Kapitänskajüte',guns:'Geschützdeck und Schlafräume',hold:'Lager und Zellen · Wasser dringt ein'}[stage]||'An Deck';}

function sh21Key(ch){const q=G.ship21,p=q.p;
 if(q.stage==='departure'){if(ch===' '){q.stage='deck';q.cinema=0;sh21Message('Die Küste bleibt hinter dir zurück.','F/J: längs über das Deck gehen. S: springen.',3);updateControls();save();}return;}
 if(q.stage==='sink'){if(ch===' ')sh21Finish();return;}if(q.transfer)return;if(q.stage==='fall'||q.brace||q.hurt>0)return;
 if(ch==='Backspace'){sh21Reset();return;}
 if(p.move||p.air){q.queue=ch;return;}
 if(q.hang){if(ch==='h')sh22Hang();return;}if(q.climb){const c=q.level.climbs.find(c=>c.id===q.climb.id);if(ch===c.key)sh21Climb();return;}
 const exit=sh22NearExit();if(exit&&ch===exit.key){save();q.transfer={...exit,elapsed:0,from:p.y};sh21Message('Du steigst durch die offene Luke hinunter.','Die Leiter ist mit dem Deck darunter verbunden.');return;}
 const climb=sh21NearClimb();
 if(climb&&ch===climb.key){sh21Climb();}
 else if(ch==='f'||ch==='j')sh21TryWalk(ch==='f'?-1:1);
 else if(ch==='s')sh21Jump();
 else if(ch==='d')sh21Pose('duck');
 else if(ch==='k')sh21Pose('crawl');
 else if(ch==='w')sh21Wade();else if(ch==='h')sh22Hang();
 else if(ch==='i'){const info=sh21Inspectable();if(info){q.known[info[0]]=true;sh21Message(info[1],info[2],4);save();}}
 else if(ch==='z'){const cargo=sh21NearCargo();if(cargo){p.face=p.x>cargo.x?-1:1;p.mode=null;q.pullingUntil=q.t+.55;q.pulls[cargo.id]=(q.pulls[cargo.id]||0)+1;q.pullAnim={id:cargo.id,from:(q.pulls[cargo.id]-1)*13,to:q.pulls[cargo.id]*13,t:q.t};if(q.pulls[cargo.id]>=3){q.cleared[cargo.id]=true;sh21Message('Die Ladung hängt sicher am Flaschenzug.','Der Weg darunter ist jetzt frei.',3);}else sh21Message('Du ziehst am Tau. Die Ladung hebt sich.','Z: weiterziehen · '+q.pulls[cargo.id]+'/3',2);SND.turn();save();}}
 else if(ch==='ü'){const wave=sh21NearWave();if(wave){p.face=1;p.mode=null;q.brace={id:wave.id,elapsed:0,from:p.x,target:wave.mast-12};q.queue=null;SND.water();sh21Hint(true);save();}}
 sh21Hint();updateControls();
}
function sh21Landed(s){const q=G.ship21,p=q.p;if(s?.kind==='fragile'&&!q.broken[s.id]){q.broken[s.id]=true;sh21Award('broken-'+s.id,s.x+s.w/2,s.top-8);q.parts.push({x:s.x+s.w/2,y:s.top,t:0,debris:true});SND.find();sh21Message('Krach! Das morsche Fass bricht auseinander.','Darin lag eine Goldmünze.',2);p.air=true;p.vy=0;p.vx=0;save();}}
function sh21Collapse(){const q=G.ship21;q.fallX=q.p.x;q.stage='fall';q.cinema=0;q.queue=null;q.p.move=null;q.p.air=false;q.broken['final-deck']=true;sh21Hint(true);save();}
function sh21EnterHold(){sh22EnterStage('inside',2100,108);sh21Message('Du landest auf dem Absatz vor der Kapitänskajüte.','Rechts zur Kajüte, links die Treppe hinunter. F/J: Richtung wählen · T: Treppe.',5);}
function sh21Tick(dt){const q=G.ship21,p=q.p,L=q.level;q.t+=dt;q.cinema+=dt;q.viewLift=(q.viewLift||0)+(Math.max(0,120-(p.y*1.45-67.5))-(q.viewLift||0))*Math.min(1,dt*5);if(q.hurt>0){q.hurt=Math.max(0,q.hurt-dt);return;}
 if(q.transfer){q.transfer.elapsed+=dt;p.y=q.transfer.from+Math.min(1,q.transfer.elapsed/.6)*42;if(q.transfer.elapsed>.6){const e=q.transfer;sh22EnterStage(e.next,e.toX,e.toY);}return;}
 if(q.stage==='departure')return;if(q.stage==='fall'){const k=Math.min(1,q.cinema/2.15);p.y=150+94*k*k;p.x=q.fallX+(2100-q.fallX)*k;q.cam=Math.max(0,p.x-95);if(q.cinema>2.5)sh21EnterHold();return;}
 if(q.stage==='sink'){if(q.cinema>8)sh21Finish();return;}
 if(q.brace){q.brace.elapsed+=dt;if(q.brace.elapsed<.5){const k=q.brace.elapsed/.5;p.x=q.brace.from+(q.brace.target-q.brace.from)*(k*k*(3-2*k));p.anim+=dt;}else p.x=q.brace.target;q.cam=Math.max(0,Math.min(L.end-220,p.x-65));if(q.brace.elapsed>2.8){q.cleared[q.brace.id]=true;q.brace=null;sh21Message('Der Brecher zieht weiter. Du lässt das Tau wieder los.','F/J: weiter über das nasse Deck.',2);updateControls();save();}return;}
 if(p.move){const m=p.move;m.t+=dt;const k=Math.min(1,m.t/m.dur),ease=k*k*(3-2*k);p.x=m.x0+(m.x1-m.x0)*ease;p.y=m.y0+(m.y1-m.y0)*ease;p.anim+=dt;
  if(k>=1){p.move=null;if(q.climb&&q.climb.n>=q.climb.total){q.climb=null;sh21Message('Du steigst auf festen Boden.','F/J: weitergehen.',1.2);}if(p.mode==='wade'&&!sh21NearWater())p.mode=null;save();updateControls();}
 }else if(p.air){const oldY=p.y;p.vy+=500*dt;let nx=p.x+p.vx*dt,ny=p.y+p.vy*dt;
  const wall=L.solids.find(s=>!sh21Removed(s)&&nx+5>s.x&&nx-5<s.x+s.w&&ny>s.top+3&&ny-30<s.y);if(wall){nx=p.x;if(p.vy>=0)p.vx=0;}
  p.x=nx;p.y=ny;
  if(p.vy>=0){let landing=null;for(const g of L.ground){if(p.x>=g.a&&p.x<=g.b&&g.y>=oldY-1&&g.y<=ny&&!L.gaps.some(z=>p.x>z.a&&p.x<z.b&&z.y===g.y)&&(!landing||g.y<landing.y))landing={y:g.y};}
   for(const s of L.solids)if(!sh21Removed(s)&&p.x+4>s.x&&p.x-4<s.x+s.w&&s.top>=oldY-1&&s.top<=ny&&(!landing||s.top<landing.y))landing={y:s.top,s};
   if(landing){p.y=landing.y;p.air=false;p.vy=p.vx=0;if(q.stage==='deck'&&p.x>L.breakAt+10){sh21Collapse();return;}sh21Landed(landing.s);updateControls();save();}
  }
  if(p.y>220){sh21Reset('Du rutschst zwischen die beschädigten Planken.');return;}
 }
 if(!p.air&&!p.move&&!q.climb&&!q.hang){const floor=sh21Floor(p.x,p.y-1);if(floor>p.y+3){p.air=true;p.vy=0;p.vx=p.face*38;p.fromY=p.y;}}
 for(const r of L.rollers){const x=(r.a+r.b)/2+Math.sin(q.t*1.1+r.a)*(r.b-r.a)/2;if(Math.abs(p.x-x)<12&&p.y>r.y-15&&p.y<r.y+4&&!q.climb){sh21Reset('Das rollende Fass bringt dich aus dem Gleichgewicht.');return;}}
 for(const z of L.water)if(p.x>z.a&&p.x<z.b&&Math.abs(p.y-z.y)<3&&p.mode!=='wade'&&!p.air){sh21Reset('Du landest unvorbereitet im übergespülten Bereich.');return;}
 for(const coin of L.coins)if(!q.collected[coin.id]&&Math.abs(p.x-coin.x)<8&&coin.y>p.y-sh21Height()-4&&coin.y<p.y+4)sh21Award(coin.id,coin.x,coin.y);
 if(!p.air&&!p.move&&!q.climb&&!q.hang){for(const cp of L.checks)if(L.dir*(cp.x-q.checkpoint.x)>0&&L.dir*(p.x-cp.x)>=0&&Math.abs(p.y-cp.y)<3){q.checkpoint={stage:q.stage,x:cp.x,y:cp.y};q.checkFlash=q.t;save();}if(q.stage==='hold'&&p.x<L.sinkAt){q.stage='sink';q.cinema=0;q.queue=null;sh21Hint(true);save();updateControls();return;}}
 if(q.hang&&!p.move&&q.hang.n>=q.hang.total){q.hang=null;p.mode=null;sh21Message('Du setzt die Füße auf festen Boden.','F/J: weitergehen.',1.5);updateControls();save();}
 q.parts=q.parts.filter(pt=>(pt.t+=dt)<1.1);q.cam=Math.max(0,Math.min(L.end-220,p.x-(L.dir<0?150:65)));
 if(!p.air&&!p.move){if(q.queue){const key=q.queue;q.queue=null;if(!sh21NearWave()&&!sh21NearCargo()&&!sh21NearClimb()&&!sh22NearHang()&&!sh22NearExit()&&sh21Actions().some(a=>a[0]===key))sh21Key(key);}sh21Hint();}
}
function sh21Finish(){if(!sh21Active())return;const q=G.ship21;sh21Capture();S.ship21.active=false;S.ship21.done=true;SND.soft();G.phase='done';paused=false;
 $('#done-card').innerHTML='<p class="eyebrow">Kapitel 2 · Auf See</p><h2>Unter den Wellen</h2><p id="done-story">Das Knarren des Schiffs verstummt. Blaues Licht zieht Kreise um dich. Für einen Moment ist alles still …</p><p>Du hast den Weg über das sturmgepeitschte Deck und durch den Schiffsrumpf geschafft.</p><dl class="stats3"><div><dt>Münzen dieser Fahrt</dt><dd>'+q.coins+'</dd></div><div><dt>Tasten geübt</dt><dd>W · Ü · I · Z · L · T · K · H</dd></div><div><dt>Fortschritt</dt><dd>Gespeichert</dd></div></dl><div class="row-btns"><button class="btn primary" id="btn-ship21-home">Zum Menü</button><button class="btn" id="btn-ship21-again">Schiff noch einmal üben</button><button class="btn" id="btn-ship21-city">Zur Stadt zum Weiterüben</button></div>';
 $('#ov-done').hidden=false;$('#btn-ship21-home').onclick=()=>show('home');$('#btn-ship21-again').onclick=()=>{q.stage='deck';sh21Start(false,true);};$('#btn-ship21-city').onclick=()=>{$('#ov-done').hidden=true;G.ship21=null;S.world.inCity=true;desertGame();sh21SetLayout();};updateControls();save();sh21SetLayout();
}

/* Illustration renderer. All scenery belonging to the vessel is drawn inside
   one transform; the independent ocean/horizon stays outside that transform. */
function sh21Sprite(sheet,i,x,base,w=null,h=null,ctx=fctx){const a=SH21[sheet],b=S21_BOUNDS[sheet][i];if(!a||!b)return;const scale=w==null?h/b.h:h==null?w/b.w:Math.min(w/b.w,h/b.h),ww=b.w*scale,hh=b.h*scale;ctx.save();if(sheet==='props')ctx.filter='saturate(.55) brightness(.85)';ctx.drawImage(a,b.x,b.y,b.w,b.h,x-ww/2,base-hh,ww,hh);ctx.restore();return {x:x-ww/2,y:base-hh,w:ww,h:hh};}
function sh21Texture(i,x,y,w,h){const im=SH21.material,b=S21_BOUNDS.material[i];fctx.drawImage(im,b.x,b.y,b.w,b.h,x,y,w,h);}
function sh21Timber(x,y,xx,yy,width=2.6){const len=Math.hypot(xx-x,yy-y),im=SH21.structure,b=S21_BOUNDS.structure[1];if(!len)return;fctx.save();fctx.translate(x,y);fctx.rotate(Math.atan2(yy-y,xx-x));const tile=64;fctx.beginPath();fctx.rect(0,-width/2,len,width);fctx.clip();for(let t=0;t<len;t+=tile)fctx.drawImage(im,b.x,b.y+b.h*.25,b.w,b.h*.13,t,-width/2,tile,width);fLine([[0,-width/2],[len,-width/2]],'#c2a172',.35);fLine([[0,width/2],[len,width/2]],'#30251c',.55);fctx.restore();}
function sh21Rope(points,width=.8){fLine(points,'#352e24',width+.6);fLine(points,'#c0a67b',width);}
// Broad deck plane and continuous structural wall, rather than crate tiles.
function sh21Panel(a,b,top,bottom){const q=G.ship21,lo=Math.max(a,q.cam-24),hi=Math.min(b,q.cam+W+24);if(hi<=lo||bottom<=top)return;
 const im=SH21.material,r=S21_BOUNDS.material[0],span=116,height=span*r.h/r.w;fctx.save();fctx.beginPath();fctx.rect(lo,top,hi-lo,bottom-top);fctx.clip();fctx.filter='saturate(.52) brightness(.63)';for(let y=Math.floor(top/height)*height;y<bottom;y+=height)for(let x=Math.floor(lo/span)*span;x<hi;x+=span)fctx.drawImage(im,r.x,r.y,r.w,r.h,x,y,span,height);fctx.filter='none';const shade=fctx.createLinearGradient(0,top,0,bottom);shade.addColorStop(0,'#17150e55');shade.addColorStop(.2,'#33251b00');shade.addColorStop(1,'#111b1a88');fctx.fillStyle=shade;fctx.fillRect(lo,top,hi-lo,bottom-top);for(let x=Math.floor(lo/98)*98;x<hi;x+=98)sh21Timber(x,top,x+3,bottom,3);fctx.restore();
}
function sh21Wood(a,b,y){const q=G.ship21,lo=Math.max(a,q.cam-24),hi=Math.min(b,q.cam+W+24);if(hi<=lo)return;
 sh21Panel(a,b,y+3,192);
 fctx.save();fctx.beginPath();fctx.rect(lo,y-17,hi-lo,21);fctx.clip();const im=SH21.structure,box=S21_BOUNDS.structure[1],span=63;
 fctx.fillStyle='#715538';fctx.fillRect(lo,y-17,hi-lo,21);
 for(let x=Math.floor(lo/span)*span;x<hi;x+=span)fctx.drawImage(im,box.x,box.y,box.w,box.h,x,y-18,span,22);
 fctx.restore();sh21Timber(lo,y+2,hi,y+2,2.4);fLine([[lo,y],[hi,y]],'#c49f67',.45);
}

function sh21Rail(a,b,y){const q=G.ship21,lo=Math.max(a,q.cam-25),hi=Math.min(b,q.cam+W+25);if(hi<=lo)return;const im=SH21.structure,r=S21_BOUNDS.structure[0],span=98.137;fctx.save();fctx.beginPath();fctx.rect(lo,y-32,hi-lo,26);fctx.clip();for(let x=Math.floor(lo/span)*span;x<hi;x+=span)fctx.drawImage(im,r.x,r.y,r.w,r.h,x,y-32,span,26);fctx.restore();}

// A hole exposes another wooden level of this vessel, never an outdoor image.
function sh24Hole(z){const q=G.ship21,broken=z.id==='final-deck';fctx.save();fctx.beginPath();fctx.rect(z.a,z.y-17,z.b-z.a,112);fctx.clip();if(!(broken&&q.stage==='fall')){const depth=fctx.createLinearGradient(0,z.y-18,0,z.y+73);depth.addColorStop(0,'#1d211f');depth.addColorStop(1,'#0d1418');fctx.fillStyle=depth;fctx.fillRect(z.a,z.y-18,z.b-z.a,130);sh21Panel(z.a,z.b,z.y+29,z.y+100);sh21Timber(z.a,z.y+34,z.b,z.y+34,4);for(let x=z.a+15;x<z.b;x+=40)sh21Timber(x,z.y+23,x-8,z.y+105,4);}
 fctx.restore();for(const [x,dir] of [[z.a,1],[z.b,-1]]){for(let i=0;i<4;i++)sh24Splinter(x,z.y-15+i*5,dir*(3+(i*7)%10),.04*(i-1));sh21Timber(x-dir*2,z.y-15,x-dir*2,z.y+8,2);}}
function sh24Splinter(x,y,len,angle=0){fctx.save();fctx.translate(x,y);fctx.rotate(angle);fctx.beginPath();fctx.moveTo(0,-1.2);fctx.lineTo(len,-1.1);fctx.lineTo(len*.73,-.1);fctx.lineTo(len*.92,.5);fctx.lineTo(len*.56,1.3);fctx.lineTo(0,1.4);fctx.closePath();fctx.clip();sh21Timber(Math.min(0,len),0,Math.max(0,len),0,3);fctx.restore();}
function sh21Terrain(){const q=G.ship21,L=q.level,gaps=L.gaps.concat(!L.hold&&q.broken['final-deck']?[{id:'final-deck',a:2080,b:2205,y:150}]:[]);
 if(q.stage!=='fall')sh21Panel(-120,L.end+70,172,195);
 for(const g of L.ground){let sections=[[g.a,g.b]];for(const gap of gaps.filter(z=>z.y===g.y))sections=sections.flatMap(([a,b])=>gap.b<=a||gap.a>=b?[[a,b]]:[[a,Math.max(a,gap.a)],[Math.min(b,gap.b),b]].filter(([x,y])=>y>x));for(const[a,b]of sections)sh21Wood(a,b,g.y);}
 if(!L.hold){const r=S21_BOUNDS.structure[3];fctx.save();fctx.translate(1212,150);fctx.scale(-1,1);fctx.drawImage(SH21.structure,r.x,r.y,r.w,r.h,0,-42,112,42);fctx.restore();}
 if(!L.hold){for(const [x,y]of [[1100,108],[1210,150],[1700,126],[1770,126],[1800,138]])if(x>q.cam-10&&x<q.cam+W+10)sh21Timber(x,y,x,195,3);sh21Timber(1770,94,1800,118,2.6);sh21Timber(1770,111,1800,135,2);sh21Timber(1800,118,1800,150,2.5);}
 for(const z of gaps)if(z.b>q.cam&&z.a<q.cam+W)sh24Hole(z);
 if(!L.hold&&!q.broken['final-deck']){for(let i=0;i<7;i++){const x=2082+i*15;if(x<q.cam||x>q.cam+W)continue;fLine([[x,134],[x+5,137],[x+2,140],[x+8,145],[x+9,149]],'#201b15',.65);fLine([[x+1,135],[x+6,138]],'#c4a476',.35);}}
}
function sh21ClimbArt(c){if(c.kind==='ladder'){// Side view: rails meet both physical deck surfaces.
 const dx=c.tx-c.x,dy=c.ty-c.y;sh21Timber(c.x-5,c.y,c.tx-5,c.ty,1.7);sh21Timber(c.x+5,c.y,c.tx+5,c.ty,1.7);for(let i=1,n=Math.ceil(Math.hypot(dx,dy)/6);i<n;i++){const k=i/n;sh21Timber(c.x+dx*k-5,c.y+dy*k,c.x+dx*k+5,c.y+dy*k,1.3);}sh21Timber(c.tx-7,c.ty,c.tx+10,c.ty,3);}
 else if(c.kind==='stairs'){const n=Math.max(4,Math.ceil(Math.abs(c.tx-c.x)/9)),dx=(c.tx-c.x)/n,dy=(c.ty-c.y)/n;fctx.save();fctx.beginPath();fctx.moveTo(c.x,c.y+6);fctx.lineTo(c.tx+8,c.ty+6);fctx.lineTo(c.tx+8,c.y+7);fctx.closePath();fctx.clip();sh21Panel(Math.min(c.x,c.tx)-5,Math.max(c.x,c.tx)+10,c.ty,Math.max(c.y,c.ty)+10);fctx.restore();for(let i=0;i<n;i++){const x=c.x+dx*i,y=c.y+dy*i;sh21Timber(x-2,y,x+dx+3,y,2.4);sh21Timber(x+dx,y,x+dx,y+dy,1.5);}sh21Timber(c.x-4,c.y+4,c.tx+7,c.ty+4,3);sh21Timber(c.x,c.y-23,c.tx,c.ty-23,2);for(const k of [0,.5,1]){const x=c.x+(c.tx-c.x)*k,y=c.y+(c.ty-c.y)*k;sh21Timber(x,y,x,y-23,1.7);}}
 else{const dx=c.tx-c.x,dy=c.ty-c.y;for(const [x,y,xx,yy]of [[c.x+12,c.y-3,c.tx-8,c.ty+5],[c.x-10,c.y,c.tx+8,c.ty+6],[c.x+5,c.y,c.tx+5,c.ty-1],[c.x-20,c.y-6,c.tx+12,c.ty+8]])sh21Timber(x,y,xx,yy,6);
 const r=S21_BOUNDS.props[9],left=Math.min(c.x,c.tx),base=c.x<c.tx?c.y:c.ty,right=Math.max(c.x,c.tx),slope=(c.y-c.ty)/(c.x-c.tx);fctx.save();fctx.translate(left,base);fctx.transform(1,slope,0,1,0,0);fctx.filter='saturate(.52) brightness(.85)';const span=(right-left)/2;for(let i=0;i<2;i++)fctx.drawImage(SH21.props,r.x,r.y,r.w,r.h,i*span,-38,span,38);fctx.restore();sh21Timber(c.x,c.y-38,c.tx,c.ty-38,2.3);sh21Timber(c.x,c.y,c.tx,c.ty,3);sh21Rope([[c.x,c.y-38],[c.x,c.y]],.8);sh21Rope([[c.tx,c.ty-38],[c.tx,c.ty]],.8);}}

function sh21Mast(m){const mb=S21_BOUNDS.props[4];fctx.save();fctx.filter='saturate(.55) brightness(.85)';fctx.drawImage(SH21.props,mb.x,mb.y,mb.w,mb.h,m.x-m.w/2,-55,m.w,m.y+57);fctx.restore();sh21Rope([[m.x-2,-10],[m.x-65,m.y-5]],.65);sh21Rope([[m.x+3,-5],[m.x+55,m.y-3]],.7);
 if(m.x===402){const z=G.ship21.level.ceil.find(z=>z.id==='sail-boom'),y=z.y-z.clear,tilt=reduceMotion?0:Math.sin(G.ship21.t*.8)*.008,bb=S21_BOUNDS.props[10];fctx.save();fctx.translate(m.x,y);fctx.rotate(tilt);fctx.filter='saturate(.55) brightness(.85)';fctx.drawImage(SH21.props,bb.x,bb.y,bb.w,bb.h,z.a-m.x-3,-17,m.x-z.a+9,17);fctx.restore();sh21Rope([[z.a+9,y-14],[m.x,-4]],.6);sh21Rope([[m.x-17,y-14],[m.x-6,25]],.65);}

 else{fctx.save();fctx.beginPath();fctx.moveTo(m.x+7,5);fctx.lineTo(m.x+155,29);fctx.lineTo(m.x+80,-34);fctx.closePath();fctx.clip();sh21Texture(3,m.x+7,-36,150,70);fctx.restore();sh21Timber(m.x+3,4,m.x+155,29,3.6);}
}
function sh24WaterPath(z){const q=G.ship21,y=z.y-(z.depth||15),a=z.a-12,b=z.b+12;fctx.beginPath();
 if(q.level.hold){fctx.moveTo(a,y);for(let x=a;x<=b;x+=3)fctx.lineTo(x,y+Math.sin(x*.095+q.t*1.6)*.65);fctx.lineTo(b,230);fctx.lineTo(a,230);}
 else{fctx.moveTo(a,z.y+1);fctx.bezierCurveTo(a+12,z.y-1,a+14,y+1,a+34,y);for(let x=a+34;x<=b-34;x+=4)fctx.lineTo(x,y+Math.sin(x*.095+q.t*1.6)*.65);fctx.bezierCurveTo(b-14,y,b-14,z.y,b,z.y+1);fctx.lineTo(b+6,z.y+17);fctx.lineTo(a-6,z.y+17);}fctx.closePath();}
function sh21Water(z,front=false){const q=G.ship21,y=z.y-(z.depth||15);if(!front&&q.level.hold){for(const x of [z.a-14,z.b+14]){sh21Timber(x,62,x,195,4);sh21Timber(x-4,145,x+4,145,3);}}fctx.save();sh24WaterPath(z);fctx.clip();const fill=fctx.createLinearGradient(0,y,0,z.y+18);fill.addColorStop(0,front?'#8caeac8a':'#244b56c9');fill.addColorStop(.32,front?'#3c6972f2':'#315864dc');fill.addColorStop(1,front?'#16333bf5':'#173943f0');fctx.fillStyle=fill;fctx.fillRect(z.a-22,y-3,z.b-z.a+44,140);
 const sea=SH21.sea,r=S21_BOUNDS.sea[1];fctx.save();fctx.globalAlpha=front?.13:.20;fctx.globalCompositeOperation='soft-light';const span=150;for(let x=z.a-25;x<z.b+25;x+=span)fctx.drawImage(sea,r.x,r.y+r.h*.85,r.w,r.h*.1,x+Math.sin(q.t*.6)*1.4,y+1,span,10);fctx.restore();
 if(!front){for(let i=0;i<5;i++){const yy=y+3+i*5;fctx.beginPath();for(let x=z.a-20;x<z.b+20;x+=3){const py=yy+Math.sin(x*.1+q.t*(1+i*.12))*1.1;if(x===z.a-20)fctx.moveTo(x,py);else fctx.lineTo(x,py);}fctx.strokeStyle=i%2?'#afc7bf35':'#102e3c55';fctx.lineWidth=.6;fctx.stroke();}}
 else{for(let i=0;i<5;i++){const x=z.a+20+i*(z.b-z.a-40)/4+Math.sin(q.t+i)*3;const glow=fctx.createLinearGradient(x-3,y,x+3,y);glow.addColorStop(0,'#c3bd8c00');glow.addColorStop(.5,'#c3bd8c25');glow.addColorStop(1,'#c3bd8c00');fctx.fillStyle=glow;fctx.fillRect(x-3,y,6,z.y-y+15);}if(q.p.mode==='wade'&&q.p.x>z.a-10&&q.p.x<z.b+10){const x=q.p.x,yy=y+6;fctx.beginPath();fctx.ellipse(x,yy,8+Math.sin(q.t*4),1.4,0,.1,Math.PI*1.8);fctx.strokeStyle='#ccdfd59c';fctx.lineWidth=.55;fctx.stroke();}}
 fctx.restore();}

function sh21Breaker(z){const q=G.ship21;if(q.cleared[z.id]||Math.abs(q.p.x-z.a)>180)return;
 const active=q.brace?.id===z.id,t=active?q.brace.elapsed:0,progress=Math.max(0,Math.min(1,(t-.2)/2.4)),swell=Math.sin(progress*Math.PI),x=z.mast+50-progress*50;
 fctx.save();fctx.globalAlpha=active?Math.min(1,.58+swell*.42):.67;
 sh21Sprite('detail',0,x,z.y+13,155+35*swell,44+54*swell);fctx.restore();
}
function sh21Foam(z){const q=G.ship21;if(q.brace?.id!==z.id)return;const t=q.brace.elapsed,peak=Math.max(0,Math.sin((t-.55)/2.1*Math.PI));if(t<.55||peak<=0)return;
 fctx.save();fctx.globalAlpha=peak*.82;sh21Sprite('detail',1,z.mast+31-(t-.55)*26,z.y+7,142+55*peak,14+15*peak);fctx.restore();
}

function sh21Roller(r){const q=G.ship21,x=(r.a+r.b)/2+Math.sin(q.t*1.1+r.a)*(r.b-r.a)/2;fctx.save();fctx.translate(x,r.y-9);fctx.rotate(Math.sin(q.t*1.1+r.a)*.18);sh21Sprite('props',2,0,9,25,18);fctx.restore();}
function sh21Marker(key,x,y){const q=G.ship21;if(x<q.cam-5||x>q.cam+W+5)return;fctx.fillStyle='#1c2b24ed';fctx.strokeStyle='#dcc68f';fctx.lineWidth=.45;fctx.beginPath();fctx.roundRect(x-5,y-8,10,10,1.3);fctx.fill();fctx.stroke();fctx.fillStyle='#ffebad';fctx.font='bold 7px Segoe UI,sans-serif';fctx.textAlign='center';fctx.fillText(key.toUpperCase(),x,y-.1);fctx.textAlign='left';}
function sh21DrawFigure(){const q=G.ship21,p=q.p;if(q.hurt>0&&Math.floor(q.t*12)%2)return;
 const brace=q.brace&&q.brace.elapsed>=.5||q.pullingUntil>q.t;
 if(q.hang){const z=q.level.hangs.find(z=>z.id===q.hang.id),frame=(q.hang.n||0)%2;sh21Sprite('actions',frame,p.x,p.y,null,40);return;}
 if(brace){fctx.save();fctx.translate(p.x,p.y);fctx.scale(p.face<0?-1:1,1);sh21Sprite('actions',2,0,0,null,33);fctx.restore();return;}
 if(p.mode==='crawl'){fctx.save();fctx.translate(p.x,p.y);fctx.scale(p.face>0?-1:1,1);sh21Sprite('actions',3,0,0,null,13);fctx.restore();return;}
 const pose=p.air||q.stage==='fall'?4:q.climb&&q.level.climbs.find(c=>c.id===q.climb.id).kind!=='stairs'?2:p.mode==='duck'?0:p.mode==='wade'?5:null;
 fctx.save();fctx.translate(p.x,p.y);fctx.scale(p.face<0?-1:1,1);fEllipse(0,1,7,1.2,'#171e1c55');if(pose==null){const moving=!!p.move||q.climb;const frame=moving?1+Math.floor((p.anim||0)*19)%8:0;rFrame(fctx,R_HUMAN,frame,0,0,null,34,1);}else sh21Sprite('poses',pose,0,0,null,[22,13,37,33,32,33][pose]);fctx.restore();

}
function sh22Obstacles(){const q=G.ship21,L=q.level;
 for(const z of L.hangs){if(z.b<q.cam||z.a>q.cam+W)continue;const left=z.beamEnd??z.beam;fctx.save();fctx.beginPath();fctx.moveTo(z.a,134);for(let x=z.a;x<=z.b;x+=7)fctx.lineTo(x,134+(Math.sin(x*1.7)+1)*2);fctx.lineTo(z.b,195);fctx.lineTo(z.a,195);fctx.closePath();fctx.clip();sh21Panel(z.a,z.b,133,230);const depth=fctx.createLinearGradient(0,134,0,195);depth.addColorStop(0,'#101913e0');depth.addColorStop(.65,'#1e282577');depth.addColorStop(1,'#081218cc');fctx.fillStyle=depth;fctx.fillRect(z.a,133,z.b-z.a,80);for(let x=z.a+18;x<z.b;x+=34){sh21Timber(x,139,x-13,196,4);sh21Timber(x-8,177,x+29,177,3);}sh21Timber(z.a,186,z.b,191,5);fctx.restore();for(const [x,dir] of [[z.a,1],[z.b,-1]])for(let i=0;i<4;i++)sh24Splinter(x,135+i*5,dir*(5+i*2),dir*.12);sh21Timber(z.a-18,left,z.b+18,z.beam,4.2);for(const [x,y]of [[z.a-18,left],[z.b+18,z.beam]]){sh21Timber(x,y+34,x,y-24,5);sh21Rope([[x-5,y-3],[x+5,y-3],[x+5,y+3],[x-5,y+3]],1);sh21Rope([[x,y-4],[x-18,y-30]],.9);}}
 for(const c of L.ceil){if(c.id==='sail-boom'||c.b<q.cam-25||c.a>q.cam+W+25)continue;const y=c.y-c.clear;sh21Timber(c.a-8,y-5,c.b+10,y-1,8);sh21Timber(c.b+8,y,c.b+22,y-57,5);sh21Timber(c.a-13,y-7,c.a+10,y-36,4);for(let i=0;i<5;i++)sh24Splinter(c.a+4+i*12,y-5,8,-.15);}
 const e=L.exit;if(e&&e.x>q.cam-30&&e.x<q.cam+W+30){fctx.fillStyle='#15201d';fctx.fillRect(e.x-10,148,20,22);sh21Timber(e.x-12,148,e.x+12,148,2.7);sh21Timber(e.x-11,149,e.x-11,180,2);sh21Timber(e.x+10,149,e.x+10,180,2);for(let y=154;y<181;y+=6)sh21Timber(e.x-11,y,e.x+10,y,1.3);}
}
// Room paintings keep their native proportions and share the vessel transform.
// The chart room is used only for the captain's cabin, never the whole passage.
function sh24Room(index,a,b,floor){const r=S21_BOUNDS.rooms[index],width=b-a,height=width*r.h/r.w,y=floor-height*.70;fctx.save();fctx.beginPath();fctx.rect(a,-130,width,floor+131);fctx.clip();fctx.drawImage(SH21.rooms,r.x,r.y,r.w,r.h,a,y,width,height);fctx.restore();}
function sh22RoomBackground(stage=G.ship21.stage){const q=G.ship21,lo=q.cam-70,hi=q.cam+W+70,wall=S21_BOUNDS.material[1],w=108,h=w*wall.h/wall.w;
 fctx.fillStyle='#241f1b';fctx.fillRect(lo,-170,hi-lo,380);fctx.save();fctx.filter='saturate(.52) brightness(.65)';for(let y=-160;y<195;y+=h)for(let x=Math.floor(lo/w)*w;x<hi;x+=w)fctx.drawImage(SH21.material,wall.x,wall.y,wall.w,wall.h,x,y,w,h);fctx.restore();
 if(stage==='inside'){sh21Timber(2176,-70,2176,94,7); // doorway into the intact chart cabin
 for(let x=Math.floor(lo/120)*120;x<Math.min(2180,hi);x+=120){sh21Timber(x,-20,x,147,5);sh21Timber(x,-5,x+35,25,4);sh21Sprite('props',7,x+17,66,5,12);}
 // Water seeps from the damaged ceiling. The rest of the hull remains closed.
 if(1515>lo&&1515<hi)for(let i=0;i<4;i++){const y=60+(q.t*47+i*23)%78;fLine([[1515+i*.8,y],[1515+i*.8,y+3]],'#9ebbc18a',.45);}
 }
 if(stage!=='inside'||q.p.x<2160)sh21Timber(lo,28,Math.min(hi,2176),28,6);
}

function sh24FurnishedRooms(stage){if(stage==='inside'){sh24Room(0,2215,2415,90);sh21Timber(2215,12,2215,90,4);sh21Timber(2415,12,2415,90,4);}
 else if(stage==='guns'){sh24Room(1,1120,1415,150);sh24Room(2,1415,1740,150);sh21Timber(1415,35,1415,150,6);}
 else{sh24Room(3,1180,1440,150);sh24Room(3,1440,1735,150);sh21Timber(1440,25,1440,150,6);}}

function sh21Scene(){const q=G.ship21,L=q.level;if(L.hold)sh22RoomBackground();
 if(!L.hold){for(const z of L.waves)sh21Breaker(z);sh21Rail(-100,2250,150);sh21Rail(700,1100,108);sh21Rail(1700,1770,126);}
 sh21Terrain();if(L.hold)sh24FurnishedRooms(q.stage);if(!L.hold)for(const c of L.climbs)if(c.x>q.cam-50&&c.x<q.cam+W+30)sh21Panel(c.x-6,c.tx+9,c.ty+4,155);
 // Secured supplies sit against the far rail; the traversable foreground stays clear.
 if(!L.hold)for(const [x,y]of [[82,150],[1138,150],[1723,150],[2167,150],[2780,150],[3390,150]]){if(x<q.cam-40||x>q.cam+W+40)continue;fctx.save();fctx.globalAlpha=.87;sh21Sprite('props',11,x,y-17,35,22);fctx.restore();sh21Rope([[x-15,y-31],[x-10,y-17],[x+12,y-17],[x+16,y-29]],.45);}
 for(const m of L.masts)if(m.x>q.cam-180&&m.x<q.cam+W+100)sh21Mast(m);
 for(const c of L.climbs)if(Math.max(c.x,c.tx)>q.cam-40&&Math.min(c.x,c.tx)<q.cam+W+40)sh21ClimbArt(c);
 sh22Obstacles();
 for(const s of L.solids){if(s.x+s.w<q.cam-30||s.x>q.cam+W+30)continue;if(s.kind==='barrier'){const r=S21_BOUNDS.structure[5];fctx.drawImage(SH21.structure,r.x,r.y,r.w,r.h,s.x-8,s.top,s.w+16,s.h);}else if(s.kind==='cargo'){const progress=q.pulls[s.id]||0,pa=q.pullAnim,delta=pa?.id===s.id?pa.from+(pa.to-pa.from)*Math.min(1,(q.t-pa.t)/.6):progress*13,base=s.y-delta;sh21Timber(s.x+s.w+13,s.y,s.x+s.w+13,s.y-95,6);sh21Timber(s.x-5,s.y-95,s.x+s.w+13,s.y-95,6);sh21Sprite('props',5,s.x+s.w/2,s.y-62,10,28);sh21Rope([[s.x+s.w/2,s.y-80],[s.x+s.w/2,base-s.h]],.65);sh21Sprite('props',3,s.x+s.w/2,base,s.w,s.h);sh21Rope([[s.x+s.w/2,s.y-68],q.pullingUntil>q.t?[q.p.x+13*q.p.face,q.p.y-23]:[G.ship21.level.dir<0?s.x+s.w+25:s.x-20,s.y-4]],.75);}
  else if(q.broken[s.id])sh21Sprite('props',6,s.x+s.w/2,s.y+1,s.w+10,7);else sh21Sprite('props',s.kind==='fragile'?1:s.kind==='lying'?2:0,s.x+s.w/2,s.y,s.w,s.h);
 }
 for(const z of L.water)if(z.b>q.cam&&z.a<q.cam+W)sh21Water(z);
 for(const r of L.rollers)if(r.b>q.cam-20&&r.a<q.cam+W+20)sh21Roller(r);
 for(const cp of L.checks){if(cp.x>q.cam-20&&cp.x<q.cam+W+20){sh21Timber(cp.x-8,cp.y,cp.x-8,cp.y-33,1.8);sh21Sprite('props',7,cp.x-8,cp.y-20,5,10);}}
 for(const coin of L.coins)if(!q.collected[coin.id]&&coin.x>q.cam-10&&coin.x<q.cam+W+10)nCoin(coin.x,coin.y,q.t*1000);
 sh21DrawFigure();for(const z of L.water)if(z.b>q.cam&&z.a<q.cam+W)sh21Water(z,true);for(const z of L.waves)sh21Foam(z);
 const wave=sh21NearWave(),climb=sh21NearClimb(),water=sh21NearWater(),cargo=sh21NearCargo(),inspect=sh21Inspectable(),ceil=L.ceil.find(c=>q.p.x>c.a-45&&q.p.x<c.b);
 if(!q.climb&&!q.brace&&!q.hang&&!q.p.air){const exit=sh22NearExit(),hang=sh22NearHang();if(exit)sh21Marker('l',exit.x,exit.y-14);else if(hang)sh21Marker('h',(hang.a+hang.b)/2,hang.beam-5);else if(wave)sh21Marker('ü',wave.mast,wave.y-48);else if(climb)sh21Marker(climb.key,(climb.x+climb.tx)/2,Math.min(climb.y,climb.ty)-10);else if(cargo)sh21Marker(inspect?'i':'z',cargo.x-10,cargo.top-4);else if(water)sh21Marker(inspect?'i':'w',Math.max(water.a,q.p.x+15),water.y-15);else if(inspect){const s=L.solids.find(s=>s.kind==='fragile'&&!sh21Removed(s)&&s.x>q.p.x-5);sh21Marker('i',s?s.x+s.w/2:q.p.x+35,s?s.top-8:q.p.y-38);}else if(ceil)sh21Marker(ceil.clear<20?'k':'d',(ceil.a+ceil.b)/2,ceil.y-ceil.clear-7);}
 for(const pt of q.parts){if(pt.debris){sh21Sprite('props',6,pt.x,pt.y+pt.t*12,20,8);}else{fctx.fillStyle='#ffdf8b';fctx.font='bold 5px system-ui,sans-serif';fctx.fillText(pt.label,pt.x-3,pt.y-pt.t*15);}}
 if(q.stage==='fall')for(let i=0;i<8;i++)sh24Splinter(2085+i*13,152+94*Math.min(1,q.cinema/2.15)**2+(i%3)*3,10,q.cinema*(i%2?.5:-.6));
}
function sh21SinkArt(){const q=G.ship21,progress=Math.min(1,q.cinema/8),zoom=1.08+progress*.17;fctx.save();fctx.translate(160,90);fctx.rotate((progress-.5)*.045);fctx.scale(zoom,zoom);fctx.drawImage(SH21.vortex,-160,-90,W,H);fctx.restore();
 for(let i=0;i<24;i++){const angle=i*2.399+q.t*.22,r=((i*17)%170)*(1-progress*.55),x=160+Math.cos(angle)*r,y=99+Math.sin(angle)*r*.6;fEllipse(x,y,.2+(i%3)*.1,.4,'#d5ebdc60');}
 if(progress>.72){fctx.fillStyle='rgba(21,49,78,'+((progress-.72)/.28*.7)+')';fctx.fillRect(0,0,W,H);}
}

function sh24FallBackground(){const q=G.ship21;fctx.save();fctx.translate(0,136);sh22RoomBackground('inside');for(const g of sh21Level('inside').ground)sh21Wood(g.a,g.b,g.y);sh24FurnishedRooms('inside');for(const c of sh21Level('inside').climbs)if(c.kind==='stairs')sh21ClimbArt(c);fctx.restore();}
function sh21Render(withHud=true){if(!sh21Active()||!SH21.sea)return;const q=G.ship21,hold=q.level.hold,im=SH21.sea,storm=q.stage==='departure'?0:hold?1:Math.max(0,Math.min(1,(q.p.x-450)/430));fctx.clearRect(0,0,W,H);
 if(q.stage==='sink'&&q.cinema>=2.2)sh21SinkArt();
 else{
  fctx.fillStyle=hold?'#241f1b':'#344e5b';fctx.fillRect(0,0,W,H);
  if(!hold){const r=S21_BOUNDS.sea[storm>.5?1:0],width=H*r.w/r.h,departure=q.stage==='departure'?Math.min(1,q.cinema/4):1;fctx.drawImage(im,r.x,r.y,r.w,r.h,-Math.max(0,width-W)*departure,0,width,H);}
  const motion=S.settings.shipMotion!==false&&!reduceMotion,roll=motion?Math.sin(q.t*.75)*(.003+storm*.018)+(q.brace?Math.sin(q.brace.elapsed*2.5)*.016:0):0,heave=motion?Math.sin(q.t*1.1)*(.6+storm*1.1):0;
  const fall=q.stage==='fall',fallCamera=fall?Math.max(0,Math.min(1,(q.cinema-.35)/1.8))*136:0;
  fctx.save();fctx.translate(160,139+heave);fctx.rotate(roll);fctx.translate(-160,-139);fctx.translate(0,-67.5+(fall?-fallCamera*1.45:(q.viewLift||0)));fctx.scale(1.45,1.45);fctx.translate(-q.cam,0);
  if(fall)sh24FallBackground();sh21Scene();fctx.restore();
  if(!hold&&storm>.1){for(let i=0;i<Math.floor(35*storm);i++){const x=(i*53+q.t*34)%340-10,y=(i*31+q.t*95)%170;fLine([[x,y],[x-3,y+7]],'#bed0d64f',.25);}}
  if(q.stage==='sink'){fctx.save();fctx.beginPath();const edge=H*(1-q.cinema/2.2);fctx.moveTo(0,edge);for(let x=0;x<=W;x+=4)fctx.lineTo(x,edge+Math.sin(x*.08+q.t*2)*3);fctx.lineTo(W,H);fctx.lineTo(0,H);fctx.closePath();fctx.clip();sh21SinkArt();fctx.restore();}
 }
 if(withHud){fctx.fillStyle='#14251fe0';fctx.beginPath();fctx.roundRect(6,6,89,10,2);fctx.fill();fctx.fillStyle='#f0ead2';fctx.font='bold 5px system-ui,sans-serif';const title=q.stage==='departure'?'Die Abfahrt':q.stage==='fall'?'Das Deck bricht':q.stage==='sink'?'Unter den Wellen':hold?({inside:'Unter dem Oberdeck',guns:'Geschützdeck · Schlafräume',hold:'Lager · Zellen'}[q.stage]||'Im Schiffsrumpf'):storm>.75?'Sturm auf dem Deck':'An Deck';fctx.fillText(title,10,12);
 fctx.fillStyle='#182a24de';fctx.fillRect(240,6,74,15);fctx.fillStyle='#f0dfad';fctx.font='bold 4.5px system-ui,sans-serif';fctx.fillText('Münzen +'+q.coins,245,12);if(S.inv.includes('kamera'))fctx.fillText('Fotos '+p18State().loaded+'/8 · F5',245,18);
 const progress=q.stage==='sink'?1:q.stage==='inside'?.58+(2100-q.p.x)/910*.24:q.stage==='guns'?.82+(q.p.x-1190)/470*.1:q.stage==='hold'?.92+(1660-q.p.x)/425*.08:q.p.x/2200*.58;fctx.fillStyle='#cfbe8d';fctx.fillRect(7,18,87*Math.max(0,Math.min(1,progress)),.6);
 if(q.checkFlash!=null&&q.t-q.checkFlash<2.8){fctx.fillStyle='#22372de8';fctx.fillRect(108,27,104,10);fctx.fillStyle='#f2d89d';fctx.font='4.7px system-ui,sans-serif';fctx.fillText('Merkpunkt gespeichert',119,34);}
 }vx.drawImage(F_CANVAS,0,0,1280,720,0,0,W,H);
}
const sh21RenderScene=renderScene;renderScene=function(){if(sh21Active()){sh21Render();return;}return sh21RenderScene(...arguments);};
const sh21Draw=draw;draw=function(now){if(!sh21Active())return sh21Draw(now);const q=G.ship21,dt=Math.max(0,Math.min(.05,(now-q.last)/1000));q.last=now;if(!paused&&$('#ov-goal').hidden&&$('#ov-done').hidden)sh21Tick(dt);if(!sh21Active())return;sh21Render();if(p18Camera)p18DrawCamera();};
const sh21PhotoAllowed=p18PhotoAllowed;p18PhotoAllowed=function(){if(sh21Active())return S.inv.includes('kamera')&&canPhoto()&&['deck','inside','guns','hold'].includes(G.ship21.stage)&&!G.ship21.brace&&!G.ship21.p.air&&!G.ship21.p.move;return sh21PhotoAllowed();};
const sh21AddPhoto=p18AddPhoto;p18AddPhoto=function(src,title,kind){return sh21AddPhoto(src,sh21Active()?(G.ship21.level.hold?({inside:'Unter dem Oberdeck',guns:'Geschützdeck · Schlafräume',hold:'Lager · Zellen'}[G.ship21.stage]||'Im Schiffsrumpf'):'Auf dem Schiff'):title,kind);};
const sh21Snap=showSnap;showSnap=function(src,title){return sh21Snap(src,sh21Active()?(G.ship21.level.hold?({inside:'Unter dem Oberdeck',guns:'Geschützdeck · Schlafräume',hold:'Lager · Zellen'}[G.ship21.stage]||'Im Schiffsrumpf'):'Auf dem Schiff'):title);};
const sh21HomeShow=show;show=function(name){const r=sh21HomeShow(...arguments);if(name==='home'&&S.ship21?.active){$('#home-where').textContent='Kapitel 2 · Auf See';$('#home-lead').textContent='Deine Reise auf dem Schiff ist gespeichert. Setze deinen Weg über das Deck und durch den Rumpf fort.';}return r;};
const sh21Ready=Promise.all([p20Ready,...Object.entries(S21_IMAGE_DATA).map(async([key,src])=>{const im=new Image();im.src=src;await im.decode();SH21[key]=im;})]).then(()=>{window.forestArt.version='4.7 Waldatelier 22 – Lesbarkeit und Schiffswege';});

const sh21OpenCamera=p18OpenCamera;p18OpenCamera=function(){const result=sh21OpenCamera(...arguments);if(sh21Active()&&p18Camera){sh21Render(false);const c=p18Camera.image;c.getContext('2d').clearRect(0,0,c.width,c.height);c.getContext('2d').drawImage(F_CANVAS,0,0);sh21Render();}return result;};
