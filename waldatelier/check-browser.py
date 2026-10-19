from playwright.sync_api import sync_playwright
import json
from tempfile import mkdtemp
OUT=mkdtemp(prefix='wald-check-')+'/'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1000});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.goto('http://127.0.0.1:8031/Tipp-Expedition/Tipp-Expedition-4.7-Waldatelier.html');pg.locator('#btn-play').click();pg.keyboard.press('f');pg.wait_for_timeout(250);pg.keyboard.press('j');pg.wait_for_timeout(350)
 pg.evaluate("paused=true;G.phase='explore';G.enc=null;G.guide=null;trans=null;S.world.animals={};S.world.items={};")
 sweep=pg.evaluate('''()=>{let views=0;for(const n of Object.values(G.w.N))for(let h=0;h<4;h++){G.pos={n:n.id,e:null,k:0,h,arrH:h};renderScene();views++;}for(let ei=0;ei<G.w.edges.length;ei++){const e=G.w.edges[ei];if(e.closed)continue;for(let k=1;k<e.n;k++)for(const h of [e.dir,(e.dir+2)%4]){G.pos={n:null,e:ei,k,h,arrH:h};renderScene();views++;}}return views;}''')
 print('PASS forest views',sweep,flush=True)
 # Mark all pre-card routes seen. Picking up the map must not reveal any of them.
 pg.evaluate("G.w.edges.forEach(e=>e.seen=true);G.pos={n:'HUT',e:null,k:0,h:0,arrH:0};const n=G.w.N.HUT;n.open=true;n.got=false;S.inv=S.inv.filter(k=>k!=='karte');S.known=[...new Set([...S.known,'g','Backspace','f','j',' '])];paused=false;arrive(false,'enter');")
 pg.keyboard.press('g');pg.wait_for_timeout(100)
 print('chart on pickup',pg.evaluate('S.world.cartography'),flush=True)
 assert pg.evaluate("S.inv.includes('karte')&&S.world.cartography.segments.length===0")
 pg.locator('#mapbox').screenshot(path=OUT+'map-on-pickup.png')
 pg.evaluate("G.pos={n:'HUT',e:null,k:0,h:2,arrH:2};arrive(false,'turn');")
 # Actual walking keys; input timing should leave the hut node.
 for i in range(10):pg.keyboard.press('f' if i%2==0 else 'j');pg.wait_for_timeout(220)
 chart=pg.evaluate('S.world.cartography');print('chart after walking',chart,flush=True);assert len(chart['segments'])>0 and len(chart['segments'])<12
 before=pg.evaluate('JSON.stringify(S.world.cartography)');pg.evaluate('renderScene();drawMap();drawMap();save();');assert pg.evaluate('JSON.stringify(S.world.cartography)')==before
 pg.locator('#mapbox').screenshot(path=OUT+'map-after-walking.png')
 pg.reload();pg.locator('#btn-play').click();pg.wait_for_timeout(200);assert pg.evaluate('JSON.stringify(S.world.cartography)')==before
 print('PASS map blank at pickup, actual movement recorded, rendering pure, reload persists.',flush=True)
 # Original footprints remain separate from cartography.
 pg.evaluate("paused=true;G.phase='explore';trans=null;G.guide=null;G.pos={n:'I',e:null,k:0,h:2,arrH:2};G.w.edges.forEach(e=>e.seen=false);renderScene();")
 unvisited=pg.evaluate('F_CANVAS.toDataURL()');pg.evaluate('G.w.edges[G.w.N.I.exits[1]].seen=true;renderScene();');assert pg.evaluate('F_CANVAS.toDataURL()')!=unvisited
 pg.locator('.stage').screenshot(path=OUT+'footprints.png')
 # Solve all 10 hut pieces through key events, without modifying their rotations or targets.
 pg.evaluate("G.pos={n:'HUT',e:null,k:0,h:0,arrH:0};G.w.N.HUT.open=false;S.world.locks={};G.phase='explore';paused=false;startLock(here(),'hut');updateControls();")
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
 pg.locator('.stage').screenshot(path=OUT+'lock-complete.png')
 pg.wait_for_function('G.w.N.HUT.open&&G.phase==="explore"',timeout=5000);pg.wait_for_timeout(500)
 pg.locator('.stage').screenshot(path=OUT+'hut-opened.png')
 assert pg.evaluate('S.world.locks.hut.used.length')==10
 print('PASS all 10 hut lock pieces, door opens and completion saved.',flush=True)
 # Accepted motifs are present for each species and actual photos capture the 2D scene.
 for animal in pg.evaluate('F_ANIMALS'):
  pg.evaluate("a=>{paused=true;G.phase='explore';trans=null;G.pos={n:null,e:0,k:1,h:G.w.edges[0].dir,arrH:0};S.world.animals={[a]:spotKey()};S.world.items={};renderScene();}",animal)
  assert pg.evaluate('fLastAnimal!==null'),animal
 pg.evaluate("paused=false;S.inv=[...new Set([...S.inv,'kamera'])];S.known=[...new Set([...S.known,'k'])];S.world.animals={kauz:spotKey()};arrive(false,'enter');")
 pg.keyboard.press('k');pg.wait_for_timeout(200);assert pg.evaluate('!!S.photoImgs.Waldkauz')
 pg.locator('.stage').screenshot(path=OUT+'owl.png')
 assert not errors,errors
 print('PASS 13 animals, actual photo key, no JavaScript errors.',flush=True)
 b.close()
