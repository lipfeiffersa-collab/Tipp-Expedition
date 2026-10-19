"""Browser checks for world-linked markers, sign directions and actual forest puzzles."""
from playwright.sync_api import sync_playwright
from pathlib import Path
from tempfile import mkdtemp
import json
OUT=Path(mkdtemp(prefix='wald-details-'))
URL='http://127.0.0.1:8031/Tipp-Expedition/Tipp-Expedition-4.7-Waldatelier.html'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1000});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL);pg.locator('#btn-play').click();pg.keyboard.press('f');pg.wait_for_timeout(250);pg.keyboard.press('j');pg.wait_for_timeout(350)
 setup="paused=true;G.phase='explore';G.enc=null;G.guide=null;G.flashT=0;trans=null;S.world.animals={};S.world.items={};S.known=[...new Set([...S.known,'u','g','l',' ','Backspace','f','j','d','s','a'])];S.needs={w:DROP_MS,f:BERRY_MS};"
 pg.evaluate(setup)
 report=pg.evaluate('''()=>{
  D_AUDIT.objects.clear();const bad=[],signs=[];
  // Independent forward shortest-path check; the drawing must use an optimal real exit.
  function cost(start,target){const q=[[0,start]],best={};while(q.length){q.sort((a,b)=>a[0]-b[0]);const [c,id]=q.shift();if(best[id]!=null)continue;best[id]=c;if(id===target)return c;const n=G.w.N[id];for(let d=0;d<4;d++){if(!passable(n,d))continue;const e=G.w.edges[n.exits[d]],to=e.a===id?e.b:e.a;if(best[to]==null)q.push([c+e.n,to]);}}return Infinity;}
  for(const n of Object.values(G.w.N))for(let h=0;h<4;h++){
   G.pos={n:n.id,e:null,k:0,h,arrH:h};renderScene();
   const mv=nodeMoves(n,h),expected=SIGN_AT.includes(n.id)&&here().t==='fork'&&(mv.f!=null||mv.j!=null);
   if(D_AUDIT.signs.length!==(expected?1:0))bad.push(['placement',n.id,h,D_AUDIT.signs]);
   if(!expected)continue;
   const s=D_AUDIT.signs[0];if(s.x!==232||s.y!==154)bad.push(['post-on-walkway',s]);
   for(const [icon,target]of [['hut','HUT'],['fire','GOAL']]){
    const arrow=s.boards.find(a=>a[0]===icon)?.[1],d={F:h,R:dR(h),L:dL(h),B:(h+2)%4}[arrow];
    const candidates=[];for(let dir=0;dir<4;dir++)if(passable(n,dir)){const e=G.w.edges[n.exits[dir]],to=e.a===n.id?e.b:e.a;candidates.push([dir,e.n+cost(to,target)]);}
    const min=Math.min(...candidates.map(a=>a[1]));const selected=candidates.find(a=>a[0]===d);if(!selected||selected[1]!==min)bad.push(['arrow',n.id,h,target,arrow,candidates]);
   }signs.push([n.id,h,s.boards]);
  }
  const missingMarkers=Object.values(NODE_DEF).filter(n=>n.lm&&!D_AUDIT.objects.has(n.lm)).map(n=>n.lm);
  dRecording=true;try{for(const key of Object.keys(OBJ))drawObj(key,70,160,.6,mulberry(99));for(const [key,o]of Object.entries(SIDE))o.draw(48,140,mulberry(7));for(const f of Object.values(BLOCK))f(mulberry(4));for(const o of Object.values(HIND))o.draw(mulberry(3));for(const o of Object.values(ORTE))o.draw(mulberry(2));}finally{dRecording=false;}
  return {bad,missingMarkers,signViews:signs.length,allObjects:[...D_AUDIT.objects].length,sides:[...D_AUDIT.sides],blocks:[...D_AUDIT.blocks],places:[...D_AUDIT.places]};
 }''')
 assert not report['bad'] and not report['missingMarkers'],report
 assert len(report['sides'])==7 and len(report['places'])==3,report
 print('PASS complete graphics registers and all relevant sign headings:',json.dumps(report),flush=True)
 # Real G actions: map, closed chest, open chest. Verify appearance follows the state.
 pg.evaluate(setup+"G.pos={n:'HUT',e:null,k:0,h:0,arrH:0};const n=G.w.N.HUT;n.open=true;n.got=false;n.chest=false;S.inv=S.inv.filter(k=>!['karte','wasserbeutel'].includes(k));paused=false;arrive(false,'enter');")
 pg.keyboard.press('g');assert pg.evaluate("S.inv.includes('karte')&&S.world.cartography.segments.length===0")
 pg.keyboard.press('g');assert pg.evaluate("G.w.N.HUT.chest&&S.inv.includes('wasserbeutel')&&fLastFocus===null")
 pg.locator('.stage').screenshot(path=str(OUT/'hut-open-chest.png'))
 # Bird hints must reveal only their original conditional map information.
 pg.evaluate("S.world.items={['e:'+G.w.edges[0].uid+':1']:'feuerstein'};birdSecrets('kauz');birdItems('kauz');")
 assert pg.evaluate('dMapAudit.secrets.length===3&&dMapAudit.items.length===1&&S.world.cartography.segments.length===0')
 assert pg.evaluate('''()=>{const before=JSON.stringify([S,G.pos]);drawMap();drawMap();return before===JSON.stringify([S,G.pos]);}''')
 print('PASS bird secret/item hints without pre-drawing walking routes; pure map rendering.',flush=True)
 # Reveal the lake, open its chest, then draw water through actual keys.
 pg.evaluate(setup+"G.pos={n:'SEE',e:null,k:0,h:0,arrH:0};const n=G.w.N.SEE;n.revealed=false;n.chest=false;S.water=0;paused=false;arrive(false,'enter');")
 pg.keyboard.press('u');assert pg.evaluate('G.w.N.SEE.revealed');pg.keyboard.press('g');assert pg.evaluate('G.w.N.SEE.chest');pg.keyboard.press('Space');before=pg.evaluate('S.water');pg.keyboard.press('g');assert pg.evaluate('S.water')==before+1
 pg.locator('.stage').screenshot(path=str(OUT/'waterfall.png'))
 print('PASS cabin map/chest, hidden waterfall revealed, chest opened, water collected.',flush=True)
 # Eight actual moss letters reveal the inscription and page.
 pg.evaluate(setup+"G.pos={n:'FH',e:null,k:0,h:3,arrH:3};const n=G.w.N.FH;n.revealed=true;n.moss=false;n.got=false;paused=false;arrive(false,'enter');")
 pg.keyboard.press('u');assert pg.evaluate('G.phase')=='moss';pg.locator('.stage').screenshot(path=str(OUT/'moss-puzzle.png'))
 for i in range(8):
  key=pg.evaluate('G.moss.letters[G.moss.idx]');pg.dispatch_event('body','keydown',{'key':key})
 assert pg.evaluate('G.moss.done&&G.w.N.FH.moss');pg.keyboard.press('Space');pg.keyboard.press('g');assert pg.evaluate('G.w.N.FH.got')
 pg.locator('.stage').screenshot(path=str(OUT/'grave-clean.png'))
 print('PASS all eight moss letters, readable inscription, actual page pickup.',flush=True)
 # Five shells followed by all ten shield pieces must open the ruin and persist progress.
 pg.evaluate(setup+"G.pos={n:'RU',e:null,k:0,h:3,arrH:3};const n=G.w.N.RU;n.revealed=true;n.shells=0;n.open=false;n.got=false;S.res.schnecke=5;S.world.locks=S.world.locks||{};delete S.world.locks.ruine;paused=false;arrive(false,'enter');")
 for i in range(5):pg.keyboard.press('g');assert pg.evaluate('G.w.N.RU.shells')==i+1
 assert pg.evaluate('S.res.schnecke')==0;pg.locator('.stage').screenshot(path=str(OUT/'five-shells.png'));pg.keyboard.press('g');assert pg.evaluate('G.phase')=='lock'
 for i in range(10):
  letter=pg.evaluate('G.lock.stones.find(t=>!t.used).letter');pg.dispatch_event('body','keydown',{'key':letter})
  for _ in range(4):
   if pg.evaluate('G.lock.cur.rot')==0:break
   pg.keyboard.press('d')
  for _ in range(15):
   delta=pg.evaluate('G.lock.cur.tx-G.lock.x')
   if delta==0:break
   pg.keyboard.press('j' if delta>0 else 'f')
  pg.keyboard.press('Space');pg.wait_for_function(f'G.lock.stones.filter(t=>t.used).length==={i+1}',timeout=5000)
 pg.wait_for_function('G.w.N.RU.open&&G.phase==="explore"',timeout=5000);pg.wait_for_function('!trans',timeout=3000);pg.keyboard.press('g');pg.wait_for_function('G.w.N.RU.got',timeout=3000);assert pg.evaluate('S.world.locks.ruine.used.length===10')
 pg.locator('.stage').screenshot(path=str(OUT/'ruin-open.png'))
 print('PASS five shells consumed, all ten shield pieces, door opened, page picked up.',flush=True)
 # Actual L fire action retains resource accounting and the lit location state.
 pg.evaluate(setup+"G.pos={n:'GOAL',e:null,k:0,h:0,arrH:0};G.w.N.HUT.open=true;S.world.stage='dusk';S.world.time=DUSK;for(const [k,v]of Object.entries(FIRE))S.res[k]=v;paused=false;arrive(false,'enter');")
 pg.keyboard.press('l');pg.wait_for_timeout(150);assert pg.evaluate("S.world.stage==='night'&&Object.keys(FIRE).every(k=>S.res[k]===0)&&D_AUDIT.scenes.has('zustaende5:3')")
 pg.locator('.stage').screenshot(path=str(OUT/'fire-lit.png'))
 assert not errors,errors;print('PASS fire lit through L with consumed resources; no JS errors. Screenshots:',OUT,flush=True);b.close()
