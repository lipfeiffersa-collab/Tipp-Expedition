/* Revision 16: readable ground material, a physical sky tilt and progressive adobe demolition. */
const V_ROADS=new Map(),V_SOFT=document.createElement('canvas');V_SOFT.width=1280;V_SOFT.height=720;
let vSandTexture=null,vSky=null,vBreak=null;
function vRoadMaterial(){if(vSandTexture)return vSandTexture;const a=F_ATLAS.wuestenmaterial,b=a.bounds[0],c=document.createElement('canvas');c.width=512;c.height=340;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(a.img,b.x,b.y,b.w,b.h,0,0,c.width,c.height);const p=g.getImageData(0,0,c.width,c.height).data;let mean=0;for(let i=0;i<p.length;i+=4)mean+=(p[i]*.3+p[i+1]*.59+p[i+2]*.11);return vSandTexture={p,w:c.width,h:c.height,mean:mean/(p.length/4)};}
uSoil=function(path){if(V_ROADS.has(rSandKey)){fctx.putImageData(V_ROADS.get(rSandKey),0,408);return;}const mask=rSandMask(path),bg=fctx.getImageData(0,408,1280,312),g=V_SOFT.getContext('2d',{willReadFrequently:true});g.clearRect(0,0,1280,720);g.filter='blur(14px)';g.drawImage(F_CANVAS,0,0);g.filter='none';const soft=g.getImageData(0,408,1280,312).data,t=vRoadMaterial(),p=bg.data;
 for(let y=0;y<312;y++)for(let x=0;x<1280;x++){const wx=x/4,wy=102+y/4,d=y/312,dx=(Math.sin(wy*.5)+Math.sin(wy*1.27)*.45)*(1+d*1.3),dy=Math.sin(wx*.15+1)*(.6+d*.6),mx=Math.max(0,Math.min(1279,Math.round(x+dx*4))),my=Math.max(0,Math.min(311,Math.round(y+dy*4))),m=mask[(my*1280+mx)*4+3]/255;if(m<.005)continue;
  const i=(y*1280+x)*4,tx=Math.floor(x/(.35+d*.8))%t.w,ty=Math.floor(y/(.25+d*.6))%t.h,ti=(ty*t.w+tx)*4,grain=(t.p[ti]*.3+t.p[ti+1]*.59+t.p[ti+2]*.11-t.mean)*.35,a=m*(.88+.08*Math.sin(wx*.2+wy*.17));
  for(let c=0;c<3;c++){const ground=soft[i+c]*.88+p[i+c]*.12,trail=ground*.88+grain-1+(c===0?1:c===2?-1:0);p[i+c]=p[i+c]*(1-a)+trail*a;}
 }fctx.putImageData(bg,0,408);V_ROADS.set(rSandKey,bg);if(V_ROADS.size>12)V_ROADS.delete(V_ROADS.keys().next().value);
};
// Cast shelter from the scenery; never leave a detached dark oval in the middle of a path.
uShelterPatch=function(x,y,rx=48,ry=13){const p=new Path2D();for(let i=0;i<=28;i++){const a=i/28*Math.PI*2,r=1+.065*Math.sin(i*2.8)+.035*Math.cos(i*1.6),xx=x+Math.cos(a)*rx*r,yy=y+Math.sin(a)*ry*r;if(i)p.lineTo(xx,yy);else p.moveTo(xx,yy);}p.closePath();fctx.save();fctx.globalAlpha=.26;fctx.filter='blur(9px)';fctx.fillStyle='#354039';fctx.fill(p);fctx.restore();uShadeAreas.push({x,y,rx,ry});};
uRestShade=function(n){if(!shadeAt(n))return;if(n.place)uShelterPatch(-5,183,120,33);};

// The chest exists behind the wall from the first frame. An enlarging breach reveals it.
function vBreach(progress){const p=new Path2D(),cx=161,cy=133,rx=progress?7+progress*6.5:4,ry=progress?7+progress*3.5:5;p.rect(86,80,150,90);p.moveTo(cx+rx,cy);for(let i=1;i<=32;i++){const a=i/32*Math.PI*2,r=1+.07*Math.sin(i*2.37)+.06*Math.cos(i*1.13);p.lineTo(cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r);}p.closePath();return p;}
uMasonry=function(n){if(!F_ATLAS.lehmruine)return;const progress=n.cleared?8:G.hack?.n||0,ratio=progress/8;
 fSprite('lehmruine',n.chest?3:2,163,153,55);
 if(!n.cleared){fctx.save();if(n.examined||progress)fctx.clip(vBreach(progress),'evenodd');fSprite('lehmruine',0,161,156,109,69);fctx.restore();}
 if(progress){fctx.save();fctx.globalAlpha=Math.min(1,.35+ratio);fSprite('lehmruine',1,161,159,112);fctx.restore();}
};
const vHack=hackWall;hackWall=function(){const before=G.hack?.n||0,r=vHack();vBreak={game:G,pos:JSON.stringify(G.pos),elapsed:0,last:performance.now(),hit:before+1};return r;};
function vDrawDebris(now){const e=vBreak;if(!e)return;if(e.game!==G||e.pos!==JSON.stringify(G.pos)||(G.pos.e==null&&curNode()?.chest)){vBreak=null;return;}const dt=Math.min(80,Math.max(0,now-e.last));e.last=now;if(!paused)e.elapsed+=dt;const t=e.elapsed/700;if(t>=1){vBreak=null;return;}vx.save();vx.globalAlpha=1-t;const a=F_ATLAS.lehmruine,r=a.bounds[0];for(let i=0;i<7;i++){const x=161+(i-3)*3+(i-3)*t*3,y=126+(i%3)*3+t*t*29-t*7,s=1.4+(i%3)*.65;vx.save();vx.translate(x,y);vx.rotate((i-3)*t);vx.drawImage(a.img,r.x+r.w*(.35+(i%3)*.12),r.y+r.h*.4,r.w*.05,r.h*.07,-s,-s,s*2,s*2);vx.restore();}const dust=vx.createRadialGradient(163,146,1,163,146,20+t*19);dust.addColorStop(0,'#c2a27744');dust.addColorStop(1,'#c2a27700');uEllipse(vx,163,146,20+t*19,8+t*5,dust);vx.restore();}

const V_SKY_CANVAS=document.createElement('canvas');V_SKY_CANVAS.width=1280;V_SKY_CANVAS.height=1440;
const vLookUp=lookUp;
lookUp=function(){if(vSky)return;vLookUp();const kind=G.sky.kind;G.sky=null;const c=V_SKY_CANVAS,g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);const a=F_ATLAS.wuestenhimmel;g.drawImage(a.img,0,0,a.img.width,a.img.height,0,0,1280,720);g.drawImage(a.img,0,0,a.img.width,a.img.height,0,0,1280,1080);
 const scene=document.createElement('canvas');scene.width=1280;scene.height=720;const sg=scene.getContext('2d');sg.drawImage(F_CANVAS,0,0);sg.globalCompositeOperation='destination-in';const feather=sg.createLinearGradient(0,0,0,120);feather.addColorStop(0,'#0000');feather.addColorStop(1,'#000');sg.fillStyle=feather;sg.fillRect(0,0,1280,720);
 if(isDark()){g.fillStyle='#091329e8';g.fillRect(0,0,1280,1440);const rnd=mulberry(971);g.fillStyle='#faf2d1';for(let i=0;i<170;i++){const x=rnd()*1280,y=rnd()*680,r=.5+rnd()*1.1;g.globalAlpha=.4+rnd()*.6;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();}g.globalAlpha=1;}
 g.drawImage(scene,0,720);
 vSky={game:G,pos:JSON.stringify(G.pos),kind,elapsed:0,last:performance.now(),dir:G.skyDir,returning:false};$('#abox').hidden=true;setCaption([...G.caption,'Leertaste oder O: Blick wieder senken.'],true);updateControls();};
function vSkyBack(){if(vSky&&!vSky.returning){vSky.returning=true;vSky.backAt=vSky.elapsed;vSky.startPitch=vSky.pitch||0;}}
function vSkyDraw(now){const s=vSky;if(!s)return;if(s.game!==G||s.pos!==JSON.stringify(G.pos)||G.phase!=='explore'){vSky=null;return;}const dt=Math.min(80,Math.max(0,now-s.last));s.last=now;if(!paused&&$('#ov-goal').hidden&&$('#ov-done').hidden)s.elapsed+=dt;const ease=x=>x*x*(3-2*x);if(!s.returning&&s.elapsed>5200)vSkyBack();let pitch=s.returning?s.startPitch*(1-ease(Math.min(1,(s.elapsed-s.backAt)/850))):ease(Math.min(1,s.elapsed/950));if(reduceMotion)pitch=s.returning?0:1;s.pitch=pitch;if(s.returning&&(pitch<=0||s.elapsed-s.backAt>=850)){vSky=null;const animal=animalHere();if(animal)renderABox(animal);updateControls();return;}vx.save();vx.globalAlpha=Math.min(1,pitch*5);vx.drawImage(V_SKY_CANVAS,0,(180-180*pitch)*4,1280,720,0,0,W,H);vx.restore();
 if(pitch>.55){vx.save();vx.globalAlpha=(pitch-.55)/.45;const t=Math.max(0,s.elapsed-950)/4300;if(s.kind==='birds'){const sign=s.dir==='L'?-1:1;for(let i=0;i<7;i++){const x=(s.dir==='L'?260-t*95:s.dir==='R'?60+t*95:160)+(i%3-1)*13*(s.dir==='F'?1-t*.45:s.dir==='B'?1+t*.45:1),y=54+Math.floor(i/3)*10+(s.dir==='F'?-t*18:s.dir==='B'?t*18:0),flap=reduceMotion?1:Math.sin(now/110+i)*2;rFrame(vx,R_ANIMAL[5],reduceMotion?0:Math.floor(now/135+i)%4,x,y+3,6+(i%2)*1.2,null,s.dir==='R'?-1:1);}}
 else if(s.kind==='sun'){const glow=vx.createRadialGradient(237,43,1,237,43,15);glow.addColorStop(0,'#fff5cfdd');glow.addColorStop(.35,'#fff5cf55');glow.addColorStop(1,'#fff5cf00');uEllipse(vx,237,43,15,15,glow);}
 else if(s.kind==='clouds'){const dust=vx.createLinearGradient(0,85,0,160);dust.addColorStop(0,'#af896400');dust.addColorStop(1,'#af8964bb');uRect(vx,0,85,320,75,dust);}
 else{const d=relDir(0,G.pos.h),x=d==='L'?55:d==='R'?265:160;if(d!=='B'){uEllipse(vx,x,47,1.2,1.2,'#fff7cb');uLine(vx,[[x-3,47],[x+3,47]],'#fff7cb',.6);}}vx.restore();}
}
const vExpected=expected,vActions=actionsNow,vHit=onHit;
expected=function(){return vSky?(paused||!$('#ov-goal').hidden||!$('#ov-done').hidden?[]:[' ','o','Backspace']):vExpected();};actionsNow=function(){return vSky?[[' ','Blick senken'],['o','Blick senken']]:vActions();};onHit=function(ch){if(vSky){if(!paused&&[' ','o','Backspace'].includes(ch))vSkyBack();return;}return vHit(ch);};
const vClock=clockTick;clockTick=function(dt){if(vSky)return;return vClock(dt);};
const vDesertOverlay=desertOverlay;desertOverlay=function(now){if(vSky)return;vDesertOverlay(now);vDrawDebris(now);};DESERT_EX.overlay=desertOverlay;
forestReady.then(()=>{window.forestArt.version='4.7 Waldatelier 16 – Sandpfade, Himmelsblick und Lehmruine';});

const vEncounter=encounterTick;encounterTick=function(dt){if(vSky)return;return vEncounter(dt);};

const vDraw=draw;draw=function(now){vDraw(now);if(vSky)vSkyDraw(now);};

const vCastShade=uCastShade;uCastShade=function(key,x,y,w,h){vCastShade(key,x,y,w,h);uShadeAreas.push({x,y,rx:w*.5,ry:h*.2,source:key});};
// Reserve the actual projected path width, including the landmark's full silhouette.
// Previously a large rock could straddle the whole crossing even though its anchor was beside it.
uCorners=function(n,h,road,near,z){const scale=1/z*1.9,slots=[[(h+3)%4,-1,road.yf-1,scale,false],[h,1,road.yf-1,scale,false],...(near?[[(h+2)%4,-1,road.yn+20,scale*1.25,true],[(h+1)%4,1,road.yn+20,scale*1.25,true]]:[])];
 for(const [corner,side,y,sz,isNear]of slots){const key=n.corner[corner];if(!key)continue;const s=sz*(key===n.lm?1.15:1),a=U_OBJECTS[key],b=a?F_ATLAS[a[0]].bounds[a[1]]:null,hh=a?(a[3]?a[3]*s:a[2]*s*b.h/b.w):15*s,ww=b?hh*b.w/b.h:12*s,half=isNear?uRoadWidth(road.yn):uRoadWidth(road.yf),gap=Math.max(isNear?36:8,ww*.5+(isNear?12:6)),x=160+side*(half+gap);if(a&&DSHADE[key])uCastShade(key,x,y,ww,hh);uObject(key,x,y,s);}
};
