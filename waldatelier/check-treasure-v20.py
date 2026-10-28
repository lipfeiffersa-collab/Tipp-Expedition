"""Buy the actual treasure map, walk its route and resume at the hidden hut."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
OUT=Path('/workspace/review-tasks20');OUT.mkdir(exist_ok=True)
URL=os.environ.get('TIPP_TEST_URL','http://127.0.0.1:8049/Tipp-Expedition-4.7-Waldatelier.html')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1000});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL,wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click();pg.evaluate("enterDesert(true);S.settings.goal=120;S.world.time=600;S.world.storms=[];S.world.animals={};S.world.items={};G.enc=null;S.needs={w:DROP_MS*30,f:BERRY_MS*30};S.inv=S.inv.filter(k=>k!=='schatzkarte');S.old=PREIS.schatzkarte;p18TutorialQueue=[];const e=G.w.edges.find(e=>e.a==='ZH'||e.b==='ZH');window.originalUid=e.uid;window.originalIndex=e.idx;")
 assert pg.evaluate("G.w.edges[originalIndex].closed&&G.w.N.JC1.exits[0]==null")
 pg.evaluate("enterCity();G.city.x=G.city.tx=CITY_ST.find(st=>st.id==='haendler').x;G.city.moving=false;cityCaption();updateControls();paused=false;");pg.keyboard.press('Space');assert pg.evaluate('G.phase==="menu"');key=pg.evaluate('G.menu.items.find(i=>i.label.includes("Schatzkarte")).k');pg.keyboard.press(key);assert pg.evaluate('S.inv.includes("schatzkarte")&&S.old===0');assert pg.locator('[data-task="treasure-trail20"]').count()==1;pg.keyboard.press('Escape');pg.evaluate("G.city.x=G.city.tx=CITY_ST.find(st=>st.id==='tor').x;cityCaption();updateControls();");pg.keyboard.press('Space');assert pg.evaluate('!G.city&&G.phase==="explore"');pg.evaluate("const e=G.w.edges.find(e=>[e.a,e.b].includes('JC3')&&[e.a,e.b].includes('JC2'));S.world.animals={skorpion:'e:'+e.uid+':2'};G.enc=null;arrive();")
 assert pg.evaluate("!G.w.edges[originalIndex].closed&&G.w.edges[originalIndex].uid===originalUid&&G.w.N.JC1.exits[0]===originalIndex&&G.w.N.ZH.exits[2]===originalIndex")
 # The graph supplies every expected key; no teleport is used on the desert route.
 pg.evaluate("window.route20=[];const queue=[[G.pos.n]],seen=new Set();while(queue.length){const path=queue.shift(),id=path.at(-1);if(seen.has(id))continue;seen.add(id);if(id==='ZH'){route20=path;break;}for(const ei of Object.values(G.w.N[id].exits)){const e=G.w.edges[ei];if(!e.closed)queue.push([...path,e.a===id?e.b:e.a]);}}if(!route20.length)throw Error('No route to ZH');")
 for target in pg.evaluate('route20.slice(1)'):
  direction=pg.evaluate("target=>{const n=curNode();return Number(Object.entries(n.exits).find(([d,ei])=>{const e=G.w.edges[ei];return(e.a===n.id?e.b:e.a)===target;})[0]);}",target)
  key=pg.evaluate("d=>{const m=nodeMoves();return Object.keys(m).find(k=>m[k]===d);}",direction);key=pg.evaluate('G.foot') if key=='walk' else key;pg.keyboard.press('Space' if key==' ' else key);pg.wait_for_function('trans===null')
  steps=0
  while pg.evaluate('G.pos.e!=null'):
   steps+=1;assert steps<60,pg.evaluate('({pos:G.pos,block:stepBlock(),expected:expected(),caption:G.caption})')
   key=pg.evaluate("G.detour?G.detour.next:obstBlock()==='tier'?(G.obsId!==spotKey()?'i':'a'):G.foot")
   pg.keyboard.press(key);pg.wait_for_function('trans===null')
  assert pg.evaluate('G.pos.n')==target;print('Walked',target,flush=True)
 assert pg.evaluate('G.pos.n==="ZH"&&G.w.N.ZH.seen&&G.w.edges[originalIndex].seen');assert pg.evaluate('rKnown("animal:skorpion")');assert pg.evaluate('p18State().metrics.treasure20===1');assert pg.locator('[data-task="treasure-trail20"]').count()==0;pg.screenshot(path=str(OUT/'04-schatzkartenweg-ziel.png'));pg.evaluate('save()');pg.reload(wait_until='domcontentloaded');pg.locator('#btn-play').click();assert pg.evaluate('G.pos.n==="ZH"&&!G.w.edges.find(e=>e.a==="ZH"||e.b==="ZH").closed')
 pg.keyboard.press('Backspace');pg.wait_for_function('trans===null');key=pg.evaluate('G.foot');pg.keyboard.press(key);pg.wait_for_function('trans===null');assert pg.evaluate('G.pos.e!=null');assert not errors,errors
 print('PASS real map purchase for 8 old coins; route unlocks on leaving town, stable edge ID, actual complete walk from city to hidden hut, map flags, saved resume and walk back; no JS errors.',flush=True);b.close()
