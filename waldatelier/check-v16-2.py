"""Real movement, branch contrast and weather-consistent sky at every camera stage."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
OUT=Path('/workspace/review-weather-final');OUT.mkdir(exist_ok=True)
URL=os.environ.get('TIPP_TEST_URL','http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1280,'height':1000});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL,wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click();pg.evaluate("enterDesert(true);paused=true;S.settings.goal=120;S.world.items={};S.world.animals={};S.world.storms=[];S.world.time=659;S.needs={w:DROP_MS*10,f:BERRY_MS*10};G.enc=null;trans=null;S.known=[...new Set([...S.known,'o','e','ü','f','j',' '])];")
 def node(id='JC4',h=1):pg.evaluate('''([id,h])=>{vSky=null;qEffect=null;G.storm=null;G.enc=null;G.hack=null;G.phase='explore';trans=null;G.pos={n:id,e:null,k:0,h,arrH:h};arrive();paused=true;}''',[id,h])
 def snap(name):pg.evaluate('updateClock();renderScene();draw(performance.now());');pg.locator('#view').screenshot(path=str(OUT/(name+'.png')))
 def key(k,wait=20):pg.evaluate('paused=false;updateControls()');pg.keyboard.press(k);pg.wait_for_timeout(wait);pg.evaluate('paused=true')
 node();stats=pg.evaluate('''()=>{uTerrain();const before=fctx.getImageData(0,0,1280,720).data,road=uRoad(G.w.N.JC4,1),after=fctx.getImageData(0,0,1280,720).data,result=[];for(const x of [200,1080]){let rows=0,contrast=0;for(let y=440;y<592;y++){const i=(y*1280+x)*4,d=(before[i]-after[i])*.299+(before[i+1]-after[i+1])*.587+(before[i+2]-after[i+2])*.114;if(d>15){rows++;contrast+=d;}}result.push({width:rows/4,contrast:contrast/rows});}return result;}''')
 assert all(s['width']>=11 and s['contrast']>=20 for s in stats),stats
 # A junction must be visible before the last walking step, not just after arriving.
 ahead=pg.evaluate('''()=>{const ei=G.w.edges.findIndex(e=>[e.a,e.b].includes('JC3')&&[e.a,e.b].includes('JC4')),e=G.w.edges[ei],fw=e.b==='JC4';G.pos={n:null,e:ei,k:fw?e.n-1:1,h:fw?e.dir:(e.dir+2)%4,arrH:0};uTerrain();const before=fctx.getImageData(0,0,1280,720).data;uRoad(G.w.N.JC4,G.pos.h,ZJ+DZSTEP);const after=fctx.getImageData(0,0,1280,720).data;let rows=0;for(let y=412;y<520;y++){const i=(y*1280+200)*4;if((before[i]-after[i])*.299+(before[i+1]-after[i+1])*.587+(before[i+2]-after[i+2])*.114>15)rows++;}return rows/4;}''');assert ahead>=4,ahead
 node();snap('kreuzung-kleines-fenster');pg.screenshot(path=str(OUT/'spielansicht-kleines-fenster.png'))
 print('PASS lateral branches have a clearly distinct material and visible width at small game-window size:',stats,flush=True)
 # Follow the actual JC3 -> JC4 route with F/J and enter the three-way choice.
 pg.evaluate("const ei=G.w.edges.findIndex(e=>[e.a,e.b].includes('JC3')&&[e.a,e.b].includes('JC4')),e=G.w.edges[ei],forward=e.b==='JC4';G.pos={n:null,e:ei,k:forward?e.n-3:3,h:forward?e.dir:(e.dir+2)%4,arrH:0};G.foot='f';arrive();paused=true;")
 for i in range(3):
  foot=pg.evaluate('G.foot');key(foot,600);snap('annaherung-'+str(i+1))
 assert pg.evaluate('G.pos.n==="JC4"&&G.pos.e===null');pg.evaluate('paused=false;updateControls()');assert pg.evaluate('expected().includes("f")&&expected().includes("j")&&expected().includes(" ")');pg.evaluate('paused=true')
 print('PASS three actual F/J steps into the cactus crossing, with left/right/straight controls intact.',flush=True)
 def image_stats():return pg.evaluate('''()=>{const p=vx.getImageData(0,0,1280,720).data;let blue=0,n=0;const means=[];for(let y=0;y<720;y++){let sum=0;for(let x=0;x<1280;x++){const i=(y*1280+x)*4,r=p[i],g=p[i+1],b=p[i+2];sum+=(r+g+b)/3;if(b>r+15&&b>g+5)blue++;n++;}means.push(sum/1280);}let jump=0;for(let y=650;y<719;y++)jump=Math.max(jump,Math.abs(means[y+1]-means[y]));return {blue:blue/n,bottomJump:jump};}''')
 for mode,time in [('clear',659),('warning',600),('night',1380),('storm',659),('nightstorm',1380)]:
  node();pg.evaluate('''([mode,time])=>{S.world.time=time;S.world.storms=mode==='warning'?[630]:[];if(mode.includes('storm'))startStorm();renderScene();}''',[mode,time]);pos=pg.evaluate('JSON.stringify(G.pos)');key('o');assert pg.evaluate('!!vSky&&!!vSky.landscape')
  for t in [240,475,710,1100]:
   pg.evaluate('(t)=>{vSky.elapsed=t;draw(performance.now());}',t);s=image_stats();
   if 'storm' in mode:assert s['blue']<.005,(mode,t,s)
   if t==1100:
    assert s['bottomJump']<5,(mode,s)
    frozen=pg.evaluate("$('#view').toDataURL()");pg.wait_for_timeout(150);pg.evaluate('draw(performance.now())');assert pg.evaluate("$('#view').toDataURL()")==frozen
   pg.locator('#view').screenshot(path=str(OUT/(mode+'-'+str(t)+'.png')))
  if 'storm' in mode:assert pg.evaluate('vSky.weather==="storm"&&actionsNow().some(a=>a[0]==="e")')
  pg.evaluate('paused=false;updateControls()');pg.keyboard.press('Space');pg.wait_for_function('vSky===null',timeout=7000);pg.evaluate('paused=true');assert pg.evaluate('JSON.stringify(G.pos)')==pos
 print('PASS actual O/Space across 20 camera stages: clear sky, warning, night, daytime storm and night storm; no blue storm sky or lower-edge strip.',flush=True)
 # Weather changes while looking up must take effect immediately; E remains usable.
 node();pg.evaluate('S.world.time=659;S.world.storms=[]');key('o');pg.evaluate('vSky.elapsed=1100;draw(performance.now());startStorm();draw(performance.now());');assert pg.evaluate('vSky.weather')=='storm';assert image_stats()['blue']<.005;key('e');assert pg.evaluate('!vSky&&G.storm.st==="qte"')
 for i in range(5):pg.evaluate('G.storm.m=G.storm.zone;paused=false;');pg.dispatch_event('body','keydown',{'key':'ü'});pg.evaluate('paused=true;')
 assert pg.evaluate('!G.storm&&G.w.N.GH.revealed')
 print('PASS storm onset during sky view, real E dig-in and all five Ü survival inputs.',flush=True)
 # Exact exits and stored tracks survive the presentation changes.
 pg.evaluate('''()=>{for(const id of ['JC4','JB3','JC3'])for(let h=0;h<4;h++){G.pos={n:id,e:null,k:0,h,arrH:h};uTerrain();const r=uRoad(G.w.N[id],h);if(r.L!==passable(G.w.N[id],dL(h))||r.R!==passable(G.w.N[id],dR(h))||r.F!==passable(G.w.N[id],h))throw Error('Wrong exit');}}''')
 node();state=pg.evaluate('JSON.stringify(S)');pg.evaluate('renderScene();renderScene()');assert pg.evaluate('JSON.stringify(S)')==state
 assert not errors,errors;print('PASS cardinal exits, read-only rendering and no JavaScript errors. Screenshots:',OUT,flush=True);b.close()
