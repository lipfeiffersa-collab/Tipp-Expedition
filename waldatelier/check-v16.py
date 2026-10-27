"""Real keyboard checks for the sky camera and the wall/chest lifecycle; visual captures for review."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
URL=os.environ.get('TIPP_TEST_URL','http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html')
OUT=Path('/workspace/review16');OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1500,'height':1050});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL,wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click();pg.evaluate("enterDesert(true);paused=true;S.settings.goal=120;S.world.animals={};S.world.items={};G.enc=null;trans=null;S.needs={w:DROP_MS*8,f:BERRY_MS*8};S.inv=[...new Set([...S.inv,'spitzhacke'])];S.known=[...new Set([...S.known,'u','g','h','o',' ','i'])];for(const a of U_ANIMALS)rLearn('animal:'+a);for(const k of Object.keys(R_FACTS))rLearn(k);")
 assert pg.evaluate('Object.keys(F_ATLAS).length')==36
 def node(id,h=None):
  pg.evaluate('''([id,h])=>{vSky=null;vBreak=null;qEffect=null;G.city=null;G.puz=null;G.storm=null;G.phase='explore';G.hack=null;G.enc=null;trans=null;const n=G.w.N[id];h=h??[0,1,2,3].find(d=>facePlace(n,d))??0;G.pos={n:id,e:null,k:0,h,arrH:h};arrive();paused=true;}''',[id,h])
 def key(k,wait=30):pg.evaluate('paused=false;updateControls()');pg.keyboard.press(k);pg.wait_for_timeout(wait);pg.evaluate('paused=true')
 def snap(name):pg.evaluate('updateClock();renderScene();draw(performance.now());');pg.locator('#view').screenshot(path=str(OUT/(name+'.png')))
 # Every path branch remains cardinal; record the actual reported viewpoint and the reverse KTR view.
 for id,h,name in [('JB3',3,'kreuzung'),('JC3',0,'kurve'),('KTR',2,'rueckweg')]:
  node(id,h);pg.evaluate('S.world.time=514;');snap(name)
 pg.evaluate('''()=>{for(const id of ['JB3','JC3','KTR']){const n=G.w.N[id];for(let h=0;h<4;h++){G.pos={n:id,e:null,k:0,h,arrH:h};uTerrain();const r=uRoad(n,h);if(r.L!==passable(n,dL(h))||r.R!==passable(n,dR(h))||r.F!==passable(n,h))throw Error('Unexpected branch');}}}''')
 node('KTR',2);pg.evaluate('renderScene();');assert pg.evaluate('uShadeAreas.every(a=>a.x<10||a.source)')
 node('KTR');pg.evaluate('Object.assign(G.w.N.KTR,{examined:false,cleared:false,chest:false});S.coins=10;S.old=0;arrive();');snap('mauer-geschlossen');key('u');assert pg.evaluate('G.w.N.KTR.examined')
 for i in range(8):
  key('g' if i%2==0 else 'h');assert pg.evaluate('!!vBreak');
  if i in [0,2,4,6,7]:snap('mauer-'+str(i+1))
 assert pg.evaluate('G.w.N.KTR.cleared&&!G.w.N.KTR.chest');key('g');assert pg.evaluate('G.w.N.KTR.chest&&S.coins===17&&S.old===3&&qEffect?.kind==="loot"');key('Space');snap('truhe-offen');assert pg.evaluate('vBreak===null')
 pg.evaluate('openChestD()');assert pg.evaluate('S.coins===17&&S.old===3')
 print('PASS actual U + eight G/H hits: progressive breach, visible debris, chest remains behind wall; correct one-time 3 old + 7 gold payout.',flush=True)
 # Actual O tilts the camera, blocks world movement, pauses correctly and returns to the same place.
 for time,kind in [(780,'sun'),(1380,'stars'),(476,'birds'),(600,'clouds')]:
  node('KTR');pg.evaluate('(time)=>{S.world.time=time;S.world.storms=time===600?[630]:[];updateClock();}',time);pos=pg.evaluate('JSON.stringify(G.pos)');key('o');assert pg.evaluate('!!vSky&&G.sky===null');assert pg.evaluate('vSky.kind')==kind
  pg.evaluate('vSky.elapsed=475;draw(performance.now());');pg.locator('#view').screenshot(path=str(OUT/('himmel-schwenk-'+kind+'.png')))
  pg.evaluate('vSky.elapsed=1100;draw(performance.now());');assert pg.evaluate('vSky.pitch')==1;pg.locator('#view').screenshot(path=str(OUT/('himmel-'+kind+'.png')))
  before=pg.evaluate('vSky.elapsed');pg.wait_for_timeout(250);assert pg.evaluate('vSky.elapsed')==before
  assert pg.evaluate('JSON.stringify(G.pos)')==pos;key('f');assert pg.evaluate('JSON.stringify(G.pos)')==pos
  pg.evaluate('paused=false;updateControls()');pg.keyboard.press('Space');pg.wait_for_function('vSky===null',timeout=7000);pg.evaluate('paused=true');assert pg.evaluate('vSky===null');assert pg.evaluate('JSON.stringify(G.pos)')==pos
 print('PASS actual O camera tilt and return for sun, night, birds and storm warning, pause and unchanged position.',flush=True)
 node('KTR');pg.evaluate('save()');pg.reload(wait_until='domcontentloaded');pg.locator('#btn-play').click();pg.evaluate('paused=true;');assert pg.evaluate('G.w.N.KTR.cleared&&G.w.N.KTR.chest&&S.coins===17&&S.old===3')
 state=pg.evaluate('JSON.stringify(S)');pg.evaluate('renderScene();renderScene()');assert pg.evaluate('JSON.stringify(S)')==state
 assert not errors,errors;print('PASS saved wall/chest state, read-only rendering and no JavaScript errors. Screenshots:',OUT,flush=True);b.close()
