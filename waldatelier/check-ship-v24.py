"""Full real-key route: central roof, reverse interior, hanging, guns, storage."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import time
OUT=Path('/workspace/review-ship24-route');OUT.mkdir(exist_ok=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1000});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto('http://127.0.0.1:8049/Tipp-Expedition-4.7-Waldatelier.html#schiff',wait_until='domcontentloaded');pg.locator('#btn-play').click();assert pg.evaluate('sh21Active()');pg.keyboard.press('Space');cdp=pg.context.new_cdp_session(pg);keys=[];stages=set();seen=set();last=None;stagnant=0;start=time.monotonic()
 def press(k):
  if k=='ü':
   cdp.send('Input.dispatchKeyEvent',dict(type='keyDown',key='ü',code='BracketLeft',text='ü',windowsVirtualKeyCode=186));cdp.send('Input.dispatchKeyEvent',dict(type='keyUp',key='ü',code='BracketLeft',windowsVirtualKeyCode=186))
  else:pg.keyboard.press(k)
 def shot(name):pg.screenshot(path=str(OUT/(name+'.png')))
 for n in range(600):
  state=pg.evaluate('({phase:G.phase,stage:G.ship21.stage,x:G.ship21.p.x,y:G.ship21.p.y,hurt:G.ship21.hurt||0})');stages.add(state['stage'])
  if state['phase']!='ship':break
  if state['hurt']>0:raise AssertionError(('unexpected checkpoint reset',state,pg.evaluate('G.caption')))
  if state['stage']=='fall':shot('08-einbruch');pg.wait_for_function("G.ship21.stage==='inside'");shot('09-kapitaensraum');continue
  if state['stage']=='sink':pg.wait_for_function('G.ship21.cinema>3');shot('18-untergang');pg.wait_for_function("G.phase==='done'");break
  key=pg.evaluate('''()=>{const q=G.ship21,p=q.p,L=q.level,d=L.dir;if(q.transfer||q.brace)return 'WAIT';if(q.hang)return 'h';if(q.climb)return L.climbs.find(c=>c.id===q.climb.id).key;if(sh22NearExit())return 'l';if(sh22NearHang())return 'h';if(sh21Inspectable())return 'i';if(sh21NearWave())return 'ü';if(sh21NearWater())return 'w';if(sh21NearCargo())return 'z';const climb=sh21NearClimb();if(climb)return climb.key;const roof=L.ceil.find(c=>d>0?p.x>c.a-35&&p.x<c.b+6:p.x<c.b+35&&p.x>c.a-6);if(roof){const mode=roof.clear<20?'crawl':'duck';if(p.mode!==mode)return mode==='crawl'?'k':'d';return d>0?'j':'f';}if(p.mode==='crawl'||p.mode==='duck')return p.mode==='crawl'?'k':'d';if(L.solids.some(s=>!sh21Removed(s)&&!['cargo','barrier'].includes(s.kind)&&d*(s.x+s.w/2-p.x)>0&&d*(s.x+s.w/2-p.x)<60&&p.y>s.top+2))return 's';if(L.gaps.some(g=>d*(d>0?g.a-p.x:p.x-g.b)>0&&(d>0?g.a-p.x:p.x-g.b)<42))return 's';if(L.rollers.some(r=>p.x>r.a-42&&p.x<r.b+12))return 's';if(q.stage==='deck'&&p.x>L.breakAt-40)return 's';return d>0?'j':'f';}''')
  if key=='WAIT':pg.wait_for_function('!G.ship21.brace&&!G.ship21.transfer');continue
  pose=(state['stage'],round(state['x']),round(state['y']),key);stagnant=stagnant+1 if last==pose else 0;last=pose;assert stagnant<10,(state,key,pg.evaluate('G.caption'));keys.append(key);press(key)
  if key=='ü':pg.wait_for_function('G.ship21.brace?.elapsed>.9');shot('04-mast-welle' if state['x']<1200 else '07-spaete-welle');pg.wait_for_function('!G.ship21.brace')
  if key=='h' and 'hang' not in seen:pg.wait_for_timeout(170);shot('11-hangeln');seen.add('hang')
  pg.wait_for_function("!sh21Active()||G.ship21.transfer||['fall','sink'].includes(G.ship21.stage)||(!G.ship21.p.move&&!G.ship21.p.air)",timeout=12000)
  for k,st,name in [('d','deck','01-ducken'),('l','deck','03-leiter'),('w','deck','06-waten'),('k','inside','10-kletternetz'),('w','inside','12-waten-links'),('z','hold','16-flaschenzug')]:
   if key==k and state['stage']==st and name not in seen:shot(name);seen.add(name)
  if state['stage']=='inside' and pg.evaluate("G.ship21.p.mode==='crawl'") and 'crawl' not in seen:shot('13-kriechen');seen.add('crawl')
  if state['stage']=='guns' and 'guns' not in seen:shot('14-geschuetzdeck');seen.add('guns')
  if state['stage']=='hold' and 'hold' not in seen:shot('15-lager-zellen');seen.add('hold')
  if n%25==0:print(n,state['stage'],round(state['x']),key,flush=True)
 else:raise AssertionError('route did not finish')
 assert pg.evaluate("G.phase==='done'&&S.ship21.done"),pg.evaluate('G.ship21')
 assert {'deck','inside','guns','hold','sink'}<=stages,stages
 assert set(['f','j','s','d','k','l','t','h','w','ü','z','i'])<=set(keys),set(keys)
 assert not errors,errors
 print('PASS full ship v24, reverse route, all actions, four levels, no resets, seconds',round(time.monotonic()-start,1),flush=True);b.close()
