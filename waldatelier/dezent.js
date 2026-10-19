/* Restrained 2D edition: original 4.7 scene geometry, no panorama compositing.
   Drawing is read-only. Cartography is recorded only by gameplay events. */
let dRecording=false;
const dLegacy={rect,ell,poly,thick,vgrad,rowPath,baseForest,sideTrees,sideFrame,forestPath,canopy,trunk,bush,groundSpeckle,drawObj,hut,drawSign,drawBird};
const dCSS=c=>Array.isArray(c)?`rgb(${c.map(v=>Math.round(v)).join(',')})`:c;
function dFill(c,a,fn){fctx.save();fctx.fillStyle=dCSS(c);if(a!=null)fctx.globalAlpha=a;fn();fctx.restore();}
rect=function(x,y,w,h,c,a){if(!dRecording)return dLegacy.rect(...arguments);if(h<=1.1&&w>20&&(y===107||y===128))return;dFill(c,a,()=>fctx.fillRect(x,y,w,h));};
ell=function(x,y,rx,ry,c,a){if(!dRecording)return dLegacy.ell(...arguments);if(rx>0&&ry>0)dFill(c,a,()=>fEllipse(x,y,rx,ry,dCSS(c)));};
poly=function(pts,c,a){if(!dRecording)return dLegacy.poly(...arguments);dFill(c,a,()=>{fctx.beginPath();pts.forEach((p,i)=>i?fctx.lineTo(...p):fctx.moveTo(...p));fctx.closePath();fctx.fill();});};
thick=function(x,y,xx,yy,w,c){if(!dRecording)return dLegacy.thick(...arguments);fLine([[x,y],[xx,yy]],dCSS(c),w);};
vgrad=function(y0,y1,c0,c1){if(!dRecording)return dLegacy.vgrad(...arguments);const g=fctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,dCSS(c0));g.addColorStop(1,dCSS(c1));fctx.fillStyle=g;fctx.fillRect(0,y0,W,y1-y0);};
function dShape(pts,fill,stroke='#293b30',width=.45){fctx.beginPath();pts.forEach((p,i)=>{if(!i)fctx.moveTo(...p);else if(p.length===4)fctx.quadraticCurveTo(...p);else if(p.length===6)fctx.bezierCurveTo(...p);else fctx.lineTo(...p);});fctx.closePath();fctx.fillStyle=fill;fctx.fill();if(stroke){fctx.strokeStyle=stroke;fctx.lineWidth=width;fctx.stroke();}}
function dLeaf(x,y,len,a,col){fctx.save();fctx.translate(x,y);fctx.rotate(a);dShape([[0,0],[len*.25,-len*.25,len,0],[len*.28,len*.25,0,0]],col,null);fctx.restore();}
/* All forest geometry still comes from 4.7. Only appearance is replaced.
   The generated base contains no roads, animals, signs, or interactive markers. */
const D_SCENES={sceneDead,sceneSecret,sceneHutInside,sceneClearing,sceneBach,drawLogGap};
const D_AUDIT={objects:new Set(),sides:new Set(),blocks:new Set(),places:new Set(),signs:[],scenes:new Set()};
function dScene(sheet,index){const a=F_ATLAS[sheet],[cols,rows]=F_GRID[sheet],w=a.img.width/cols,h=a.img.height/rows;fctx.drawImage(a.img,(index%cols)*w,Math.floor(index/cols)*h,w,h,0,0,W,H);D_AUDIT.scenes.add(sheet+':'+index);}
function dBackdrop(){dScene('grundwald',0);}
function fPlate(){dBackdrop();}
baseForest=function(r){if(!dRecording)return dLegacy.baseForest(r);dBackdrop();};
canopy=function(){if(!dRecording)return dLegacy.canopy(...arguments);};
groundSpeckle=function(){if(!dRecording)return dLegacy.groundSpeckle(...arguments);};
sideTrees=function(){if(!dRecording)return dLegacy.sideTrees(...arguments);};
sideFrame=function(){if(!dRecording)return dLegacy.sideFrame(...arguments);};
// Decorative trunks are already painted in the common setting. Location trees use dTree.
trunk=function(){if(!dRecording)return dLegacy.trunk(...arguments);};
bush=function(x,y,s,r){if(!dRecording)return dLegacy.bush(...arguments);fSprite('waldflora',8,x,y,s*2.4);};
let dSoilPattern=null,dLastRoad=null;
function dSoil(){if(!dSoilPattern){const a=F_ATLAS.wegmaterial;dSoilPattern=fctx.createPattern(a.img,'repeat');dSoilPattern.setTransform(new DOMMatrix().scale(W/a.img.width,H/a.img.height));}return dSoilPattern;}
rowPath=function(cx,hw,y,c,r){if(!dRecording)return dLegacy.rowPath(...arguments);const last=dLastRoad;fctx.fillStyle=dSoil();fctx.beginPath();fctx.moveTo(cx-hw,y);fctx.lineTo(cx+hw,y);if(last&&last.y===y+1){fctx.lineTo(last.cx+last.hw,y+1.03);fctx.lineTo(last.cx-last.hw,y+1.03);}else{fctx.lineTo(cx+hw,y+1.03);fctx.lineTo(cx-hw,y+1.03);}fctx.closePath();fctx.fill();dLastRoad={cx,hw,y};};
function dTreeSprite(i,x,y,height){return fSprite('waldflora',i,x,y,null,height);}
function dTree(key,x,y,s){
 if(key==='tannen'){dTreeSprite(3,x-11*s,y,48*s);dTreeSprite(3,x+8*s,y,63*s);return;}
 if(key==='totbaum'||key==='spalt'){fSprite('baeume',key==='totbaum'?6:7,x,y,null,215*s);return;}
 const idx={eiche:0,buche:1,birke:2,birken2:2,kiefer:4,weide:5,efeu:0,baum:1}[key]??1,near=y>145&&s>.65,height=(key==='weide'?350:near?330:235)*s;
 dTreeSprite(idx,x,y,height);if(key==='birken2')dTreeSprite(2,x+20*s,y-1,height*.91);
 if(key==='buche'&&s>.4)fLine([[x-3*s,y-43*s],[x-6*s,y-49*s,x,y-46*s],[x+5*s,y-51*s,x+6*s,y-46*s],[x,y-39*s],[x-3*s,y-43*s]],'#665a42',.65*s);
 if(key==='efeu')for(let i=0;i<24;i++)dLeaf(x+Math.sin(i*.7)*5*s,y-5*s-i*4*s,3*s,i*.8,'#65793c');
}
function dObject(key,x,y,s=1){
 if(!key)return;D_AUDIT.objects.add(key);
 if(key==='schild'){const n=curNode();if(n)drawSign(x,y,[['hut',relDir(dirTo('HUT',n),G.pos.h)],['fire',relDir(dirTo('GOAL',n),G.pos.h)]]);return;}
 if(key==='baum'){fSprite('requisiten',15,x,y,45*s);return;}
 if(key==='huette'){const near=s>.6;fSprite('requisiten',11,near?(x<160?-12:332):x,y,near?245:135*s);return;}
 if(key in F_TREE||key==='tannen'){dTree(key,x,y,s);return;}
 if(key==='busch'){fSprite('waldflora',8,x,y,32*s);return;}
 if(key==='farnk'){fSprite('waldflora',6,x,y,24*s);return;}
 const a=F_OBJECT[key];if(!a)throw Error('Missing forest object: '+key);fShadow(x,y,a[2]*s*.65);fSprite(a[0],a[1],x,y,a[2]*s);
}
drawObj=function(key,x,y,s,r){if(!dRecording)return dLegacy.drawObj(...arguments);dObject(key,x,y,s);};
hut=function(x,y,s,open){if(!dRecording)return dLegacy.hut(...arguments);fSprite('requisiten',11,x,y,100*s);};
// Cover every side-object renderer, including the former pixel log and fern functions.
const D_SIDE={huette:['requisiten',11,130],hochsitz:['wegmarker',5,48],holz:['wegmarker',7,49],felsen:['wegmarker',0,43],stamm:['requisiten',6,65],buesche:['waldflora',8,47],farn:['waldflora',6,42]};
for(const [key,obj]of Object.entries(SIDE)){const old=obj.draw;obj.draw=function(x,y,r){if(!dRecording)return old(...arguments);D_AUDIT.sides.add(key);const [sheet,i,w]=D_SIDE[key];fSprite(sheet,i,x,y,w);};}
for(const [key,obj]of Object.entries(BLOCK)){const old=obj;BLOCK[key]=function(r){if(!dRecording)return old(r);D_AUDIT.blocks.add(key);const [sheet,i,w]={dickicht:['requisiten',5,220],baumstamm:['requisiten',6,225],geroell:['requisiten',7,225],felsen:['wegmarker',14,185]}[key];fSprite(sheet,i,160,132,w);};}
for(const [key,obj]of Object.entries(HIND)){const old=obj.draw;obj.draw=function(r){if(!dRecording)return old(r);D_AUDIT.blocks.add('hind:'+key);fSprite(key==='baum'?'requisiten':'wegmarker',key==='baum'?6:14,160,134,key==='baum'?265:185);};}
for(const [key,obj]of Object.entries(ORTE)){const old=obj.draw;obj.draw=function(r){if(!dRecording)return old(r);D_AUDIT.places.add(key);if(key==='hecke')fSprite('requisiten',10,160,137,220);else dScene('orte5b',key==='felsen'?2:3);};}
drawLogGap=function(){if(!dRecording)return D_SCENES.drawLogGap(...arguments);fSprite('requisiten',6,160,128,225);};
function dSignIcon(icon,x,y){const ink='#453f28';if(icon==='hut'){dShape([[x-5,y],[x,y-4],[x+5,y],[x+4,y+4],[x-4,y+4]],'#71633e',ink,.45);fLine([[x-6,y],[x,y-5],[x+6,y]],ink,.65);fLine([[x,y+4],[x,y+1]],ink,1.3);}else{fLine([[x-5,y+4],[x+5,y+3]],ink,1);fLine([[x-4,y+3],[x+4,y+4]],ink,.8);dShape([[x-3,y+2],[x-3,y-1,x,y-5],[x,y-1,x+3,y+2],[x+1,y+3,x-3,y+2]],'#b7833e',ink,.4);}}
drawSign=function(x,y,boards){if(!dRecording)return dLegacy.drawSign(...arguments);D_AUDIT.signs.push({node:G.pos.n,heading:G.pos.h,x,y,boards:boards.map(a=>a.slice())});fShadow(x,y,18);dShape([[x-1.9,y],[x-1.3,y-47],[x+1.5,y-48],[x+2.3,y]],'#82704b','#514b32',.5);fLine([[x-.5,y-45],[x+.2,y-2]],'#b49a69',.4);
 boards.forEach(([icon,dir],i)=>{const yy=y-40+i*15,cx=x+(dir==='L'?-8:dir==='R'?8:0);const pts=dir==='L'?[[cx-23,yy],[cx-17,yy-6.5],[cx+18,yy-6],[cx+18,yy+6],[cx-17,yy+6]]:dir==='R'?[[cx+23,yy],[cx+17,yy-6.5],[cx-18,yy-6],[cx-18,yy+6],[cx+17,yy+6]]:[[cx-20,yy-6],[cx+20,yy-6.5],[cx+20,yy+6],[cx-20,yy+6.3]];dShape(pts,'#a18b5f','#544d35',.55);for(let j=0;j<4;j++)fLine([[cx-15,yy-4+j*2.6],[cx-3,yy-4.3+j*2.6,cx+15,yy-4+j*2.6]],j%2?'#6f60433b':'#d6ba8366',.25);fEllipse(x,yy-3.5,.55,.55,'#554b33');
 const ix=cx+(dir==='L'?4:dir==='R'?-4:-7);dSignIcon(icon,ix,yy-.2);const ax=cx+(dir==='L'?-14:dir==='R'?14:11),dx=dir==='L'?-1:dir==='R'?1:0,dy=dir==='F'?-1:dir==='B'?1:0;fLine([[ax-dx*3,yy-dy*3],[ax+dx*3,yy+dy*3]],'#443b28',.9);fLine([[ax+dx*3-dx*2.4-dy*2.2,yy+dy*3-dy*2.4+dx*2.2],[ax+dx*3,yy+dy*3],[ax+dx*3-dx*2.4+dy*2.2,yy+dy*3-dy*2.4-dx*2.2]],'#443b28',.9);
 });};
// Connected, softly curved ground contours retain the four cardinal game directions.
const dSceneNodeOriginal=sceneNode;
function dGrassEdge(x,y,s=1){for(let i=0;i<4;i++){const dx=(i-1.5)*.8*s;fLine([[x+dx,y],[x+dx+(i-1.5)*.5*s,y-(1.3+(i%3)*.6)*s]],i%2?'#7d833e':'#616b36',.23*s);}}
function dPaintRoad(p){fctx.fillStyle=dSoil();fctx.fill(p);fctx.strokeStyle='#8c794650';fctx.lineWidth=.4;fctx.stroke(p);}
forestPath=function(r,horizonBush=true){if(!dRecording)return dLegacy.forestPath(...arguments);
 dBackdrop();const p=new Path2D();p.moveTo(86,H);p.bezierCurveTo(111,147,139,107,154,HOR+3);p.lineTo(166,HOR+3);p.bezierCurveTo(181,107,209,147,234,H);p.closePath();dPaintRoad(p);
 for(const y of [106,119,137,159,176]){const hw=pathHW(y);dGrassEdge(160-hw-.6,y,.4+(y-HOR)/110);dGrassEdge(160+hw+.7,y,.4+(y-HOR)/110);}
};
sceneNode=function(n,h,r){if(!dRecording||nodeMoves(n,h).f==null&&nodeMoves(n,h).j==null)return dSceneNodeOriginal(n,h,r);dBackdrop();const L=passable(n,dL(h)),R=passable(n,dR(h)),F=passable(n,h),p=new Path2D();
 p.moveTo(86,H);p.bezierCurveTo(100,159,110,142,117,134);
 if(L){p.quadraticCurveTo(122,127,111,127);p.lineTo(0,127);p.lineTo(0,108);p.quadraticCurveTo(42,106.8,78,108);p.quadraticCurveTo(106,109,127,108);}else p.quadraticCurveTo(126,123,130,108);
 if(F){p.quadraticCurveTo(145,101,154,HOR+3);p.lineTo(166,HOR+3);p.quadraticCurveTo(175,101,190,108);}else p.lineTo(193,108);
 if(R){p.quadraticCurveTo(231,107,274,108);p.quadraticCurveTo(300,109,320,108);p.lineTo(320,127);p.lineTo(209,127);p.quadraticCurveTo(198,127,203,134);}else p.quadraticCurveTo(196,123,203,134);
 p.bezierCurveTo(210,142,220,159,234,H);p.closePath();dPaintRoad(p);
 for(const side of [-1,1]){for(const [x,y]of [[53,107],[88,108],[121,132],[111,145],[98,164]]){if(y<120&&!(side<0?L:R))continue;dGrassEdge(side<0?x:W-x,y,.75);}}
 if(!F)drawObj(n.wall[h]||'dickicht',160,JF-3,.8,objR(n,4+h));
 drawObj(n.corner[(h+3)%4],90,JF-2,.85,objR(n,(h+3)%4));drawObj(n.corner[h],230,JF-2,.85,objR(n,h));
 if(!L)drawObj(n.wall[dL(h)]||'dickicht',30,JN-4,.85,objR(n,4+dL(h)));
 if(!R)drawObj(n.wall[dR(h)]||'dickicht',290,JN-4,.85,objR(n,4+dR(h)));
 drawObj(n.corner[(h+2)%4],60,172,1.1,objR(n,(h+2)%4));drawObj(n.corner[(h+1)%4],260,172,1.1,objR(n,(h+1)%4));
 if(SIGN_AT.includes(n.id))drawSign(232,154,[['hut',relDir(dirTo('HUT',n),h)],['fire',relDir(dirTo('GOAL',n),h)]]);
 // The familiar branch tracks remain based on the original exploration flags.
 const walked=d=>n.exits[d]!=null&&G.w.edges[n.exits[d]].seen,fp=(x,y)=>{fEllipse(x-2,y,1.4,.65,'#6a5639');fEllipse(x+2,y-1,1.4,.65,'#6a5639');};
 if(L&&walked(dL(h)))for(const p of [[34,119],[65,117],[96,119]])fp(...p);
 if(R&&walked(dR(h)))for(const p of [[224,119],[255,117],[286,119]])fp(...p);
 if(F&&walked(h))for(const p of [[160,103],[160,97],[160,92]])fp(...p);
};
sceneHutInside=function(d,r){if(!dRecording)return D_SCENES.sceneHutInside(...arguments);dScene('orte5a',1);if(!d.got&&!S.inv.includes('karte'))fItem('karte',83,104,.7);const box=fSprite('requisiten',d.chest?13:12,225,155,64);if(!d.chest)fLastFocus={...box,cx:225,base:155};};
function dRuin(d){
 if(d.open){if(!d.got)fItem('seite',160,137,.6);return;}
 fLastFocus={cx:160,y:81,base:110};for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,x=160+Math.cos(a)*12,y=105+Math.sin(a)*12;fEllipse(x,y,4,4,'#514c36');fLine([[x-2.7,y-2],[x,y-3.6,x+2.8,y-2]],'#c8b891',.4);if(i<(d.shells||0))fSprite('gegenstaende',15,x,y+3.1,6.6);}
}
function dGrave(d){
 const x=160,y=99;
 if(!d.moss){if(!needsBlocked())fLastFocus={cx:160,y:61,base:125,keyHint:'U'};}
 else{fctx.save();fctx.fillStyle='#53503a';fctx.font='5.1px Georgia';fctx.textAlign='center';fctx.fillText('BRUNO',x,y-8);fctx.font='2.8px Georgia';fctx.fillText('DER TREUE HUND',x,y+1);fctx.fillText('DES FÖRSTERS',x,y+7);fctx.restore();if(!d.got)fItem('seite',160,151,.6);}
}
sceneSecret=function(d,r){if(!dRecording)return D_SCENES.sceneSecret(...arguments);if(d.secret==='see'){dScene('orte5a',2);const box=fSprite('requisiten',d.chest?13:12,51,158,51);if(!d.chest)fLastFocus={...box,cx:51,base:158};}else if(d.secret==='ruine'){dScene(d.open?'zustaende5':'orte5b',d.open?1:0);dRuin(d);}else{dScene(d.moss?'orte5a':'zustaende5',d.moss?3:0);dGrave(d);}};
sceneDead=function(d,r){if(!dRecording)return D_SCENES.sceneDead(...arguments);
 if(d.t==='hut'){if(d.open)sceneHutInside(d,r);else {dScene('orte5a',0);fLastFocus={cx:220,y:104,base:113};}return;}
 if(d.secret&&d.revealed){sceneSecret(d,r);return;}
 if(d.t==='ort'&&d.ort!=='hecke'){D_AUDIT.places.add(d.ort);dScene('orte5b',d.ort==='felsen'?2:3);return;}
 baseForest(r);if(d.t==='block')pathFar(r);else pathDead(r);
 if(d.t==='block')HIND[d.hind].draw(r);else if(d.t==='ort')ORTE[d.ort].draw(r);else if(BLOCK[d.block])BLOCK[d.block](r);
 const k='d:'+d.uid,a=animalAt(k),it=S.world.items[k];if(a)ANIMALS[a](r);if(it)ITEM_DRAW[it](122,140);
};
sceneClearing=function(r){if(!dRecording)return D_SCENES.sceneClearing(...arguments);dScene('zustaende5',S.world.stage==='night'||G.restT?3:2);};
sceneBach=function(r){if(!dRecording)return D_SCENES.sceneBach(...arguments);forestPath(r);const p=new Path2D();p.moveTo(0,105);p.bezierCurveTo(80,101,220,108,320,104);p.lineTo(320,123);p.bezierCurveTo(220,128,80,121,0,126);p.closePath();fctx.save();fctx.clip(p);const a=F_ATLAS.orte5a.img;fctx.drawImage(a,a.width*.15,a.height*.78,a.width*.31,a.height*.1,0,104,W,24);fctx.restore();for(const [x,y,w]of [[18,127,44],[300,126,39]])fSprite('wegmarker',0,x,y,w);};
function dRender(){if(!fActive())return;dRecording=true;dLastRoad=null;fLastAnimal=null;fLastItem=null;fLastFocus=null;D_AUDIT.signs=[];try{fOriginalRender();dReadableTracks();}finally{dRecording=false;}}
renderScene=function(){if(fActive()&&!['jr','lantern'].includes(G.phase))dRender();else fOriginalRender();};
function fPaintForest(){return dRender();}
const dLegacyLantern=renderLanternScene;
renderLanternScene=function(){
 dLegacyLantern();if(!fReady)return;
 // Same clearing, now genuinely extinguished; later steps keep one stable forest.
 dRecording=true;try{if(G.lan.step===0)dScene('zustaende5',2);else forestPath(mulberry(82));}finally{dRecording=false;}
 fctx.fillStyle='#102330b3';fctx.fillRect(0,0,W,H);
 const step=G.lan.step,x=160+Math.sin(step*.7)*5,y=step===0?87:83-step;
 nGlow(x,y-7,58,.48);fLantern(x,y,.82+step*.025);
};
forestReady.then(()=>{window.forestArt.version='4.7 Waldatelier 9 – Steiler Felshang auf Waldboden';window.forestArt.biomes=['Zusammenhängender Wald'];});
// The approved specimens and collectable objects retain their exact motifs.
for(const key of F_ANIMALS){const old=ANIMALS[key];ANIMALS[key]=function(r){if(!dRecording)return old(r);dAnimal(key);};}
function dAnimal(key,guide=false,at=null){const i=F_ANIMALS.indexOf(key);if(i<0)return;const widths={fuchs:51,reh:58,kauz:24,hoernchen:26,salamander:26,dachs:49,specht:23,schwein:58,blindschleiche:29,wolf:61,baer:72,hase:26,maus:16};let x=164,y=128,w=widths[key];if(key==='kauz'){x=184;y=64;if(!guide){dTreeSprite(0,223,126,220);fLine([[211,68],[187,65],[168,65]],'#6c6b4f',2);}}if(key==='specht'){x=181;y=82;if(!guide)dTreeSprite(2,190,132,230);}if(key==='dachs'&&!guide){fSprite('requisiten',0,187,136,70);x=160;}if(at){[x,y]=at;w*=at[2];}fShadow(x,y,w*.7);const b=fSprite('waldtiere',i,x,y,w);if(!guide)fLastAnimal={key,...b};}
for(const key of Object.keys(ITEM_DRAW)){const old=ITEM_DRAW[key];if(F_ITEMS.includes(key)||key.startsWith('foto_')||key==='laterne')ITEM_DRAW[key]=function(x,y){if(dRecording)return fItem(key,x,y);return old(...arguments);};}
drawBird=function(key,x,y,s){if(dRecording)return dAnimal(key,true,[x,y,s*.65]);return dLegacy.drawBird(...arguments);};
// Existing album photographs use the same illustration style, without scene-state changes.
fotoScene=function(k){if(!fReady||!['foto_huette','foto_reh'].includes(k))return fOldFoto(k);const saved=fctx.getImageData(0,0,1280,720),last=fLastItem,animal=fLastAnimal,focus=fLastFocus;try{dRecording=true;if(k==='foto_huette')sceneDead({t:'hut',open:false,uid:0},mulberry(4711));else{sceneBach(mulberry(4712));dAnimal('reh');}const c=document.createElement('canvas');c.width=704;c.height=424;const ctx=c.getContext('2d');ctx.fillStyle='#e5dac0';ctx.fillRect(0,0,704,424);ctx.filter='sepia(.25) saturate(.7)';ctx.drawImage(F_CANVAS,32,32,640,360);return c.toDataURL('image/webp',.9);}finally{dRecording=false;fctx.putImageData(saved,0,0);fLastItem=last;fLastAnimal=animal;fLastFocus=focus;}};

/* A separate, persistent pen trace begins when the map is picked up.
   The old `seen` flags still provide footprints; drawing never changes either. */
function dMapPosition(){if(!G||!G.w||G.cave||inDesert()||G.city||G.ex)return null;return {...fPosition(),edge:G.pos.e==null?null:G.w.edges[G.pos.e].uid,node:G.pos.e==null?G.pos.n:null};}
function dEnsureChart(){if(!S.world||!S.inv.includes('karte')||!dMapPosition())return null;if(!S.world.cartography||S.world.cartography.version!==3)S.world.cartography={version:3,segments:[],nodes:[],last:dMapPosition()};return S.world.cartography;}
function dRecordChart(){const c=dEnsureChart(),p=dMapPosition();if(!c||!p)return;const a=c.last;if(a&&Math.hypot(p.x-a.x,p.y-a.y)>0){const e=G.w.edges.find(e=>e.uid===p.edge||e.uid===a.edge||(p.node&&a.node&&[e.a,e.b].includes(p.node)&&[e.a,e.b].includes(a.node)));const connected=e&&[e.a,e.b].includes(p.node||a.node)||(p.edge!=null&&p.edge===a.edge);if(connected){const sig=[a.x,a.y,p.x,p.y].join(':');const rev=[p.x,p.y,a.x,a.y].join(':');if(!c.segments.some(s=>s.join(':')===sig||s.join(':')===rev))c.segments.push([a.x,a.y,p.x,p.y]);}if(p.node&&!c.nodes.includes(p.node))c.nodes.push(p.node);}c.last=p;}
const dOldPick=pick;pick=function(){const isMap=itemHere()==='karte'&&!S.inv.includes('karte');if(isMap&&!atCap('karte'))S.world.cartography={version:3,segments:[],nodes:[],last:dMapPosition()};return dOldPick(...arguments);};
const dOldArrive=arrive;arrive=function(){dRecordChart();return dOldArrive(...arguments);};
const dOldStoryInit=storyInit;storyInit=function(){const r=dOldStoryInit(...arguments);dEnsureChart();return r;};
// Preserve the original bird helpers: their discoveries are independent of walking traces.
let dMapAudit={secrets:[],items:[]};
function dMapSymbols(c,X,Y,chart){
 dMapAudit={secrets:[],items:[]};const known=new Set(chart?.nodes||[]);
 if(S.world.markSecrets)for(const n of Object.values(G.w.N))if(n.secret){known.add(n.id);dMapAudit.secrets.push(n.id);}
 for(const id of known){const n=G.w.N[id];if(!n)continue;const x=X(n.x),y=Y(n.y);c.strokeStyle='#626951';c.fillStyle='#626951';c.lineWidth=.65;
  if(n.t==='hut'){c.strokeRect(x-2.5,y-1.5,5,3.5);c.beginPath();c.moveTo(x-3.4,y-1.5);c.lineTo(x,y-4);c.lineTo(x+3.4,y-1.5);c.stroke();}
  else if(n.t==='goal'){c.beginPath();c.ellipse(x,y,3.5,1.8,0,0,7);c.stroke();c.fillStyle='#b17c40';c.beginPath();c.moveTo(x-1.8,y);c.lineTo(x,y-4);c.lineTo(x+1.8,y);c.closePath();c.fill();}
  else if(n.t==='bach'||n.secret==='see'){c.strokeStyle='#5a8583';c.beginPath();c.moveTo(x-3.5,y);c.bezierCurveTo(x-1,y-2,x+1,y+2,x+3.5,y);c.stroke();}
  else if(n.secret==='ruine'){c.strokeRect(x-3,y-3,6,5);c.strokeRect(x-1,y-1,2,3);}
  else if(n.secret==='friedhof'){c.beginPath();c.moveTo(x,y-4);c.lineTo(x,y+2);c.moveTo(x-2,y-2);c.lineTo(x+2,y-2);c.stroke();}
 }
 if(S.world.itemsDay===curDay())for(const key of Object.keys(S.world.items||{})){const [,uid,k]=key.split(':'),e=G.w.nodes[uid];if(!e||e.hidden||!e.a)continue;const a=G.w.N[e.a],b=G.w.N[e.b],t=Number(k)/e.n;c.fillStyle='#bb963b';c.beginPath();c.arc(X(a.x+(b.x-a.x)*t),Y(a.y+(b.y-a.y)*t),1.1,0,7);c.fill();dMapAudit.items.push(key);}
}
const dPreviousMap=drawMap;drawMap=function(){if(!fActive()||!S.inv.includes('karte'))return dPreviousMap();const box=$('#mapbox'),cv=$('#map');box.classList.add('has');$('#map-note').textContent='Die Karte zeichnet deinen Weg ab dem Fund auf.';const ww=9*MC+2*MM,hh=10*MC+2*MM;cv.width=ww*3;cv.height=hh*3;const c=cv.getContext('2d');c.scale(3,3);c.fillStyle='#ddd6b8';c.fillRect(0,0,ww,hh);c.strokeStyle='#a29d7d';c.lineWidth=.5;c.strokeRect(.8,.8,ww-1.6,hh-1.6);const X=x=>MM+(x+1)*MC,Y=y=>hh-MM-y*MC,chart=S.world.cartography;
 if(chart?.version===3){c.strokeStyle='#626951';c.lineWidth=1.1;c.lineCap='round';c.beginPath();for(const [x,y,xx,yy]of chart.segments){c.moveTo(X(x),Y(y));c.lineTo(X(xx),Y(yy));}c.stroke();for(const id of chart.nodes){const n=G.w.N[id];if(!n)continue;c.fillStyle='#626951';c.beginPath();c.arc(X(n.x),Y(n.y),1.2,0,7);c.fill();}}
 dMapSymbols(c,X,Y,chart);const p=dMapPosition();if(p){c.save();c.translate(X(p.x),Y(p.y));c.rotate(G.pos.h*Math.PI/2);c.beginPath();c.moveTo(0,-3.5);c.lineTo(2.5,2.5);c.lineTo(0,1);c.lineTo(-2.5,2.5);c.closePath();c.fillStyle='#aa604c';c.fill();c.restore();}cv.style.imageRendering='auto';};
// Clearer, illustrated puzzle frame; identical ten pieces and keyboard controls.
const dOriginalRenderLock=renderLock;
renderLock=function(){dOriginalRenderLock();const el=$('#lock');el.dataset.kind=G.lock?.kind||'hut';el.dataset.title=el.dataset.kind==='ruine'?'WAPPENSCHLOSS':el.dataset.kind==='seite'?'DIE ZERRISSENE SEITE':'BILDSCHLOSS';el.setAttribute('aria-label','Bildschloss: Setze die zehn Teile zum Schlüssel zusammen.');};
// A few close, readable prints supplement the original distant prints.
// Only exposed earth receives them; foliage and markers remain in front.
function dReadableTracks(){if(!G||G.pos.e!=null||here().t!=='fork')return;const n=G.w.N[G.pos.n],h=G.pos.h;
 for(const [dir,points]of [[dL(h),[[144,126],[134,124],[124,122]]],[dR(h),[[176,126],[186,124],[196,122]]],[h,[[160,103],[160,97],[160,92]]]]){
  const ei=n.exits[dir];if(ei==null||!G.w.edges[ei].seen||!passable(n,dir))continue;
  for(const [x,y]of points){const p=fctx.getImageData(Math.round(x*4),Math.round(y*4),1,1).data;if(p[0]<p[1]*1.045||p[1]<p[2]*1.13)continue;fEllipse(x-1.8,y,1.45,.65,'#594c34');fEllipse(x+1.8,y-.9,1.45,.65,'#594c34');}
 }
}
// The actual puzzle controls retain their original masks and keyboard behavior.
// Their surfaces use the same illustrated wood, stone, and moss as their locations.
forestReady.then(()=>{
 const sample=(sheet,sx,sy,sw,sh)=>{const c=document.createElement('canvas');c.width=240;c.height=160;const g=c.getContext('2d');g.drawImage(F_ATLAS[sheet].img,sx,sy,sw,sh,0,0,240,160);return `url(${c.toDataURL('image/webp',.88)})`;};
 document.documentElement.style.setProperty('--wald-wood',sample('orte5a',1180,20,220,130));
 document.documentElement.style.setProperty('--wald-stone',sample('orte5a',1180,680,95,105));
 document.documentElement.style.setProperty('--wald-moss',sample('zustaende5',348,158,90,110));
});
// Fire emits light: paint its transparent flame above the original night shading.
// The lower stone ring remains part of the correctly lit location illustration.
function fDrawFire(){
 if(!fActive()||['lantern','jr'].includes(G.phase)||here().t!=='goal'||!(S.world.stage==='night'||G.restT))return;
 const a=F_ATLAS.requisiten,b=a.bounds[14],w=60,h=w*b.h/b.w,x=160,y=141;
 vx.save();vx.imageSmoothingEnabled=true;vx.drawImage(a.img,b.x,b.y,b.w,b.h*.66,x-w/2,y-h,w,h*.66);vx.restore();
}

// Keep chapters on separate spreads as discoveries add illustrated animal pages.
// The source already paginates by card height; only chapter boundaries need padding.
const nJournalPages=journalPages;
journalPages=function(){const source=nJournalPages(),pages=[];for(const page of source){
 if(page.cls==='empty'&&!page.html)continue;
 if(pages.length&&pages[pages.length-1].tab!==page.tab&&pages.length%2)
  pages.push({tab:pages[pages.length-1].tab,title:'',html:'',cls:'empty'});
 pages.push(page);
}if(pages.length%2)pages.push({tab:pages[pages.length-1].tab,title:'',html:'',cls:'empty'});return pages;};
