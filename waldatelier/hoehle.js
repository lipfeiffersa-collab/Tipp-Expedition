/* Illustrated cave: the original ray geometry, occlusion and interactions remain authoritative. */
function hActive(){return fReady&&!!(G&&G.cave&&!G.ex&&!G.city&&!inDesert());}
let hRecording=false,hGeometry=null,hMasks=new Map(),hForegroundSpiders=[];
const hTextures=[];
const hRaster=document.createElement('canvas');hRaster.width=960;hRaster.height=540;
const hRasterCtx=hRaster.getContext('2d'),hPixels=hRasterCtx.createImageData(960,540),hPacked=new Uint32Array(hPixels.data.buffer);
forestReady.then(()=>{const a=F_ATLAS.hoehlenmaterial;for(const r of a.bounds){const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');g.drawImage(a.img,r.x,r.y,r.w,r.h,0,0,512,512);hTextures.push(new Uint32Array(g.getImageData(0,0,512,512).data.buffer));}});
function hTex(i,u,v){const x=(u%1+1)%1*512,y=(v%1+1)%1*512,ix=x|0,iy=y|0,fx=x-ix,fy=y-iy,t=hTextures[i],a=t[iy*512+ix],b=t[iy*512+((ix+1)&511)],c=t[((iy+1)&511)*512+ix],d=t[((iy+1)&511)*512+((ix+1)&511)];let color=0xff000000;for(let shift=0;shift<24;shift+=8){const aa=(a>>>shift)&255,bb=(b>>>shift)&255,cc=(c>>>shift)&255,dd=(d>>>shift)&255;const value=(aa+(bb-aa)*fx)*(1-fy)+(cc+(dd-cc)*fx)*fy;color|=(value|0)<<shift;}return color>>>0;}
function hFloor(ci,T,wx,wy){const f=T.floor[ci];if(f===1)return hTex(3,wx*.45,wy*.45);if(f===5)return hTex(1,wx*.4,wy*.4);
 if(f===2||f===3){const al=f===2?wx:wy,la=(f===2?wy:wx)%1-.5;if(Math.abs(Math.abs(la)-.17)<.018)return 0xff777975;if((al*3)%1<.32&&Math.abs(la)<.3)return hTex(2,al,la);}
 return hTex(f===4?0:1,wx*.45,wy*.45);}
function hCeil(ci,T,wx,wy,x,y,ch){const tx=wx%1-.5,ty=wy%1-.5;if(T.hole[ci]&&tx*tx+ty*ty<.11)return T.hole[ci]===1?0xffbaa488:0xffd5edff;
 if(T.beam[ci]){const al=T.axis[ci]===1?wx:wy,fr=al%1;if(fr<.13)return hTex(2,(T.axis[ci]===1?wy:wx)*.4,fr*2);}
 return hTex(0,wx*.45,wy*.45);}
function hColor(c){return Array.isArray(c)?`rgb(${c.join(',')})`:c;}
function hClip(depth){if(depth==null)return null;const key=depth.toFixed(3);if(hMasks.has(key))return hMasks.get(key);const path=new Path2D();for(let y=0;y<H;y++){let start=-1;for(let x=0;x<=W;x++){const visible=x<W&&hGeometry[y*W+x]>=depth-.035;if(visible&&start<0)start=x;if(!visible&&start>=0){path.rect(start,y,x-start,1);start=-1;}}}hMasks.set(key,path);return path;}
function hPaint(fn,depth=ZT){fctx.save();const clip=hClip(depth);if(clip)fctx.clip(clip);fn();fctx.restore();}
function hSprite(sheet,index,x,y,w,h=null,depth=ZT){hPaint(()=>fSprite(sheet,index,x,y,w,h),depth);}
const hOldO=O;
O=function(x,y,s){const o=hOldO(x,y,s);if(!hRecording)return o;const d=ZT;
 for(const method of ['R','E','P','T','X']){const old=o[method];o[method]=function(...args){old(...args);if(!hRecording)return;hPaint(()=>{const p=(a,b)=>[x+a*s,y+b*s];
 if(method==='R'){const [dx,dy,w,h,c,a=1]=args;fctx.globalAlpha=a;fctx.fillStyle=hColor(c);fctx.fillRect(x+dx*s,y+dy*s,w*s,h*s);}
 if(method==='E'){const [dx,dy,rx,ry,c,a=1]=args;fctx.globalAlpha=a;fEllipse(x+dx*s,y+dy*s,Math.max(.15,rx*s),Math.max(.15,ry*s),hColor(c));}
 if(method==='P'){const [pts,c,a=1]=args;fctx.globalAlpha=a;fctx.beginPath();pts.forEach(([xx,yy],i)=>fctx[i?'lineTo':'moveTo'](x+xx*s,y+yy*s));fctx.closePath();fctx.fillStyle=hColor(c);fctx.fill();}
 if(method==='T'){const [x0,y0,x1,y1,w,c]=args;fLine([p(x0,y0),p(x1,y1)],hColor(c),Math.max(.12,w*s));}
 if(method==='X'){const [dx,dy,c]=args;fEllipse(x+dx*s,y+dy*s,.17,.17,hColor(c));}
 },d);};}return o;};
const hOldLine=line1;line1=function(x0,y0,x1,y1,c){hOldLine(...arguments);if(hRecording)hPaint(()=>fLine([[x0,y0],[x1,y1]],hColor(c),.2));};
function hArt(old,paint){return function(...args){if(!hRecording)return old(...args);hRecording=false;try{old(...args);}finally{hRecording=true;}paint(...args);};}
function hProp(i,o,w,h=null){hSprite('hoehlenobjekte',i,o.x,o.y,w*o.s,h==null?null:h*o.s);}
crystals=hArt(crystals,(o,c,big=.8)=>{const colors={blau:0,rot:1,gruen:2,gelb:3,lila:12},key=Object.keys(CRY).find(k=>CRY[k]===c)||'blau';hProp(colors[key],o,62*big);});
stalagmites=hArt(stalagmites,o=>hProp(4,o,61));barrels=hArt(barrels,o=>hProp(5,o,65));crates=hArt(crates,o=>hProp(6,o,65));
shovel=hArt(shovel,o=>hProp(8,o,58));coalCart=hArt(coalCart,o=>hProp(9,o,87));bufferStop=hArt(bufferStop,o=>hProp(10,o,65));
function hBoulder(o,x,y,w,h){hPaint(()=>{const seed=mulberry(fHash([x,y,w,h].join(':'))),path=new Path2D();path.moveTo(o.x+(x-w)*o.s,o.y+y*o.s);for(let i=0;i<=8;i++){const angle=Math.PI+i*Math.PI/8,rr=.83+seed()*.15;path.lineTo(o.x+(x+Math.cos(angle)*w*rr)*o.s,o.y+(y+Math.sin(angle)*h*rr)*o.s);}path.closePath();fctx.save();fctx.clip(path);const a=F_ATLAS.hoehlenmaterial,r=a.bounds[0];fctx.drawImage(a.img,r.x+seed()*r.w*.4,r.y+seed()*r.h*.4,r.w*.5,r.h*.5,o.x+(x-w)*o.s,o.y+(y-h)*o.s,w*2*o.s,h*o.s+1);fctx.restore();fctx.strokeStyle='#463e35';fctx.lineWidth=Math.max(.15,.45*o.s);fctx.stroke(path);});}
rubbleWall=hArt(rubbleWall,o=>{for(let row=0;row<6;row++)for(let i=0;i<10-row;i++){const x=-145+row*13+i*29,y=-row*19;hBoulder(o,x,y,18,23);}});
boulder=hArt(boulder,(o,x,y,w,h)=>hBoulder(o,x,y,w,h));
roots=hArt(roots,o=>hSprite('hoehlenobjekte',11,o.x,o.y+66*o.s,90*o.s,80*o.s));
sandPile=hArt(sandPile,o=>hProp(13,o,132));skeleton=hArt(skeleton,o=>hSprite('hoehlenbewohner',3,o.x,o.y,69*o.s));
chest=hArt(chest,(o,open)=>hSprite('requisiten',open?13:12,o.x,o.y,64*o.s));
drawSpider=hArt(drawSpider,o=>{hSprite('begegnungen',3,o.x,o.y+13*o.s,35*o.s);hForegroundSpiders.push({o,depth:ZT});});
drawMole=hArt(drawMole,o=>hSprite('hoehlenbewohner',2,o.x,o.y,42*o.s));
drawBat=hArt(drawBat,o=>{const a=F_ATLAS.begegnungen,r=a.bounds[2],w=12*o.s;hSprite('begegnungen',2,o.x,o.y+w*r.h/r.w,w);});
stoneDoor=hArt(stoneDoor,(o,open)=>{if(!open)hSprite('hoehlenobjekte',15,o.x,o.y,100*o.s,105*o.s);else hPaint(()=>{fLine([[o.x-50*o.s,o.y-104*o.s],[o.x+48*o.s,o.y-104*o.s],[o.x+48*o.s,o.y]],'#756e5c',4*o.s);});});
woodDoor=hArt(woodDoor,(o,bolts,open)=>{if(!open){hSprite('hoehlenobjekte',14,o.x,o.y,100*o.s,104*o.s);for(let i=0;i<2;i++)hPaint(()=>{const yy=o.y+(-60+i*20)*o.s,xx=o.x+(i<bolts?-8:19)*o.s;fLine([[xx,yy],[xx+18*o.s,yy]],'#a69a77',3*o.s);});}else hPaint(()=>fLine([[o.x-48*o.s,o.y],[o.x-48*o.s,o.y-100*o.s],[o.x+48*o.s,o.y-100*o.s]],'#776346',4*o.s));});
ladder=hArt(ladder,(o,h)=>hPaint(()=>{const top=o.y-h*o.s;for(const dx of [-14,14])nPole(o.x+dx*o.s,o.y,o.x+dx*o.s,top,3*o.s);for(let y=12;y<h;y+=14)nPole(o.x-14*o.s,o.y-y*o.s,o.x+14*o.s,o.y-y*o.s,2*o.s);}));
const hOldLantern=drawLantern;drawLantern=function(x,y,s=1){hOldLantern(...arguments);if(hRecording){hPaint(()=>{nGlow(x,y-10*s,20*s,.2);fLantern(x,y,s);});}};
function hDrawItem(key,x,y,ctx=fctx){
 if(key==='spitzhacke')return fSprite('hoehlenobjekte',7,x,y,24,null,ctx);
 if(key.startsWith('foto_'))return fSprite('gegenstaende',19,x,y,25,null,ctx);
 if(key==='laterne')return fLantern(x,y,1.25,ctx);
 if(key==='amethyst')return fSprite('hoehlenobjekte',12,x,y,28,null,ctx);
 if(key==='opal'){ctx.save();ctx.translate(x,y);ctx.fillStyle='#bac1ae';ctx.strokeStyle='#675f51';ctx.lineWidth=.7;ctx.beginPath();ctx.ellipse(0,-8,8,10,.25,0,7);ctx.fill();ctx.stroke();for(const [xx,yy,c]of [[-3,-12,'#72a49a'],[2,-13,'#b6a1bf'],[3,-6,'#8dabb7'],[-2,-5,'#caad75']]){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(xx,yy,2,2.5,.3,0,7);ctx.fill();}ctx.restore();return;}
 ctx.save();ctx.translate(x,y);ctx.strokeStyle='#c4b58b';ctx.lineWidth=1;
 if(key==='schluessel'){ctx.fillStyle='#7d8176';ctx.beginPath();ctx.ellipse(-5,-7,3.2,3.2,0,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(-2,-7);ctx.lineTo(9,-7);ctx.lineTo(9,-3);ctx.moveTo(5,-7);ctx.lineTo(5,-4);ctx.stroke();}
 else if(key==='oel'){ctx.fillStyle='#a67d40';ctx.beginPath();ctx.roundRect(-4,-12,8,12,2);ctx.fill();ctx.stroke();ctx.fillStyle='#c4b58b';ctx.fillRect(-2.5,-15,5,3);ctx.strokeStyle='#e8c88a';ctx.beginPath();ctx.moveTo(-2,-10);ctx.lineTo(-2,-3);ctx.stroke();}
 else{ctx.fillStyle=key==='amethyst'?'#9186a6':'#9bbab3';ctx.beginPath();ctx.moveTo(-8,-9);ctx.lineTo(-3,-16);ctx.lineTo(5,-14);ctx.lineTo(10,-8);ctx.lineTo(0,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-8,-9);ctx.lineTo(10,-8);ctx.moveTo(-3,-16);ctx.lineTo(0,0);ctx.lineTo(5,-14);ctx.stroke();}ctx.restore();}
for(const key of ['spitzhacke','schluessel','oel','amethyst','diamant','opal','foto_stollen','foto_fleder']){const old=ITEM_DRAW[key];if(old)ITEM_DRAW[key]=function(x,y){old(...arguments);if(hRecording)hPaint(()=>hDrawItem(key,x,y));};}
const hOldCaveLight=caveLight;caveLight=function(lights,lamp){hOldCaveLight(...arguments);if(!hRecording)return;
 // Webs remain behind the opaque spider, including nearby decorative corner webs.
 for(const {o,depth}of hForegroundSpiders)hSprite('begegnungen',3,o.x,o.y+13*o.s,35*o.s,null,depth);
 const data=fctx.getImageData(0,0,1280,720),pix=data.data;
 for(let y=0;y<720;y++){const yy=y/4,iy=yy|0,vy=(yy-92)/110;for(let x=0;x<1280;x++){const xx=x/4,ci=iy*W+(xx|0),t=ZB[ci],k=(y*1280+x)*4;if(EM[ci])continue;
 const v=(xx-160)/160,vg=1-.25*(v*v+vy*vy);let l=(lamp?.2+.8/(1+t*t/6):.13)*vg,lr=l*1.04,lg=l*.95,lb=l*.84;
 for(const L of lights){const dx=xx-L.x,dy=(yy-L.y)*1.15,d2=dx*dx+dy*dy;if(d2>L.R*L.R)continue;const dz=Math.abs(t-L.t),a=Math.pow(1-Math.sqrt(d2)/L.R,2)*L.I/(1+dz*dz*1.5);lr+=a*L.c[0];lg+=a*L.c[1];lb+=a*L.c[2];}
 pix[k]*=Math.min(1.25,lr);pix[k+1]*=Math.min(1.2,lg);pix[k+2]*=Math.min(1.15,lb);
 }}fctx.putImageData(data,0,0);
};
const hLegacyRender=renderCave;
renderCave=function(){if(!hActive()||!hTextures.length)return hLegacyRender();hRecording=true;hMasks=new Map();hForegroundSpiders=[];fLastItem=fLastFocus=null;try{hLegacyRender();}finally{hRecording=false;}};
const hOldCast=castCave;castCave=function(cam,T){hOldCast(cam,T);if(!hRecording)return;hGeometry=new Float32Array(ZB);hCast(cam,T);hRasterCtx.putImageData(hPixels,0,0);fctx.drawImage(hRaster,0,0,W,H);};
const hOldBuildIcons=buildIcons;buildIcons=function(){hOldBuildIcons();if(!fReady)return;for(const key of ['spitzhacke','schluessel','oel','amethyst','diamant','opal','foto_stollen','foto_fleder']){const c=document.createElement('canvas');c.width=192;c.height=128;const ctx=c.getContext('2d');ctx.scale(4,4);hDrawItem(key,24,30,ctx);ICON[key]=c.toDataURL('image/webp',.92);}};

const windowHCF=CF,windowHCHZ=CHZ;
function hCast(cam,T){const W=960,H=540,CF=windowHCF*3,CHZ=windowHCHZ*3,P=hPacked,ZB=new Float32Array(W*H),EM=new Uint8Array(W*H);const {x:px,y:py,fx,fy,rx,ry,eye}=cam,Wt=T.w;
  ZB.fill(99);EM.fill(0);
  for(let col=0;col<W;col++){
    const q=(col+.5-480)/CF,dx=fx+rx*q,dy=fy+ry*q;
    let mx=Math.floor(px),my=Math.floor(py);
    const ddx=Math.abs(1/dx),ddy=Math.abs(1/dy),sx=dx<0?-1:1,sy=dy<0?-1:1;
    let sdx=dx<0?(px-mx)*ddx:(mx+1-px)*ddx,sdy=dy<0?(py-my)*ddy:(my+1-py)*ddy;
    let t0=.05,ytop=0,ybot=H,ci=my*Wt+mx,ch=T.open[ci]?T.ceil[ci]:1;
    for(let it=0;it<80&&ytop<ybot;it++){
      let t1,side;if(sdx<sdy){t1=sdx;sdx+=ddx;mx+=sx;side=0;}else{t1=sdy;sdy+=ddy;my+=sy;side=1;}
      // Boden dieses Feldes
      const yf1=Math.ceil(CHZ+eye*CF/t1),yf0=Math.ceil(CHZ+eye*CF/t0);
      for(let y=Math.max(ytop,yf1);y<Math.min(ybot,yf0);y++){const t=eye*CF/(y+.5-CHZ),i=y*W+col;P[i]=hFloor(ci,T,px+dx*t,py+dy*t,col,y);ZB[i]=t;}
      ybot=Math.max(ytop,Math.min(ybot,yf1));
      // Decke dieses Feldes
      if(ch>eye){const a=(ch-eye)*CF,yc0=Math.floor(CHZ-a/t0),yc1=Math.floor(CHZ-a/t1);
        for(let y=Math.max(ytop,yc0);y<Math.min(ybot,yc1);y++){const t=a/(CHZ-y-.5),i=y*W+col;P[i]=hCeil(ci,T,px+dx*t,py+dy*t,col,y,ch);ZB[i]=t;}
        ytop=Math.min(ybot,Math.max(ytop,yc1));}
      const out=mx<0||my<0||mx>=Wt||my>=T.h,ni=my*Wt+mx,u=side===0?py+dy*t1:px+dx*t1;
      if(out||!T.open[ni]||t1>14){
        if(t1>14){for(let y=ytop;y<ybot;y++){const i=y*W+col;P[i]=ROCK[0];ZB[i]=99;}break;}
        // Wand: Stützbalken an den Feldgrenzen der Stollen
        const beamW=T.beam[ci]&&((side===0&&T.axis[ci]===2)||(side===1&&T.axis[ci]===1)),fr=u-Math.floor(u);
        for(let y=ytop;y<ybot;y++){const v=eye+(CHZ-y-.5)*t1/CF,i=y*W+col;P[i]=beamW&&fr<.13&&v<ch?hTex(2,u*.5,v*.5):hTex(0,u*.45+(side?.31:0),v*.45);ZB[i]=t1;}
        break;}
      const nch=T.ceil[ni];
      if(nch<ch){const yl=Math.min(ybot,Math.floor(CHZ-(nch-eye)*CF/t1));for(let y=ytop;y<yl;y++){const v=eye+(CHZ-y-.5)*t1/CF,i=y*W+col;P[i]=hTex(0,u*.45,v*.45);ZB[i]=t1;}ytop=Math.max(ytop,yl);}
      ch=nch;ci=ni;t0=t1;}}}

// New remembered photographs use the same cave illustration; stored photos stay intact.
const hEarlierFoto=fotoScene;
fotoScene=function(key){if(!hActive()||!['foto_stollen','foto_fleder'].includes(key))return hEarlierFoto(key);
 const pos={...G.pos},animals=S.world.animals,items=S.world.items,inv=S.inv.slice(),oil=S.oil,mark=G.mark,scr=G.animScr;
 try{S.world.items={};S.inv=[...new Set([...S.inv,'laterne'])];S.oil=OIL_MAX;
 if(key==='foto_stollen'){const n=G.w.N.V1;G.pos={n:'V1',e:null,k:0,h:n.rdir,arrH:n.rdir};S.world.animals={};}
 else{const ei=G.w.edges.findIndex(e=>e.a==='NM'&&e.b==='B4'),e=G.w.edges[ei];G.pos={n:null,e:ei,k:1,h:e.dir,arrH:e.dir};S.world.animals={mausohr:'e:'+e.uid+':2'};}
 renderCave();const c=document.createElement('canvas');c.width=704;c.height=424;const ctx=c.getContext('2d');ctx.fillStyle='#e8ddc5';ctx.fillRect(0,0,c.width,c.height);ctx.filter='sepia(.25) saturate(.7)';ctx.drawImage(F_CANVAS,32,32,640,360);return c.toDataURL('image/webp',.92);
 }finally{G.pos=pos;S.world.animals=animals;S.world.items=items;S.inv=inv;S.oil=oil;renderScene();G.mark=mark;G.animScr=scr;}
};

const hOldFund=fundImg,hFundImages={};
fundImg=function(key){if(!fReady||!['spitzhacke','schluessel','oel','amethyst','diamant','opal'].includes(key))return hOldFund(key);if(!hFundImages[key]){const c=document.createElement('canvas');c.width=320;c.height=240;const ctx=c.getContext('2d');ctx.scale(5,5);hDrawItem(key,32,44,ctx);hFundImages[key]=c;}return hFundImages[key];};
