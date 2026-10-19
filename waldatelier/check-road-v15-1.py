"""Road-only revision: actual crossing, sand texture retention, topology, tracks and render cache."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
URL=os.environ.get('TIPP_TEST_URL','http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html')
OUT=Path('/workspace/road-review')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1500,'height':1050});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL,wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click();pg.evaluate("enterDesert(true);paused=true;S.settings.goal=120;S.world.animals={};S.world.items={};G.enc=null;trans=null;S.world.time=476;")
 stats=pg.evaluate('''()=>{const e=G.w.edges[0];G.pos={n:null,e:0,k:1,h:e.dir,arrH:e.dir};uTerrain();const before=fctx.getImageData(584,632,112,72).data;uRoad();const after=fctx.getImageData(584,632,112,72).data;const stat=a=>{const v=[];for(let i=0;i<a.length;i+=4)v.push(a[i]*.2126+a[i+1]*.7152+a[i+2]*.0722);const mean=v.reduce((a,b)=>a+b,0)/v.length;return {mean,std:Math.sqrt(v.reduce((a,b)=>a+(b-mean)**2,0)/v.length)};};return {before:stat(before),after:stat(after)};}''')
 assert .82<stats['after']['mean']/stats['before']['mean']<.98,stats
 assert stats['after']['std']>.65*stats['before']['std'],stats
 print('PASS original sand colours and ripple detail retained; subtle contrast instead of opaque yellow fill:',stats,flush=True)
 pg.evaluate('''()=>{for(const id of ['JB3','JC3','JL2']){const n=G.w.N[id];for(let h=0;h<4;h++){G.pos={n:id,e:null,k:0,h,arrH:h};uTerrain();const r=uRoad(n,h);if(r.L!==passable(n,dL(h))||r.R!==passable(n,dR(h))||r.F!==passable(n,h))throw Error('Exit mismatch');}}}''')
 for id,h,name in [('JB3',3,'kreuzung'),('JC3',0,'kurve'),('JL2',0,'felsbogen')]:
  pg.evaluate('''([id,h])=>{G.pos={n:id,e:null,k:0,h,arrH:h};arrive();paused=true;updateClock();renderScene();draw(performance.now());}''',[id,h]);pg.locator('#view').screenshot(path=str(OUT/(name+'.png')))
 state=pg.evaluate('JSON.stringify(S)');pg.evaluate('renderScene();');before=pg.evaluate('F_CANVAS.toDataURL()');pg.evaluate('renderScene();');assert pg.evaluate('F_CANVAS.toDataURL()')==before;assert pg.evaluate('JSON.stringify(S)')==state
 ms=pg.evaluate('()=>{const t=performance.now();for(let i=0;i<8;i++)renderScene();return (performance.now()-t)/8}');assert ms<150,ms
 pg.evaluate("const e=G.w.edges[0];G.pos={n:null,e:0,k:1,h:e.dir,arrH:e.dir};S.world.trails15={[e.uid]:[0]};renderScene();");assert pg.evaluate('rVisiblePrints.length')==0
 pg.evaluate('G.pos.h=(G.pos.h+2)%4;renderScene()');assert pg.evaluate('rVisiblePrints.length')==1
 assert pg.evaluate('rSandCache.size<=12');assert not errors,errors
 print(f'PASS all 12 cardinal crossing views, accurate tracks, bounded cache, read-only and stable repeated rendering ({ms:.1f} ms).',flush=True);b.close()
