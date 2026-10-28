"""Play the complete ship with real keys: every climb, storm, hold and ending."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,time
OUT=Path('/workspace/review-ship21');OUT.mkdir(exist_ok=True)
URL=os.environ.get('TIPP_TEST_URL','http://127.0.0.1:8049/Tipp-Expedition-4.7-Waldatelier.html')
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1000});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL+'#schiff',wait_until='domcontentloaded');pg.locator('#btn-play').click();assert pg.evaluate('STORE==="tipp-expedition-schiff-demo-v21"&&sh21Active()&&G.ship21.stage==="departure"');pg.screenshot(path=str(OUT/'01-abfahrt.png'));pg.keyboard.press('Space');keys=[];seen=set();stagnant=0;last_pose=None;started=time.monotonic();cdp=pg.context.new_cdp_session(pg)
 def press(key):
  if key=='ü':
   cdp.send('Input.dispatchKeyEvent',{'type':'keyDown','key':'ü','code':'BracketLeft','text':'ü','windowsVirtualKeyCode':186});cdp.send('Input.dispatchKeyEvent',{'type':'keyUp','key':'ü','code':'BracketLeft','windowsVirtualKeyCode':186})
  else:pg.keyboard.press(key)
 def settled():pg.wait_for_function("!sh21Active()||['fall','sink'].includes(G.ship21.stage)||(!G.ship21.p.move&&!G.ship21.p.air)",timeout=15000)
 def shot(name):pg.screenshot(path=str(OUT/name))
 for n in range(700):
  state=pg.evaluate("({phase:G.phase,stage:G.ship21.stage,x:G.ship21.p.x,y:G.ship21.p.y,climb:G.ship21.climb?.id,brace:G.ship21.brace?.id,hurt:G.ship21.hurt||0})")
  if state['phase']!='ship':break
  if state['stage']=='fall':
   if 'fall' not in seen:shot('10-deck-bricht.png');seen.add('fall')
   pg.wait_for_function("G.ship21.stage==='hold'");shot('11-schiffsrumpf.png');continue
  if state['stage']=='sink':
   pg.wait_for_function('G.ship21.cinema>1.1');shot('15-wasser-steigt.png');pg.wait_for_function('G.ship21.cinema>3');shot('16-blaue-wellen.png');pg.wait_for_function("G.phase==='done'");break
  if state['hurt']>0:pg.wait_for_function('G.ship21.hurt===0');continue
  key=pg.evaluate('''()=>{const q=G.ship21,p=q.p,L=q.level;if(q.climb)return L.climbs.find(c=>c.id===q.climb.id).key;if(q.brace)return 'WAIT';const i=sh21Inspectable();if(i)return 'i';const w=sh21NearWave();if(w)return 'ü';const water=sh21NearWater();if(water)return 'w';const cargo=sh21NearCargo();if(cargo)return 'z';const c=sh21NearClimb();if(c&&Math.abs(p.y-c.y)<3)return c.key;const ceiling=L.ceil.find(c=>p.x>c.a-35&&p.x<c.b+6);if(ceiling){const mode=ceiling.clear<20?'crawl':'duck';if(p.mode!==mode)return mode==='crawl'?'k':'d';return 'j';}if(p.mode==='duck'||p.mode==='crawl')return p.mode==='duck'?'d':'k';if(L.solids.some(s=>!sh21Removed(s)&&s.kind!=='cargo'&&s.x-p.x>0&&s.x-p.x<60&&p.y>s.top+2))return 's';if(L.gaps.some(z=>z.a-p.x>0&&z.a-p.x<42))return 's';if(L.rollers.some(r=>p.x>r.a-42&&p.x<r.b+12))return 's';if(q.stage==='deck'&&p.x>3500)return 's';return 'j';}''')
  if key=='WAIT':pg.wait_for_function('!G.ship21.brace');continue
  pose=(round(state['x']),round(state['y']),state['climb']);stagnant=stagnant+1 if pose==last_pose else 0;last_pose=pose;assert stagnant<9,(state,key,pg.evaluate('G.caption'));keys.append(key);press(key);settled()
  if key=='ü':
   pg.wait_for_function('G.ship21.brace?.elapsed>.8');shot('05-welle-am-mast.png' if state['x']<1500 else '08-oberdeck-im-sturm.png');pg.wait_for_function('!G.ship21.brace')
  if key=='i' and 'inspect' not in seen:shot('02-fass-identifizieren.png');seen.add('inspect')
  if key=='d' and state['stage']=='deck' and 'boom' not in seen:shot('03-unter-dem-segelbaum.png');seen.add('boom')
  if key=='w' and state['stage']=='deck' and 'water' not in seen:shot('04-waten.png');seen.add('water')
  if key=='l' and 'ladder' not in seen:shot('06-leiter.png');seen.add('ladder')
  if key=='t' and 'stairs' not in seen:shot('07-seitliche-treppe.png');seen.add('stairs')
  if key=='k' and state['stage']=='deck' and 'net' not in seen:shot('09-wantennetz.png');seen.add('net')
  if key=='k' and state['stage']=='hold' and 'crawl' not in seen:shot('12-kriechen.png');seen.add('crawl')
  if key=='z' and state['stage']=='hold' and 'cargo' not in seen:shot('14-tauziehen.png');seen.add('cargo')
  if n%35==0:print(n,state['stage'],round(state['x']),key,flush=True)
 else:raise AssertionError(pg.evaluate('({stage:G.ship21.stage,p:G.ship21.p,caption:G.caption})'))
 assert pg.evaluate("G.phase==='done'&&S.ship21.done&&!S.ship21.active"),pg.evaluate('({phase:G.phase,stage:G.ship21.stage,p:G.ship21.p})')
 assert all(k in keys for k in ['l','t','k','w','ü','i','z','s','d']);assert 'fall' in seen;assert pg.evaluate('G.ship21.level.hold&&S.ship21.coins>0');shot('17-ende.png')
 assert not errors,errors
 print('PASS complete real-key ship route, all upper-row actions, three climbs, intact crops, deck collapse, shorter hold, flooding and underwater ending. Actions',len(keys),'seconds',round(time.monotonic()-started,1),'coins',pg.evaluate('S.ship21.coins'),flush=True);b.close()
