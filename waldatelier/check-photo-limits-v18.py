"""Photo limits, deferred rewards, city viewfinder and keyboard-only deletion."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
OUT=Path('/workspace/review-expedition18');OUT.mkdir(exist_ok=True)
URL=os.environ.get('TIPP_TEST_URL','http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1000});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL,wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click();pg.evaluate("enterDesert(true);S.settings.goal=120;S.world.time=600;S.world.storms=[];S.world.animals={};S.world.items={};G.enc=null;S.needs={w:DROP_MS*20,f:BERRY_MS*20};enterCity();G.city.x=G.city.tx=390;cityCaption();paused=false;")
 assert pg.evaluate('p18State().loaded===8&&S.res.film===0');pg.keyboard.press('F5');assert pg.evaluate('!!p18Camera&&paused');pg.keyboard.press('j');pg.keyboard.press('Space');assert pg.evaluate('p18State().gallery.at(-1).title==="Am Hafen"&&p18State().loaded===7');pg.screenshot(path=str(OUT/'09-hafenfoto.png'))
 # A full personal album prevents a shutter charge. Removing a print never refunds film.
 pg.evaluate("const src=p18State().gallery[0].src;p18State().gallery=Array.from({length:P18_ALBUM_LIMIT},(_,i)=>({id:'test-'+i,src,title:'Aufnahme '+i,kind:'scene',day:1,world:'wueste'}));");pg.keyboard.press('F5');pg.keyboard.press('Space');assert pg.evaluate('!!p18Camera&&p18State().loaded===7&&p18State().gallery.length===P18_ALBUM_LIMIT');pg.keyboard.press('Escape');pg.keyboard.press('F4');pg.evaluate("jGo(journalPages().findIndex(p=>p.tab==='Sofortbilder'))");pg.wait_for_timeout(600);pg.locator('.p18-remove').first.focus();pg.keyboard.press('Enter');assert pg.evaluate('p18State().gallery.length===P18_ALBUM_LIMIT');pg.keyboard.press('Enter');assert pg.evaluate('p18State().gallery.length===P18_ALBUM_LIMIT-1&&p18State().loaded===7');pg.keyboard.press('F6');assert pg.evaluate('journalPages()[JP].tab==="Entdecken"');pg.keyboard.press('Escape')
 # Closing the journal must preserve an already active pause, including inside the city.
 pg.keyboard.press('Escape');assert pg.evaluate('paused');pg.keyboard.press('F4');assert pg.evaluate('!!p18Journal');pg.keyboard.press('Escape');assert pg.evaluate('paused&&!p18Journal');pg.keyboard.press('Enter');assert pg.evaluate('!paused')
 # Rewards wait rather than exceed inventory limits, then are delivered exactly once.
 pg.evaluate("const s=p18State();s.metrics.fire=1;delete s.claimed['fire-ready'];S.res.film=CAP;p18CheckTasks();");assert pg.evaluate('!p18State().claimed["fire-ready"]&&S.res.film===CAP');pg.evaluate('p18State().loaded=0');pg.keyboard.press('F5');pg.keyboard.press('r');assert pg.evaluate('p18State().loaded===8&&S.res.film===CAP&&!!p18State().claimed["fire-ready"]');pg.keyboard.press('Escape');pg.evaluate('p18CheckTasks();p18CheckTasks()');assert pg.evaluate('S.res.film===CAP')
 pg.evaluate("p18State().metrics.reh=5;delete p18State().claimed['deer-five'];S.food=FOOD_CAP;p18CheckTasks()");assert pg.evaluate('!p18State().claimed["deer-five"]');pg.evaluate('S.food=FOOD_CAP-5;p18CheckTasks()');assert pg.evaluate('S.food===FOOD_CAP&&!!p18State().claimed["deer-five"]')
 # Existing film on a path is not duplicated by revisiting the same world.
 pg.evaluate('leaveCity();S.world.photoFilmDay18=0;S.world.items={};p18SeedFilm(G.w,null)');assert pg.evaluate('Object.values(S.world.items).filter(k=>k==="film").length')==1;pg.evaluate('p18SeedFilm(G.w,null)');assert pg.evaluate('Object.values(S.world.items).filter(k=>k==="film").length')==1
 assert not errors,errors
 print('PASS city photos, full-album protection, keyboard delete confirmation, no film refund, F6 jump, paused journal return, deferred once-only rewards and nonduplicating film discovery; no JS errors.',flush=True);b.close()
