from playwright.sync_api import sync_playwright
from tempfile import mkdtemp
OUT=mkdtemp(prefix='wald-mouse-')
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1500,'height':1000});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto('http://127.0.0.1:8031/shared/downloads/Wald-Spiel-v12.html');pg.locator('#btn-play').click();pg.keyboard.press('f');pg.wait_for_timeout(250);pg.keyboard.press('j');pg.wait_for_timeout(350)
 pg.evaluate("G.phase='explore';trans=null;G.enc=null;G.guide=null;G.pos={n:null,e:0,k:1,h:G.w.edges[0].dir,arrH:0};S.inv=[...new Set([...S.inv,'kamera','feldtagebuch'])];S.known=[...new Set([...S.known,'k'])];S.world.animals={maus:spotKey()};S.world.items={};arrive(false,'enter');paused=false;")
 for attempt in range(12):
  pg.evaluate("S.world.animals={maus:spotKey()};arrive(false,'enter');")
  pg.keyboard.press('k');pg.wait_for_timeout(200)
  if pg.evaluate("!!S.photoImgs[SPECIES[0].find(s=>SP2KEY[s.n]===F_ANIMALS[12]).n]"):break
 assert pg.evaluate("!!S.photoImgs[SPECIES[0].find(s=>SP2KEY[s.n]===F_ANIMALS[12]).n]")

 image=pg.evaluate('S.photoImgs[SPECIES[0].find(s=>SP2KEY[s.n]===F_ANIMALS[12]).n]');pg.evaluate("paused=true;show('journal');JP=journalPages().findIndex(p=>p.tab==='Wald'&&p.html.includes(SPECIES[0].find(s=>SP2KEY[s.n]===F_ANIMALS[12]).n));renderJournal();save()");pg.screenshot(path=OUT+'/journal-mouse.png');assert pg.locator('.jtab.on').inner_text()=='Wald'
 pg.reload();pg.wait_for_function('fReady');assert pg.evaluate('S.photoImgs[SPECIES[0].find(s=>SP2KEY[s.n]===F_ANIMALS[12]).n]')==image
 pg.locator('#btn-play').click();pg.evaluate('startNight();paused=true;save()');pg.reload();pg.locator('#btn-play').click();assert pg.evaluate("G.phase==='lantern'&&S.world.jrActive");assert pg.evaluate('S.photoImgs[SPECIES[0].find(s=>SP2KEY[s.n]===F_ANIMALS[12]).n]')==image
 assert not errors,errors;print('PASS actual K mouse photo stays in Wald, image persists through reload, night resumes without losing photo');b.close()
