// Warm pools of light preserve the readability of the illustrated night passage.
function nGlow(x,y,r,alpha){const glow=fctx.createRadialGradient(x,y,1,x,y,r);glow.addColorStop(0,`rgba(255,214,139,${alpha})`);glow.addColorStop(.45,`rgba(235,192,112,${alpha*.35})`);glow.addColorStop(1,'rgba(235,192,112,0)');fctx.fillStyle=glow;fctx.fillRect(x-r,y-r,r*2,r*2);}
// One collectable is one coin; the inventory keeps its separate pile illustration.
function nCoin(x,y,now){
 fctx.save();fctx.translate(x,y);
 const gold=fctx.createLinearGradient(-2,-3,2,3);gold.addColorStop(0,'#f2d28b');gold.addColorStop(.45,'#c6a155');gold.addColorStop(1,'#856334');
 fEllipse(0,.25,2.8,3.05,'#493d28');fEllipse(0,0,2.65,2.85,gold);
 fctx.beginPath();fctx.ellipse(0,0,2.05,2.25,0,0,Math.PI*2);fctx.strokeStyle='#856536';fctx.lineWidth=.25;fctx.stroke();
 fLine([[0,-1.3],[-.7,0],[0,1.2],[.7,0],[0,-1.3]],'#8c6937',.3);
 fLine([[-1.8,-1.2],[-1.3,-2],[-.5,-2.3]],'#fff0bd',.3);
 fctx.restore();
}
// The background remains visible at the mouth, with rock faces fading into depth.
function nChasm(a,b,y){
 fctx.save();fctx.beginPath();fctx.rect(a-12,y,b-a+24,240-y);fctx.clip();
 const depth=fctx.createLinearGradient(0,y,0,y+37);
 depth.addColorStop(0,'#132a2b12');depth.addColorStop(.28,'#142b2c66');depth.addColorStop(.65,'#0b1b1bd9');depth.addColorStop(1,'#061112');
 fctx.fillStyle=depth;fctx.fillRect(a,y,b-a,240-y);
 const mat=F_ATLAS.nachtmaterial,r=mat.bounds[1];
 for(const [edge,dir]of [[a,-1],[b,1]]){
  const face=new Path2D();face.moveTo(edge+dir*12,y);face.lineTo(edge,y);
  face.lineTo(edge-dir*.8,y+4);face.lineTo(edge+dir*1.6,y+9);face.lineTo(edge-dir*1.2,y+15);face.lineTo(edge+dir*2,y+23);face.lineTo(edge+dir*.6,y+31);face.lineTo(edge+dir*5,y+49);face.lineTo(edge+dir*12,y+54);face.closePath();
  fctx.save();fctx.clip(face);fctx.drawImage(mat.img,r.x,r.y,r.w,r.h,edge-14,y,28,55);
  const shade=fctx.createLinearGradient(0,y,0,y+48);shade.addColorStop(0,'#19312d22');shade.addColorStop(.45,'#0b1b1b99');shade.addColorStop(1,'#061112');fctx.fillStyle=shade;fctx.fillRect(edge-14,y,28,70);fctx.restore();
  fLine([[edge,y+.8],[edge+dir*1.2,y+5],[edge+dir*.7,y+10]],'#a5a17a',.5);
  for(let i=0;i<3;i++)fLine([[edge+dir*(2+i*2),y+2],[edge+dir*(1+i*2),y+7+i*2],[edge+dir*(2+i),y+10+i*3]],'#655e4366',.25);
 }
 // A quiet veil unites the woodland and the void instead of a solid black rectangle.
 const mist=fctx.createLinearGradient(0,y,0,y+20);mist.addColorStop(0,'#829b8710');mist.addColorStop(.3,'#829b871d');mist.addColorStop(1,'#829b8700');fctx.fillStyle=mist;fctx.fillRect(a+2,y,b-a-4,20);
 fctx.restore();
}
// Rough poles, rope lashings and bank anchors make the handline visibly supported.
function nPole(x0,y0,x1,y1,width=2.6){
 const len=Math.hypot(x1-x0,y1-y0),a=F_ATLAS.nachtmaterial,r=a.bounds[2];
 fctx.save();fctx.translate(x0,y0);fctx.rotate(Math.atan2(y1-y0,x1-x0));
 fctx.drawImage(a.img,r.x,r.y,r.w,r.h,0,-width/2,len,width);
 fLine([[0,-width/2],[len,-width/2]],'#bdab7c',.3);fLine([[0,width/2],[len,width/2]],'#26362c',.65);
 fEllipse(len,0,.45,width/2,'#ac966b');fctx.restore();
}
function nLashing(x,y){for(let i=-2;i<=2;i++)fLine([[x-2.3,y+i*.6-.8],[x+2.3,y+i*.6+.8]],'#ccb789',.42);fLine([[x-1.2,y-2],[x-.6,y+2.6]],'#6b5d3f',.45);}
function nHandline(br){
 const left=br.x0+2,right=br.x1-2,y=br.y;
 for(const [x,dir]of [[left,-1],[right,1]]){
  const gy=groundAt(x),top=y-2;
  nPole(x-9,gy,x+.8,top,2.6);nPole(x+9,gy,x-.8,top,2.6);
  nPole(x-6.4,gy-13,x+6.4,gy-13,1.8);nLashing(x,top+2);
  nLashing(x-6.1,gy-13);nLashing(x+6.1,gy-13);
  const anchor=x+dir*15;
  fLine([[x,top+2],[anchor,gy-2]],'#29382b',1.2);fLine([[x,top+2],[anchor,gy-2]],'#b6a378',.55);
  nPole(anchor-1,gy+1,anchor+1,gy-5,1.6);nLashing(anchor,gy-2);
 }
 const center=(left+right)/2;
 fLine([[left,y],[center,y+8,right,y]],'#23332a',1.7);
 fLine([[left,y],[center,y+8,right,y]],'#af956b',.95);
 // Interwoven strands, with a shallow sag rather than a rigid floating beam.
 for(let x=left;x<right;x+=2.4){const t=(x-left)/(right-left),yy=y+16*t*(1-t);fLine([[x,yy-.55],[x+1.8,yy+.55]],'#d7bd8b',.3);}
 nLashing(left,y);nLashing(right,y);
}
// Individual broad rock facets, anchored to world coordinates, without stretched atlas strips.
function nRockFace(a,b,top,bottom){
 const atlas=F_ATLAS.felspassagen,r=atlas.bounds[1];
 fctx.save();fctx.beginPath();fctx.rect(a,top,b-a,bottom-top);fctx.clip();
 fctx.fillStyle='#586256';fctx.fillRect(a,top,b-a,bottom-top);
 const sx=r.x+r.w*.55,sy=r.y+r.h*.12,sw=r.w*.40,sh=r.h*.80,scale=Math.max((b-a)/sw,(bottom-top)/sh),w=sw*scale,h=sh*scale;
 fctx.drawImage(atlas.img,sx,sy,sw,sh,a,top,w,h);
 const shade=fctx.createLinearGradient(a,top,b,bottom);shade.addColorStop(0,'#122b3615');shade.addColorStop(1,'#122b3655');fctx.fillStyle=shade;fctx.fillRect(a,top,b-a,bottom-top);fctx.restore();
}
function nRockWall(a,b,y){nRockFace(a,b,y,240);fLine([[a+.3,y],[a+.8,y+17],[a,240]],'#233b37',.85);}
function nTunnel(z){const a=z.x0,b=z.x1,gy=z.gy,roof=gy-z.clear,p=new Path2D();
 p.moveTo(a-7,roof+2);p.lineTo(a-9,roof-13);p.lineTo(a+2,roof-70);p.lineTo(a+21,roof-82);p.lineTo(a+43,roof-80);p.lineTo(b-19,roof-85);p.lineTo(b+5,roof-64);p.lineTo(b+10,roof-10);p.lineTo(b+6,roof+1);p.lineTo(b-12,roof-.6);p.lineTo(a+15,roof-.3);p.closePath();
 fctx.save();fctx.clip(p);nRockFace(a-10,b+11,roof-85,roof+3);fctx.restore();fctx.strokeStyle='#293b34';fctx.lineWidth=.45;fctx.stroke(p);
 const shade=fctx.createLinearGradient(0,roof,0,gy);shade.addColorStop(0,'#102128ee');shade.addColorStop(.5,'#102128bb');shade.addColorStop(1,'#13283066');fctx.fillStyle=shade;fctx.fillRect(a,roof,b-a,z.clear);
 fLine([[a+2,roof],[a+26,roof-.3],[b-12,roof-.6],[b-2,roof]],'#b3af9477',.5);
 for(const x of [a+10,b-12])fSprite('waldflora',7,x,roof-29,6,3);
}
function nBrush(z,p){const progress=Math.max(0,Math.min(1,(p.x-z.x0+7)/(z.x1-z.x0+9)));
 const rnd=mulberry(fHash('branches:'+z.x0));
 for(let i=0;i<10;i++){const t=(i+.5)/10,x=z.x0+t*(z.x1-z.x0),h=17+rnd()*15;
  if(t<progress-.08)continue;const bend=z.i?Math.max(0,Math.min(1,(progress+.18-t)/.18)):0,tip=x+4+bend*17;
  fLine([[x,z.gy],[x-3,z.gy-h*.48,tip,z.gy-h*(1-bend*.48)]],'#3d3828',2.1);
  fLine([[x-.4,z.gy],[x-3.4,z.gy-h*.48,tip-.4,z.gy-h*(1-bend*.48)]],'#9a865e',.55);
  for(let k=0;k<3;k++){const yy=z.gy-h*(.32+k*.19);fLine([[x,yy],[tip+(k%2?6:-7),yy-5+bend*5]],'#6e6348',.85);}
 }
}
function nGate(s){const a=s.x0-4,b=s.x1+4,y=s.top,gy=y+42;
 nPole(a,gy,a,y-3,2.8);nPole(b,gy,b,y-3,2.8);nPole(a-1,y-3,b+1,y-3,2.6);
 fctx.save();const hinge=b-1,leaf=s.open?2.5:b-a-3,x=s.open?hinge-1:a+1.5;
 const wood=fctx.createLinearGradient(x,0,x+leaf,0);wood.addColorStop(0,'#6e6449');wood.addColorStop(.5,'#9a8661');wood.addColorStop(1,'#514d3a');fctx.fillStyle=wood;fctx.fillRect(x,y+1,leaf,39);
 for(let xx=x+2;xx<x+leaf;xx+=3)fLine([[xx,y+2],[xx+.3,y+39]],'#403e3180',.35);
 if(!s.open){nPole(x,y+33,x+leaf,y+7,1.4);for(let j=0;j<2;j++){const yy=y+12+j*14,slid=j>=s.bolts;fctx.fillStyle='#323e3d';fctx.fillRect(x+1,yy,leaf-2,2.2);fctx.fillStyle='#92978a';fctx.fillRect(x+2+(slid?4:0),yy+.35,Math.max(3,leaf-6),1);fEllipse(x+3+(slid?4:0),yy+.8,.45,.65,'#c2bc9e');}}
 fctx.restore();for(const yy of [y+6,y+32])fLine([[b-3,yy],[b+1,yy]],'#263632',1.2);
}
// The final obstacle is a steep mountainside standing ON the continuing forest floor.
function nMountain(a,b,gy){
 const rock=F_ATLAS.nachtmaterial,r=rock.bounds[1],face=new Path2D();
 face.moveTo(a,gy);face.lineTo(a+4,gy-8);face.lineTo(a+6,gy-23);face.lineTo(a+11,gy-33);
 face.lineTo(a+13,gy-51);face.lineTo(a+20,gy-67);face.lineTo(a+21,gy-80);
 face.lineTo(a+29,gy-98);face.lineTo(a+34,gy-124);face.lineTo(a+43,gy-147);
 face.lineTo(b,gy-180);face.lineTo(b,gy);face.closePath();
 fctx.save();fctx.clip(face);
 // Keep the rock texture above the soil line, without tiling its moss rim.
 fctx.drawImage(rock.img,r.x,r.y+r.h*.12,r.w,r.h*.88,a,gy-180,b-a,180);
 const shade=fctx.createLinearGradient(a,gy-80,b,gy);shade.addColorStop(0,'#172a2d18');shade.addColorStop(1,'#0c1e2555');fctx.fillStyle=shade;fctx.fillRect(a,gy-180,b-a,180);
 fctx.restore();fctx.strokeStyle='#263b35';fctx.lineWidth=.65;fctx.stroke(face);
 // Loose stone and low vegetation connect the mountain foot to the same ground.
 fShadow(a+18,gy+1,32);fSprite('wegmarker',0,a+8,gy+1,13,7);
 fSprite('waldflora',7,a-1,gy+.5,7,3);fSprite('waldflora',6,a+21,gy+.6,8,5);
}
/* The forest side-scrolling passage uses the existing physics and exact collision geometry. */
const fOldJRRender=jrRender;
jrRender=function(now){if(!fReady||!G||!G.jr)return fOldJRRender(now);const J=G.jr,L=J.lv,p=J.p,cam=J.cam,camY=J.camY==null?Math.max(0,p.y-66):J.camY;
 fctx.clearRect(0,0,W,H);
 // A single side-view woodland, continuous with slow scrolling; no unrelated panoramas.
 const bg=F_ATLAS.nachtwald.img,span=640;
 // Scroll through the panorama once over the whole level, without mirroring or looping.
 const offset=(span-W)*Math.max(0,Math.min(1,cam/Math.max(1,L.W-JV_W)));
 fctx.drawImage(bg,-offset,0,span,H);
 fctx.fillStyle='#10252a30';fctx.fillRect(0,0,W,H);
 fctx.save();fctx.scale(2,2);fctx.translate(-cam,-camY);

 const on=(a,b)=>b-cam>-45&&a-cam<JV_W+45;
 function ground(a,b,y,rock=false){const x0=Math.max(a,cam-3),x1=Math.min(b,cam+JV_W+3);if(x1<=x0)return;
 fctx.save();fctx.beginPath();fctx.rect(x0,y,x1-x0,240-y);fctx.clip();
 const g=fctx.createLinearGradient(0,y,0,y+55);g.addColorStop(0,rock?'#666d60':'#86714f');g.addColorStop(.2,rock?'#485349':'#594e3b');g.addColorStop(1,'#1b2d2b');fctx.fillStyle=g;fctx.fillRect(x0,y,x1-x0,240-y);
 // Soil grain is shared with the approved forest, anchored in world coordinates.
 fctx.globalAlpha=.8;const mat=F_ATLAS.nachtmaterial;
 const rr=mat.bounds[rock?1:0];
 if(rock){const r=mat.bounds[1];fctx.globalAlpha=.3;for(let tx=Math.floor(x0/40)*40;tx<x1;tx+=40)for(let ty=y+30;ty<240;ty+=40)fctx.drawImage(mat.img,r.x,r.y+r.h*.2,r.w,r.h*.8,tx,ty,40,40);fctx.globalAlpha=.8;}
 for(let tx=Math.floor(x0/40)*40;tx<x1;tx+=40)fctx.drawImage(mat.img,rr.x,rr.y,rr.w,rr.h,tx,y,40,40);
 fctx.globalAlpha=1;
 const shade=fctx.createLinearGradient(0,y+8,0,y+40);shade.addColorStop(0,'#1b2d2b00');shade.addColorStop(1,'#1b2d2b');fctx.fillStyle=shade;fctx.fillRect(x0,y+8,x1-x0,80);
 const r=mulberry(fHash(a+':'+b));for(let xx=a+3;xx<b;xx+=4+r()*8){if(xx<x0-8||xx>x1+8)continue;const yy=y+9+r()*35;
 fLine([[xx,yy],[xx+1+r()*3,yy-.4]],'#b4a17a45',.25);
 }
 fLine([[x0,y+.5],[x1,y+.5]],'#202e26',1);fLine([[x0,y],[x1,y]],'#b7b18a',.65);
 fctx.restore();
 const start=Math.ceil(x0/13)*13;for(let xx=start;xx<x1;xx+=13){const rr=mulberry(fHash('grass'+xx));const h=2+rr()*2;
 for(let k=0;k<4;k++)fLine([[xx+k*.7,y],[xx+k*.7-1+rr()*2,y-h*rr()]],k%2?'#71866a':'#a4aa7a',.28);
 if(rr()>.55)fSprite('waldflora',6,xx+3,y+.3,5+rr()*3,4);
 }
 if(!(L.shaft&&a===L.shaft[1]+18)&&a>cam-3&&a<cam+JV_W+3)fLine([[a+.3,y],[a+.3,240]],'#192925',1);
 if(!(L.shaft&&b===L.shaft[1]+18)&&b>cam-3&&b<cam+JV_W+3)fLine([[b-.3,y],[b-.3,240]],'#192925',1);
 }
 function fitted(sheet,index,x,y,w,h){const a=F_ATLAS[sheet],r=a.bounds[index];fctx.drawImage(a.img,r.x,r.y,r.w,r.h,x,y,w,h);}

 for(const [a,b,y]of L.ground)if(on(a,b)){if(L.shaft&&a===L.shaft[1]+18&&y===40){const gy=groundAt(L.shaft[0]-1);ground(a,b,gy);nMountain(a,b,gy);}else if(y<=60)nRockWall(a,b,y);else ground(a,b,y);}
 for(const [a,b,y]of L.water)if(on(a,b)){fctx.fillStyle='#24454e';fctx.fillRect(a,y+8,b-a,180-y);for(let i=0;i<18;i++)fLine([[a+(i*13)%(b-a),y+10+(i*7)%20],[a+(i*13)%(b-a)+4,y+10+(i*7)%20]],'#8fae9c88',.35);}
 for(const [a,b,y]of L.ravine)if(on(a,b))nChasm(a,b,y);
 for(const br of L.branches)if(on(br.x0-18,br.x1+18))nHandline(br);

 // A real timber scaffold supports the three climbable ledges.
 if(L.tower&&on(L.tower.x0,L.tower.W1)){const t=L.tower;
 for(const xx of [t.x0+23,t.W1-4]){fLine([[xx,t.t3],[xx,t.gy]],'#26352c',3);fLine([[xx-.35,t.t3],[xx-.35,t.gy]],'#877758',1.8);fLine([[xx+.3,t.t3],[xx+.3,t.gy]],'#b4a176',.3);}
 for(const yy of [t.t1,t.t2,t.t3]){fLine([[t.x0+23,yy+27],[t.x0+45,yy+3]],'#726749',1.6);fLine([[t.W1-4,yy+27],[t.W1-26,yy+3]],'#726749',1.6);}}
 for(const s of L.solids){if(!on(s.x0,s.x1)||s.broken||s.got||(s.open&&s.kind!=='tor'))continue;const x=(s.x0+s.x1)/2,w=s.x1-s.x0,gy=groundAt(s.x0+1);
  if(s.kind==='crate')fitted('nachtpfad',3,s.x0,s.top,w,16);
  else if(s.kind==='log')fitted('requisiten',6,s.x0,s.top,w,gy-s.top);
  else if(s.kind==='igel')fitted('nachtpfad',0,s.x0,s.top,w,gy-s.top);
  else if(s.kind==='dornen')fitted('requisiten',5,s.x0,s.top,w,gy-s.top);
  else if(s.kind==='plat'){const mat=F_ATLAS.nachtmaterial,r=mat.bounds[2];fctx.drawImage(mat.img,r.x,r.y,r.w,r.h,s.x0,s.top,w,8);fLine([[s.x0,s.top],[s.x1,s.top]],'#c2af83',.5);fLine([[s.x0,s.top+8],[s.x1,s.top+8]],'#24332d',.65);for(let xx=s.x0+4;xx<s.x1;xx+=15){fEllipse(xx,s.top+2,.35,.35,'#2a3027');}}
  else if(s.kind==='fund')fItem(s.item,x,s.top+2,.55);
  else if(s.kind==='tor')nGate(s);


 }
 for(const t of L.trees)if(on(t.x-30,t.x+30))fSprite('waldflora',0,t.x,t.gy,54,74);
 for(const l of L.ladders)if(on(l.x-9,l.x+9))fitted('nachtpfad',10,l.x-5,l.yTop,10,l.yBot-l.yTop);

 for(const z of L.zones){if(!on(z.x0,z.x1))continue;const x=(z.x0+z.x1)/2,w=z.x1-z.x0,gy=z.gy;
  if(z.kind==='ast'){const yy=gy-z.clear-4;fLine([[z.x0-12,yy-8],[z.x0+6,yy],[z.x1+12,yy+1]],'#51432e',4);fLine([[z.x0-10,yy-9],[z.x0+6,yy-1],[z.x1+12,yy]],'#a38c59',.7);}
  if(z.kind==='tunnel')nTunnel(z);
  if(z.kind==='zapfen'){fSprite('waldflora',4,x,gy,65,90);for(let i=0;i<4;i++){const phase=(now/900+i*.27)%1;fItem('zapfen',z.x0+8+i*(w-16)/3,gy-64+phase*64,.35);}}
  if(z.kind==='bienen'){fSprite('requisiten',9,x-12,gy,42,72);fSprite('nachtpfad',1,x,gy-38,12,19);for(let i=0;i<6;i++){const xx=x+Math.cos(now/500+i)*13,yy=gy-33+Math.sin(now/340+i*2)*7;fEllipse(xx,yy,.8,.4,'#c1a04a');fLine([[xx,yy-.4],[xx+.5,yy+.4]],'#3b3325',.3);}}
  if(z.kind==='aeste'&&(!z.done||p.move))nBrush(z,p);
 }
 for(const it of L.items||[]){if(it.got||!on(it.x-10,it.x+10))continue;if(it.kind==='beeren')fSprite('gegenstaende',12,it.x,it.y+2.5,6);else nCoin(it.x,it.y,now);}
 // Existing animated obstacle locations are reused rather than moved to fit the art.
 for(const z of L.zones){if(!on(z.x0,z.x1))continue;if(z.kind==='rollstamm'){const xx=rollX(z,J.t);fSprite('requisiten',6,xx,z.gy,18,14);}}
 {const idx=p.pose==='crawl'?6:p.pose==='duck'?5:p.pose==='climb'||p.pose==='hang'?7:p.pose==='jump'||p.air?9:p.move&&Math.floor(p.anim*8)%2?8:4;
 const hangLine=p.pose==='hang'?L.branches.find(br=>p.x>=br.x0&&p.x<=br.x1):null;const ht=hangLine?Math.max(0,Math.min(1,(p.x-hangLine.x0)/(hangLine.x1-hangLine.x0))):0;
 fctx.save();fctx.translate(p.x,p.y+(hangLine?6+16*ht*(1-ht):0)-(p.hop||0));if(p.face<0)fctx.scale(-1,1);const hh=idx===6?8:idx===5?12:22,ww=idx===6?23:idx===5?14:idx===9?19:14;fSprite('nachtpfad',idx,0,0,ww,hh);fctx.restore();}
 if(L.shaft){const [a,b]=L.shaft,gy=groundAt(a-1);if(on(a,b)){nChasm(a,b,gy);for(const xx of [a-2,b+2]){fLine([[xx,gy-24],[xx,180]],'#2b3429',3);fLine([[xx-.4,gy-24],[xx-.4,180]],'#8e7c57',1.8);fLine([[xx+.3,gy-23],[xx+.3,180]],'#b09b6e',.3);}const mat=F_ATLAS.nachtmaterial,r=mat.bounds[2];fctx.drawImage(mat.img,r.x,r.y,r.w,r.h,a-5,gy-26,b-a+10,3);for(const xx of [a-2,b+2])fEllipse(xx,gy-24.5,.45,.45,'#34362c');}}
 for(const c of L.checks.slice(1))if(on(c-10,c+10)){const gy=groundAt(c+12);fLine([[c+12,gy],[c+12,gy-29]],'#695c3d',1.1);fEllipse(c+12,gy-31,2.6,3,'#a8c3ad');}
 // Preserve the original shaft descent and adapt the light to the actual platform height.
 const sx=(L.shaft[0]+L.shaft[1])/2,atShaft=J.lamp>=sx-2;
 if(atShaft&&J.shaftT==null)J.shaftT=J.t;
 const lg=groundAt(J.lamp),lampY=(atShaft?Math.min(170,106+(J.t-J.shaftT)*30):lg<999?Math.min(lg,p.air?p.fromY:p.y)-39:p.y-39)+(reduceMotion?0:Math.sin(now/600)*1.1);
 nGlow(J.lamp,lampY-5,38,.42);nGlow(p.x,p.y-10,24,.13);fLantern(J.lamp,lampY,.65);
 for(const q of J.parts){if(q.shard){fLine([[q.x+q.vx*q.t,q.y+q.vy*q.t+60*q.t*q.t],[q.x+q.vx*q.t+2,q.y+q.vy*q.t+60*q.t*q.t+1]],'#b99b6f',.8);}else{fctx.fillStyle=`rgba(255,230,160,${1-q.t})`;fctx.font='3.5px Georgia';fctx.fillText(q.txt,q.x-6,q.y-q.t*16);}}
 fctx.restore();
 if(J.flash){fctx.fillStyle=`rgba(6,17,20,${Math.min(1,(performance.now()-J.flash)/350)*.85})`;fctx.fillRect(0,0,W,H);}

};
const fOldRest=restDay;restDay=function(){fOldRest();if(fActive())fPaintForest();};
