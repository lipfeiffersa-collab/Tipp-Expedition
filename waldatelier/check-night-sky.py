"""Night sky follows terrain contours; camera never exposes a scene rectangle."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
URL=os.environ.get('TIPP_TEST_URL','http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html')
OUT=Path('/workspace/review-night-final');OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1500,'height':1050});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL,wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click();pg.evaluate("enterDesert(true);paused=true;S.settings.goal=120;S.world.items={};S.world.animals={};G.enc=null;trans=null;S.known=[...new Set([...S.known,'o',' '])];S.world.time=1380;")
 def node(id,h=None):
  pg.evaluate('''([id,h])=>{vSky=null;const n=G.w.N[id];h=h??[0,1,2,3].find(d=>facePlace(n,d))??0;G.pos={n:id,e:null,k:0,h,arrH:h};arrive();paused=true;updateClock();renderScene();draw(performance.now());}''',[id,h])
 def snap(name):pg.locator('#view').screenshot(path=str(OUT/(name+'.png')))
 # These are sky and land points picked from the actual dune and cliff illustrations.
 node('AH',1);assert pg.evaluate('nSkyMask.alpha[10*640+320]===255');assert pg.evaluate('nSkyMask.alpha[50*640+190]===0');assert pg.evaluate('nSkyMask.alpha[130*640+320]===0');snap('duenen-nacht')
 node('KTR');assert pg.evaluate('nSkyMask.alpha[16*640+440]===255');assert pg.evaluate('nSkyMask.alpha[40*640+160]===0');snap('felsen-nacht')
 print('PASS actual sky points retained; dune crests and cliffs occlude the stars.',flush=True)
 for id,h,name in [('AH',1,'duenen'),('KTR',None,'felsen'),('OASE',None,'palmen')]:
  node(id,h);position=pg.evaluate('JSON.stringify(G.pos)');snap(name+'-nacht');pg.evaluate('paused=false;updateControls()');pg.keyboard.press('o');pg.evaluate('paused=true;');assert pg.evaluate('!!vSky.landscape&&!!vSky.skyWindow')
  for t in [240,475,710,1100]:
   pg.evaluate('(t)=>{vSky.elapsed=t;draw(performance.now());}',t);assert pg.evaluate('vSky.sourceRect.x>=0&&vSky.sourceRect.y>=0&&vSky.sourceRect.x+vSky.sourceRect.w<=1280.01&&vSky.sourceRect.y+vSky.sourceRect.h<=720.01');snap(name+'-blick-'+str(t))
  # The final crop contains no terrain alpha, so no line can remain along a frame edge.
  assert pg.evaluate('''()=>{const a=vSky.sourceRect,g=vSky.landscape.getContext('2d'),p=g.getImageData(Math.ceil(a.x),Math.ceil(a.y),Math.floor(a.w)-1,Math.floor(a.h)-1).data;return p.every((v,i)=>i%4!==3||v===0);}''')
  pg.evaluate('paused=false;updateControls()');pg.keyboard.press('Space');pg.wait_for_function('vSky===null',timeout=7000);pg.evaluate('paused=true;');assert pg.evaluate('JSON.stringify(G.pos)')==position
 print('PASS actual O/Space through four camera stages: dunes, cliffs and palms; no scene edge enters the viewport, empty foreground at full sky and unchanged position.',flush=True)
 # Stars must never leak to paths or water through the lower part of the scene.
 for id in ['AH','JB3','T3','OASE','WADI','KTR','KF','GH','ZH','STADT']:
  for h in range(4):
   node(id,h)
   assert pg.evaluate('nSkyMask.alpha.slice(265*640).every(v=>v===0)'),(id,h)
 # Ordinary daytime rendering is byte-identical to the unmodified lighting function.
 node('AH',1);pg.evaluate('S.world.time=780;renderScene();');day=pg.evaluate('F_CANVAS.toDataURL()');pg.evaluate('const savedLight=uLight;uLight=nOriginalLight;renderScene();uLight=savedLight;');assert pg.evaluate('F_CANVAS.toDataURL()')==day
 state=pg.evaluate('JSON.stringify(S)');pg.evaluate('S.world.time=1380;renderScene();S.world.time=780;renderScene();');assert pg.evaluate('JSON.stringify(S)')==state
 assert pg.evaluate('N_MASK_CACHE.size<=12');assert not errors,errors
 print('PASS 40 night orientations: no sky on ground/water, day rendering unchanged, bounded cache, read-only rendering and no JavaScript errors.',flush=True);b.close()
