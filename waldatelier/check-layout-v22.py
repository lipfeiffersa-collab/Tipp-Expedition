from pathlib import Path
import json
from playwright.sync_api import sync_playwright
OUT=Path('/workspace/review-layout22');OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1000});pg.set_default_timeout(90000);pg.goto('http://127.0.0.1:8049/Tipp-Expedition-4.7-Waldatelier.html');pg.locator('#btn-play').click();pg.evaluate("enterDesert(true);testKit();S.settings.goal=120;S.world.time=824;S.world.storms=[];S.res.palmwedel=2;S.res.akazienzweig=1;S.res.stoff=4;G.w.N.GH.revealed=true;S.old=3;p18TutorialQueue=[];paused=true;G.enc=null;G.storm=null;renderInv();p20TaskState().started={'first-feed':1,'deer-five':2,'fire-ready':3};p20Render();updateControls();")
 for w,h in [(1600,1000),(1280,900),(1920,1080)]:
  pg.set_viewport_size(dict(width=w,height=h))
  for puz in [False,True]:
   pg.evaluate("want=>{G.puz=null;if(want){ensureFrieze();dW().puzzle=pzNew();G.puz={anim:null};}updateControls();}",puz)
   for kb in [False,True]:
    if pg.evaluate('d17Expanded')!=kb:pg.keyboard.press('F3')
    pg.wait_for_timeout(250);info=pg.evaluate("()=>{let r={};for(const id of ['stage','map','mapbox','side-extra','kb','actions'])r[id]=$( '#'+id).getBoundingClientRect().toJSON();r.bottom=$('#screen-game').getBoundingClientRect().bottom;r.css=getComputedStyle(document.body).getPropertyValue('--stage22');return r;}")
    assert info['stage']['width']>=700,(w,h,puz,kb,info)
    assert info['bottom']<=h+2,(w,h,puz,kb,info)
    if not puz:
     boxes=pg.evaluate("[...document.querySelectorAll('#map,#p20-map-tasks,#side-extra,#side-extra>div')].filter(e=>!e.hidden).map(e=>e.getBoundingClientRect().toJSON())");assert info['map']['width']>=180;assert all(r['bottom']<=info['mapbox']['bottom']+2 for r in boxes),boxes
    print(w,h,'puzzle',puz,'kb',kb,'stage',round(info['stage']['width']),round(info['stage']['height']),'bottom',round(info['bottom']),'css',info['css'],flush=True);pg.screenshot(path=str(OUT/f'{w}-{h}-puzzle{puz}-kb{kb}.png'))
 # All approaches show the mirage through the final step, only in its time window.
 pg.set_viewport_size(dict(width=1600,height=1000));pg.evaluate("G.puz=null;S.world.time=824;S.world.animals={};S.world.items={};G.storm=null;G.enc=null;S.needs={w:DROP_MS*20,f:BERRY_MS*20};const original=uMirage;window.mirageCalls=0;uMirage=function(){window.mirageCalls++;return original();};")
 for minutes in [599,600,824,1019,1020]:
  for distance in [3,2,1]:
   result=pg.evaluate("a=>{S.world.time=a[0];const e=G.w.edges.find(e=>e.a==='FM'||e.b==='FM'),fw=e.b==='FM';G.pos={n:null,e:e.idx,k:fw?e.n-a[1]:a[1],h:fw?e.dir:(e.dir+2)%4,arrH:0};G.phase='explore';window.mirageCalls=0;renderScene();draw(performance.now());updateClock();drawMap();updateControls();return {calls:window.mirageCalls,time:fmShows()};}",[minutes,distance]);assert bool(result['calls'])==(600<=minutes<1020),(minutes,distance,result)
   if minutes==824 and distance==1:pg.screenshot(path=str(OUT/'mirage-final-approach.png'))
 pg.evaluate("G.pos={n:'FM',e:null,k:0,h:0,arrH:0};S.world.time=824;window.mirageCalls=0;arrive();renderScene();draw(performance.now());");assert pg.evaluate('G.w.N.FM.fmKnown&&window.mirageCalls===0')
 print('PASS desktop map/status/tasks, keyboard and puzzle sizing, mirage time window and final approach/arrival',flush=True)
 b.close()
