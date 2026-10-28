/* Version 19: puzzle-local keys, intact pencil notebook page and explicit turn guidance. */
// The seeded partition and its ordering remain identical. Migrate saved letters by
// their original list positions so a partially solved page keeps exactly its pieces.
function o19MigratePageKeys(){const state=S.world?.locks?.seite;if(!state||state.keyVersion===19)return;const old=['y','x','c','v','b','n','m',',','.','-'],keys=LOCK_DEFS.seite.letters.flat();state.used=(state.used||[]).map(k=>old.includes(k)?keys[old.indexOf(k)]:k);state.keyVersion=19;save();}
// Persist the actual piece layout: the legacy random sort comparator can produce
// different partitions after browser optimisation, despite the same seed.
const o19StartLock=startLock;startLock=function(h,kind){
 if(kind==='seite')o19MigratePageKeys();const result=o19StartLock(h,kind);
 S.world.locks=S.world.locks||{};const state=S.world.locks[kind]=S.world.locks[kind]||{used:[]};
 if(state.layout19?.length===10){G.lock.stones=state.layout19.map(t=>({...t,rel:t.rel.map(c=>({...c})),used:false}));G.lock.placed={};for(const t of G.lock.stones)if(state.used.includes(t.letter))placeStone(G.lock,t);renderLock();}
 else state.layout19=G.lock.stones.map(({letter,side,rot,tx,ty,rel})=>({letter,side,rot,tx,ty,rel:rel.map(c=>({...c}))}));
 if(kind==='seite')state.keyVersion=19;save();return result;
};
// Full paper is retained for the solved page and journal. Only the actual puzzle
// cells are cut into pieces; the source motif never moves or gets rearranged.
const o19Page=new Image();
const o19PageReady=new Promise((resolve,reject)=>{o19Page.onload=resolve;o19Page.onerror=reject;});
o19Page.src=O19_SKETCH;
LOCK_DEFS.seite.paint=function(d){const c=document.createElement('canvas');c.width=d.KW*16*8;c.height=d.KH*16*8;const g=c.getContext('2d');g.drawImage(o19Page,0,0,c.width,c.height);return c.toDataURL('image/webp',.92);};
const o19Puzzle=fPuzzle;fPuzzle=function(d,kind){return kind==='seite'?d.paint(d):o19Puzzle(d,kind);};
// Cell CSS expects a source width of KW cells; high resolution is downsampled by
// background-size, while the completed notebook image keeps its pencil texture.
const o19Fork=document.createElement('div');o19Fork.id='o19-junction';o19Fork.hidden=true;o19Fork.setAttribute('role','status');o19Fork.setAttribute('aria-live','polite');$('#stage').append(o19Fork);
function o19Directions(){if(!G||G.phase!=='explore'||G.pos.e!=null||G.puz||G.detour||G.storm?.st==='qte'||vSky||G.sky||G.ex?.modal?.())return [];const mv=nodeMoves();return [['f','←','Links'],[' ','↑','Geradeaus'],['j','→','Rechts']].filter(([k])=>mv[k]!=null);}
let o19ForkSignature='';
function o19UpdateFork(){const dirs=o19Directions(),show=dirs.some(([k])=>k==='f'||k==='j')&&!paused&&!trans&&!qEffect&&!p18ModalActive()&&$('#ov-page').hidden&&$('#ov-done').hidden&&$('#ov-goal').hidden;o19Fork.hidden=!show;if(!show){o19ForkSignature='';return;}const sig=G.pos.n+':'+G.pos.h+':'+dirs.map(d=>d[0]).join('');if(sig===o19ForkSignature)return;o19ForkSignature=sig;o19Fork.innerHTML='<strong>'+(dirs.length>1?'Abzweigung erreicht · Wähle deinen Weg':'Hier biegt der Weg ab')+'</strong><div>'+dirs.map(([k,arrow,label])=>'<span><b>'+arrow+'</b> <kbd>'+ (k===' '?'Leertaste':k.toUpperCase())+'</kbd> '+label+'</span>').join('')+'</div>';}
const o19Draw=draw;draw=function(now){o19Draw(now);o19UpdateFork();};
// A step typed during the last walking animation must not become a turn. The
// visible junction requires a fresh key press; straight paths retain buffering.
const o19ProcessPending=processPending;processPending=function(){if(!trans&&['f','j',' '].includes(pending)&&o19Directions().some(([k])=>k==='f'||k==='j'))pending=null;return o19ProcessPending();};
const o19Ready=Promise.all([P18_READY,o19PageReady]).then(()=>{delete LOCK_DEFS.seite.KW;delete LOCK_DEFS.seite.img;delete LOCK_DEFS.seite.fIllustrated;o19MigratePageKeys();window.forestArt.version='4.7 Waldatelier 19 – Orientierung und Tagebuchskizze';});

// The existing ruin trail keeps its node/edge IDs. Make entry explicit and add
// an actual, once-only loose food supply on the clearing (independent of deer).
function o19Clearing(){return qForest()&&G.phase==='explore'&&G.pos.e==null&&G.pos.n==='REHKRIPPE'&&G.pos.h===0;}
function o19FoodLeft(){return Math.max(0,3-(S.world.roeClearing?.foodTaken19||0));}
const o19ItemHere=itemHere;itemHere=function(){return o19Clearing()&&o19FoodLeft()>0?'tierfutter':o19ItemHere();};
const o19ClearingScene=sceneDead;sceneDead=function(d,r){const result=o19ClearingScene(...arguments);if(dRecording&&d.id==='REHKRIPPE'&&o19FoodLeft()>0)fItem('tierfutter',69,161,.9);return result;};
const o19Ruin=dRuin;dRuin=function(d){o19Ruin(d);if(d.open&&d.got)fLastFocus={cx:160,y:78,base:116,keyHint:'␣'};};
const o19Actions=actionsNow;actionsNow=function(){const actions=o19Actions();if(qForest()&&G.phase==='explore'&&G.pos.e==null&&G.pos.n==='RU'&&G.pos.h===3&&G.w.N.RU.open&&!qEffect){const entry=actions.find(a=>a[0]===' ');if(entry)entry[1]='durch die Ruine gehen';}return actions;};
function o19ClearingCaption(){const left=qHerdLeft(),food=o19FoodLeft();setCaption([left?(left===3?'Drei Rehe stehen':left===2?'Zwei Rehe stehen':'Ein Reh steht')+' an der Futterkrippe.':'Die Rehe sind zwischen den Bäumen weitergezogen.',(food?'G: '+food+' Portionen Tierfutter aufheben. ':'')+(left?'H: füttern · S: streicheln · K: Reh fotografieren. ':'')+'F5: die Lichtung fotografieren. Rücktaste: zurück.'],true);}
const o19Arrive=arrive;arrive=function(){const result=o19Arrive(...arguments);if(o19Clearing())o19ClearingCaption();return result;};
const o19Pick=pick;pick=function(){if(!o19Clearing()||!o19FoodLeft())return o19Pick(...arguments);const qty=Math.min(o19FoodLeft(),Math.max(0,FOOD_CAP-(S.food||0)));if(!qty){setCaption(['Dein Tierfuttervorrat ist voll.','Das Futter bleibt hier liegen. Du kannst es später aufheben.'],true);return;}S.world.roeClearing=S.world.roeClearing||{helped:0};S.world.roeClearing.foodTaken19=(S.world.roeClearing.foodTaken19||0)+qty;S.food=(S.food||0)+qty;SND.pick();save();renderInv('tierfutter');renderScene();o19ClearingCaption();qBegin('loot',{loot:[['tierfutter',qty]],title:'An der Futterkrippe gefunden',duration:3200});updateControls();};
const o19TakePage=takePage;takePage=function(h){const result=o19TakePage(...arguments);if(h?.secret==='ruine'&&h.open)setCaption([...G.caption,'Leertaste: durch die Ruine zur Futterkrippe gehen.'],true);return result;};
const o19OpenCamera=p18OpenCamera;p18OpenCamera=function(animalMode=false){const result=o19OpenCamera(...arguments);if(o19Clearing()&&p18Camera&&!animalMode){p18Camera.size=160;p18Camera.x=80;p18Camera.y=10;}return result;};
const o19AddPhoto=p18AddPhoto;p18AddPhoto=function(src,title,kind){return o19AddPhoto(src,o19Clearing()&&kind==='scene'?'Futterkrippe hinter der Ruine':title,kind);};

function o19RuinPosition(w,p){if(!w.N.RU?.open)return false;const ids=['RU_WEG','REHKRIPPE'];if(p.e==null)return ids.includes(p.n);const e=w.edges[p.e];return !!e&&(ids.includes(e.a)||ids.includes(e.b));}
const o19ShowPage=showPage;showPage=function(){const r=o19ShowPage();$('#page-img').classList.remove('p18-found-print');$('#page-img').alt='Tagebuchskizze: Dromedar, Fennek und Skorpion';return r;};
const o19Snap=showSnap;showSnap=function(src,title){return o19Snap(src,o19Clearing()&&title==='Unterwegs im Wald'?'Futterkrippe hinter der Ruine':title);};
