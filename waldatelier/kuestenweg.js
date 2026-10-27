/* One coastal pass for the complete final approach, using the established city entrance. */
function d17Coast(){if(!uActive()||G.city||G.pos.e==null)return null;const e=G.w.edges[G.pos.e],forward=G.pos.h===e.dir,n=G.w.N[forward?e.b:e.a];return n.place==='stadt'?{e,n,dist:forward?e.n-G.pos.k:G.pos.k}:null;}
function d17CoastPlate(progress){const a=F_ATLAS.stadtzugang,zoom=1+.12*Math.max(0,Math.min(1,progress)),sw=a.img.width/zoom,sh=a.img.height/zoom;fctx.drawImage(a.img,(a.img.width-sw)/2,(a.img.height-sh)*.58,sw,sh,0,0,W,H);}
const d17DesertDest=desertDest;desertDest=function(e,h){const n=G.w.N[h===e.dir?e.b:e.a];return n.place==='stadt'?'Der Weg führt zwischen hohen Felsen zum Stadttor. Dahinter liegen die Stadt und das Meer.':d17DesertDest(e,h);};
const d17Place=uPlace;uPlace=function(n){if(n.place==='stadt'){d17CoastPlate(1);uLastFocus={x:162,y:107,base:153,keyHint:' '};return;}return d17Place(n);};
const d17DesertRender=renderDesert;
renderDesert=function(){const coast=d17Coast();if(!coast)return d17DesertRender();uLastAnimal=uLastItem=uLastFocus=null;uShadeAreas=[];fctx.clearRect(0,0,W,H);d17CoastPlate(1-coast.dist/coast.e.n);uTracks(null);
 const item=itemHere();if(item&&!uPhotoBusy){const box=uItem(item,159,157,1);uLastItem={key:item,...box,cx:159,base:157};}
 const a=animalHere();if(a&&!uPhotoBusy)uAnimal(a);if(G.guide&&!uPhotoBusy){const rd=guideRel();if(rd!=='B')uAnimal('flughuhn',rd==='L'?51:rd==='R'?269:166,113,21,false);}
 G.mark=null;G.animScr=uLastAnimal?[Math.round(uLastAnimal.x+uLastAnimal.w/2),Math.round(uLastAnimal.y+uLastAnimal.h/2)]:null;uLight();
};DESERT_EX.render=renderDesert;
