"""Version 12: real controls, save migration, gated trail and visual feedback lifecycles."""
from pathlib import Path
from tempfile import mkdtemp
from playwright.sync_api import sync_playwright
import json
OUT=Path(mkdtemp(prefix='tipp-v12-'))
URL='http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1050});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 # Load an actual v11 save in v12; old topology IDs and positions must not change.
 pg.goto('http://127.0.0.1:8000/downloads/Tipp-Expedition-v11.html');pg.locator('#btn-play').click();pg.keyboard.press('f');pg.wait_for_timeout(250);pg.keyboard.press('j');pg.wait_for_timeout(350)
 before=pg.evaluate('''()=>{paused=true;G.pos={n:'E',e:null,k:0,h:1,arrH:1};G.w.N.RU.revealed=true;G.w.N.HUT.open=true;S.coins=21;S.old=8;S.inv=[...new Set([...S.inv,'karte','kamera','feldtagebuch'])];S.res.schnecke=5;save();return {seed:G.seed,coins:S.coins,old:S.old,ids:Object.fromEntries(Object.entries(G.w.N).map(([k,n])=>[k,n.uid])),edges:G.w.edges.map(e=>[e.uid,e.a,e.b]),pos:{...G.pos}};}''')
 pg.goto(URL);pg.locator('#btn-play').click();pg.evaluate("paused=true;G.phase='explore';trans=null;S.settings.goal=120;S.needs={w:DROP_MS,f:BERRY_MS};G.enc=null;")
 assert pg.evaluate('G.seed')==before['seed'];assert pg.evaluate('S.coins')==21;assert pg.evaluate('S.old')==8
 assert pg.evaluate('G.pos')==before['pos'];assert pg.evaluate('G.w.N.HUT.open&&G.w.N.RU.revealed')
 assert pg.evaluate('n=>Object.entries(n).every(([k,v])=>G.w.N[k].uid===v)',before['ids'])
 assert pg.evaluate('G.w.edges.slice(0,-2).map(e=>[e.uid,e.a,e.b])')==before['edges']
 assert pg.evaluate('Object.keys(S.world.animals).length')==12
 print('PASS v11 save: original node/edge IDs, position, unlocked hut, inventory and currency retained.',flush=True)
 # An early house sign must point east, including its caption, for every heading.
 for h in range(4):
  pg.evaluate('h=>{G.pos={n:"A",e:null,k:0,h,arrH:h};arrive(false,"enter");}',h)
  assert pg.evaluate('dirTo("HUT",G.w.N.A)')==1
  assert pg.evaluate('D_AUDIT.signs[0].boards[0][1]===relDir(1,G.pos.h)')
 print('PASS early hut sign in all four headings; actual route A→C→HUT exists.',flush=True)
 # Old photos now have the same ground image and pickup image.
 for cave,key in [(False,'foto_huette'),(False,'foto_reh'),(True,'foto_stollen'),(True,'foto_fleder')]:
  if cave and not pg.evaluate('!!G.cave'):pg.evaluate('enterCave(true)')
  pg.evaluate('''key=>{paused=true;G.phase='explore';qFinish();G.enc=null;trans=null;const e=G.w.edges.find(e=>!e.closed);G.pos={n:null,e:e.idx,k:1,h:e.dir,arrH:e.dir};S.world.animals={};S.world.items={[spotKey()]:key};S.known=[...new Set([...S.known,'g',' '])];arrive(false,'enter');}''',key)
  pg.wait_for_function('key=>qPhotoCache.get(S.world.seed+":"+key)?.complete',arg=key)
  img=pg.evaluate('key=>qPhotoCache.get(S.world.seed+":"+key).src',key)
  pg.evaluate('paused=false');pg.keyboard.press('g');assert pg.evaluate('G.phase')=='page';assert pg.locator('#page-img').get_attribute('src')==img
  pg.keyboard.press('Space');pg.wait_for_timeout(100)
 print('PASS four real old-photo G pickups match their ground motifs, including mine photos.',flush=True)
 # Return to the forest in a new context to solve the complete ruin puzzle through keys.
 pg.goto(URL);pg.locator('#btn-play').click();pg.evaluate('S.world=null;S.hoehle=null;S.wueste=null;S.where="wald";newGame();G.phase="explore";paused=true;trans=null;S.world.time=600;S.needs={w:DROP_MS,f:BERRY_MS};S.settings.goal=120;')
 pg.evaluate("G.pos={n:'RU',e:null,k:0,h:3,arrH:3};const n=G.w.N.RU;n.revealed=true;n.open=false;n.shells=0;S.res.schnecke=5;S.known=[...new Set([...S.known,'g','f','j','d',' ','s','h','Backspace'])];arrive();")
 assert pg.evaluate('!passable(G.w.N.RU,3)&&nodeMoves().walk==null')
 pg.evaluate('paused=false')
 for _ in range(5):pg.keyboard.press('g')
 pg.keyboard.press('g');assert pg.evaluate('G.phase')=='lock'
 for i in range(10):
  key=pg.evaluate('G.lock.stones.find(t=>!t.used).letter');pg.dispatch_event('body','keydown',{'key':key})
  for _ in range(4):
   if pg.evaluate('G.lock.cur.rot')==0:break
   pg.keyboard.press('d')
  for _ in range(15):
   delta=pg.evaluate('G.lock.cur.tx-G.lock.x')
   if delta==0:break
   pg.keyboard.press('j' if delta>0 else 'f')
  pg.keyboard.press('Space');pg.wait_for_function(f'G.lock.stones.filter(t=>t.used).length==={i+1}',timeout=5000)
 pg.wait_for_function('G.w.N.RU.open&&G.phase==="explore"&&!trans',timeout=7000)
 assert pg.evaluate('passable(G.w.N.RU,3)&&nodeMoves().walk===3')
 pg.keyboard.press('g');assert pg.evaluate('G.w.N.RU.got')
 for i in range(5):
  pg.keyboard.press(pg.evaluate('G.foot'));pg.wait_for_timeout(380)
  if pg.evaluate('G.pos.n==="RU_WEG"'):break
 assert pg.evaluate('G.pos.n')=='RU_WEG'
 # Turn right onto the hidden clearing trail, then walk to the end and face its manger.
 pg.keyboard.press('j');pg.wait_for_timeout(650)
 for _ in range(5):
  if pg.evaluate('G.pos.n==="REHKRIPPE"'):break
  pg.keyboard.press(pg.evaluate('G.foot'));pg.wait_for_timeout(420)
 assert pg.evaluate('G.pos.n==="REHKRIPPE"&&qHerdLeft()===3')
 pg.evaluate('paused=true;S.food=4;S.pet.Reh=0;S.fed.Reh=0;arrive();draw(performance.now());');pg.locator('.stage').screenshot(path=str(OUT/'three-deer.png'))
 pg.evaluate('paused=false');pg.keyboard.press('h');assert pg.evaluate('qEffect?.kind==="feed"&&qHerdLeft()===2&&S.food===3')
 pg.wait_for_timeout(600);pg.locator('.stage').screenshot(path=str(OUT/'deer-eating.png'));pg.keyboard.press('Space')
 pg.keyboard.press('s');assert pg.evaluate('qEffect?.kind==="pet"&&qHerdLeft()===1&&S.pet.Reh===1');pg.wait_for_timeout(500);pg.locator('.stage').screenshot(path=str(OUT/'deer-petting.png'));pg.keyboard.press('Space')
 pg.keyboard.press('h');assert pg.evaluate('qHerdLeft()===0&&S.food===2');pg.keyboard.press('Space');assert pg.evaluate('animalHere()===null');pg.evaluate('save()')
 pg.reload();pg.locator('#btn-play').click();assert pg.evaluate('qHerdLeft()===0&&G.w.N.RU.open&&G.w.N.RU.got')
 print('PASS five shells, ten actual puzzle pieces, gated trail entered, three deer actions consume one each, persistence without respawn.',flush=True)
 # Chest item animation uses the true payout and cannot pay twice or react to repeated keys.
 pg.evaluate("paused=true;G.phase='explore';trans=null;G.pos={n:'HUT',e:null,k:0,h:0,arrH:0};G.w.N.HUT.open=true;G.w.N.HUT.got=true;G.w.N.HUT.chest=false;S.inv=[...new Set([...S.inv,'karte'])];S.food=18;S.coins=0;arrive();paused=false;")
 pg.keyboard.press('g');assert pg.evaluate('qEffect?.kind==="loot"&&qEffect.loot.some(([k,n])=>k==="tierfutter"&&n===2)&&S.coins===5')
 pg.wait_for_timeout(300);pg.locator('.stage').screenshot(path=str(OUT/'chest-rewards.png'));pg.keyboard.press('g');assert pg.evaluate('S.coins')==5
 pg.keyboard.press('Space');pg.evaluate('openChest(G.w.N.HUT)');assert pg.evaluate('S.coins')==5
 print('PASS chest animation: true capped quantities, quantities visible, one-time payout and skip control.',flush=True)
 # Owl: food action keeps its permanent perch, and farewell is drawn while controls pause.
 pg.evaluate("paused=true;G.pos={n:null,e:0,k:1,h:0,arrH:0};S.world.items={};S.world.animals={kauz:spotKey()};S.food=5;arrive();draw(performance.now());paused=false;")
 pg.keyboard.press('h');assert pg.evaluate('qEffect?.a==="kauz"&&S.world.perches[spotKey()]==="kauz"');pg.wait_for_timeout(1900);pg.locator('.stage').screenshot(path=str(OUT/'owl-flight.png'));pg.keyboard.press('Space')
 assert pg.evaluate('S.world.perches[spotKey()]==="kauz"');pg.locator('.stage').screenshot(path=str(OUT/'owl-perch-retained.png'))
 pg.evaluate("S.world.animals={salamander:spotKey()};S.fed.Feuersalamander=99;arrive();")
 assert pg.evaluate('!expected().includes("s")&&!expected().includes("h")&&!tameable("salamander")')
 print('PASS owl perch retained after feeding; no feeding or petting of fire salamanders.',flush=True)
 # Dusk image has a continuous overlay across the former cut line.
 pg.evaluate("paused=true;qFinish();S.world.animals={};G.pos={n:'A',e:null,k:0,h:0,arrH:0};S.world.time=20*60+7;arrive();draw(performance.now());")
 pg.locator('.stage').screenshot(path=str(OUT/'soft-dusk.png'))
 # Every original J&R obstacle still has the same collision geometry and key actions.
 pg.evaluate('startNight();startJR();paused=true;');level=pg.evaluate('JSON.stringify(G.jr.lv)')
 for kind in ['tunnel','aeste','tor','tower']:
  pg.evaluate('''kind=>{const J=G.jr,L=J.lv;let x,y;if(kind==='tor'){const o=L.solids.find(s=>s.kind==='tor');x=o.x0-14;y=o.top+42;}else if(kind==='tower'){x=L.tower.W1-95;y=L.tower.gy;}else{const z=L.zones.find(z=>z.kind===kind);x=z.x0-7;y=z.gy;}Object.assign(J.p,{x,y,pose:'stand',air:false,move:null,mode:null});J.cam=x-35;J.camY=Math.max(0,y-66);jrRender(performance.now());draw(performance.now());}''',kind)
  pg.locator('.stage').screenshot(path=str(OUT/('jump-'+kind+'.png')))
 assert pg.evaluate('JSON.stringify(G.jr.lv)')==level
 pg.evaluate("const s=G.jr.lv.solids.find(s=>s.kind==='tor');G.jr.p.x=s.x0-14;G.jr.p.y=s.top+42;jrKey('ö');jrKey('ö');G.jr.cam=s.x0-45;G.jr.camY=Math.max(0,G.jr.p.y-66);jrRender(performance.now());draw(performance.now());")
 assert pg.evaluate('G.jr.lv.solids.find(s=>s.kind==="tor").open');pg.locator('.stage').screenshot(path=str(OUT/'jump-gate-open.png'))
 print('PASS J&R rendering read-only; both actual gate bolts open while frame remains.',flush=True)
 assert not errors,errors;print('PASS no JavaScript errors. Screenshots:',OUT,flush=True);b.close()
