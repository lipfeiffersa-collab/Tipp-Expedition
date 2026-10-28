"""First wake only; actual shell/puzzle/entry/path/loot/deer/photo interactions."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
OUT=Path('/workspace/review-orientation19');OUT.mkdir(exist_ok=True)
URL=os.environ.get('TIPP_TEST_URL','http://127.0.0.1:8049/Tipp-Expedition-4.7-Waldatelier.html')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1000});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL,wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click();pg.keyboard.press('f');pg.keyboard.press('j');assert pg.evaluate('p18Help?.id==="leine"');pg.keyboard.press('Enter');assert pg.evaluate('!p18Help')
 # An old save without the tutorial flag still must not replay the opening scene.
 pg.evaluate("delete p18State().seen.leine;S.settings.goal=120;save()");pg.reload(wait_until='domcontentloaded');pg.locator('#btn-play').click();pg.keyboard.press('f');pg.keyboard.press('j');assert pg.evaluate('!p18Help&&!p18TutorialQueue.some(t=>t.id==="leine")')
 pg.evaluate("S.world.fires=0;S.world.stage='explore';newDay()");pg.keyboard.press('f');pg.keyboard.press('j');assert pg.evaluate('!p18Help&&!p18TutorialQueue.some(t=>t.id==="leine")')
 pg.evaluate("p18TutorialQueue=[];qEffect=null;trans=null;G.phase='explore';S.world.animals={};S.world.items={};G.enc=null;S.world.time=600;S.needs={w:DROP_MS*20,f:BERRY_MS*20};S.inv=[...new Set([...S.inv,'feldtagebuch','kamera','karte'])];p18State().loaded=8;S.food=0;S.res.schnecke=5;G.pos={n:'RU',e:null,k:0,h:3,arrH:3};G.w.N.RU.revealed=true;G.w.N.RU.shells=0;G.w.N.RU.open=false;G.w.N.RU.got=false;S.world.locks.ruine={used:[]};arrive();paused=false;updateControls();")
 assert not pg.evaluate("expected().includes(' ')")
 for _ in range(5):pg.keyboard.press('g')
 assert pg.evaluate('G.w.N.RU.shells===5&&!G.w.N.RU.open');pg.keyboard.press('g');assert pg.evaluate('G.phase==="lock"&&G.lock.kind==="ruine"')
 # Solve the real shield lock with its piece letters and movement controls.
 for _ in range(10):
  key=pg.evaluate('G.lock.stones.find(t=>!t.used).letter');pg.keyboard.press(key)
  while pg.evaluate('G.lock.cur.rot')%4:pg.keyboard.press('d')
  while pg.evaluate('G.lock.x!==G.lock.cur.tx'):pg.keyboard.press(pg.evaluate('G.lock.x>G.lock.cur.tx?"f":"j"'))
  pg.keyboard.press('Space');pg.wait_for_function('G.lock?.cur===null||G.lock?.busy')
 pg.wait_for_function('G.phase==="explore"&&trans===null');assert pg.evaluate('G.w.N.RU.open&&expected().includes(" ")');pg.screenshot(path=str(OUT/'07-ruine-offener-weg.png'))
 pg.keyboard.press('g');assert pg.evaluate('G.w.N.RU.got');assert pg.evaluate('expected().includes(" ")');pg.keyboard.press('Space');pg.wait_for_function('trans===null');assert pg.evaluate('G.pos.e!=null&&G.w.edges[G.pos.e].a==="RU"')
 steps=0
 while pg.evaluate('G.pos.n!=="REHKRIPPE"'):
  assert steps<20;key=pg.evaluate('G.pos.e!=null?G.foot:nodeMoves().walk!=null?G.foot:nodeMoves().f!=null?"f":nodeMoves().j!=null?"j":" "');pg.keyboard.press('Space' if key==' ' else key);pg.wait_for_function('trans===null');steps+=1
 assert steps>=3;assert pg.evaluate('qHerdLeft()===3&&o19FoodLeft()===3&&expected().includes("g")&&expected().includes("s")')
 assert pg.evaluate('S.world.cartography.nodes.includes("REHKRIPPE")&&S.world.cartography.segments.some(s=>s[0]<0||s[2]<0)');pg.screenshot(path=str(OUT/'08-futterkrippe.png'))
 pg.keyboard.press('g');assert pg.evaluate('S.food===3&&o19FoodLeft()===0&&qEffect.loot.some(([k,n])=>k==="tierfutter"&&n===3)');pg.screenshot(path=str(OUT/'09-futterfund.png'));pg.keyboard.press('Space');assert pg.evaluate('!qEffect');pg.keyboard.press('g');assert pg.evaluate('S.food===3')
 pg.keyboard.press('F5');assert pg.evaluate('p18Camera?.size===160');pg.keyboard.press('Space');assert pg.evaluate('qHerdLeft()===3&&p18State().gallery.at(-1).title==="Futterkrippe hinter der Ruine"');pg.wait_for_timeout(1800);pg.screenshot(path=str(OUT/'10-lichtungsfoto.png'))
 # Acknowledging new achievements/tutorials must not consume another deer.
 pg.evaluate('p18TutorialQueue=[];p18State().seen.trust=true;p18State().seen.friend=true;')
 pg.keyboard.press('h');assert pg.evaluate('qEffect?.kind==="feed"&&qHerdLeft()===2');pg.keyboard.press('Space');pg.keyboard.press('s');assert pg.evaluate('qEffect?.kind==="pet"&&qHerdLeft()===1');pg.keyboard.press('Space');pg.keyboard.press('s');assert pg.evaluate('qEffect?.kind==="pet"&&qHerdLeft()===0');pg.keyboard.press('Space');pg.evaluate('save()')
 pg.reload(wait_until='domcontentloaded');pg.locator('#btn-play').click();pg.keyboard.press('f');pg.keyboard.press('j');assert pg.evaluate('!p18Help&&G.pos.n==="REHKRIPPE"&&qHerdLeft()===0&&o19FoodLeft()===0&&S.world.cartography.nodes.includes("REHKRIPPE")')
 assert not errors,errors
 print('PASS first-only leash, legacy resume and next morning; five shells, real shield puzzle, Space entrance, walked/mapped hidden trail, visible once-only food, square scenery photo without consuming deer, feed/pet departures and persisted clearing state; no JS errors.',flush=True);b.close()
