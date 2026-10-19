from playwright.sync_api import sync_playwright
import json
url='http://127.0.0.1:8031/shared/downloads/Wald-Spiel-v12.html'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page();errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(url+'#hoehle');pg.locator('#btn-play').click()
 pg.evaluate("paused=false;S.known=[...new Set([...S.known,'g'])];S.coins=20;S.old=0;const n=G.w.N.GR;G.w.N.TU.open=true;G.pos={n:'GR',e:null,k:0,h:n.rdir,arrH:n.rdir};arrive(false,'enter');")
 before=pg.evaluate('[S.coins,S.old,S.res.diamant||0,S.food||0]');pg.keyboard.press('g');after=pg.evaluate('[S.coins,S.old,S.res.diamant||0,S.food||0]');assert after[:3]==[25,5,before[2]+1],(before,after)
 assert '5 alte Münzen, 5 Goldmünzen' in pg.locator('#dialog-txt').inner_text()
 pg.evaluate("caveChest(G.w.N.GR);save()");assert pg.evaluate('[S.coins,S.old,S.res.diamant||0]')==after[:3]
 pg.reload();pg.locator('#btn-play').click();assert pg.evaluate('[S.coins,S.old,S.res.diamant||0]')==after[:3]
 print('PASS mine actual G reward, diamond retained, one-time payout and reload',flush=True)
 pg.evaluate("enterDesert(true);paused=false;S.coins=20;S.old=5;const n=G.w.N.KTR;G.pos={n:'KTR',e:null,k:0,h:0,arrH:0};G.pos.h=[0,1,2,3].find(h=>facePlace(n,h));G.pos.arrH=G.pos.h;n.examined=true;n.cleared=true;S.known=[...new Set([...S.known,'g'])];arrive(false,'enter');")
 pg.keyboard.press('g');assert pg.evaluate('[S.coins,S.old]')==[27,8];assert '3 alte Münzen und 7 Goldmünzen' in pg.locator('#dialog-txt').inner_text()
 pg.evaluate('openChestD();save()');assert pg.evaluate('[S.coins,S.old]')==[27,8]
 pg.reload();pg.locator('#btn-play').click();assert pg.evaluate('[S.coins,S.old]')==[27,8]
 # The dune chest retains its original ancient-coin reward.
 pg.evaluate("paused=false;const n=G.w.N.GH;n.revealed=true;n.open=true;n.solved=true;n.chest=false;G.pos={n:'GH',e:null,k:0,h:0,arrH:0};G.pos.h=[0,1,2,3].find(h=>facePlace(n,h));G.pos.arrH=G.pos.h;arrive(false,'enter');")
 pg.keyboard.press('g');assert pg.evaluate('[S.coins,S.old]')==[27,16]
 print('PASS cactus actual G reward, one-time payout and reload; dune chest remains 8 old coins',flush=True)
 template=pg.evaluate('JSON.parse(JSON.stringify(S))')
 uid=pg.evaluate("[Object.keys(CAVE_NODES).indexOf('GR')+1,Object.keys(DESERT_NODES).indexOf('KTR')+1]")
 for coins,mine,cactus in [(30,True,True),(2,True,True),(30,True,False),(30,False,False)]:
  state=json.loads(json.dumps(template));state['coins']=coins;state['old']=0;state['world'].pop('coinRewardsV11',None);state['hoehle'].pop('coinRewardsV11',None);state['hoehle']['flags'].setdefault(str(uid[0]),{})['chest']=mine;state['world']['flags'].setdefault(str(uid[1]),{})['chest']=cactus
  raw=json.dumps(state,separators=(',',':'));q=b.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto('http://127.0.0.1:8031/');q.evaluate("raw=>{localStorage.clear();localStorage.setItem('tipp-expedition-rpg-v1',raw)}",raw);q.goto(url);q.wait_for_function('fReady');amount=(5 if mine else 0)+(3 if cactus else 0);expected=[max(0,coins-amount),amount];assert q.evaluate('[S.coins,S.old]')==expected,(coins,mine,cactus,q.evaluate('[S.coins,S.old]'))
  if amount:assert q.evaluate("localStorage.getItem(STORE+'-vor-muenzkorrektur-v11')")==raw
  q.reload();q.wait_for_function('fReady');assert q.evaluate('[S.coins,S.old]')==expected
  assert q.evaluate('S.res.diamant')==state['res']['diamant'];q.close()
 print('PASS legacy active/archive chests reconciled once, low-gold balance >=0, unopened chests untouched, original save backup and other rewards retained',flush=True)
 assert not errors,errors;b.close()
