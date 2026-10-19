/* Revision 15. Completed steps, consistent illustrations, persistent desert knowledge. */
function rTrailStep(e,from,to){if(!G?.ex||!inDesert())return;const trails=S.world.trails15||(S.world.trails15={}),a=new Set(trails[e.uid]||[]);for(let i=Math.min(from,to);i<Math.max(from,to);i++)a.add(i);trails[e.uid]=[...a].sort((a,b)=>a-b);}
const rStorm=endStorm;endStorm=function(){S.world.trails15={};return rStorm(...arguments);};
let rVisiblePrints=[];
uTracks=function(road){rVisiblePrints=[];const prints=(x,y,s)=>{uPrint(x,y,s);rVisiblePrints.push({x,y,s});},tr=S.world.trails15||{};
 if(G.pos.e!=null){const e=G.w.edges[G.pos.e],fw=G.pos.h===e.dir;for(const seg of tr[e.uid]||[]){const d=fw?seg+.5-G.pos.k:G.pos.k-seg-.5;if(d<=0||d>8)continue;const y=103+72/(1+d*.52);prints(160,y,Math.max(.28,(y-103)/40));}return;}
 if(!road?.n)return;const {n,h,yn,yf}=road;for(const d of [dL(h),h,dR(h)]){if(n.exits[d]==null)continue;const e=G.w.edges[n.exits[d]],set=new Set(tr[e.uid]||[]);for(let i=0;i<4;i++){if(!set.has(e.a===n.id?i:e.n-1-i))continue;if(d===h){if(road.F)prints(160,yf-3-i*4,.42-i*.05);}else{if(d===dL(h)&&road.L)prints(139-i*33,(yn+yf)/2,.68);if(d===dR(h)&&road.R)prints(181+i*33,(yn+yf)/2,.68);}}}
};
// One continuous dune basin; never stretch a single sky row into a different landscape.
uTerrain=function(){uDuneScene(0);};
uSoil=function(path){
 fctx.save();fctx.fillStyle='#d6b379';fctx.globalAlpha=.79;fctx.filter='blur(3px)';fctx.fill(path);fctx.restore();
 fctx.save();fctx.clip(path);fctx.globalAlpha=.24;uTexture(0,0,103,W,77);fctx.fillStyle='#d8b77f';fctx.globalAlpha=.40;fctx.fill(path);fctx.globalAlpha=1;const rnd=mulberry(149);for(let i=0;i<125;i++){const y=105+rnd()*75,x=rnd()*W,k=(y-103)/77;uLine(fctx,[[x,y],[x+2*k,y-.3*k,x+4*k,y]],i%3?'#f3d39955':'#a8865538',.15+.18*k);}fctx.restore();
};
const rShelter=uShelterPatch;
uShelterPatch=function(x,y,rx=48,ry=13){rShelter(x,y,rx*1.12,ry*1.35);fctx.save();const g=fctx.createRadialGradient(x,y,rx*.12,x,y,rx*1.2);g.addColorStop(0,'#333e3b99');g.addColorStop(.65,'#37413e7d');g.addColorStop(1,'#414a4300');uEllipse(fctx,x,y,rx*1.13,ry*1.4,g);fctx.restore();};
const rPlace=uPlace;
uPlace=function(n){if(n.place==='stadt'){const a=F_ATLAS.stadtzugang;fctx.drawImage(a.img,0,0,a.img.width,a.img.height,0,0,W,H);uLastFocus={x:162,y:107,base:153,keyHint:' '};return;}const value=rPlace(n);if(n.place==='geheim'&&n.revealed&&!n.solved){uLastFocus={x:166,y:123,base:144,keyHint:n.open?'U':'G'};if(n.open)G.rGateClose=false;if(G.rGateClose){const c=document.createElement('canvas');c.width=1280;c.height=720;c.getContext('2d').drawImage(F_CANVAS,0,0);fctx.drawImage(c,90*4,83*4,150*4,84.375*4,0,0,W,H);uLastFocus={x:162,y:79,base:137,keyHint:'G'};}}return value;};
const rGate=uRoseGate;
uRoseGate=function(n){fctx.save();fctx.translate(166,142);fctx.scale(.50,.43);fctx.translate(-160,-148);rGate(n);fctx.restore();};

// Extract complete poses into equal-sized canvases, with a common head/ground baseline.
const R_HUMAN=[],R_ANIMAL=[];
function rPoseRow(sheet,cells){const a=F_ATLAS[sheet],im=a.img,boxes=cells.map(([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,x,y,w,h,0,0,w,h);const pix=g.getImageData(0,0,w,h).data;let l=w,t=h,r=0,b=0;for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(pix[(yy*w+xx)*4+3]>80){l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy);}return {c,l,t,w:r-l+1,h:b-t+1};});const height=Math.max(...boxes.map(b=>b.h)),width=Math.max(...boxes.map(b=>b.w));return boxes.map(b=>{const c=document.createElement('canvas');c.width=width+24;c.height=height+16;c.getContext('2d').drawImage(b.c,b.l,b.t,b.w,b.h,(c.width-b.w)/2,c.height-8-b.h,b.w,b.h);return c;});}
function rFrame(ctx,frames,i,x,base,width=null,height=null,face=1){const c=frames[i%frames.length];if(!c)return;const h=height||width*c.height/c.width,w=width||height*c.width/c.height;ctx.save();ctx.translate(x,base+h*8/c.height);ctx.scale(face,1);ctx.drawImage(c,-w/2,-h,w,h);ctx.restore();return {x:x-w/2,y:base-h,w,h};}
uPlayer=function(x,y,face,t){uShadow(x,y+1,9,1);const i=t?1+Math.floor(t/4)%8:0;return rFrame(fctx,R_HUMAN,i,x,y, null,46,face<0?-1:1);};
const rCityFrame=cityFrame;
cityFrame=function(dt){if(rInn)return;const C=G?.city;if(!C)return;const d=C.tx-C.x,walk=Math.sign(d)*Math.min(Math.abs(d),dt*57);if(Math.abs(d)>.1){C.x+=walk;C.anim=(C.anim||0)+Math.abs(walk);C.moving=true;}else{C.x=C.tx;C.moving=false;}};
// Keep the established continuous harbor and stations, but the entrance is behind us.
cityDraw=function(now){if(!uActive()||!G.city)return uCityDraw(now);const C=G.city;ccam=Math.max(0,Math.min(CITY_W-CVW,C.x-CVW/2));fctx.clearRect(0,0,W,H);const a=F_ATLAS.hafenpanorama;fctx.save();fctx.scale(CZ,CZ);fctx.translate(-ccam,-CY0);fctx.drawImage(a.img,0,0,a.img.width,a.img.height,0,-17,CITY_W,212);uRect(fctx,0,122,CITY_W,15,'#dfc69b');
 for(const st of CITY_ST){if(st.id==='tor')continue;const idx={haendler:1,schiff:2,mann:5,herberge:3}[st.id],width={haendler:65,schiff:70,mann:22,herberge:72}[st.id];fSprite('hafenbauten',idx,st.x,CITY_GY,width,st.id==='mann'?44:null,fctx);U_AUDIT.city.add(st.id);}
 uPath(fctx,[[401,142],[410,142],[422,174],[412,174]],'#806548','#594b3c',.6);for(let y=145;y<174;y+=3)uLine(fctx,[[402+(y-142)*.35,y],[411+(y-142)*.35,y]],'#ad8b5c',.4);fSprite('hafenbauten',4,442,181,105,null,fctx);uLine(fctx,[[563,91],[572,91],[572,97]],'#70583b',.8);uRect(fctx,567,96,11,10,'#64513c');uEllipse(fctx,572,101,3.2,3.2,'#f2dc9f');uEllipse(fctx,574,100,2.9,2.9,'#64513c');
 if(!C.noPlayer){let x=C.x,alpha=1,t=C.moving?C.anim:0;if(rInn){const e=rInn.elapsed,p=e<1200?Math.min(1,e/1200):e>3300?Math.max(0,1-(e-3300)/1200):1;x=rInn.x+(rInn.door-rInn.x)*p;alpha=e<1200?Math.min(1,(1200-e)/280):e>3300?Math.min(1,(e-3300)/280):0;t=e*.045;}fctx.save();fctx.globalAlpha=alpha;uPlayer(x,CITY_GY,C.face,t);fctx.restore();}fctx.restore();uLight();};
const rAnimalAction=uAnimalAction;
uAnimalAction=function(kind,fn){const value=rAnimalAction(kind,fn);if(qEffect?.u)qEffect.duration=kind==='pet'?4800:4500;return value;};
const rAnimalDraw=qDrawAnimal;
qDrawAnimal=function(e,t){if(!e.u||!U_ANIMALS.slice(0,6).includes(e.a)||e.kind==='tent')return rAnimalDraw(e,t);const b=e.box||{x:140,y:110,w:40,h:30},wait=e.kind==='pet'?1850:1500,base=b.y+b.h,cx=b.x+b.w/2;if(t<wait){if(e.kind==='pet')return rAnimalDraw(e,t);for(let i=0;i<Math.max(0,7-Math.floor(t/210));i++)uEllipse(vx,cx-b.w*.25+(i%3)*1.3,base+Math.floor(i/3)*.5,.7,.4,'#a97d45');fSprite('wuestentiere',U_ANIMALS.indexOf(e.a),cx,base+Math.sin(t/220)*.3,b.w,null,vx);return;}
 const p=Math.min(1,(t-wait)/(e.duration-wait)),dist=p*(cx+b.w),frames=R_ANIMAL[U_ANIMALS.indexOf(e.a)],phase=Math.floor(dist/(e.a==='dromedar'?9:5))%4,hop=e.a==='springmaus'?Math.max(0,Math.sin(dist/7))*4:0,fly=e.a==='flughuhn'?p*85:0;rFrame(vx,frames,phase,cx-dist,base-hop-fly,b.w,null,1);
};

// Inn: payment is made by the existing menu; this sequence never charges again.
let rInn=null;
const rSleep=sleepInn;
function rInnApply(){if(!rInn||rInn.applied)return;rInn.applied=true;delete S.world.innStayPending;rSleep();G.phase='innSleep';save();}
function rInnFinish(){if(!rInn)return;rInnApply();rInn=null;G.phase='city';G.city.moving=false;save();renderScene();cityCaption();setCaption([`Tag ${S.world.day}. Du trittst aus der Herberge. Es ist 7 Uhr morgens.`,'Du hast geschlafen und setzt deinen Weg durch die Stadt fort.'],true);updateControls();}
sleepInn=function(){if(rInn)return;cityClose();rInn={game:G,x:G.city.x,door:522,elapsed:0,last:performance.now(),applied:false};S.world.innStayPending={day:S.world.day,x:G.city.x};save();G.phase='innSleep';setCaption(['Du gehst in die Herberge.','Leertaste: Übernachtung abschließen.'],true);updateControls();};
const rEnterCity=enterCity;enterCity=function(resume){if(rInn&&rInn.game!==G)rInn=null;const v=rEnterCity(resume);if(S.world.innStayPending){const pending=S.world.innStayPending;G.city.x=G.city.tx=pending.x||532;if(S.world.day>pending.day){delete S.world.innStayPending;save();}else sleepInn();}return v;};
const rDraw=draw;draw=function(now){if(rInn&&rInn.game!==G)rInn=null;if(rInn){const dt=Math.max(0,Math.min(100,now-rInn.last));rInn.last=now;if(!paused)rInn.elapsed+=dt;if(rInn.elapsed>=2400&&!rInn.applied)rInnApply();if(rInn.elapsed>=4500)rInnFinish();if(rInn)cityDraw(now);}rDraw(now);if(rInn){const t=rInn.elapsed,alpha=t<1200?0:t<1800?(t-1200)/600:t<2500?1:t<3300?1-(t-2500)/800:0;uRect(vx,0,0,W,H,`rgba(13,21,34,${alpha})`);if(alpha>.75){vx.fillStyle='#e9dfbd';vx.font='8px Georgia';vx.textAlign='center';vx.fillText(t<2500?'Eine ruhige Nacht in der Herberge …':'Der Morgen bricht an …',160,90);}}};
const rExpected=expected,rActions=actionsNow,rHit=onHit;
expected=function(){return rInn?(paused?[]:[' ']):rExpected();};actionsNow=function(){return rInn?[[' ','Übernachtung abschließen']]:rActions();};onHit=function(ch){if(rInn){if(ch===' '&&!paused)rInnFinish();return;}if(G?.rGateClose&&ch==='Backspace'){G.rGateClose=false;renderScene();updateControls();return;}return rHit(ch);};
// Knowledge belongs to the saved expedition, not to an encounter's temporary spot.
const R_FACTS={
 'plant:palme':['Dattelpalme','Datteln sind essbar. Nur reife Früchte sammeln; vor dem Essen säubern. Die Palmwedel eignen sich für ein Zeltdach.'],
 'plant:kaktus':['Feigenkaktus','Die Kaktusfeigen sind essbar. Die feinen Stacheln sorgfältig entfernen und die Frucht schälen. Nicht mit bloßen Händen greifen.'],
 'plant:oscher':['Oscher','Giftig. Der weiße Milchsaft reizt Haut und Augen. Weder Früchte noch Pflanzenteile essen.'],
 'plant:koloquinten':['Koloquinte','Giftige Bitterfrüchte. Nicht essen, auch nicht probieren. Keine essbare Wüstenmelone.'],
 'plant:akazie':['Schirmakazie','Der flache Schirm wirft Schatten. Vorsicht vor den Dornen. Trockene Zweige können als Baumaterial dienen.'],
 'plant:tamariske':['Tamariske','Ein salzverträglicher Baum mit feinen Zweigen. Hier findest du Schatten, aber keine Nahrung.'],
 'plant:jericho':['Rose von Jericho','Eine trockene Wüstenpflanze, die sich bei Feuchtigkeit entfaltet. Kein Lebensmittel.'],
 'plant:blueten':['Wüstenblüten','Blühende Wüstenpflanzen. Ohne sichere Artbestimmung nicht essen.'],
 'plant:gras':['Wüstengras','Die zähen Halme halten Sand fest. Für Menschen keine Nahrung.'],
 'plant:dornbusch':['Dornstrauch','Dichtes, dorniges Geäst. Keine sicher bestimmte Nahrung.'],
 'item:datteln':['Datteln','Essbar: reife Früchte der Dattelpalme. Säubern und den harten Kern entfernen.'],
 'item:kaktusfeigen':['Kaktusfeigen','Essbar nach dem Entfernen der feinen Stacheln und der Schale.'],
 'water':['Wasserstelle','Hier kannst du trinken und deinen Wasserbeutel füllen. In der wirklichen Wüste muss Wasser aufbereitet werden.'],
};
function rKnown(k){return !!S.desertKnown15?.[k];}
function rCanEat(k){return rKnown('item:'+k);}
function rLearn(k){S.desertKnown15=S.desertKnown15||{};S.desertKnown15[k]=true;if(k==='plant:palme')S.desertKnown15['item:datteln']=true;if(k==='plant:kaktus')S.desertKnown15['item:kaktusfeigen']=true;}
function rInfo(k){if(R_FACTS[k])return R_FACTS[k];const [type,id]=k.split(':');if(type==='animal'){const a=DTIERE[id];return [DEAD[id]?.sp||id,a.danger?'Giftig. Abstand halten: warten oder außen herum gehen. Nicht streicheln.':id==='dornteufel'?'Eine pflanzenfressende Dornschwanzagame aus Nordafrika. In Ruhe vorbeigehen.':(DSPEC.find(s=>s.n===DEAD[id]?.sp)?.f||'Ein Wüstentier. Beobachte es ruhig und halte Abstand.')];}if(type==='item')return [ITEMS[id]?.name||id,ITEMS[id]?.text||'Ein Fundstück. Kein Lebensmittel.'];return [DLMK[id]?.[1]?.replace(/^am |^an der |^an den /,'')||id,'Ein Wegmarker zur Orientierung. Keine Nahrung.'];}
function rContexts(){if(!G?.ex||!inDesert()||G.city)return [];const list=[],a=animalHere(),it=itemHere(),n=G.pos.e==null?curNode():null;if(a)list.push('animal:'+a);if(it&&!it.startsWith('foto_'))list.push('item:'+it);if(n){if(n.place==='oase')list.push('plant:palme','water');else if(n.place==='kakteen')list.push('plant:kaktus');else if(n.place==='wadi'){list.push('plant:akazie');if(n.spring)list.push('water');}if(n.lm&&n.lm!=='flimmern')list.push((['palme','kaktus','oscher','koloquinten','akazie','tamariske','jericho','blueten','gras','dornbusch'].includes(n.lm)?'plant:':'marker:')+n.lm);}for(const key of ['datteln','kaktusfeigen'])if(S.res[key]>0&&!rCanEat(key))list.push('item:'+key);return [...new Set(list)];}
function rUnknown(){return rContexts().find(k=>!rKnown(k));}
const rSighting=sighting;sighting=function(a){if(inDesert()&&DTIERE[a]&&!rKnown('animal:'+a))return;return rSighting(a);};
function rApplyAnimalKnowledge(){const a=G?.ex&&inDesert()?obstHere():null;if(a&&rKnown('animal:'+a)){G.obsId=spotKey();if(!DTIERE[a].danger)G.passOk=spotKey();}}
const rArrive=arrive;arrive=function(){rApplyAnimalKnowledge();const value=rArrive(...arguments);const a=G?.ex&&inDesert()&&!G.city?animalHere():null;if(a&&!rKnown('animal:'+a)){setCaption(['Ein noch unbekanntes Wüstentier. Was ist das?','I: bestimmen und sein Verhalten prüfen.'],true);updateControls();}return value;};
function rIdentify(){const k=rUnknown();if(!k)return;rLearn(k);const [name,fact]=rInfo(k);if(k.startsWith('animal:')){const a=k.slice(7);rSighting(a);rApplyAnimalKnowledge();renderABox(a);}save();renderInv();setCaption([name+'. '+fact,'Im Feldtagebuch vermerkt. Du musst das künftig nicht erneut bestimmen.'],true);updateControls();}
identifyObst=function(){return rIdentify();};
const rABox=renderABox;renderABox=function(a){if(inDesert()&&DTIERE[a]&&!rKnown('animal:'+a)){const b=$('#abox');b.innerHTML='<b>Unbekanntes Wüstentier</b><p>I: bestimmen und Verhalten prüfen.</p>';b.hidden=false;return;}return rABox(a);};
const rOpts=desertOpts;
desertOpts=function(){rApplyAnimalKnowledge();let out=rOpts().filter(o=>o[0]!=='i');const a=animalHere(),it=itemHere(),h=here();if(a&&!rKnown('animal:'+a))out=out.filter(o=>!['k','h','s','r'].includes(o[0]));if(it&&!it.startsWith('foto_')&&!rKnown('item:'+it))out=out.filter(o=>o[0]!=='g');if(h.place==='oase'&&!rCanEat('datteln')||h.place==='kakteen'&&!rCanEat('kaktusfeigen'))out=out.filter(o=>o[0]!=='p');if(hasWater(h)&&!rKnown('water'))out=out.filter(o=>!['w','g'].includes(o[0]));if(h.place==='geheim'&&h.revealed&&!h.open)out.push(['u',G.rGateClose?'zur Gesamtansicht':'Eingang näher ansehen',()=>{G.rGateClose=!G.rGateClose;renderScene();setCaption(['Die Steinplatte sitzt im Eingang unter der Düne.',G.rGateClose?'G: Sandrose einsetzen. U: Gesamtansicht.':'U: näher ansehen. G: Sandrose einsetzen.'],true);updateControls();}]);const k=rUnknown();if(k)out.unshift(['i','bestimmen: '+(k.startsWith('animal:')?'Tier':k==='water'?'Wasserstelle':k.startsWith('plant:')?'Pflanze':'Fund oder Wegmarker'),rIdentify]);return out;};DESERT_EX.opts=desertOpts;
const rLines=desertLines;desertLines=function(){const lines=rLines(...arguments),a=animalHere(),it=itemHere();if(a&&!rKnown('animal:'+a))return ['Ein noch unbekanntes Tier. Beobachte es aus sicherem Abstand.','I: bestimmen. Danach kennst du seine Art und das passende Verhalten.'];if(it&&!it.startsWith('foto_')&&!rKnown('item:'+it))return ['Auf dem Weg liegt etwas. Was ist das?','I: erst bestimmen, dann aufheben.'];const k=rUnknown();if(k&&G.pos.e==null&&!G.city){const n=curNode(),hint=k==='water'?'I: Wasserstelle untersuchen.':k.startsWith('plant:')?'I: Pflanze bestimmen. Ist sie essbar?':'I: Wegmarker oder Fund bestimmen.';return [lines?.[0]||'Du schaust dich um.',hint+' '+(here().t==='fork'?desertExits(n,G.pos.h):'Rücktaste: umdrehen.')];}return lines;};DESERT_EX.lines=desertLines;
const rPickD=pickD;pickD=function(n,k,txt){if(!rCanEat(k)){setCaption(['Du kennst diese Früchte noch nicht.','I: bestimmen, bevor du sie sammelst oder isst.'],true);return;}return rPickD(n,k,txt);};
const rJournal=journalPages;journalPages=function(){const pages=rJournal(),entries=Object.keys(S.desertKnown15||{}).filter(k=>!(k==='item:datteln'&&rKnown('plant:palme'))&&!(k==='item:kaktusfeigen'&&rKnown('plant:kaktus')));if(!entries.length)return pages;const extra=[];for(let i=0;i<entries.length;i+=4)extra.push({tab:'Wüste',title:'Bestimmte Arten und Funde',cls:'',html:entries.slice(i,i+4).map(k=>{const [n,f]=rInfo(k);return '<p><b>'+esc(n)+'</b><br>'+esc(f)+'</p>';}).join('')});if(extra.length%2)extra.push({tab:'Wüste',title:'',html:'',cls:'empty'});const at=pages.findIndex(p=>p.tab==='Funde');pages.splice(at<0?pages.length:at,0,...extra);return pages;};

// Photos are a single upright exposure. Creases change paper lighting, never image geometry.
const R_PHOTOS=new Map();
function rPhotoScene(key){if(R_PHOTOS.has(key))return R_PHOTOS.get(key);const oldG=G,oldWorld=S.world,oldWhere=S.where,oldInv=S.inv,oldOil=S.oil,meta=[fLastItem,fLastAnimal,fLastFocus,uLastAnimal,uLastItem,uLastFocus],pixels=fctx.getImageData(0,0,1280,720),rec=dRecording,hr=hRecording;let src;
 try{dRecording=true;hRecording=true;uPhotoBusy=true;
 if(key==='foto_huette')dScene('orte5a',0);
 else if(key==='foto_reh'){dScene('grundwald',0);dAnimal('reh');}
 else if(key==='foto_duene'){uDuneScene(3);uRoseGate({open:false,roses:0});}
 else if(key==='foto_hafen'){S.where='wueste';S.world={...oldWorld,kind:'wueste',time:600};G={...oldG,ex:DESERT_EX,city:{x:390,tx:390,face:1,anim:0,moving:false,noPlayer:true}};cityDraw(performance.now());}
 else{const seed=4713,w=genWorld(seed,CAVE_DEF);caveTiles(w);S.world={seed,kind:'hoehle',time:600,day:1,items:{},animals:{},flags:{}};S.where='hoehle';S.inv=[...new Set([...oldInv,'laterne'])];S.oil=OIL_MAX;const n=w.N.V1;G={...oldG,seed,w,cave:true,ex:null,city:null,pos:{n:'V1',e:null,k:0,h:n.rdir,arrH:n.rdir},phase:'explore'};if(key==='foto_fleder'){const ei=w.edges.findIndex(e=>e.a==='NM'&&e.b==='B4'),e=w.edges[ei];G.pos={n:null,e:ei,k:1,h:e.dir,arrH:e.dir};S.world.animals={mausohr:'e:'+e.uid+':2'};}renderCave();}
 const c=document.createElement('canvas');c.width=704;c.height=424;const g=c.getContext('2d');g.fillStyle='#e7ddc5';g.fillRect(0,0,704,424);g.filter='sepia(.12) saturate(.88)';g.drawImage(F_CANVAS,0,0,1280,720,32,32,640,360);g.filter='none';const crease=g.createLinearGradient(338,0,354,0);crease.addColorStop(0,'#fff9e300');crease.addColorStop(.45,'#fff9e322');crease.addColorStop(.53,'#6653421c');crease.addColorStop(1,'#66534200');g.fillStyle=crease;g.fillRect(338,24,16,376);src=c.toDataURL('image/webp',.91);R_PHOTOS.set(key,src);return src;
 }finally{G=oldG;S.world=oldWorld;S.where=oldWhere;S.inv=oldInv;S.oil=oldOil;dRecording=rec;hRecording=hr;uPhotoBusy=false;fctx.putImageData(pixels,0,0);[fLastItem,fLastAnimal,fLastFocus,uLastAnimal,uLastItem,uLastFocus]=meta;}}
fotoScene=function(key){const src=rPhotoScene(key),cacheKey=(S.world?.seed||0)+':'+key;if(!qPhotoCache.has(cacheKey)){const im=new Image();im.src=src;qPhotoCache.set(cacheKey,im);im.onload=()=>{if(G&&!qPhotoBusy)renderScene();};}return src;};
forestReady.then(()=>{
 const h=F_ATLAS.stadtgang.img,cw=h.width/3,ch=h.height/3;R_HUMAN.push(...rPoseRow('stadtgang',Array.from({length:9},(_,i)=>[Math.round(i%3*cw),Math.round(Math.floor(i/3)*ch),Math.floor(cw),Math.floor(ch)])));
 const a=F_ATLAS.wuestengang.img,ys=[0,196,430,595,765,1058,a.height];const xs=[[0,335,650,975,a.width],[0,324,637,952,a.width],[0,342,650,968,a.width],[0,350,657,971,a.width],[0,326,638,950,a.width],[0,314,628,942,a.width]];for(let row=0;row<6;row++)R_ANIMAL.push(rPoseRow('wuestengang',Array.from({length:4},(_,i)=>[xs[row][i],ys[row],xs[row][i+1]-xs[row][i],ys[row+1]-ys[row]])));
 S.desertKnown15=S.desertKnown15||{};if(!S.desertKnowledgeMigration15){for(const a of U_ANIMALS){const sp=DEAD[a].sp;if(S.seen?.[sp]||S.photos?.[sp]||S.fed?.[sp]||S.pet?.[sp])rLearn('animal:'+a);}for(const k of ['datteln','kaktusfeigen'])if(S.res[k]>0)rLearn('item:'+k);S.desertKnowledgeMigration15=true;}
 qPhotoCache.clear();if(S.album&&S.photoArt15!==15){for(const key of Object.keys(S.album))if(key.startsWith('foto_'))S.album[key]={...S.album[key],img:fotoScene(key)};S.photoArt15=15;}save();window.forestArt.version='4.7 Waldatelier 15 – Klare Wege und lebendige Hafenstadt';
});

const rOverlay=desertOverlay;desertOverlay=function(now){rOverlay(now);if(uActive()&&!G.city&&!G.puz&&!G.storm&&!qEffect&&rUnknown()){const f=uLastItem||uLastFocus;if(f)uLabel(vx,'I',f.cx??f.x??160,Math.min(164,f.base+11));}};DESERT_EX.overlay=desertOverlay;
