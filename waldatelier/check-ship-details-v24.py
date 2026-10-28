"""Actual optional cabin visit, stairs save, unavoidable landing, native art ratios and flooded floor."""
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path('/workspace/review-ship24-details');OUT.mkdir(exist_ok=True)
URL='http://127.0.0.1:8049/Tipp-Expedition-4.7-Waldatelier.html#schiff'
with sync_playwright() as w:
 b=w.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1600,'height':1000});p.set_default_timeout(90000);errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.goto(URL);p.locator('#btn-play').click();p.keyboard.press('Space');p.evaluate("sh22EnterStage('inside',2100,108);S.settings.shipMotion=false;G.ship21.known.water=true;")
 def key(k):
  p.keyboard.press(k);p.wait_for_function("!G.ship21.p.move&&!G.ship21.p.air");assert not p.evaluate('G.ship21.hurt>0'),p.evaluate('G.ship21.p')
 def stair():
  for _ in range(20):
   key('t')
   if not p.evaluate('!!G.ship21.climb'):break
  else:raise AssertionError('stair did not finish')
 key('j');assert p.evaluate("sh21NearClimb().id==='cabin-stairs'");key('t');assert p.evaluate('!!G.ship21.climb');before=p.evaluate('({x:G.ship21.p.x,y:G.ship21.p.y,n:G.ship21.climb.n})');p.evaluate('save()');p.reload();p.locator('#btn-play').click();assert p.evaluate('G.ship21.climb.n')==before['n'];assert abs(p.evaluate('G.ship21.p.y')-before['y'])<.01;stair();key('j');key('j');key('j');key('j');assert p.evaluate("G.ship21.p.x>2250&&G.ship21.p.y===90&&G.ship21.caption.includes('Kapitänskajüte')");p.screenshot(path=str(OUT/'01-kajuete-betreten.png'))
 # Actual indoor photograph uses the scene, consumes a frame and survives the wrapper.
 frames=p.evaluate('p18State().loaded');p.keyboard.press('F5');assert p.evaluate('!!p18Camera&&paused');p.keyboard.press('Space');assert p.evaluate('p18State().loaded')==frames-1;p.wait_for_timeout(700)
 for _ in range(4):key('f')
 assert p.evaluate("sh21NearClimb().id==='cabin-stairs'");stair()
 key('f');key('f');assert p.evaluate("sh21NearClimb().id==='landing-stairs'");stair();assert p.evaluate('G.ship21.p.x===2005&&G.ship21.p.y===150');p.screenshot(path=str(OUT/'02-kajuete-zurueck.png'))
 # The final gap must be jumped, then collapse occurs on the landing itself.
 p.evaluate("sh22EnterStage('deck',2020);const q=G.ship21;q.p.face=1;q.cleared['great-breaker']=true;");key('j');assert p.evaluate('G.ship21.p.x<2045');p.keyboard.press('s');p.wait_for_function("G.ship21.stage==='fall'");assert p.evaluate("G.ship21.broken['final-deck']&&!G.ship21.p.air");p.wait_for_timeout(650);p.screenshot(path=str(OUT/'03-fall-in-den-rumpf.png'));p.evaluate('save()');p.reload();p.locator('#btn-play').click();assert p.evaluate("G.ship21.stage==='inside'&&G.ship21.p.x===2100&&G.ship21.p.y===108");p.wait_for_timeout(350);p.screenshot(path=str(OUT/'04-landung-auf-absatz.png'))
 # Legacy interior positions are relocated to the safe landing, never the missing deck.
 p.evaluate("const s=S.ship21;delete s.geometry24;s.stage='inside';s.p={x:1800,y:150,face:-1,mode:null};const c=S.coins;window.beforeCoins24=c;sh21Start(true);");assert p.evaluate('G.ship21.p.x===2100&&G.ship21.p.y===108&&S.coins===beforeCoins24')
 # Observe actual image drawing: room sprites are never anisotropically stretched.
 ratio=p.evaluate("""()=>{paused=true;sh22EnterStage('inside',2290,90);paused=true;const calls=[],old=fctx.drawImage;fctx.drawImage=function(...a){if(a[0]===SH21.rooms)calls.push(a.slice(1));return old.apply(this,a)};const before=JSON.stringify(G.ship21);for(let i=0;i<3;i++)sh21Render();fctx.drawImage=old;return {pure:before===JSON.stringify(G.ship21),ratios:calls.map(a=>(a[6]/a[7])/(a[2]/a[3]))}}""");assert ratio['pure'];assert ratio['ratios'] and all(abs(x-1)<1e-6 for x in ratio['ratios']),ratio
 # W advances in the route direction; J backs out of a leftward flooded section.
 p.evaluate("sh22EnterStage('inside',1610);paused=false;G.ship21.known.water=true;");key('w');assert p.evaluate("G.ship21.p.mode==='wade'&&sh21Actions().some(a=>a[0]==='j'&&a[1]==='zurückwaten')");x=p.evaluate('G.ship21.p.x');key('j');assert p.evaluate('G.ship21.p.x')>x;assert p.evaluate('G.ship21.p.mode===null')
 # Actual water covers the floor and the character's legs down to the screen edge.
 colors=p.evaluate("""()=>{sh22EnterStage('inside',1500);paused=true;const q=G.ship21;q.cam=1400;q.known.water=true;q.p.mode='wade';q.viewLift=0;sh21Render();return [154,169,177].map(y=>Array.from(fctx.getImageData(140*4,y*4,1,1).data).slice(0,3))}""");assert all(c[2]>c[0]+5 and c[1]>c[0]+10 for c in colors),colors;p.screenshot(path=str(OUT/'05-gefluteter-durchgang.png'))
 p.keyboard.press('F3');p.wait_for_timeout(200);assert p.locator('#kb').is_visible();p.screenshot(path=str(OUT/'06-mit-tastatur.png'))
 assert not errors,errors
 print('PASS real optional cabin visit and return, stair reload, indoor photo, real final jump and landing-triggered collapse, fall reload, legacy migration, pure proportional drawing, deep flood and F3; no JS errors.',flush=True);b.close()
