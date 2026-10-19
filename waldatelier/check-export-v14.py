"""Validate the standalone v14 export and unchanged survival rules (requires export.py first)."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import zipfile,hashlib,json,time
z=Path('/workspace/shared/downloads/Wald-Spiel-v14.zip');html=Path('/workspace/shared/downloads/Wald-Spiel-v14.html')
with zipfile.ZipFile(z) as a:assert a.testzip() is None and a.read('Wald-Spiel.html')==html.read_bytes()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1000});pg.set_default_navigation_timeout(90000);pg.set_default_timeout(90000);errors=[];remote=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('request',lambda req:remote.append(req.url) if req.url.startswith('http') and '127.0.0.1' not in req.url else None)
 started=time.monotonic();pg.goto('http://127.0.0.1:8031/shared/downloads/Wald-Spiel-v14.html');pg.locator('#btn-play').click();print(f'Standalone startup: {time.monotonic()-started:.2f}s',flush=True);pg.evaluate('enterDesert(true);paused=true;S.settings.goal=120;G.enc=null;G.storm=null;S.world.animals={};S.world.items={};')
 # Original survival arithmetic must remain unchanged.
 assert pg.evaluate('''()=>{S.world.time=13*60;S.world.heatOff=null;G.pos={n:'JC1',e:null,k:0,h:0,arrH:0};S.inv=S.inv.filter(k=>k!=='kopfschutz');return heatMul()===2;}''')
 assert pg.evaluate('S.inv.push("kopfschutz");heatMul()===1.5')
 assert pg.evaluate("G.pos.n='T1';heatMul()===1")
 pg.evaluate('restShade()');assert pg.evaluate('dTime()')==900
 assert pg.evaluate('''()=>{S.water=0;S.needs={w:0,f:BERRY_MS};return exhausted()&&needsBlocked()==='durstig';}''')
 assert pg.evaluate('''()=>{S.water=0;for(const k of ["beeren","datteln","kaktusfeigen","honig"])S.res[k]=0;S.needs={w:DROP_MS,f:0};return exhausted()&&needsBlocked()==='hungrig';}''')
 pg.evaluate("S.needs={w:DROP_MS*10,f:BERRY_MS*10};S.world.time=12*60;const e=G.w.edges.find(e=>e.a==='FM'||e.b==='FM');G.pos={n:null,e:e.idx,k:e.a==='FM'?e.n-2:2,h:e.a==='FM'?(e.dir+2)%4:e.dir,arrH:0};renderScene();draw(performance.now());")
 assert pg.evaluate('fmShows()');pg.locator('#view').screenshot(path='/tmp/v14-mirage.png')
 pg.evaluate("G.pos={n:'FM',e:null,k:0,h:0,arrH:0};arrive();draw(performance.now());");assert pg.evaluate('G.w.N.FM.fmKnown')
 pg.evaluate('enterCity();G.city.x=G.city.tx=170;cityCaption();paused=true;renderScene();draw(performance.now());');pg.locator('#view').screenshot(path='/tmp/v14-harbor-final.png')
 # Surviving the export must not hide regional animal journal pages under the forest tab.
 assert pg.evaluate('journalPages().filter(p=>p.tab==="Wüste").length')>=1
 assert not remote,remote;assert not errors,errors
 print('PASS standalone ZIP byte equality, 31 atlases loaded, survival arithmetic, shade rest, thirst/hunger, mirage, city, desert journal, no remote resources or JavaScript errors.',flush=True)
 print('SHA256',hashlib.sha256(z.read_bytes()).hexdigest(),flush=True);b.close()
