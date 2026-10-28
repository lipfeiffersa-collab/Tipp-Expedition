"""Real F/J coastal approach and tent construction inside the landscape, with a walking video."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,time,subprocess
OUT=Path('/workspace/review-coast17-2');OUT.mkdir(exist_ok=True);(OUT/'video').mkdir(exist_ok=True)
URL=os.environ.get('TIPP_TEST_URL','http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1600,'height':1000},record_video_dir=str(OUT/'video'),record_video_size={'width':1600,'height':1000});stamp=time.monotonic();pg=ctx.new_page();pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL,wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click();pg.evaluate("enterDesert(true);S.settings.goal=120;S.world.time=660;S.world.storms=[];S.world.animals={};S.world.items={};G.enc=null;S.needs={w:DROP_MS*20,f:BERRY_MS*20};S.known=[...new Set([...S.known,'f','j','z',' ','Backspace'])];")
 pg.evaluate("const ei=G.w.edges.findIndex(e=>e.a==='STADT'||e.b==='STADT'),e=G.w.edges[ei],fw=e.b==='STADT',dir=fw?e.dir:(e.dir+2)%4;window.coastEdge=ei;window.coastForward=fw;G.pos={n:fw?e.a:e.b,e:null,k:0,h:(dir+3)%4,arrH:0};G.foot='f';arrive();paused=false;updateControls();");box=pg.locator('#view').bounding_box();start=time.monotonic()-stamp
 pg.keyboard.press('j');pg.wait_for_function('trans===null');assert pg.evaluate('!!d17Coast()');pg.evaluate('paused=true;renderScene();draw(performance.now());');pg.screenshot(path=str(OUT/'stadt-01-nach-abbiegen.png'));pg.wait_for_timeout(400)
 zooms=[];deltas=[];previous=pg.evaluate('Array.from(fctx.getImageData(0,0,1280,720).data.filter((_,i)=>i%64===0))')
 n=pg.evaluate('G.w.edges[window.coastEdge].n')
 for i in range(n-1):
  pg.evaluate('paused=false;updateControls()');pg.keyboard.press(pg.evaluate('G.foot'));assert pg.evaluate('!!trans?.coastal')
  if i==0:
   pg.evaluate('paused=true;trans.coastal.elapsed=trans.dur*.5;draw(performance.now())');pos=pg.evaluate('JSON.stringify(G.pos)');state=pg.evaluate('JSON.stringify(S)');image=pg.evaluate('F_CANVAS.toDataURL()');pg.wait_for_timeout(100);pg.evaluate('draw(performance.now())');assert pg.evaluate('JSON.stringify(G.pos)')==pos and pg.evaluate('JSON.stringify(S)')==state;assert pg.evaluate('F_CANVAS.toDataURL()')==image;pg.evaluate('paused=false')
  pg.wait_for_function('trans===null');pg.evaluate('paused=true;draw(performance.now());');c=pg.evaluate('''()=>{const coast=d17Coast(),p=coast?1-coast.dist/coast.e.n:1;return d17CoastPlate(p).zoom;}''');zooms.append(c)
  current=pg.evaluate('Array.from(fctx.getImageData(0,0,1280,720).data.filter((_,i)=>i%64===0))');delta=sum(abs(a-b) for a,b in zip(previous,current))/len(current);deltas.append(delta);previous=current;pg.screenshot(path=str(OUT/f'stadt-{i+2:02}-schritt.png'));pg.wait_for_timeout(350)
 assert pg.evaluate('G.pos.n==="STADT"&&G.pos.e===null');assert zooms[-1]>2 and all(b>a for a,b in zip(zooms,zooms[1:]));assert all(d>3 for d in deltas),deltas
 pg.wait_for_timeout(500);duration=time.monotonic()-stamp-start
 # Rapid alternating input must still commit exactly two real steps, not duplicate or lose one.
 pg.evaluate("const e=G.w.edges[coastEdge];G.pos={n:null,e:coastEdge,k:coastForward?1:e.n-1,h:coastForward?e.dir:(e.dir+2)%4,arrH:0};G.foot='f';arrive();paused=false;window.oldMoves=G.moves;");pg.keyboard.press('f');pg.keyboard.press('j');pg.wait_for_function('G.moves===oldMoves+2&&trans===null');pg.evaluate('paused=true')
 print('PASS actual turn plus',n-1,'walking steps; camera zooms',zooms,'pixel changes',deltas,'pause/read-only and queued F/J.',flush=True)
 # Instrument the popup renderer: no card may be drawn during any tent assembly phase.
 pg.evaluate("G.pos={n:'OASE',e:null,k:0,h:1,arrH:1};G.phase='explore';G.storm=null;S.world.time=720;S.world.animals={};S.world.items={};S.inv=S.inv.filter(k=>k!=='zelt');delete S.world.tentCamp17;for(const[k,n]of Object.entries(ZELT))S.res[k]=n;arrive();paused=false;renderInv();");pg.keyboard.press('z');assert pg.evaluate('!!qEffect?.tent17')
 for t,name,stage in [(700,'zelt-01-gestell',0),(1800,'zelt-02-dach',1),(2800,'zelt-03-fertig',2)]:
  calls=pg.evaluate('''t=>{paused=true;qEffect.elapsed=t;const saved=qCard;let count=0;qCard=(...args)=>{count++;return saved(...args);};try{draw(performance.now());}finally{qCard=saved;}return count;}''',t);assert calls==0,calls;assert pg.evaluate('qEffect.worldStage')==stage;pg.screenshot(path=str(OUT/(name+'.png')))
 before=pg.evaluate('Array.from(fctx.getImageData(210*4,100*4,80*4,70*4).data)');pg.evaluate('paused=false');pg.keyboard.press('Space');pg.evaluate('paused=true;renderScene();draw(performance.now())');after=pg.evaluate('Array.from(fctx.getImageData(210*4,100*4,80*4,70*4).data)');assert before==after;assert pg.evaluate('S.inv.includes("zelt")&&S.world.tentCamp17==="OASE"');pg.screenshot(path=str(OUT/'zelt-04-lagerplatz.png'));assert not errors,errors
 print('PASS all three assembly phases inside the actual landscape, no popup card, exact same tent position before/after completion; no JS errors.',flush=True)
 video=pg.video;ctx.close();raw=video.path();b.close()
subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(start),'-i',str(raw),'-t',str(duration),'-vf',f"crop={int(box['width'])//2*2}:{int(box['height'])//2*2}:{int(box['x'])}:{int(box['y'])}",'-an','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'Stadtweg.mp4')],check=True)
print('Actual walking video:',OUT/'Stadtweg.mp4',flush=True)
