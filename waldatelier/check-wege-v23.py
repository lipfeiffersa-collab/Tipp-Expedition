"""Junction key circles and a real mine round trip to retrieve the forgotten pickaxe."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
OUT=Path('/workspace/review-wege23');OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1000});pg.set_default_timeout(30000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto('http://127.0.0.1:8049/Tipp-Expedition-4.7-Waldatelier.html');pg.locator('#btn-play').click()
 def fork(desert=False):
  pg.evaluate("""desert=>{if(desert)enterDesert(true);G.phase='explore';G.wake=2;S.settings.goal=120;G.puz=null;G.storm=null;G.sky=null;vSky=null;qEffect=null;trans=null;p18TutorialQueue=[];G.enc=null;S.world.animals={};S.world.items={};const candidates=[];for(const n of Object.values(G.w.N))if(n.t==='j'&&!n.place)for(let h=0;h<4;h++){const m=nodeMoves(n,h);if(m.f!=null&&m.j!=null&&m[' ']!=null)candidates.push([n,h]);}const[n,h]=candidates[0];G.pos={n:n.id,e:null,k:0,h,arrH:h};arrive();paused=false;updateControls();draw(performance.now());}""",desert)
 for desert in [False,True]:
  fork(desert);pg.wait_for_timeout(120);assert pg.locator('.route-key23').count()==3;assert pg.locator('#o19-junction strong').count()==0;assert pg.locator('.route-key23').all_inner_texts()==['F','␣','J'];assert pg.evaluate("getComputedStyle(document.querySelector('.route-key23')).borderRadius==='50%'")
  node=pg.evaluate('G.pos.n');pg.evaluate("pending='f';processPending();");assert pg.evaluate('G.pos.e===null&&pending===null');pg.screenshot(path=str(OUT/('02-wueste-kreuzung.png' if desert else '01-wald-kreuzung.png')))
  direction=pg.evaluate('nodeMoves().f');pg.keyboard.press('f');pg.wait_for_function('trans===null');assert pg.evaluate('G.pos.e!=null&&G.pos.h=== '+str(direction));pg.wait_for_timeout(100);assert not pg.locator('#o19-junction').is_visible()
 # Place views must remain free, including the oasis with side exits and animals.
 pg.evaluate("const n=G.w.N.OASE;G.pos={n:'OASE',e:null,k:0,h:[0,1,2,3].find(d=>facePlace(n,d)),arrH:0};G.enc=null;S.world.time=1100;arrive();paused=false;draw(performance.now());");pg.wait_for_timeout(150);assert not pg.locator('#o19-junction').is_visible();pg.screenshot(path=str(OUT/'03-oase-ohne-fenster.png'))
 # Prepare the state of somebody who completed the mine but left its tool at ST.
 pg.evaluate("enterCave(true);S.inv.push('laterne');S.inv=S.inv.filter(k=>k!=='spitzhacke');G.pos={n:'AUS',e:null,k:0,h:0,arrH:0};G.w.N.AUS.seen=true;G.w.N.GR.chest=true;markCoinReward('mineSecret');G.w.N.TU.open=true;for(const e of G.w.edges){if(e.roots)e.cleared=true;if(e.door)e.open=true;}save();enterDesert();S.world.time=824;S.world.day=3;S.world.storms=[1070];S.world.animals={};S.world.items={};S.world.customKeep23='keep';G.w.N.GH.revealed=true;G.w.N.GH.roses=3;G.w.N.JC1.seen=true;S.coins=17;S.old=9;S.needs={w:DROP_MS*20,f:BERRY_MS*20};p18TutorialQueue=[];arrive();updateControls();save();")
 desert_seed=pg.evaluate('S.world.seed');mine_seed=pg.evaluate('S.hoehle.seed');assert pg.evaluate("expected().includes('l')&&!S.inv.includes('spitzhacke')");pg.keyboard.press('l');pg.wait_for_function("trans===null&&inCave()");assert pg.evaluate('G.pos.n==="AUS"&&S.world.seed=== '+str(mine_seed));assert pg.evaluate('G.w.N.GR.chest&&G.w.N.TU.open&&G.w.edges.find(e=>e.roots).cleared&&G.w.edges.find(e=>e.door).open');pg.screenshot(path=str(OUT/'04-zurueck-in-der-mine.png'))
 def route(goal):
  return pg.evaluate("goal=>{const queue=[[G.pos.n]],seen=new Set();while(queue.length){const path=queue.shift(),id=path.at(-1);if(seen.has(id))continue;seen.add(id);if(id===goal)return path.slice(1);for(const ei of Object.values(G.w.N[id].exits)){const e=G.w.edges[ei];if(!e.closed)queue.push([...path,e.a===id?e.b:e.a]);}}throw Error('No route');}",goal)
 def walk(goal):
  for target in route(goal):
   d=pg.evaluate("target=>{const n=curNode();return Number(Object.entries(n.exits).find(([d,ei])=>{const e=G.w.edges[ei];return(e.a===n.id?e.b:e.a)===target;})[0]);}",target)
   key=pg.evaluate("d=>{if(here().t==='sprung'&&G.pos.arrH===d)return 's';const m=nodeMoves();const k=Object.keys(m).find(k=>m[k]===d);return k==='walk'?G.foot:k;}",d)
   if key is None:
    pg.keyboard.press('Backspace');pg.wait_for_function('trans===null');key=pg.evaluate("d=>{const m=nodeMoves();const k=Object.keys(m).find(k=>m[k]===d);return k==='walk'?G.foot:k;}",d)
   assert key is not None,(target,pg.evaluate('({p:G.pos,here:here(),keys:expected()})'))
   print('Start edge',target,key,pg.evaluate('({pos:G.pos,paused,help:!!p18Help})'),flush=True);pg.keyboard.press('Space' if key==' ' else key);
   try:pg.wait_for_function('trans===null')
   except Exception:
    print('FAILED',errors,pg.evaluate('({pos:G.pos,trans,paused,help:!!p18Help,caption:G.caption})'),flush=True);raise
   steps=0
   while pg.evaluate('G.pos.e!=null'):
    steps+=1;assert steps<70,pg.evaluate('({p:G.pos,block:stepBlock(),caption:G.caption})');key=pg.evaluate("stepBlock()==='roots'?'ä':stepBlock()==='door'?'ö':stepBlock()==='duck'?'d':stepBlock()==='crawl'?'k':G.foot");pg.keyboard.press(key);pg.wait_for_function('trans===null')
   assert pg.evaluate('G.pos.n')==target
  print('Walked to',goal,flush=True)
 walk('ST')
 if not pg.evaluate('!!itemHere()'):pg.keyboard.press('Backspace');pg.wait_for_function('trans===null')
 assert pg.evaluate('itemHere()==="spitzhacke"');pg.keyboard.press('g');assert pg.evaluate('S.inv.includes("spitzhacke")');pg.keyboard.press('Space');pg.wait_for_timeout(120);pg.screenshot(path=str(OUT/'05-spitzhacke-geholt.png'))
 # Reload within the mine before walking back; both worlds must survive it.
 pg.evaluate('save()');pg.reload(wait_until='domcontentloaded');pg.locator('#btn-play').click();assert pg.evaluate('inCave()&&S.inv.includes("spitzhacke")');assert pg.evaluate('S.world.seed')==mine_seed;walk('AUS')
 if not pg.evaluate("expected().includes('l')"):pg.keyboard.press('Backspace');pg.wait_for_function('trans===null')
 pg.keyboard.press('l');pg.wait_for_function('trans===null&&inDesert()');assert pg.evaluate('S.world.seed')==desert_seed;assert pg.evaluate("G.pos.n==='AH'&&S.world.day===3&&S.world.time>=824&&S.world.time<830&&S.world.customKeep23==='keep'&&G.w.N.GH.revealed&&G.w.N.GH.roses===3&&G.w.N.JC1.seen&&S.coins===17&&S.old===9&&S.inv.includes('spitzhacke')"),pg.evaluate('({pos:G.pos,day:S.world.day,time:S.world.time,custom:S.world.customKeep23,gh:G.w.N.GH,seen:G.w.N.JC1.seen,coins:S.coins,old:S.old,inv:S.inv})');pg.screenshot(path=str(OUT/'06-wieder-in-der-wueste.png'))
 pg.evaluate('save()');pg.reload(wait_until='domcontentloaded');pg.locator('#btn-play').click();assert pg.evaluate("inDesert()&&G.pos.n==='AH'&&S.inv.includes('spitzhacke')&&G.w.N.GH.roses===3");# The recovered tool must also unlock the actual desert wall action.
 pg.evaluate("const n=Object.values(G.w.N).find(n=>n.place==='kfelsen');n.examined=true;G.pos={n:n.id,e:null,k:0,h:[0,1,2,3].find(d=>facePlace(n,d)),arrH:0};arrive();");assert pg.evaluate("expected().includes('g')");pg.keyboard.press('g');assert pg.evaluate('G.hack.n===1')
 # Legacy archives without edge flags still allow the ladder corridor back out.
 pg.evaluate("G.hack=null;G.pos={n:'AH',e:null,k:0,h:1,arrH:1};delete S.hoehle.mineEdges23;arrive();");pg.keyboard.press('l');pg.wait_for_function('trans===null&&inCave()');assert pg.evaluate('G.w.edges.find(e=>e.roots).cleared')
 # A save without any mine archive gets one mine, without awarding the missing tool.
 pg.evaluate("G.pos={n:'AUS',e:null,k:0,h:0,arrH:0};arrive();");pg.keyboard.press('l');pg.wait_for_function('trans===null&&inDesert()');pg.evaluate("S.hoehle=null;S.inv=S.inv.filter(k=>k!=='spitzhacke');arrive();");pg.keyboard.press('l');pg.wait_for_function('trans===null&&inCave()');assert pg.evaluate("!S.inv.includes('spitzhacke')&&S.world.items['d:'+G.w.N.ST.uid]==='spitzhacke'&&S.coins===17&&S.old===9")
 assert not errors,errors
 print('PASS black circle markers only at reached real junctions, no oasis popup, buffered turns, mine/pickaxe round trip using real keys, edge flags, world seeds/progress/inventory/money/day/time and reload; no JS errors.',flush=True);b.close()
