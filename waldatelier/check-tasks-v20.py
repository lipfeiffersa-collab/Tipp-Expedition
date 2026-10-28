"""Contextual task activation, most recent three, progress, reward caps and persistence."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
OUT=Path('/workspace/review-tasks20');OUT.mkdir(exist_ok=True)
URL=os.environ.get('TIPP_TEST_URL','http://127.0.0.1:8049/Tipp-Expedition-4.7-Waldatelier.html')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1000});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(URL,wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click();pg.keyboard.press('f');pg.keyboard.press('j');pg.keyboard.press('Enter');pg.evaluate("S.settings.goal=120;S.world.time=600;S.needs={w:DROP_MS*30,f:BERRY_MS*30};S.world.animals={};S.world.items={};G.enc=null;p18TutorialQueue=[];qEffect=null;trans=null;")
 assert not pg.locator('#p20-map-tasks').is_visible()
 def edge(item=None,animal=None):
  pg.evaluate("arg=>{qEffect=null;trans=null;p18TutorialQueue=[];G.phase='explore';const ei=G.w.edges.findIndex(e=>e.n>=5&&!e.hidden&&!e.closed),e=G.w.edges[ei];G.pos={n:null,e:ei,k:2,h:e.dir,arrH:e.dir};G.foot='f';S.world.items={};S.world.animals={};G.enc=null;if(arg[0])S.world.items[spotKey()]=arg[0];if(arg[1])S.world.animals[arg[1]]=spotKey();arrive();paused=false;updateControls();}",[item,animal])
 def ids():return pg.locator('#p20-map-tasks li').evaluate_all('(rows)=>rows.map(r=>r.dataset.task)')
 edge('rucksack');pg.keyboard.press('g');assert 'find-camera20' in ids();assert 'Kamera finden' in pg.locator('#p20-map-tasks').inner_text();pg.keyboard.press('Enter');pg.screenshot(path=str(OUT/'01-kamera-finden.png'));assert pg.evaluate('S.res.film===1')
 edge('kamera');pg.keyboard.press('g');assert 'find-camera20' not in ids();assert 'first-photo' in ids();pg.keyboard.press('Enter');assert pg.evaluate('S.coins===0&&p18State().claimed["find-camera20"]')
 pg.keyboard.press('F5');pg.keyboard.press('Space');assert pg.evaluate('p18State().metrics.photos===1');assert not pg.locator('#p20-map-tasks').is_visible()
 # Actual feeding updates the deer task and activates petting; the counter does
 # not change which previously accepted task is the newest.
 pg.evaluate("S.food=6;p18State().metrics.reh=2;");edge(None,'reh');assert '2/5 Rehe gefüttert' in pg.locator('#p20-map-tasks').inner_text();pg.keyboard.press('h');assert '3/5 Rehe gefüttert' in pg.locator('#p20-map-tasks').inner_text();pg.keyboard.press('Space');pg.evaluate("p18TutorialQueue=[];p18State().seen.trust=true;p18State().seen.friend=true;S.inv.push('karte');G.w.N.HUT.open=true;S.res.schnecke=1;G.w.N.RU.shells=2;G.w.N.RU.revealed=true;G.pos={n:'RU',e:null,k:0,h:3,arrH:3};arrive();updateControls();")
 assert ids()==['ruin-shells20','fire-ready','first-pet'],ids();assert pg.locator('#p20-map-tasks li').count()==3;assert '3/5 Schneckenhäuser gefunden' in pg.locator('#p20-map-tasks').inner_text()
 order=pg.evaluate('JSON.stringify(p20TaskState().started)');pg.evaluate('p18State().metrics.reh=4;p18CheckTasks()');assert pg.evaluate('JSON.stringify(p20TaskState().started)')==order;assert ids()==['ruin-shells20','fire-ready','first-pet']
 pg.screenshot(path=str(OUT/'02-drei-aktuelle-aufgaben.png'))
 for width,height,keyboard in [(1600,1000,True),(1280,900,False),(1920,1080,False),(900,800,True)]:
  pg.set_viewport_size({'width':width,'height':height});pg.evaluate('want=>{if(d17Expanded!==want)d17Keyboard();}',keyboard);assert pg.locator('#p20-map-tasks li').count()==3
  bounds=pg.evaluate('''()=>{const box=$('#mapbox').getBoundingClientRect(),tasks=$('#p20-map-tasks').getBoundingClientRect(),supply=$('#side-extra').getBoundingClientRect();return {box:box.toJSON(),tasks:tasks.toJSON(),supply:supply.toJSON()};}''');assert bounds['tasks']['bottom']<=bounds['supply']['top']+2 and bounds['supply']['bottom']<=bounds['box']['bottom']+2,(width,height,keyboard,bounds)
 pg.set_viewport_size({'width':1600,'height':1000});pg.evaluate('if(d17Expanded)d17Keyboard()')
 # A completed latest task disappears and reveals the older open deer task.
 pg.evaluate('for(const[k,n]of Object.entries(FIRE))S.res[k]=n;p18CheckTasks()');assert ids()==['ruin-shells20','first-pet','deer-five'];pg.evaluate('p18State().metrics.pets=1;p18CheckTasks()');assert ids()==['first-help','ruin-shells20','deer-five'];pg.screenshot(path=str(OUT/'03-fortschritt-an-der-ruine.png'))
 # Persist acceptance order and progress; continuing may not create fresh entries.
 order=pg.evaluate('JSON.stringify(p20TaskState().started)');pg.evaluate('save()');pg.reload(wait_until='domcontentloaded');pg.locator('#btn-play').click();pg.keyboard.press('f');pg.keyboard.press('j');assert pg.evaluate('JSON.stringify(p20TaskState().started)')==order;assert ids()==['first-help','ruin-shells20','deer-five'];assert '3/5 Schneckenhäuser gefunden' in pg.locator('#p20-map-tasks').inner_text()
 # New guide goals give no extra money/film, and inserted shells still count.
 coins=pg.evaluate('S.coins');film=pg.evaluate('S.res.film');pg.evaluate('S.res.schnecke=3;p18CheckTasks()');assert 'ruin-shells20' not in ids();assert pg.evaluate('S.coins')==coins and pg.evaluate('S.res.film')==film;pg.evaluate('S.res.schnecke=0;G.w.N.RU.shells=5;p18CheckTasks()');assert pg.evaluate('p18State().metrics.shells20')==5
 pg.evaluate('p18State().metrics.helps=1;p18CheckTasks();S.food=FOOD_CAP;p18State().metrics.reh=5;p18CheckTasks()');assert not pg.locator('#p20-map-tasks').is_visible();assert pg.evaluate('!p18State().claimed["deer-five"]');pg.evaluate('S.food=FOOD_CAP-5;p18CheckTasks();p18CheckTasks()');assert pg.evaluate('S.food===FOOD_CAP&&!!p18State().claimed["deer-five"]')
 pg.keyboard.press('F6');assert pg.evaluate('!!p18Journal&&journalPages()[JP].tab==="Entdecken"');assert pg.evaluate('journalPages().some(p=>p.tab==="Entdecken"&&p.html.includes("Die Kamera zum Film"))');assert pg.evaluate('journalPages().some(p=>p.tab==="Entdecken"&&p.html.includes("Die fünf Mulden"))');pg.keyboard.press('Escape')
 assert pg.evaluate('''()=>{const pages=journalPages();for(let i=1;i<pages.length;i++)if(pages[i].tab!==pages[i-1].tab&&i%2)return false;return true;}''')
 assert not errors,errors
 print('PASS backpack/camera/photo guidance, real deer feed counter, contextual shell goal, newest three, stable order, completing hides/reveals older tasks, saved progress, no extra guide rewards, full-inventory completion, F6 journal and page boundaries; no JS errors.',flush=True);b.close()
