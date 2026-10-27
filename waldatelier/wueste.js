/* World 2, revision 14: all gameplay coordinates and save IDs stay authoritative. */
const U_ANIMALS=['fennek','dromedar','sandkatze','springmaus','mendes','flughuhn','dornteufel','skorpion','hornviper'];
const U_ITEMS=['datteln','kaktusfeigen','palmwedel','akazienzweig','stoff','zelt','sandrose','haizahn','ammonit','trilobit','fulgurit','wuestenglas','meteorit','schatzkarte','kopfschutz','ticket','flaschenschiff','teekanne','tonschale','teppich','messinglaterne','altmuenzen'];
const U_OBJECTS={
 oscher:['wuestenflora',0,40],oscherK:['wuestenflora',0,22],koloquinten:['wuestenflora',1,47],koloqK:['wuestenflora',1,22],jericho:['wuestenflora',2,33],gras:['wuestenflora',3,38],grasbusch:['wuestenflora',3,19],blueten:['wuestenflora',4,46],
 tamariske:['wuestenflora',5,null,112],akazie:['wuestenflora',6,null,150],akazieK:['wuestenflora',6,29],palme:['wuestenflora',7,null,175],kaktus:['wuestenflora',8,49],kakt:['wuestenflora',9,25],dornbusch:['wuestenflora',10,45],busch:['wuestenflora',10,26],totholz:['wuestenflora',11,48],
 felsbogen:['wuestenmarker',0,102],felsbrocken:['wuestenmarker',1,74],felsplatte:['wuestenmarker',1,77],felsnadel:['wuestenmarker',2,null,125],zwillingsfelsen:['wuestenmarker',3,96],steinhaufen:['wuestenmarker',4,41],kamelskelett:['wuestenmarker',5,104],schaedel:['wuestenmarker',6,36],knochen:['wuestenmarker',7,40],kleinknochen:['wuestenmarker',7,17],brunnen:['wuestenmarker',8,73],sattel:['wuestenmarker',9,46],rad:['wuestenmarker',10,43],scherben:['wuestenmarker',11,39],stein:['wuestenmarker',1,18],steine:['wuestenmarker',4,25]
};
let uLastAnimal=null,uLastItem=null,uLastFocus=null,uDust=null,uLastT=0,uPhotoBusy=false;
const U_AUDIT={objects:new Set(),places:new Set(),animals:new Set(),scenes:new Set(),city:new Set()};
function uActive(){return fReady&&!!(G&&inDesert());}
function uPos(){return fPosition();}
function uMix(a,b,t){return a.map((v,i)=>Math.round(v+(b[i]-v)*Math.max(0,Math.min(1,t))));}
function uColor(c){return `rgb(${c.map(Math.round).join(',')})`;}
function uRect(ctx,x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h);}
function uPath(ctx,pts,fill,stroke=null,width=.4){ctx.beginPath();pts.forEach((p,i)=>{if(!i)ctx.moveTo(...p);else if(p.length===6)ctx.bezierCurveTo(...p);else if(p.length===4)ctx.quadraticCurveTo(...p);else ctx.lineTo(...p);});ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function uLine(ctx,pts,c,w=.4){ctx.beginPath();pts.forEach((p,i)=>{if(!i)ctx.moveTo(...p);else if(p.length===4)ctx.quadraticCurveTo(...p);else ctx.lineTo(...p);});ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke();}
function uEllipse(ctx,x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
function uTexture(index,x,y,w,h,ctx=fctx){const a=F_ATLAS.wuestenmaterial,r=a.bounds[index];ctx.drawImage(a.img,r.x,r.y,r.w,r.h,x,y,w,h);}
function uDuneScene(index,alpha=1){const a=F_ATLAS.duenen,r=a.bounds[index];fctx.save();fctx.globalAlpha=alpha;fctx.drawImage(a.img,r.x+1,r.y+1,r.w-2,r.h-2,0,0,W,H);fctx.restore();}
function uScene(index){if(index===3||index===4){uDuneScene(index-1);U_AUDIT.scenes.add(index);return;}const a=F_ATLAS.wuestenorte,r=a.bounds[index];fctx.drawImage(a.img,r.x,r.y,r.w,r.h,0,0,W,H);U_AUDIT.scenes.add(index);}
function uTerrain(){
 // The same dunes continue across adjacent steps. Their relief gradually lowers towards the south.
 const p=uPos(),open=Math.max(0,Math.min(1,(p.y-2.2)/2.7)),k=1-open*.35,a=F_ATLAS.duenen,r=a.bounds[0],sx=r.x+1,sy=r.y+1,sw=r.w-2,sh=r.h-2,split=sh*103/H,top=103*(1-k);
 if(top>0)fctx.drawImage(a.img,sx,sy,sw,1,0,0,W,top+.1);
 fctx.drawImage(a.img,sx,sy,sw,split,0,top,W,103*k);fctx.drawImage(a.img,sx,sy+split,sw,sh-split,0,103,W,H-103);
}
function uRoadWidth(y){return Math.max(.5,62*(y-103)/(179-103));}
const uRoadMask=document.createElement('canvas');uRoadMask.width=1280;uRoadMask.height=720;
function uSoil(path){
 // A feathered, slightly compacted sand ribbon. Preserve the basin's sand colour and wind ripples.
 const ctx=uRoadMask.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,1280,720);ctx.setTransform(4,0,0,4,0,0);const grad=ctx.createLinearGradient(0,103,0,H);grad.addColorStop(0,'#b79c7100');grad.addColorStop(.35,'#b79c714d');grad.addColorStop(1,'#b79c7180');ctx.fillStyle=grad;ctx.fill(path);
 fctx.save();fctx.globalCompositeOperation='multiply';fctx.filter='blur(12px)';fctx.drawImage(uRoadMask,0,0,W,H);fctx.restore();
 fctx.save();fctx.clip(path);const rnd=mulberry(149);for(let i=0;i<60;i++){const y=113+rnd()*66,x=rnd()*W,k=(y-103)/76;uLine(fctx,[[x,y],[x+2*k,y-.5*k,x+5*k,y]],i%3?'#f5d79a1a':'#8d70411a',.15+.20*k);}fctx.restore();
}
function uRoad(n=null,h=G.pos.h,z=ZJ){
 const yD=z=>103+(179-103)/z,yn=n?yD(z):139,yf=n?yD(z+DZOFF):125,L=!!n&&passable(n,dL(h)),R=!!n&&passable(n,dR(h)),F=!n||passable(n,h),nw=uRoadWidth(yn),fw=uRoadWidth(yf),p=new Path2D(),pos=uPos(),bend=Math.sin(pos.x*.38+pos.y*.31+h)*4;
 if(!n){p.moveTo(122+bend,H);p.bezierCurveTo(134+bend,164,129,151,143,139);p.bezierCurveTo(155,128,149,115,157,104);p.lineTo(163,104);p.bezierCurveTo(164,118,181,124,178,139);p.bezierCurveTo(179,153,202,164,198+bend,H);p.closePath();uSoil(p);return {path:p,yn,yf,L,R,F,n,h};}
 p.moveTo(120+bend,H);p.bezierCurveTo(125+bend,161,160-nw,yn+6,160-nw,yn);
 if(L){p.lineTo(0,yn);p.lineTo(0,yf);p.quadraticCurveTo(70,yf-1,160-fw,yf);}else p.lineTo(160-fw,yf);
 if(F){p.bezierCurveTo(160-fw,yf-(yf-104)*.4,157,104+(yf-104)*.3,157,104);p.lineTo(163,104);p.bezierCurveTo(163,104+(yf-104)*.3,160+fw,yf-(yf-104)*.4,160+fw,yf);}else p.lineTo(160+fw,yf);
 if(R){p.quadraticCurveTo(250,yf-1,320,yf);p.lineTo(320,yn);p.lineTo(160+nw,yn);}else p.lineTo(160+nw,yn);
 p.bezierCurveTo(160+nw,yn+6,195+bend,161,200+bend,H);p.closePath();uSoil(p);
 return {path:p,yn,yf,L,R,F,n,h};
}
function uShadow(x,y,w,h=3){const grad=fctx.createRadialGradient(x,y,.5,x,y,w*.6);grad.addColorStop(0,'#65573b77');grad.addColorStop(1,'#65573b00');uEllipse(fctx,x,y,w*.65,h,grad);}
function uObject(key,x,y,s=1){if(!key)return;U_AUDIT.objects.add(key);if(key==='flimmern'){for(let i=0;i<3;i++)uLine(fctx,[[x-9,y-i*3],[x,y-i*3-1,x+9,y-i*3]],'#d3b87880',.4);return;}
 if(key==='pfahl'){nPole(x,y,x+.6*s,y-37*s,1.7*s);uPath(fctx,[[x,y-35*s],[x+13*s,y-33*s],[x+10*s,y-24*s],[x,y-27*s]],'#a87556','#806242',.3);return;}
 const a=U_OBJECTS[key];if(!a)throw Error('Unmapped desert marker '+key);uShadow(x,y,(a[2]||30)*s*.65,3*s);fSprite(a[0],a[1],x,y,a[2]==null?null:a[2]*s,a[3]?a[3]*s:null);
}
function uVegetation(lvl,road){
 const p=uPos(),seed=fHash(`${G.seed}:flora:${Math.round(p.x*2)}:${Math.round(p.y*2)}:${G.pos.h}`),rnd=mulberry(seed),pool=p.x>9?['grasbusch','oscherK','koloqK','stein']:p.y>3.2?['grasbusch','busch','akazieK','steine']:['grasbusch','stein','kleinknochen'];
 const count=lvl>1?13:lvl?7:3;
 for(let i=0;i<count;i++){const y=104+(i/count)*72+Math.sin(i*7)*2,side=i%2?-1:1,hw=uRoadWidth(y),x=160+side*(hw+12+rnd()*(80-hw*.35)),s=.24+(y-100)/100;
  if(x<-10||x>330||road&&fctx.isPointInPath(road.path,x,y))continue;uObject(pool[Math.floor(rnd()*pool.length)],x,y,s);
 }
}
function uPrint(x,y,s=1){fctx.save();fctx.translate(x,y);fctx.rotate(-.08);uEllipse(fctx,-1.8*s,0,1.2*s,.55*s,'#8a623ccc');uEllipse(fctx,1.8*s,-1*s,1.2*s,.55*s,'#8a623ccc');fctx.restore();}
function uTracks(road){if(G.pos.e!=null){if(G.w.edges[G.pos.e].trail)for(let i=0;i<8;i++){const y=171-i*8;uPrint(160+(i%2?2:-2),y,.55+(y-110)/65);}return;}
 if(!road?.n)return;const {n,h,yn,yf}=road,walked=d=>n.exits[d]!=null&&G.w.edges[n.exits[d]].trail,mid=(yn+yf)/2;
 if(road.L&&walked(dL(h)))for(const x of [30,57,84,111])uPrint(x,mid,.65);
 if(road.R&&walked(dR(h)))for(const x of [209,236,263,290])uPrint(x,mid,.65);
 if(road.F&&walked(h))for(const y of [yf-4,yf-10,yf-16])uPrint(160,y,.4);
}
const uShadeMasks=new Map();
let uShadeAreas=[];
function uShadeMask(key){if(uShadeMasks.has(key))return uShadeMasks.get(key);const spec=U_OBJECTS[key],a=F_ATLAS[spec[0]],r=a.bounds[spec[1]],c=document.createElement('canvas');c.width=r.w;c.height=r.h;const g=c.getContext('2d');if(a.cells?.[spec[1]])g.drawImage(a.cells[spec[1]],0,0);else g.drawImage(a.img,r.x,r.y,r.w,r.h,0,0,r.w,r.h);g.globalCompositeOperation='source-in';g.fillStyle='#413f34';g.fillRect(0,0,r.w,r.h);uShadeMasks.set(key,c);return c;}
function uCastShade(key,x,y,w,h){const mask=uShadeMask(key),noon=Math.max(0,1-Math.abs(dTime()-13*60)/300),dx=.55-noon*.24,dy=.22-noon*.12;
 fctx.save();fctx.beginPath();fctx.rect(0,106,W,H-106);fctx.clip();fctx.globalAlpha=.58;fctx.transform(.93,.025,-dx,-dy,x-w*.465+h*dx,y-w*.0125+h*dy);fctx.drawImage(mask,0,0,w,h);fctx.restore();}
function uShelterPatch(x,y,rx=48,ry=13){const p=new Path2D();p.moveTo(x-rx,y-ry*.4);p.bezierCurveTo(x-rx*.9,y-ry*1.25,x-rx*.35,y-ry*.8,x,y-ry);p.bezierCurveTo(x+rx*.6,y-ry*1.1,x+rx*1.1,y-ry*.1,x+rx,y+ry*.3);p.bezierCurveTo(x+rx*.5,y+ry*.8,x-rx*.5,y+ry*1.2,x-rx,y-ry*.4);p.closePath();
 for(const [line,alpha]of [[4,.045],[2,.07],[0,.22]]){fctx.save();fctx.fillStyle='#42483e';fctx.strokeStyle='#42483e';fctx.globalAlpha=alpha;fctx.filter='blur(2px)';if(line){fctx.lineWidth=line;fctx.stroke(p);}else fctx.fill(p);fctx.restore();}uShadeAreas.push({x,y,rx,ry});}
function uRestShade(n,road){if(!shadeAt(n))return;const ci=[(G.pos.h+3)%4,G.pos.h,(G.pos.h+2)%4,(G.pos.h+1)%4].indexOf(n.c),side=ci%2?1:-1,near=ci>=2;uShelterPatch(160+side*33,near?163:149,52,near?12:10);}
function uCorners(n,h,road,near,z){const scale=1/z*1.9,far=road.yf,fw=uRoadWidth(far),nw=uRoadWidth(road.yn);
 for(const [i,x,y,sz]of [[(h+3)%4,160-fw-Math.max(8,fw*1.1),far-1,scale],[h,160+fw+Math.max(8,fw*1.1),far-1,scale],...(near?[[(h+2)%4,160-nw-36,road.yn+20,scale*1.25],[(h+1)%4,160+nw+36,road.yn+20,scale*1.25]]:[])]){
  const key=n.corner[i],s=sz*(key===n.lm?1.15:1);if(key&&DSHADE[key]){const a=U_OBJECTS[key],r=F_ATLAS[a[0]].bounds[a[1]],hh=a[3]?a[3]*s:a[2]*s*r.h/r.w,ww=hh*r.w/r.h;uCastShade(key,x,y,ww,hh);}
  uObject(key,x,y,s);
 }
}
function uApproach(n,dist){if(!n.place||dist>5)return;const s=1/(dist+.8),x=160,y=96+34*s;
 if(n.place==='oase'){uEllipse(fctx,x,y,33*s,5*s,'#8da9a0');uObject('palme',x-22*s,y,.42*s);uObject('palme',x+24*s,y,.5*s);}
 else if(n.place==='stadt')fSprite('hafenbauten',0,x,y,95*s);
 else if(n.place==='kakteen')for(let i=0;i<4;i++)uObject('kaktus',x+(i-1.5)*18*s,y,.6*s);
 else if(n.place==='wadi'){uObject('akazie',x-27*s,y,.45*s);uObject('akazie',x+27*s,y,.5*s);}
 else if(n.place==='geheim')uDuneApproach(n,dist);
 else if(n.place==='kfelsen')uObject('zwillingsfelsen',x,y,.8*s);
 else if(n.place==='zelthuette')fSprite('hafenbauten',6,x,y,75*s);
 else if(n.place==='ausgang'){uObject('felsbrocken',x-17*s,y,.5*s);uEllipse(fctx,x,y,12*s,3*s,'#6c5133');}
}
function uDuneApproach(n,dist){const t=Math.max(0,1-dist/6),base=114+15*t,peak=47-23*t,half=65+65*t;
 const whole=new Path2D();whole.moveTo(160-half,base);whole.bezierCurveTo(160-half*.6,base-10,151-half*.30,peak+5,151,peak);whole.bezierCurveTo(178,peak+13,160+half*.55,base-12,160+half,base);whole.closePath();const g=fctx.createLinearGradient(100,peak,235,base);g.addColorStop(0,'#e8bd73');g.addColorStop(.45,'#e2b065');g.addColorStop(1,'#b58e60');fctx.fillStyle=g;fctx.fill(whole);
 uPath(fctx,[[151,peak],[155,peak+12],[141,peak+30],[149,base-10],[160+half,base],[160+half*.55,base-12,178,peak+13,151,peak]],'#9f826332');
 for(let i=0;i<12;i++){const yy=base-3-i*3,ww=(base-yy)/(base-peak)*half*.5;uLine(fctx,[[151-ww,yy],[151,yy-2,158+ww*.7,yy-1]],'#f0d39444',.25);}
 if(n.revealed){uPath(fctx,[[151-13*t,base],[152-12*t,base-11*t],[160,base-15*t],[169+10*t,base-9*t],[170+12*t,base]],'#574b39');uObject('stein',148-11*t,base,.5+t*.2);uObject('stein',173+9*t,base,.5+t*.2);}
}
function uWater(x,y,w,h){const p=new Path2D();p.moveTo(x-w,y);p.bezierCurveTo(x-w*.6,y-h,x+w*.6,y-h,x+w,y);p.bezierCurveTo(x+w*.7,y+h*.7,x-w*.5,y+h,x-w,y);p.closePath();const g=fctx.createLinearGradient(0,y-h,0,y+h);g.addColorStop(0,'#62887f');g.addColorStop(.55,'#86a89c');g.addColorStop(1,'#c6c6a0');fctx.fillStyle=g;fctx.fill(p);for(let i=0;i<6;i++)uLine(fctx,[[x-w*.6+i*w*.18,y+(i%3-1)*h*.26],[x-w*.48+i*w*.18,y+(i%3-1)*h*.26]],'#d4e1c188',.35);}
function uMasonry(n){const done=n.cleared,progress=G.hack?.n||0;if(done){fSprite('requisiten',n.chest?13:12,163,153,61);for(let i=0;i<9;i++)uPath(fctx,[[115+i*10,155],[114+i*10,151-(i%3)],[121+i*10,151],[123+i*10,155]],i%2?'#b78f64':'#c4a273','#906f4b',.25);return;}
 const rows=Math.max(1,8-progress);for(let row=0;row<rows;row++){const yy=151-row*5,off=row%2?5:0;for(let j=0;j<9-(row>4?row-4:0);j++){const xx=112+j*10+off+(row>4?(row-4)*5:0);uPath(fctx,[[xx,yy],[xx+.8,yy-4.6],[xx+9.5,yy-4.4],[xx+9,yy]],row%2?'#be986d':'#c7a478','#967047',.35);uLine(fctx,[[xx+1,yy-4],[xx+8,yy-4.1]],'#dfc192',.25);}}
 if(n.examined){uPath(fctx,[[153,125],[155,116],[166,117],[169,126]],'#5a432e','#a58259',.6);if(progress)for(let i=0;i<progress;i++)uLine(fctx,[[129+i*8,127],[131+i*8,133],[128+i*8,141]],'#7b573b',.6);}
}
function uRoseGate(n){fctx.save();fctx.translate(160,148);fctx.scale(.90,.76);fctx.translate(-160,-148);if(!n.open){const at=F_ATLAS.wuestenmaterial,r=at.bounds[3],p=new Path2D();p.moveTo(125,147);p.lineTo(129,95);p.quadraticCurveTo(160,84,191,95);p.lineTo(196,147);p.closePath();fctx.save();fctx.clip(p);fctx.drawImage(at.img,r.x,r.y,r.w,r.h,124,87,73,62);uRect(fctx,124,87,73,62,'#bc9d6966');fctx.restore();fctx.strokeStyle='#78664a';fctx.lineWidth=.8;fctx.stroke(p);
  for(let i=0;i<7;i++){const x=138+(i%4)*14+(i>3?7:0),y=i>3?127:111;uEllipse(fctx,x,y,4.7,3.5,'#736147');uEllipse(fctx,x,y+.5,3.6,2.5,'#594b35');if(i<(n.roses||0))uItem('sandrose',x,y+3,.32);}
 }else{uPath(fctx,[[122,147],[127,96],[160,84],[194,96],[200,147]],'#473c30','#6a5a40',1.4);uPath(fctx,[[132,146],[137,104],[160,96],[184,104],[190,146]],'#6c5740');uFrieze(140,106,40,23);}fctx.restore();}
function uPlace(n){U_AUDIT.places.add(n.place);const ids={ausgang:0,oase:1,wadi:2,kfelsen:6,zelthuette:7};
 if(n.place==='geheim'){if(!n.revealed){uScene(3);return;}if(!n.solved){uScene(4);if(n.open)uShadeAreas.push({x:160,y:148,rx:35,ry:8});uRoseGate(n);uLastFocus={x:160,y:103,base:150,keyHint:n.open?'U':'G'};return;}
  uScene(5);uShadeAreas.push({x:160,y:155,rx:130,ry:20});uFrieze(72,26,176,94);fSprite('requisiten',n.chest?13:12,113,164,52);if(!n.chest)uLastFocus={x:113,y:120,base:164,keyHint:'G'};return;
 }
 if(n.place==='kakteen'){uTerrain();uRoad();for(const[x,y,s]of [[44,128,.8],[278,129,.75],[78,143,1.05],[235,146,1.0],[22,172,1.5],[297,174,1.55]])fSprite('wuestenflora',canPickD(n)?8:9,x,y,43*s);uLastFocus=canPickD(n)?{x:79,y:109,base:142,keyHint:'P'}:null;return;}
 if(n.place==='stadt'){uTerrain();uRoad();uObject('felsbrocken',38,152,1.4);uObject('felsbrocken',293,154,1.5);fSprite('hafenbauten',0,160,150,180,141);uLastFocus={x:160,y:84,base:149,keyHint:' '};return;}
 uScene(ids[n.place]??3);
 if(n.place==='oase'){
  uShelterPatch(77,156,64,16);uCastShade('palme',-17,137,106,138);
  if(canPickD(n))for(const[x,y,s]of [[72,82,.45],[238,75,.42],[134,71,.3]])uItem('datteln',x,y,s);
  uLastFocus={x:161,y:124,base:149,keyHint:canFill(n)?'G':'W'};
 }
 if(n.place==='wadi'){uShelterPatch(70,157,65,16);uCastShade('akazie',28,139,129,99);const progress=n.spring?5:G.dig||0;uEllipse(fctx,214,142,25+progress*1.5,4+progress*.4,'#876e4b6b');if(n.spring)uWater(214,142,23,5);for(const[x,y,s]of [[180,145,.72],[242,148,.75],[220,128,.55]])uAnimal('flughuhn',x,y,21*s,false);uLastFocus={x:214,y:126,base:145,keyHint:n.spring?'W':'Q'};}
 if(n.place==='kfelsen'){uShelterPatch(69,154,66,18);uCastShade('zwillingsfelsen',28,133,99,85);uMasonry(n);uLastFocus=n.chest?null:{x:160,y:n.cleared?118:103,base:151,keyHint:!n.examined?'U':!n.cleared?(G.hack?.next||'g').toUpperCase():'G'};}
}
function uItem(key,x,y,s=1,ctx=fctx){const index=U_ITEMS.indexOf(key);if(key.startsWith('foto_'))return fItem(key,x,y,s,ctx);if(index<0){if(F_ITEMS.includes(key)||key==='laterne')return fItem(key,x,y,s,ctx);return hDrawItem(key,x,y,ctx);}
 const widths={palmwedel:33,akazienzweig:31,stoff:28,sandrose:19,haizahn:17,ammonit:21,trilobit:20,fulgurit:25,wuestenglas:20,meteorit:19,zelt:31,schatzkarte:28,kopfschutz:27,ticket:27,flaschenschiff:31,teekanne:25,tonschale:27,teppich:31,messinglaterne:21,altmuenzen:27},w=(widths[key]||23)*s;
 return fSprite('wuestenfunde',index,x,y,w,null,ctx);
}
function uAnimal(key,x=162,y=151,w=null,focus=true,ctx=fctx){const i=U_ANIMALS.indexOf(key);if(i<0)return;U_AUDIT.animals.add(key);const widths={fennek:40,dromedar:76,sandkatze:34,springmaus:24,mendes:64,flughuhn:25,dornteufel:29,skorpion:23,hornviper:28};w=w??widths[key];if(ctx===fctx)uShadow(x,y,w*.6,2.4);const box=fSprite('wuestentiere',i,x,y,w,null,ctx);if(focus&&ctx===fctx)uLastAnimal={key,...box};return box;}
function uLight(ctx=fctx){
 const t=dTime(),warm=t>=17*60&&t<21*60?Math.sin(Math.min(1,(t-17*60)/240)*Math.PI)*.11:t<8*60&&t>=D_WAKE?.10*(1-(t-D_WAKE)/120):0;
 if(warm>0){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(228,161,100,${warm*.3})`);g.addColorStop(.6,`rgba(221,149,85,${warm})`);g.addColorStop(1,`rgba(221,149,85,${warm*.3})`);uRect(ctx,0,0,W,H,g);}
 let dark=t>=19*60+30?Math.min(.80,(t-(19*60+30))/90*.80):t<D_WAKE?.80:0;
 if(dark){uRect(ctx,0,0,W,H,`rgba(20,30,54,${dark})`);if(S.inv.includes('laterne')&&S.oil>0){const glow=ctx.createRadialGradient(160,166,2,160,166,122);glow.addColorStop(0,'#e4b76a5c');glow.addColorStop(1,'#e4b76a00');uRect(ctx,0,54,W,126,glow);}for(let i=0;i<28;i++)uEllipse(ctx,(i*73+19)%W,(i*31+9)%58,.25,.25,'#e9e7d277');}
}
const uLegacyRender=renderDesert;
renderDesert=function(){if(!uActive())return uLegacyRender();uLastAnimal=uLastItem=uLastFocus=null;uShadeAreas=[];fctx.clearRect(0,0,W,H);const P=G.pos,h=here();let road=null;
 if(P.e!=null){const e=G.w.edges[P.e],fw=P.h===e.dir,dist=fw?e.n-P.k:P.k,ahead=G.w.N[fw?e.b:e.a];uTerrain();road=uRoad(dist<=3&&!facePlace(ahead,P.h)?ahead:null,P.h,ZJ+DZSTEP*dist);uVegetation(vegEdge(e),road);if(road.n)uCorners(ahead,P.h,road,false,ZJ+DZSTEP*dist);uApproach(ahead,dist);if(ahead.id==='FM'&&dist>=2&&fmShows())uMirage();}
 else if(h.t==='fork'){const n=h.node,mv=nodeMoves(n,P.h);uTerrain();const junction=mv.f!=null||mv.j!=null;road=uRoad(junction?n:null,P.h);uVegetation(DVEG[n.id]||0,road);uRestShade(n,road);if(junction)uCorners(n,P.h,road,true,ZJ);else for(const[i,x]of [[(P.h+3)%4,65],[P.h,255]])uObject(n.corner[i],x,170,1.0);
  const ei=n.exits[P.h],e=ei==null?null:G.w.edges[ei],ahead=e&&G.w.N[e.a===n.id?e.b:e.a];if(ahead?.id==='FM'&&fmShows())uMirage();
 }else uPlace(h);
 if(road)uTracks(road);
 const item=itemHere();if(item&&!uPhotoBusy){const box=uItem(item,159,157,1);uLastItem={key:item,...box,cx:159,base:157};}
 const a=animalHere();if(a&&!(a==='flughuhn'&&h.place==='wadi')&&!uPhotoBusy)uAnimal(a);
 if(G.guide&&!uPhotoBusy){const rd=guideRel();if(rd!=='B')uAnimal('flughuhn',rd==='L'?51:rd==='R'?269:166,113,21,false);}
 G.mark=null;G.animScr=uLastAnimal?[Math.round(uLastAnimal.x+uLastAnimal.w/2),Math.round(uLastAnimal.y+uLastAnimal.h/2)]:null;
 uLight();
};
DESERT_EX.render=renderDesert;
function uFrieze(x,y,w,h,ctx=fctx){const a=F_ATLAS.saharafelsbild,r=a.bounds[0];ctx.drawImage(a.img,r.x,r.y,r.w,r.h,x,y,w,h);}
const uPaintFrieze=paintFrieze;
paintFrieze=function(){if(!fReady)return uPaintFrieze();const c=document.createElement('canvas');c.width=PZ_C*PZ_TW*4;c.height=PZ_R*PZ_TH*4;uFrieze(0,0,c.width,c.height,c.getContext('2d'));return c;};
const uPzDraw=pzDraw;
pzDraw=function(now){if(!uActive()||!G.puz)return uPzDraw(now);const puzzle=dW().puzzle;if(!puzzle||!PZ_IMG)return;const x=(W-PZ_C*PZ_TW)/2,y=26,A=G.puz.anim,k=A?Math.min(1,(now-A.t0)/140):1;if(A&&k>=1)G.puz.anim=null;
 uRect(vx,0,0,W,H,'#191a15ca');qCard(vx,x-6,y-8,PZ_C*PZ_TW+12,PZ_R*PZ_TH+32);const scale=PZ_IMG.width/(PZ_C*PZ_TW);
 for(let p=0;p<pzN;p++){const v=puzzle.t[p];if(v<0)continue;let xx=x+(p%PZ_C)*PZ_TW,yy=y+Math.floor(p/PZ_C)*PZ_TH;if(A?.v===v&&k<1){const fx=x+(A.from%PZ_C)*PZ_TW,fy=y+Math.floor(A.from/PZ_C)*PZ_TH;xx=fx+(xx-fx)*k;yy=fy+(yy-fy)*k;}
  vx.drawImage(PZ_IMG,(v%PZ_C)*PZ_TW*scale,Math.floor(v/PZ_C)*PZ_TH*scale,PZ_TW*scale,PZ_TH*scale,xx,yy,PZ_TW,PZ_TH);vx.strokeStyle='#5b5138';vx.lineWidth=.45;vx.strokeRect(xx+.2,yy+.2,PZ_TW-.4,PZ_TH-.4);
  const near=pzNbrs(pzHole()).includes(p);uRect(vx,xx+PZ_TW-9,yy+PZ_TH-10,8,9,near?'#eee0b8f5':'#3c3429b0');vx.font='bold 6.5px Segoe UI';vx.textAlign='center';vx.fillStyle=near?'#3e3928':'#e2d6b2';vx.fillText(PZ_LET[v].toUpperCase(),xx+PZ_TW-5,yy+PZ_TH-3);
 }
 const hole=pzHole();uRect(vx,x+hole%PZ_C*PZ_TW,y+Math.floor(hole/PZ_C)*PZ_TH,PZ_TW,PZ_TH,'#2b2a21');vx.fillStyle='#dfd6bb';vx.font='5.8px Segoe UI';vx.textAlign='left';vx.fillText('Nachbarstein tippen · Rücktaste: zurück',x,y+PZ_R*PZ_TH+10);vx.fillText('Züge: '+puzzle.moves,x,y+PZ_R*PZ_TH+18);
};

function uMirage(){if(!fmShows())return;fctx.save();const g=fctx.createLinearGradient(0,72,0,105);g.addColorStop(0,'#88b5b200');g.addColorStop(.5,'#88b5b266');g.addColorStop(1,'#88b5b200');uEllipse(fctx,160,94,36,8,g);fctx.globalAlpha=.28;fSprite('wuestenflora',7,143,94,null,27);fSprite('wuestenflora',7,177,94,null,22);fctx.restore();}
function uLabel(g,text,x,y){g.font='bold 5.2px Segoe UI';g.textAlign='center';const w=g.measureText(text).width+8;qCard(g,x-w/2,y-6,w,10);g.fillStyle='#f6e7be';g.fillText(text,x,y+1);}
function uSky(now){const s=G.sky;if(!s)return;const t=(now-s.t0)/2600;if(t>=1){G.sky=null;return;}vx.save();vx.globalAlpha=Math.sin(t*Math.PI);
 if(s.kind==='birds'){const dx=G.skyDir==='L'?-1:G.skyDir==='R'?1:0;for(let i=0;i<7;i++){const x=160+(i%3-1)*10+dx*t*140,y=36+Math.floor(i/3)*7+(G.skyDir==='B'?t*15:G.skyDir==='F'?-t*15:0),flap=reduceMotion?1:Math.sin(now/100+i)*2;uLine(vx,[[x-3,y+flap],[x,y],[x+3,y+flap]],'#4b4b3b',.65);}}
 else if(s.kind==='clouds'){const g=vx.createLinearGradient(0,15,0,100);g.addColorStop(0,'#ae824000');g.addColorStop(.7,'#b1885955');g.addColorStop(1,'#ae824000');uRect(vx,0,15,W,85,g);}
 else if(s.kind==='stars'){const d=relDir(0,G.pos.h),x=d==='L'?40:d==='R'?280:160;uEllipse(vx,x,24,1.2,1.2,'#fff7c5');uLine(vx,[[x-3,24],[x+3,24]],'#fff7c5',.5);uLine(vx,[[x,21],[x,27]],'#fff7c5',.5);}
 else{const g=vx.createRadialGradient(241,26,1,241,26,15);g.addColorStop(0,'#fff5cd99');g.addColorStop(1,'#fff5cd00');uEllipse(vx,241,26,15,15,g);}vx.restore();}
const uOldOverlay=desertOverlay;
desertOverlay=function(now){if(!uActive())return uOldOverlay(now);if(G.city)return;if(G.puz){pzDraw(now);return;}
 const dt=Math.min(.1,Math.max(0,(now-(dLastT||now))/1000));dLastT=now;if(!paused&&G.phase==='explore'&&!qEffect)stormTick(dt);uSky(now);
 if(isHot()&&!inShade()){const g=vx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#fff1c533');g.addColorStop(.5,'#fff1c50a');g.addColorStop(1,'#fff1c500');uRect(vx,0,0,W,H,g);uLabel(vx,S.inv.includes('kopfschutz')?'Mittagshitze · Kopfschutz':'Mittagshitze · Schatten suchen',254,14);}
 if(!G.storm&&!qEffect){const f=uLastItem||uLastFocus;if(f){const key=uLastItem?'G':f.keyHint||'G',x=f.cx??f.x??160,y=Math.min(164,f.base+11);uLabel(vx,key===' '?'Leertaste':key,x,y);}}
 if(inShade()&&!G.storm&&!qEffect)uLabel(vx,isHot()?'Im Schatten · Ü: rasten':'Schattenplatz',253,14);
 const s=G.storm;if(!s)return;
 const intensity=s.st==='warn'?Math.min(.78,.13+(STORM_WARN-s.left)/STORM_WARN*.6):.82;
 const dust=vx.createLinearGradient(0,0,0,H);dust.addColorStop(0,`rgba(155,113,61,${intensity})`);dust.addColorStop(.6,`rgba(194,153,95,${intensity*.8})`);dust.addColorStop(1,`rgba(210,178,126,${intensity})`);uRect(vx,0,0,W,H,dust);
 for(let i=0;i<66;i++){const x=(now*(reduceMotion?0:.06)*(1+i%4)+i*67)%370-25,y=(i*37)%H;uLine(vx,[[x,y],[x+5+i%7,y-1.6]],i%2?'#eed6a34d':'#af814f55',.35+(i%3)*.15);}
 if(s.st==='warn'){qCard(vx,78,14,164,26);vx.fillStyle='#f5e5bc';vx.font='bold 7px Segoe UI';vx.textAlign='center';vx.fillText('Sandsturm · E: eingraben',160,25);uRect(vx,88,31,144,3,'#4e4637');uRect(vx,88,31,144*Math.max(0,s.left)/STORM_WARN,3,'#dec28b');}
 else{qCard(vx,48,115,224,50);vx.font='6px Segoe UI';vx.fillStyle='#f5e6bf';vx.textAlign='center';vx.fillText('Ü drücken, wenn die Markierung im hellen Feld ist',160,125);uRect(vx,60,137,200,12,'#4d4230');uRect(vx,s.zone-11,137,22,12,'#e8d7a3');uLine(vx,[[s.m,134],[s.m,152]],'#ffffff',1.3);for(let i=0;i<QTE_N;i++)uEllipse(vx,140+i*10,158,2,2,i<s.hits?'#e7ce8c':'#6e6045');}
};DESERT_EX.overlay=desertOverlay;

// One continuous harbor panorama; all station positions and the walking camera are unchanged.
const uCityDraw=cityDraw;
cityDraw=function(now){if(!uActive()||!G.city)return uCityDraw(now);const C=G.city;ccam=Math.max(0,Math.min(CITY_W-CVW,C.x-CVW/2));fctx.clearRect(0,0,W,H);
 const a=F_ATLAS.hafenpanorama;fctx.save();fctx.scale(CZ,CZ);fctx.translate(-ccam,-CY0);fctx.drawImage(a.img,0,0,a.img.width,a.img.height,0,-17,CITY_W,212);
 // Street surface at the same physical walking height as the original side-view level.
 uRect(fctx,0,122,CITY_W,15,'#dfc69b');for(let i=0;i<100;i++)uLine(fctx,[[i*7,132+(i%3)*1.2],[i*7+2,132+(i%3)*1.2]],'#b89e7155',.25);
 for(const st of CITY_ST){const idx={tor:0,haendler:1,schiff:2,mann:5,herberge:3}[st.id];const width={tor:62,haendler:65,schiff:70,mann:12,herberge:72}[st.id];fSprite('hafenbauten',idx,st.x,CITY_GY,width,null,fctx);U_AUDIT.city.add(st.id);}
 // A real pier joins the quay to the boat, rather than a boat floating over the street.
 uPath(fctx,[[401,142],[410,142],[422,174],[412,174]],'#806548','#594b3c',.6);for(let y=145;y<174;y+=3)uLine(fctx,[[402+(y-142)*.35,y],[411+(y-142)*.35,y]],'#ad8b5c',.4);
 fSprite('hafenbauten',4,442,181,105,null,fctx);
 // Moon sign identifies the inn described by the existing dialogue.
 uLine(fctx,[[563,91],[572,91],[572,97]],'#70583b',.8);uRect(fctx,567,96,11,10,'#64513c');uEllipse(fctx,572,101,3.2,3.2,'#f2dc9f');uEllipse(fctx,574,100,2.9,2.9,'#64513c');
 if(!C.noPlayer)uPlayer(C.x,CITY_GY,C.face,C.moving?C.anim:0);fctx.restore();uLight();
};
function uPlayer(x,y,face,t){fctx.save();fctx.translate(x,y);if(face<0)fctx.scale(-1,1);uShadow(0,1,8,1.2);fSprite('nachtpfad',t&&Math.floor(t*8)%2?8:4,0,0,14,25,fctx);fctx.restore();}

const uBuildIcons=buildIcons;
buildIcons=function(){uBuildIcons();if(!fReady)return;for(const key of U_ITEMS){const c=document.createElement('canvas');c.width=240;c.height=160;const ctx=c.getContext('2d');fSprite('wuestenfunde',U_ITEMS.indexOf(key),120,145,210,135,ctx);ICON[key]=c.toDataURL('image/webp',.92);}};
const uFundImg=fundImg;
fundImg=function(key){if(!fReady||!U_ITEMS.includes(key))return uFundImg(key);const c=document.createElement('canvas');c.width=400;c.height=300;fSprite('wuestenfunde',U_ITEMS.indexOf(key),200,280,360,260,c.getContext('2d'));return c;};
const uCropPhoto=cropPhoto;
cropPhoto=function(a){if(!uActive())return uCropPhoto(a);const box=uLastAnimal,cx=box?box.x+box.w/2:160,cy=box?box.y+box.h/2:114,w=Math.max(100,(box?.w||45)*1.6),h=w*.69,x=Math.max(0,Math.min(W-w,cx-w/2)),y=Math.max(0,Math.min(H-h,cy-h/2)),c=document.createElement('canvas');c.width=480;c.height=330;c.getContext('2d').drawImage(F_CANVAS,x*4,y*4,w*4,h*4,0,0,480,330);return c.toDataURL('image/webp',.90);};
function uFotoHandles(k){return uActive()&&['foto_duene','foto_hafen'].includes(k);}
function uFotoScene(k){const w=S.world,sv={pos:{...G.pos},time:w.time,animals:w.animals,items:w.items,city:G.city},meta=[uLastAnimal,uLastItem,uLastFocus],c=document.createElement('canvas');c.width=640;c.height=384;uPhotoBusy=true;
 try{w.time=600;w.items={};w.animals={};if(k==='foto_hafen'){G.city={x:390,tx:390,face:1,anim:0,moving:false,noPlayer:true};cityDraw(performance.now());}else{G.city=null;uScene(4);uRoseGate({...G.w.N.GH,open:false,roses:0});}const ctx=c.getContext('2d');ctx.fillStyle='#e9dfc4';ctx.fillRect(0,0,640,384);ctx.drawImage(F_CANVAS,0,0,1280,720,16,16,608,342);return c.toDataURL('image/webp',.9);
 }finally{Object.assign(G,{pos:sv.pos,city:sv.city});w.time=sv.time;w.items=sv.items;w.animals=sv.animals;[uLastAnimal,uLastItem,uLastFocus]=meta;uPhotoBusy=false;}}

function uAnimalAction(kind,fn){if(!uActive()||G.city)return fn();const a=animalHere();if(!a||!tameable(a)||kind==='feed'&&!(S.food>0)||kind==='pet'&&!trusted(a))return;const box=uLastAnimal?{...uLastAnimal}:null;fn();renderScene();qBegin(kind,{u:true,a,box,duration:kind==='pet'?2900:2700});setCaption([...G.caption,'Leertaste: Sequenz überspringen.'],true);}
const uFeed=feedAnimal,uPet=petAnimal;feedAnimal=function(){return uAnimalAction('feed',uFeed);};petAnimal=function(){return uAnimalAction('pet',uPet);};
const uQDrawAnimal=qDrawAnimal;
qDrawAnimal=function(e,t){if(e.kind==='tent')return uDrawTent(e,t);if(!e.u)return uQDrawAnimal(e,t);const b=e.box||{x:140,y:110,w:40,h:30},base=b.y+b.h,cx=b.x+b.w/2,wait=e.kind==='pet'?1850:1500;
 if(e.kind==='pet'&&t<wait){qCard(vx,60,18,200,143);fSprite('wuestentiere',U_ANIMALS.indexOf(e.a),160,138,160,100,vx);qHand(vx,135+(reduceMotion?0:Math.sin(t/250)*4),84,1);vx.fillStyle='#efdfb8';vx.textAlign='center';vx.font='6px Georgia';vx.fillText(DEAD[e.a].sp+' · vorsichtig streicheln',160,151);return;}
 const p=Math.max(0,Math.min(1,(t-wait)/(e.duration-wait))),x=cx-p*230,bob=reduceMotion?0:Math.sin(t/(p?85:180))*(p?1:.25);vx.save();vx.beginPath();vx.rect(0,0,W,H);vx.clip();
 if(e.kind==='feed'&&t<wait)for(let i=0;i<Math.max(0,7-Math.floor(t/210));i++)uEllipse(vx,cx-b.w*.27+(i%3)*1.3,base+Math.floor(i/3)*.5,.7,.4,'#a97d45');
 fSprite('wuestentiere',U_ANIMALS.indexOf(e.a),x,base+bob-(e.a==='flughuhn'?p*65:0),b.w,null,vx);vx.restore();};
const uSleepTent=sleepTent;
sleepTent=function(){if(!uActive())return uSleepTent();if(qEffect||!canTentHere(curNode())||dTime()<REST_FROM||!S.inv.includes('zelt')&&tentNeed().length)return;
 qBegin('tent',{duration:3300,onFinish:()=>uSleepTent()});setCaption(['Du richtest Zweige auf, verknotest die Verbindungen und spannst den Stoff darüber.','Leertaste: Aufbau abschließen und schlafen.'],true);
};
function uDrawTent(e,t){qCard(vx,39,20,242,142);vx.fillStyle='#ebdfbb';vx.textAlign='center';vx.font='bold 7px Georgia';vx.fillText(t<1100?'1 · Das Gestell aufrichten':t<2200?'2 · Das Dach bespannen':'3 · Der Schlafplatz ist bereit',160,34);fSprite('wuestenfunde',t<1100?23:22,160,143,188,98,vx);if(t>=1100&&t<2200){vx.save();vx.globalAlpha=.45;fSprite('wuestenfunde',4,160,121,80,null,vx);vx.restore();}}

// The old Australian photo remains explicitly archived; it is never presented as an African agama.
function uMigrateSpecies(){if(!S||S.desertArtVersion>=13)return;const old='Dornteufel',name='Dornschwanzagame';if(S.seen?.[old]||S.photos?.[old]||S.photoImgs?.[old]){S.legacySpeciesPhotos=S.legacySpeciesPhotos||{};S.legacySpeciesPhotos[old]={img:S.photoImgs?.[old]||null,date:S.photos?.[old]||null,seen:S.seen?.[old]||null};for(const key of ['seen','fed','pet'])if(S[key]?.[old]!=null){S[key][name]=S[key][name]??S[key][old];delete S[key][old];}if(S.photos?.[old]){S.photos[name]=S.photos[old];delete S.photos[old];const c=document.createElement('canvas');c.width=480;c.height=320;const ctx=c.getContext('2d');ctx.fillStyle='#dfcaa1';ctx.fillRect(0,0,480,320);fSprite('wuestentiere',6,240,280,420,250,ctx);S.photoImgs[name]=c.toDataURL('image/webp',.9);delete S.photoImgs[old];S.agamaMigratedPhoto=true;}}S.desertArtVersion=13;save();}
const uJournalCard=jAnimalCard;
jAnimalCard=function(s,i,gi){let html=uJournalCard(s,i,gi);if(s.n==='Dornschwanzagame'&&S.legacySpeciesPhotos?.Dornteufel){const a=S.legacySpeciesPhotos.Dornteufel;html=html.replace('</div></div>',`${S.agamaMigratedPhoto?'<p class="pencil">Bestandsbild der neuen Art. Dein altes Foto bleibt im Archiv.</p>':''}<details><summary>Foto aus dem früheren Spielstand: Dornteufel</summary>${a.img?`<img src="${a.img}" alt="Archivfoto: australischer Dornteufel" style="max-width:100%">`:'<p>Frühere Sichtung übernommen.</p>'}</details></div></div>`);}return html;};
forestReady.then(()=>{uMigrateSpecies();window.forestArt.version='4.7 Waldatelier 14 – Hohe Dünen und Schattenplätze';window.forestArt.desert={animals:U_ANIMALS,items:U_ITEMS,markers:Object.keys(U_OBJECTS)};});
const uTakePhoto=takePhoto;takePhoto=function(){const a=animalHere(),r=uTakePhoto();if(a==='dornteufel'&&S.agamaMigratedPhoto&&S.photos.Dornschwanzagame){S.agamaMigratedPhoto=false;save();}return r;};

// Backspace cancels an unfinished camp instead of silently consuming a night.
const uOnHit=onHit;onHit=function(ch){if(ch==='Backspace'&&qEffect?.kind==='tent')qEffect.onFinish=null;return uOnHit(ch);};
const uActions=actionsNow;actionsNow=function(){if(qEffect?.kind==='tent')return [[' ','Zelt fertigstellen und schlafen'],['Backspace','Aufbau abbrechen und umdrehen']];return uActions();};
const uClockTick=clockTick;clockTick=function(dt){if(qEffect?.kind==='tent')return;return uClockTick(dt);};

// Some special places (notably the oasis) also join paths. Facing an exit is a place view,
// not a named landmark: the original caption lookup otherwise dereferenced an absent marker.
const uDesertLines=desertLines;
desertLines=function(h,known,turned,how,first){
 if(first!=='desert'&&h.t==='fork'&&h.node.place&&!DLMK[h.node.lm]){const n=h.node,names={oase:'Am Rand der Oase.',wadi:'Am trockenen Flussbett.',kfelsen:'Bei den Felsen im Kakteenfeld.',geheim:'Am Fuß der hohen Düne.',kakteen:'Am Rand des Kakteenfelds.',stadt:'Vor dem Stadttor.',zelthuette:'Bei der alten Zelthütte.',ausgang:'Beim Schachtausgang.'},rest=isHot()&&shadeAt(n)?' Ü: im Schatten rasten.':'';G.caveAct=rest?'Ü: im Schatten rasten.':null;return [(turned?turned+' ':'')+(names[n.place]||'Am Wüstenweg.'),desertExits(n,G.pos.h)+rest];}
 return uDesertLines(h,known,turned,how,first);
};DESERT_EX.lines=desertLines;
