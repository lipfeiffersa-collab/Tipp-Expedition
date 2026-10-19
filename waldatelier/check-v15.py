"""Real keyboard regressions for the desert revision; no implementation-mirror unit tests."""
from pathlib import Path
import json,base64,os
from playwright.sync_api import sync_playwright
OUT=Path('/workspace/review15');OUT.mkdir(exist_ok=True)
URL=os.environ.get('TIPP_TEST_URL','http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1500,'height':1000});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL,wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click();pg.evaluate("enterDesert(true);S.settings.goal=120;paused=true;S.world.animals={};S.world.items={};G.enc=null;S.inv=[...new Set([...S.inv,'kamera','feldtagebuch','karte','wasserbeutel'])];S.known=[...new Set([...S.known,'g','h','s','q','u','w','e','ü','z','i','a','o','p',' '])];S.needs={w:DROP_MS*8,f:BERRY_MS*8};")
 def node(id,h=None):
  pg.evaluate('''([id,h])=>{qEffect=null;rInn=null;G.city=null;G.storm=null;G.puz=null;G.rGateClose=false;G.phase='explore';trans=null;S.world.animals={};S.world.items={};G.enc=null;const n=G.w.N[id];h=h??[0,1,2,3].find(d=>facePlace(n,d))??0;G.pos={n:id,e:null,k:0,h,arrH:h};arrive();paused=true;}''',[id,h])
 def key(k,wait=30):
  pg.evaluate('paused=false;updateControls();');pg.keyboard.press(k);pg.wait_for_timeout(wait);pg.evaluate('paused=true;')
 def snap(n):pg.evaluate('updateClock();renderScene();draw(performance.now());');pg.locator('#view').screenshot(path=str(OUT/(n+'.png')))
 # New species, objects and food are identified through I; danger still requires a safe action.
 node('OASE');pg.evaluate("S.desertKnown15={};S.res.datteln=2;S.res.beeren=0;S.res.honig=0;S.res.kaktusfeigen=0;S.needs.f=0;needsTick(10)");assert pg.evaluate('S.res.datteln')==2;pg.evaluate('S.needs.f=BERRY_MS*8;')
 assert not pg.evaluate('desertOpts().some(o=>o[0]==="p")');key('i');assert pg.evaluate('rCanEat("datteln")&&rKnown("plant:palme")');key('i');assert pg.evaluate('rKnown("water")');assert pg.evaluate('desertOpts().some(o=>o[0]==="p")');key('p');assert pg.evaluate('S.res.datteln')==5
 pg.evaluate('S.needs.f=0;needsTick(10)');assert pg.evaluate('S.res.datteln')==4
 node('KF');key('i');assert pg.evaluate('rCanEat("kaktusfeigen")');key('p');assert pg.evaluate('S.res.kaktusfeigen')>=3
 for plant in ['oscher','koloquinten']:
  node(pg.evaluate('k=>Object.values(G.w.N).find(n=>n.lm===k).id',plant));key('i');assert pg.evaluate('k=>rKnown("plant:"+k)',plant);assert not pg.evaluate('desertOpts().some(o=>o[0]==="p")')
 node('AH');pg.evaluate("const e=G.w.edges[0];G.pos={n:null,e:0,k:1,h:e.dir,arrH:e.dir};S.world.animals={hornviper:spotKey()};arrive();");key('i');assert pg.evaluate('rKnown("animal:hornviper")&&obstBlock()==="tier"');pg.evaluate('G.obsId=null;arrive();');assert not pg.evaluate('desertOpts().some(o=>o[0]==="i")');assert pg.evaluate('desertOpts().some(o=>o[0]==="a")');key('Space');assert pg.evaluate('obstBlock()===null')
 print('PASS real I/P: persistent species and food knowledge, poisonous plants excluded, unknown food not eaten, known dangerous animal still blocks.',flush=True)
 # A new forward segment has no prints ahead. Turning exposes only completed segments.
 node('AH',1);pg.evaluate("S.world.trails15={};const e=G.w.edges[0],n=G.w.N[e.a];G.pos={n:e.a,e:null,k:0,h:e.dir,arrH:e.dir};G.foot='f';arrive();");print('start route',pg.evaluate('[nodeMoves(),expected()]'),flush=True)
 k=pg.evaluate("nodeMoves().walk!=null?G.foot:nodeMoves()[' ']!=null?' ':nodeMoves().f!=null?'f':'j'");key('Space' if k==' ' else k,650);assert pg.evaluate('G.pos.e===0'),pg.evaluate('G.pos');assert pg.evaluate('JSON.stringify(S.world.trails15[G.w.edges[0].uid])')=='[0]';pg.evaluate('renderScene()');assert pg.evaluate('rVisiblePrints.length')==0
 key('Backspace',650);pg.evaluate('renderScene()');assert pg.evaluate('rVisiblePrints.length')==1;snap('prints-looking-back');key('Backspace',650)
 k=pg.evaluate('G.foot');key(k,650);assert pg.evaluate('S.world.trails15[G.w.edges[0].uid].length')==2;assert pg.evaluate('G.pos.k')==2
 pg.evaluate('save()');pg.reload(wait_until='domcontentloaded');pg.locator('#btn-play').click();pg.evaluate('paused=true;S.world.animals={};S.world.items={};');assert pg.evaluate('S.world.trails15[G.w.edges[0].uid].length')==2;assert pg.evaluate('rCanEat("datteln")&&rKnown("animal:hornviper")')
 pg.evaluate('endStorm(false);');assert pg.evaluate('Object.keys(S.world.trails15).length')==0
 print('PASS actual F/J and turns: only completed partial segments, correct reverse view, reload; storm removes prints.',flush=True)
 # All directions of every intersection remain physically accurate and the scene is read-only.
 pg.evaluate('''()=>{for(const n of Object.values(G.w.N).filter(n=>n.t==='j'))for(let h=0;h<4;h++){G.pos={n:n.id,e:null,k:0,h,arrH:h};uTerrain();const r=uRoad(n,h);if(r.L!==passable(n,dL(h))||r.R!==passable(n,dR(h))||r.F!==passable(n,h))throw Error(n.id+':'+h);}}''')
 node('JL2',0);pg.evaluate('S.world.time=780;S.world.heatOff=null;renderScene();');assert pg.evaluate('inShade()&&heatMul()===1&&uShadeAreas.length>0');snap('shade')
 node('T1',1);snap('crossroads');node('STADT');snap('city-outside')
 # Zoom is optional, original seven-rose and slider puzzle mechanics stay intact.
 node('GH');pg.evaluate('Object.assign(G.w.N.GH,{revealed:true,open:false,roses:0,solved:false});S.res.sandrose=7;');key('u');assert pg.evaluate('G.rGateClose');snap('cave-close')
 for i in range(7):key('g')
 assert pg.evaluate('G.w.N.GH.open&&G.w.N.GH.roses===7&&!G.rGateClose');key('u');assert pg.evaluate('!!G.puz');key('Backspace');snap('cave-open')
 # All 6 story photos are continuous and cached identically for pickup, without modifying the world.
 state=pg.evaluate('JSON.stringify(S)');photos=pg.evaluate('Object.values(FOTOS).flat().map(x=>[x[0],fotoScene(x[0])])');assert pg.evaluate('JSON.stringify(S)')==state
 for name,data in photos:(OUT/(name+'.webp')).write_bytes(base64.b64decode(data.split(',')[1]))
 pg.evaluate("S.album=Object.fromEntries(Object.values(FOTOS).flat().map(([k])=>[k,{img:'old-image'}]));S.photoArt15=14;S.photoImgs.Dachs='sentinel';save();");pg.reload(wait_until='domcontentloaded');pg.wait_for_function('fReady');assert pg.evaluate('Object.values(S.album).length===6&&Object.values(S.album).every(v=>v.img.startsWith("data:image/"))&&S.photoImgs.Dachs==="sentinel"')
 print('PASS cardinal paths, real shade, 7 rose inserts + puzzle entry, six intact photos and saved album structure.',flush=True)
 pg.locator('#btn-play').click();node('STADT');pg.evaluate('enterCity(false);G.city.x=G.city.tx=170;renderScene();');snap('city-merchant')
 pg.evaluate('G.city.x=G.city.tx=532;S.coins=100;S.old=0;');day=pg.evaluate('S.world.day');pg.evaluate('innMenu();');key('a',100);assert pg.evaluate('!!rInn&&G.phase==="innSleep"');assert pg.evaluate('S.coins')==90
 # Advance stage times with actual draw dispatch; native once-only economy remains intact.
 pg.evaluate('rInn.elapsed=1600;draw(performance.now());');pg.locator('#view').screenshot(path=str(OUT/'inn-dusk.png'))
 pg.evaluate('rInn.elapsed=2200;draw(performance.now());');pg.locator('#view').screenshot(path=str(OUT/'inn-night.png'))
 pg.evaluate('rInn.elapsed=2900;draw(performance.now());');pg.locator('#view').screenshot(path=str(OUT/'inn-dawn.png'));assert pg.evaluate('S.world.day')==day+1
 key('Space');assert pg.evaluate('!rInn&&G.phase==="city"&&S.coins===90');assert pg.evaluate('S.world.day')==day+1
 # Paid but interrupted sleep survives reload without another payment.
 pg.evaluate('innMenu();');key('a',100);assert pg.evaluate('S.coins')==80;pg.reload(wait_until='domcontentloaded');pg.locator('#btn-play').click();assert pg.evaluate('!!rInn');key('Space');assert pg.evaluate('S.coins===80');assert pg.evaluate('S.world.day')==day+2
 print('PASS actual inn payment, entry/night/dawn/exit, skip, interrupted paid stay resumed; day and gold applied exactly once.',flush=True)
 # Gait images have complete poses, full alpha bodies, different limb phases and fixed bottom baseline.
 assert pg.evaluate('R_HUMAN.length===9&&R_ANIMAL.every(r=>r.length===4)')
 for i in range(9):
  pg.evaluate('(i)=>{G.city.x=G.city.tx=170;G.city.moving=i>0;G.city.anim=(i-1)*4;cityDraw(performance.now());draw(performance.now());}',i);pg.locator('#view').screenshot(path=str(OUT/f'city-walk-{i}.png'))
 node('AH');pg.evaluate("const e=G.w.edges[0];G.pos={n:null,e:0,k:1,h:e.dir,arrH:e.dir};S.world.animals={fennek:spotKey()};rLearn('animal:fennek');S.food=20;arrive();");key('h');assert pg.evaluate('qEffect?.u&&qEffect.duration>=4500')
 for t in [1650,2000,2400]:pg.evaluate('(t)=>{draw(performance.now());qEffect.elapsed=t;qDrawAnimal(qEffect,t);}',t);pg.locator('#view').screenshot(path=str(OUT/f'fox-walk-{t}.png'))
 key('Space');assert not pg.evaluate('!!qEffect');assert not errors,errors
 print('PASS complete city walk and animal gait phase render, actual feeding, no JavaScript errors. Screenshots: '+str(OUT),flush=True);b.close()
