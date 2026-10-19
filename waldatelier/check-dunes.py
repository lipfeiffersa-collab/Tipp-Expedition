"""Revision 14: visible shelter agrees with real heat protection, map exits and rest controls."""
from pathlib import Path
from tempfile import mkdtemp
from playwright.sync_api import sync_playwright
OUT=Path(mkdtemp(prefix='tipp-dunes-'))
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=browser.new_page(viewport={'width':1500,'height':1000});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto('http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html',wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click();pg.evaluate("enterDesert(true);paused=true;S.settings.goal=120;S.world.time=13*60;S.world.heatOff=null;S.world.animals={};S.world.items={};G.enc=null;S.known=[...new Set([...S.known,'ü'])];S.needs={w:DROP_MS*4,f:BERRY_MS*4};")
 def node(id,h=0):
  pg.evaluate('''([id,h])=>{qFinish();G.city=null;G.storm=null;G.puz=null;G.phase='explore';trans=null;G.pos={n:id,e:null,k:0,h,arrH:h};arrive();paused=true;updateClock();renderScene();draw(performance.now());}''',[id,h])
 def snap(name):pg.locator('#view').screenshot(path=str(OUT/(name+'.png')))
 # Existing named shelters retain their physical heat protection in every viewing direction.
 for id in ['JL2','T1','JC3','JB3','OASE','WADI','KTR']:
  for h in range(4):
   node(id,h);assert pg.evaluate('inShade()&&heatMul()===1&&uShadeAreas.length>0')
  node(id);snap('shelter-'+id)
 print('PASS 28 shelter views: painted shade and actual heat protection agree.',flush=True)
 node('OASE',2);pg.evaluate('paused=false;');pg.keyboard.press('Backspace');pg.wait_for_timeout(800);assert pg.evaluate('G.phase==="explore"&&G.pos.n==="OASE"');print('PASS actual oasis turn toward its adjoining paths without missing-marker caption error.',flush=True)
 node('JC1');assert pg.evaluate('!inShade()&&heatMul()===2&&uShadeAreas.length===0');pg.evaluate('paused=false;updateControls();');assert not pg.evaluate('expected().includes("ü")')
 # Water actually drains twice as fast outside shade; this is not merely a visual label.
 pg.evaluate('paused=true;S.water=0;S.needs.w=DROP_MS*4;needsTick(1000)');outside=pg.evaluate('DROP_MS*4-S.needs.w')
 node('T1');pg.evaluate('S.needs.w=DROP_MS*4;needsTick(1000)');inside=pg.evaluate('DROP_MS*4-S.needs.w');assert outside==inside*2
 pg.evaluate('paused=false;updateControls();');assert pg.evaluate('expected().includes("ü")');pos=pg.evaluate('JSON.stringify(G.pos)');pg.dispatch_event('body','keydown',{'key':'ü'});pg.evaluate('paused=true;');assert pg.evaluate('dTime()>=900&&dTime()<901');assert pg.evaluate('JSON.stringify(G.pos)')==pos
 print('PASS real water drain and Ü rest: correct protection, advances to 15:00, same location.',flush=True)
 # Sandrose entrance is still sealed below a high dune until its existing storm/rose flags open it.
 pg.evaluate('S.world.time=13*60;S.world.heatOff=null;')
 node('GH',pg.evaluate("[0,1,2,3].find(d=>facePlace(G.w.N.GH,d))"));pg.evaluate('Object.assign(G.w.N.GH,{revealed:false,open:false,solved:false});renderScene();draw(performance.now());');snap('dune-hidden');assert pg.evaluate('!inShade()&&uShadeAreas.length===0')
 pg.evaluate('G.w.N.GH.revealed=true;renderScene();draw(performance.now());');snap('dune-revealed');assert pg.evaluate('!inShade()')
 pg.evaluate('G.w.N.GH.open=true;renderScene();draw(performance.now());');snap('dune-open');assert pg.evaluate('inShade()&&uShadeAreas.length>0')
 print('PASS same high dune before/after uncovering, seven-socket entrance and unlocked shelter.',flush=True)
 # Cardinal branches retain the exact exits. The new drawings never add/remove a movement route.
 pg.evaluate('''()=>{for(const n of Object.values(G.w.N).filter(n=>n.t==='j'))for(let h=0;h<4;h++){G.pos={n:n.id,e:null,k:0,h,arrH:h};uTerrain();const road=uRoad(n,h);if(road.L!==passable(n,dL(h))||road.R!==passable(n,dR(h))||road.F!==passable(n,h))throw Error('Mismatch '+n.id+':'+h);}}''')
 pg.evaluate("const e=G.w.edges[0];G.pos={n:null,e:0,k:1,h:e.dir,arrH:e.dir};e.trail=true;updateClock();renderScene();draw(performance.now());");snap('sand-route-with-footprints')
 state=pg.evaluate('JSON.stringify(S)');ms=pg.evaluate('()=>{const t=performance.now();for(let i=0;i<6;i++)renderScene();return (performance.now()-t)/6;}');print(f'Mean static desert render: {ms:.1f} ms',flush=True);assert pg.evaluate('JSON.stringify(S)')==state
 print('PASS cardinal routes, retained footprints and read-only rendering.',flush=True)
 assert not errors,errors;print('PASS no JavaScript errors. Screenshots:',OUT,flush=True);browser.close()
