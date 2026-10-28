/* Revision 12: short, skippable feedback sequences; appended, save-compatible ruin trail. */
let qEffect=null,qAction=null,qPhotoBusy=false;
const qPhotoCache=new Map();
function qForest(){return !!(G&&!G.cave&&!G.ex&&!G.city&&!inDesert());}
function qRuinPassable(n,d){
 if(!G?.w?.N.RU)return true;
 const ei=n.exits[d],e=G.w.edges[ei];
 return !e||!['RU_WEG','REHKRIPPE'].includes(e.a)&&!['RU_WEG','REHKRIPPE'].includes(e.b)||!!G.w.N.RU.open;
}
function qHerdHere(){return qForest()&&G.phase==='explore'&&G.pos.e==null&&G.pos.n==='REHKRIPPE'&&G.pos.h===0&&qHerdLeft()>0;}
function qHerdLeft(){return Math.max(0,3-(S.world?.roeClearing?.helped||0));}
function qPerch(a){if(!qForest()||!['kauz','specht','hoernchen'].includes(a)||!spotKey())return;S.world.perches=S.world.perches||{};S.world.perches[spotKey()]=a;}
function qDrawPerch(a){if(a==='kauz'){dTreeSprite(0,223,126,220);fLine([[211,68],[187,65],[168,65]],'#6c6b4f',2);}else if(a==='specht')dTreeSprite(2,190,132,230);else if(a==='hoernchen'){const a=F_ATLAS.waldtiere,r=a.bounds[3],w=26,h=w*r.h/r.w;fctx.drawImage(a.img,r.x,r.y+r.h*.83,r.w,r.h*.17,164-w/2,128-h*.17,w,h*.17);}}
// Existing forest IDs are untouched. Only the appended trail unlocks with the shield puzzle.
const qHere=here;
here=function(){if(qForest()&&G.pos.e==null&&G.pos.n==='RU'&&G.pos.h===3)return G.w.N.RU;return qHere();};
const qNodeMoves=nodeMoves;
nodeMoves=function(n,h){n=n||(G.pos.e==null?G.w.N[G.pos.n]:null);h=h??G.pos.h;if(qForest()&&n?.id==='RU'&&h===3)return n.open?{' ':3}:{};return qNodeMoves(n,h);};
const qZuName=zuName;zuName=function(n){return n.id==='REHKRIPPE'?'zur Futterkrippe hinter der Ruine':n.id==='RU_WEG'?'zum Pfad hinter der Ruine':qZuName(n);};
function qSeedDeer(w){
 if(!qForest()||S.world.encounters12)return;
 const start=w.N.start.exits[0],candidate=w.edges[w.N.A.exits[0]],spots=[];
 if(candidate)for(let k=1;k<candidate.n;k++)spots.push('e:'+candidate.uid+':'+k);
 const free=spots.filter(s=>!S.world.items[s]&&!Object.values(S.world.animals).includes(s));
 if(!S.world.animals.reh){const a=Object.keys(S.world.animals).find(a=>!['kauz','specht'].includes(a));if(a)delete S.world.animals[a];const available=free.length?free:freeSpots(w,w.edges[start].uid);if(available.length)S.world.animals.reh=pickRand(available);}
 S.world.encounters12=true;
}
DEAD.reh.w=5;
DEAD.salamander.note='Feuersalamander scheiden ein giftiges Hautsekret aus. Bitte nur beobachten und fotografieren, nicht anfassen oder füttern.';
const qStoryInit=storyInit;
storyInit=function(w,avoid){const value=qStoryInit(...arguments);if(qForest()){qSeedDeer(w);S.world.roeClearing=S.world.roeClearing||{helped:0};}return value;};
// More local encounters without duplicates: move a distant animal to an upcoming path.
const qRotate=rotateAnimals;
rotateAnimals=function(){const rotating=qForest()&&(G.rot||0)+1>=ROTATE_MOVES;qRotate();if(!rotating)return;
 const n=curNode(),edge=G.pos.e!=null?G.w.edges[G.pos.e]:null;
 const next=n||(edge?G.w.N[G.pos.h===edge.dir?edge.b:edge.a]:null);if(!next)return;
 const near=new Set();for(const ei of Object.values(next.exits)){const e=G.w.edges[ei];if(e.hidden||e.closed)continue;for(let k=1;k<e.n;k++)near.add('e:'+e.uid+':'+k);}
 const free=freeSpots(G.w,curEdgeUid()).filter(s=>near.has(s));if(!free.length)return;
 const candidates=Object.keys(S.world.animals).filter(a=>S.world.animals[a]!==spotKey()&&!near.has(S.world.animals[a]));if(!candidates.length)return;
 const a=candidates.includes('reh')&&Math.random()<.5?'reh':weightedPick(candidates,animalWeight);S.world.animals[a]=pickRand(free);
};
// Keep route and arrow captions in agreement, with an unambiguous early route via C.
const qDirTo=dirTo;
dirTo=function(target,n){if(qForest()&&target==='HUT'&&n.id==='A')return 1;return qDirTo(target,n);};
const qArrive=arrive;
arrive=function(){qEffect=null;const result=qArrive(...arguments);if(!qForest())return result;
 const a=animalHere();if(a)qPerch(a);
 if(G.pos.e==null&&G.pos.n==='RU'&&G.pos.h===3&&G.w.N.RU.open){setCaption(['Die Steintür der Ruine steht offen.',G.w.N.RU.got?'Dahinter führt ein schmaler Pfad zur Futterkrippe. Leertaste: durch die Ruine gehen.':'Drinnen liegt ein Seitenstück: G. Leertaste: durch die Ruine zum Pfad hinter dem Gemäuer.']);}
 if(G.pos.e==null&&G.pos.n==='REHKRIPPE'&&G.pos.h===0){
  const left=qHerdLeft();if(left){sighting('reh');renderABox('reh');setCaption([`${left===3?'Drei Rehe stehen':left===2?'Zwei Rehe stehen':'Ein Reh steht'} an der alten Futterkrippe.`,(S.food>0?'H: ein Reh füttern. ':'')+'S: ein Reh behutsam streicheln. Danach zieht es weiter.']);}else setCaption(['Die Futterkrippe liegt still im Wald.','Alle drei Rehe sind weitergezogen. Rücktaste: zurück zur Ruine.']);
 }
 if(a==='salamander')setCaption([DEAD.salamander.text,DEAD.salamander.note+(canPhoto()?' K: fotografieren.':'')]);
 renderScene();updateControls();return result;
};
const qSceneDead=sceneDead;
sceneDead=function(d,r){if(!dRecording||d.id!=='REHKRIPPE')return qSceneDead(...arguments);
 dBackdrop();const p=new Path2D();p.moveTo(92,H);p.bezierCurveTo(103,169,80,163,87,150);p.bezierCurveTo(91,135,123,137,143,133);p.bezierCurveTo(177,126,213,137,227,149);p.bezierCurveTo(243,162,214,173,228,H);p.closePath();dPaintRoad(p);for(const [x,y]of [[89,151],[100,140],[128,135],[223,150],[231,165],[95,175],[225,177]])dGrassEdge(x,y,1.1);fSprite('wegmarker',11,194,126,86);
 const helped=S.world.roeClearing?.helped||0;for(let i=helped;i<3;i++){const x=[104,145,209][i],y=[149,160,154][i];fShadow(x,y,38);fctx.save();if(i===2){fctx.translate(x*2,0);fctx.scale(-1,1);}fSprite('waldtiere',1,x,y,[46,53,44][i]);fctx.restore();}
 if(helped<3){const i=helped,w=[46,53,44][i],a=F_ATLAS.waldtiere.bounds[1],x=[104,145,209][i],y=[149,160,154][i];fLastAnimal={key:'reh',x:x-w/2,y:y-w*a.h/a.w,w,h:w*a.h/a.w};}
};
const qDRender=dRender;
dRender=function(){qDRender();if(!fActive()||qPhotoBusy)return;const perch=S.world.perches?.[spotKey()];if(perch&&animalHere()!==perch)qDrawPerch(perch);};
const qAnimalGone=animalGone;
animalGone=function(a){qPerch(a);if(qHerdHere()&&a==='reh'&&!qAction){G.enc=null;save();return;}if(qAction&&qHerdHere()&&a==='reh'){
 S.world.roeClearing=S.world.roeClearing||{helped:0};S.world.roeClearing.helped=Math.min(3,S.world.roeClearing.helped+1);G.enc=null;save();return;
 }return qAnimalGone(a);};
function qBegin(kind,data){qEffect={kind,...data,t:performance.now(),elapsed:0,last:performance.now(),game:G,pos:JSON.stringify(G.pos),caption:G.caption.slice()};updateControls();}
function qFinish(){if(!qEffect)return;const e=qEffect;qEffect=null;if(e.onFinish&&G===e.game&&e.pos===JSON.stringify(G.pos))e.onFinish();if(G){if(G===e.game&&G.caption.length===e.caption.length+1&&e.caption.every((line,i)=>G.caption[i]===line))setCaption(e.caption,true);renderScene();updateControls();}}
function qAnimalAction(kind,fn){
 if(!qForest())return fn();
 const a=animalHere();if(!a||a==='salamander'||(kind==='feed'&&(!(S.food>0)||!tameable(a)))||(kind==='pet'&&!trusted(a)&&!qHerdHere()))return;
 const box=fLastAnimal?{...fLastAnimal}:null,herd=qHerdHere();
 qAction=kind;
 try{
  if(kind==='pet'&&herd&&!trusted('reh')){
   const sp=DEAD.reh.sp;S.pet[sp]=(S.pet[sp]||0)+1;animalGone(a);SND.soft();setCaption(['Das Reh an der Futterkrippe lässt dich vorsichtig seinen Kopf streicheln.','Dann zieht es ruhig zwischen die Bäume.'],true);renderABox(a);
  }else fn();
 }finally{qAction=null;}
 renderScene();qBegin(kind,{a,box,herd,duration:kind==='pet'?2900:2600});
 setCaption([...G.caption,reduceMotion?'Leertaste: weiter.':'Leertaste: Sequenz überspringen.'],true);
}
const qFeed=feedAnimal;feedAnimal=function(){return qAnimalAction('feed',qFeed);};
const qPet=petAnimal;petAnimal=function(){return qAnimalAction('pet',qPet);};
// Only the clearing's deer are approachable before the normal trust threshold.
const qExpected=expected;
expected=function(){if(paused||!$('#ov-goal').hidden||!$('#ov-done').hidden)return [];if(qEffect&&G===qEffect.game&&G.phase==='explore')return [' ','Backspace'];const keys=qExpected();if(qHerdHere()&&!needsBlocked()&&!keys.includes('s'))keys.push('s');return keys;};
const qActions=actionsNow;
actionsNow=function(){if(qEffect&&G===qEffect.game&&G.phase==='explore')return [[' ','weiter'],['Backspace','Sequenz beenden und umdrehen']];const actions=qActions();if(qHerdHere()&&!needsBlocked()&&!actions.some(a=>a[0]==='s'))actions.splice(-1,0,['s','Reh streicheln']);return actions;};
const qOnHit=onHit;
onHit=function(ch){if(qEffect&&G===qEffect.game&&G.phase==='explore'){qFinish();if(ch==='Backspace')return qOnHit(ch);return;}return qOnHit(ch);};
// Rewards come from actual inventory changes (including caps), never a second payout.
function qLootState(){const o={muenzen:S.coins||0,altmuenzen:S.old||0,tierfutter:S.food||0,seite:S.pages||0};for(const[k,v]of Object.entries(S.res||{}))o[k]=v;for(const k of S.inv||[])o[k]=1;return o;}
function qChest(fn){return function(h){if(h?.chest||(!h&&curNode()?.chest))return;const before=qLootState(),value=fn(...arguments),after=qLootState(),loot=[];
 for(const[k,v]of Object.entries(after))if(v>(before[k]||0))loot.push([k,v-(before[k]||0)]);
 if(loot.length){qBegin('loot',{loot,duration:Math.max(3200,Math.ceil(loot.length/4)*1900)});setCaption([...G.caption,'Leertaste: weiter.'],true);}return value;};}
openChest=qChest(openChest);openSecretChest=qChest(openSecretChest);caveChest=qChest(caveChest);openChestD=qChest(openChestD);ghChest=qChest(ghChest);
// The motif on the ground and the collected photo share the exact same cached image.
const qFotoScene=fotoScene;
fotoScene=function(key){const cacheKey=(S.world?.seed||0)+':'+key;if(qPhotoCache.has(cacheKey))return qPhotoCache.get(cacheKey).src;if(qPhotoBusy)return null;
 const saved=fctx.getImageData(0,0,1280,720),meta=[fLastItem,fLastAnimal,fLastFocus,G.mark,G.animScr],record=dRecording,rec=hRecording;
 qPhotoBusy=true;let src;
 try{src=(typeof uFotoScene==='function'&&uFotoHandles(key))?uFotoScene(key):qFotoScene(key);}finally{qPhotoBusy=false;dRecording=record;hRecording=rec;fctx.putImageData(saved,0,0);[fLastItem,fLastAnimal,fLastFocus,G.mark,G.animScr]=meta;}
 const image=new Image();qPhotoCache.set(cacheKey,image);image.onload=()=>{if(G&&!qPhotoBusy)renderScene();};image.src=src;return src;
};
function qPhoto(key,x,y,s,ctx){const w=29*s,h=19*s;ctx.save();ctx.translate(x,y-h*.48);ctx.rotate(-.09);ctx.fillStyle='#e6ddc6';ctx.fillRect(-w/2,-h/2,w,h);
 const cacheKey=(S.world?.seed||0)+':'+key;if(G&&!qPhotoBusy&&!qPhotoCache.has(cacheKey))fotoScene(key);const im=qPhotoCache.get(cacheKey);
 if(im?.complete&&im.naturalWidth)ctx.drawImage(im,-w/2+1,-h/2+1,w-2,h-2);else{ctx.fillStyle='#8e9279';ctx.fillRect(-w/2+1,-h/2+1,w-2,h-2);}
 ctx.strokeStyle='#fff7de88';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(2,-h/2);ctx.lineTo(-1,h/2);ctx.stroke();ctx.restore();return {x:x-w/2,y:y-h,w,h};}
const qFItem=fItem;
fItem=function(key,x,y,s=1,ctx=fctx){if(!key.startsWith('foto_'))return qFItem(...arguments);const box=qPhoto(key,x,y,s,ctx);if(ctx===fctx)fLastItem={key,...box,cx:x,base:y};return box;};
const qHDrawItem=hDrawItem;
hDrawItem=function(key,x,y,ctx=fctx){if(key.startsWith('foto_'))return qPhoto(key,x,y,1,ctx);return qHDrawItem(...arguments);};
function qCard(g,x,y,w,h){g.fillStyle='#15241def';g.strokeStyle='#b8ac80';g.lineWidth=.6;g.beginPath();g.roundRect(x,y,w,h,5);g.fill();g.stroke();}
function qItemIcon(g,key,x,y,w=27){const icon=ICON[key]||ICON[key==='altmuenzen'?'muenzen':key];if(icon){const im=qIconCache[key]||(qIconCache[key]=Object.assign(new Image(),{src:icon}));if(im.complete&&im.naturalWidth)g.drawImage(im,x-w/2,y-w*.7,w,w*.67);}else{g.fillStyle='#d6bf7e';g.beginPath();g.arc(x,y-8,5,0,7);g.fill();}}
const qIconCache={};
function qDrawLoot(e,t){
 const page=Math.min(Math.ceil(e.loot.length/4)-1,Math.floor(t/1900)),list=e.loot.slice(page*4,page*4+4),x=29,y=37,w=262,h=110;
 qCard(vx,x,y,w,h);vx.textAlign='center';vx.fillStyle='#eee2bd';vx.font='bold 8px Georgia';vx.fillText(e.title||'In der Truhe gefunden',160,y+13);
 const width=248/list.length;
 list.forEach(([key,n],i)=>{const cx=x+7+width*(i+.5),rise=reduceMotion?0:Math.max(0,1-(t%1900)/250)*4;
  qItemIcon(vx,key,cx,y+59-rise,34);vx.fillStyle='#f4d991';vx.font='bold 10px Segoe UI';vx.fillText('×'+n,cx,y+70);
  vx.fillStyle='#dedac6';vx.font='5.2px Segoe UI';const label=key==='muenzen'?'Goldmünzen':key==='altmuenzen'?'Alte Münzen':ITEMS[key]?.name||key;
  const words=label.split(' ');if(label.length>17&&words.length>1){vx.fillText(words[0],cx,y+81);vx.fillText(words.slice(1).join(' '),cx,y+88);}else vx.fillText(label,cx,y+84);
 });vx.fillStyle='#bcbfa9';vx.font='5px Segoe UI';vx.fillText('Leertaste: weiter'+(e.loot.length>4?` · ${page+1}/${Math.ceil(e.loot.length/4)}`:''),160,y+101);
}
function qAnimalSprite(g,a,x,y,w,pose=0){if(pose===4){const atlas=F_ATLAS.waldtiere,r=atlas.bounds[3],h=w*r.h/r.w;g.drawImage(atlas.img,r.x,r.y,r.w,r.h*.83,x-w/2,y-h,w,h*.83);return;}if(pose===3)return fSprite('spechtflug',0,x,y,w,null,g);const sheet=pose&&F_ATLAS.begegnungen?'begegnungen':'waldtiere',index=sheet==='begegnungen'?pose-1:F_ANIMALS.indexOf(a);return fSprite(sheet,index,x,y,w,null,g);}
function qHand(g,x,y,scale=1){if(F_ATLAS.tierportraets)return fSprite('tierportraets',12,x,y,49*scale,null,g);g.save();g.translate(x,y);g.scale(scale,scale);g.fillStyle='#c4a17a';g.strokeStyle='#715941';g.lineWidth=.55;
 g.beginPath();g.moveTo(-1,16);g.lineTo(-4,5);g.quadraticCurveTo(-8,0,-6,-2);g.quadraticCurveTo(-5,-3,-2,1);g.lineTo(-3,-9);g.quadraticCurveTo(-2,-12,-.5,-9);g.lineTo(1,-3);g.lineTo(0,-12);g.quadraticCurveTo(1,-14,2,-11);g.lineTo(3,-3);g.lineTo(3,-11);g.quadraticCurveTo(5,-13,5,-9);g.lineTo(5,-2);g.lineTo(6,-8);g.quadraticCurveTo(8,-9,8,-6);g.lineTo(8,4);g.quadraticCurveTo(8,10,5,16);g.closePath();g.fill();g.stroke();g.fillStyle='#657663';g.fillRect(-2,13,9,9);g.restore();}
function qDrawAnimal(e,t){const b=e.box||{x:137,y:95,w:54,h:40},bird=['kauz','specht'].includes(e.a),base=b.y+b.h,cx=b.x+b.w/2;
 if(e.kind==='pet'&&t<1850){
  qCard(vx,60,16,200,147);vx.save();vx.beginPath();vx.roundRect(62,18,196,143,4);vx.clip();const order=['fuchs','reh','kauz','hoernchen','dachs','specht','schwein','blindschleiche','wolf','baer','hase','maus'];
  fSprite('tierportraets',order.indexOf(e.a),160,140,145,112,vx);
  const stroke=reduceMotion?0:Math.sin(t/270)*5,handY={reh:94,kauz:59,specht:88,hoernchen:85,fuchs:85,dachs:85,schwein:80,blindschleiche:103,wolf:85,baer:80,hase:100,maus:94}[e.a]||85;
  qHand(vx,(e.a==='kauz'?170:157)+stroke,handY,1.1);
  vx.restore();vx.fillStyle='#e7ddbd';vx.textAlign='center';vx.font='6px Georgia';vx.fillText(DEAD[e.a].sp+' · vorsichtig streicheln',160,151);return;
 }
 const wait=e.kind==='feed'?1500:1850,depart=Math.max(0,Math.min(1,(t-wait)/(e.duration-wait))),dx=-depart*230,dy=bird?-depart*105:0,bob=reduceMotion?0:depart?Math.sin(t/80)*1.3:Math.sin(t/170)*.35;
 vx.save();vx.beginPath();vx.rect(0,0,W,H);vx.clip();
 if(e.kind==='feed'&&t<wait){
  const foodY=bird?b.y+b.h*.30:base,foodX=bird?cx-b.w*.22:cx-b.w*.3;for(let i=0;i<Math.max(1,6-Math.floor(t/240));i++){vx.fillStyle=i%2?'#ad8959':'#d1b379';vx.beginPath();vx.ellipse(foodX+(i%3)*1.3,foodY+.4+Math.floor(i/3)*.5,.7,.4,0,0,7);vx.fill();}
  qAnimalSprite(vx,e.a,cx,base+bob,b.w,e.a==='reh'?1:0);
 }else{vx.save();vx.translate(cx+dx,base+dy+bob);if(bird&&!reduceMotion)vx.scale(1,1+Math.sin(t/75)*.09);else if(!reduceMotion)vx.rotate(Math.sin(t/95)*.015);qAnimalSprite(vx,e.a,0,0,b.w,e.a==='kauz'?2:e.a==='specht'?3:e.a==='hoernchen'?4:0);vx.restore();}
 vx.restore();
}
const qDraw=draw;
draw=function(now){qDraw(now);const e=qEffect;if(!e)return;if(G!==e.game||G.phase!=='explore'||e.pos!==JSON.stringify(G.pos)||trans){qFinish();return;}
 const dt=Math.min(100,Math.max(0,now-e.last));e.last=now;if(!$('#ov-goal').hidden||!$('#ov-done').hidden)return;if(!paused)e.elapsed+=dt;
 const duration=reduceMotion?Math.min(e.duration,2000):e.duration;
 if(e.elapsed>=duration){qFinish();return;}
 vx.save();vx.imageSmoothingEnabled=true;if(e.kind==='loot')qDrawLoot(e,e.elapsed);else qDrawAnimal(e,reduceMotion?(e.kind==='pet'?800:900):e.elapsed);vx.restore();
};
forestReady.then(()=>{window.forestArt.version='4.7 Waldatelier 12 – Begegnungen und Ruinenpfad';});

const qTakePhoto=takePhoto;takePhoto=function(){const herd=qHerdHere(),result=qTakePhoto();if(herd)setCaption(['Klick! Die Rehe an der Futterkrippe sind im Feldtagebuch.','Sie bleiben ruhig stehen. H: füttern. S: vorsichtig streicheln.'],true);return result;};
