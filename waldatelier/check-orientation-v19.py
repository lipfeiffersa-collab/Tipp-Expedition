"""Real keyboard puzzle controls, legacy piece migration and authoritative junction guidance."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
OUT=Path('/workspace/review-orientation19');OUT.mkdir(exist_ok=True)
URL=os.environ.get('TIPP_TEST_URL','http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1000});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL,wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click()
 pg.evaluate("G.phase='explore';G.wake=2;S.settings.goal=120;S.world.time=600;S.world.animals={};S.world.items={};G.enc=null;p18TutorialQueue=[];S.inv=[...new Set([...S.inv,'feldtagebuch'])];paused=false;trans=null;S.pages=3;S.world.locks.seite={used:['y',',','-']};startLock(here(),'seite');updateControls();")
 assert pg.evaluate("G.lock.stones.filter(s=>s.used).length===3&&S.world.locks.seite.keyVersion===19")
 before=pg.evaluate('JSON.stringify(G.lock.stones.filter(s=>s.used).map(s=>s.rel))')
 assert pg.evaluate("new Set(G.lock.stones.map(s=>s.letter)).size===10&&G.lock.stones.every(s=>'asdfghjklö'.includes(s.letter))")
 assert not pg.locator('#kb').is_visible();pg.keyboard.press('F3');assert pg.locator('#kb').is_visible();assert pg.evaluate('G.phase==="lock"&&!paused')
 # Actual puzzle key picks a piece and exposes movement keys on the keyboard.
 key=pg.evaluate('G.lock.stones.find(s=>!s.used).letter');pg.keyboard.press(key);assert pg.evaluate('G.lock.cur.letter')==key;rot=pg.evaluate('G.lock.cur.rot');pg.keyboard.press('d');assert pg.evaluate('G.lock.cur.rot')==(rot+1)%4
 assert pg.evaluate("document.querySelector('#kb').getBoundingClientRect().bottom<=innerHeight+2")
 pg.screenshot(path=str(OUT/'01-seitenraetsel-tastatur.png'));pg.keyboard.press('Backspace');assert pg.evaluate('!G.lock.cur');pg.keyboard.press('F3');assert not pg.locator('#kb').is_visible();pg.keyboard.press('Backspace');assert pg.evaluate('G.phase==="explore"')
 pg.evaluate("startLock(here(),'seite');updateControls()");assert pg.evaluate('JSON.stringify(G.lock.stones.filter(s=>s.used).map(s=>s.rel))')==before;pg.keyboard.press('Backspace')
 # Newly placed pieces survive another reload, not merely legacy migration.
 pg.evaluate("startLock(here(),'seite');const t=G.lock.stones.find(t=>!t.used);placeStone(G.lock,t);S.world.locks.seite.used.push(t.letter);save();leaveLock();")
 pg.reload(wait_until='domcontentloaded');pg.locator('#btn-play').click();pg.evaluate("p18TutorialQueue=[];startLock(here(),'seite');updateControls()");assert pg.evaluate('G.lock.stones.filter(s=>s.used).length')==4;pg.keyboard.press('Backspace')
 pg.evaluate("S.pageDone=true;showPage();updateControls()");pg.wait_for_function("document.querySelector('#page-img').complete");assert pg.evaluate("document.querySelector('#page-img').naturalWidth>=768");pg.screenshot(path=str(OUT/'02-tagebuchskizze.png'));pg.keyboard.press('Enter')
 pg.keyboard.press('F4');pg.wait_for_timeout(650);pg.screenshot(path=str(OUT/'03-skizze-im-tagebuch.png'));pg.keyboard.press('Escape')
 def fork(desert=False):
  pg.evaluate("""desert=>{if(desert)enterDesert(true);p18TutorialQueue=[];qEffect=null;trans=null;G.phase='explore';G.puz=null;vSky=null;G.sky=null;S.world.animals={};G.enc=null;const candidates=[];for(const n of Object.values(G.w.N))for(let h=0;h<4;h++){const m=nodeMoves(n,h);if(m.f!=null&&m.j!=null&&m[' ']!=null)candidates.push([n,h]);}const[n,h]=candidates[0];G.pos={n:n.id,e:null,k:0,h,arrH:h};arrive();paused=false;updateControls();draw(performance.now());}""",desert)
 fork();assert pg.locator('#o19-junction').is_visible();assert 'Leertaste' in pg.locator('#o19-junction').inner_text();node=pg.evaluate('G.pos.n');pg.evaluate("pending='f';processPending()");assert pg.evaluate('G.pos.n=== '+repr(node)+'&&G.pos.e===null&&pending===null');pg.screenshot(path=str(OUT/'04-abzweigung-wald.png'))
 # A deliberate F now takes the graph's actual left exit and hides the field.
 direction=pg.evaluate('nodeMoves().f');pg.keyboard.press('f');pg.wait_for_function('trans===null');assert pg.evaluate('G.pos.h')==direction;assert pg.evaluate('G.pos.e!=null');assert not pg.locator('#o19-junction').is_visible()
 fork(True);assert pg.locator('#o19-junction').is_visible();pg.screenshot(path=str(OUT/'05-abzweigung-wueste.png'))
 pg.evaluate("paused=true;draw(performance.now())");assert not pg.locator('#o19-junction').is_visible();pg.evaluate("paused=false;draw(performance.now())");assert pg.locator('#o19-junction').is_visible()
 # F3 also works in the desert slider, not just in the DOM lock puzzle.
 pg.evaluate("G.pos={n:'GH',e:null,k:0,h:2,arrH:2};G.w.N.GH.revealed=true;G.w.N.GH.open=true;G.w.N.GH.solved=false;startPuzzle();paused=false;updateControls();");pg.keyboard.press('F3');assert pg.locator('#kb').is_visible();key=pg.evaluate('pzKeys()[0]');moves=pg.evaluate('dW().puzzle.moves');pg.keyboard.press(key);assert pg.evaluate('dW().puzzle.moves')==moves+1;pg.screenshot(path=str(OUT/'06-schiebepuzzle-tastatur.png'));
 for width,height in [(1280,900),(1920,1080),(900,800)]:
  pg.set_viewport_size({'width':width,'height':height});assert pg.locator('#kb').bounding_box()['y']+pg.locator('#kb').bounding_box()['height']<=height+2,(width,height,pg.locator('#kb').bounding_box())
 pg.keyboard.press('Escape');assert pg.evaluate('!G.puz')
 pg.evaluate("chapterEnd()");assert 'Kapitel 2 ist noch' not in pg.locator('#done-card').inner_text()
 assert not errors,errors
 print('PASS legacy/new page progress, puzzle-local home row, real pick/rotate keys, F3 in both puzzle types, intact notebook, junction graph directions, deliberate turns, buffered-step protection, hidden overlays, updated fire text; no JS errors.',flush=True);b.close()
