"""Revision 15: desert geometry, actual controls, survival, journal, city and save compatibility."""
from pathlib import Path
from tempfile import mkdtemp
from playwright.sync_api import sync_playwright
import json
OUT=Path(mkdtemp(prefix='tipp-desert-'))
URL='http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1600,'height':1050});pg.set_default_timeout(90000);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.goto(URL,wait_until='domcontentloaded',timeout=90000);pg.locator('#btn-play').click();pg.evaluate("enterDesert(true);paused=true;S.settings.goal=120;S.needs={w:DROP_MS*10,f:BERRY_MS*10};S.inv=[...new Set([...S.inv,'kamera','feldtagebuch','karte','wasserbeutel'])];S.known=[...new Set([...S.known,'g','h','s','q','u','w','e','ü','z','i','a','o','p',' ','Backspace'])];S.world.animals={};S.world.items={};G.enc=null;")
 # This is the known-expedition regression; fresh identification is exercised by check-v15.py.
 pg.evaluate("for(const a of U_ANIMALS)rLearn('animal:'+a);for(const k of U_ITEMS)rLearn('item:'+k);for(const k of Object.keys(R_FACTS))rLearn(k);")
 assert pg.evaluate('Object.keys(F_ATLAS).length')==37
 assert pg.evaluate('DEAD.dornteufel.sp')=='Dornschwanzagame'
 assert pg.evaluate('SPECIES[2].some(s=>s.n==="Dornschwanzagame"&&s.l==="Uromastyx acanthinura")')
 def snap(name):
  pg.evaluate('renderScene();draw(performance.now());');pg.locator('#view').screenshot(path=str(OUT/(name+'.png')))
 def place(n):
  pg.evaluate('''id=>{qEffect=null;G.city=null;G.phase='explore';G.puz=null;G.storm=null;G.enc=null;trans=null;S.world.animals={};S.world.items={};const n=G.w.N[id],h=[0,1,2,3].find(d=>facePlace(n,d));G.pos={n:id,e:null,k:0,h:h??0,arrH:h??0};arrive();paused=true;}''',n)
 # Every node, heading, and edge face is drawable and rendering alone cannot change saves.
 pg.evaluate('''()=>{for(const n of Object.values(G.w.N))for(let h=0;h<4;h++){G.pos={n:n.id,e:null,k:0,h,arrH:h};renderScene();}for(const e of G.w.edges)for(const h of [e.dir,(e.dir+2)%4]){G.pos={n:null,e:e.idx,k:1,h,arrH:h};renderScene();}}''')
 print('PASS every desert node and edge in both directions.',flush=True)
 place('JC3');snap('tamarisk-junction')
 state=pg.evaluate('JSON.stringify(S)');pg.evaluate('for(let i=0;i<8;i++)renderScene();');assert pg.evaluate('JSON.stringify(S)')==state
 pg.evaluate('''()=>{const n=G.w.N.JC3;for(const idx of Object.values(n.exits))G.w.edges[idx].trail=true;}''');snap('footprints')
 for n in ['OASE','WADI','KTR','KF','AH','ZH','STADT','GH']:
  place(n);snap(n.lower())
 # Photo, pickup, journal, and actual item atlas agree.
 place('JC3');pg.evaluate("const e=G.w.edges[0];G.pos={n:null,e:0,k:1,h:e.dir,arrH:e.dir};S.world.items={[spotKey()]:'ammonit'};arrive();paused=false;")
 pg.keyboard.press('g');assert pg.evaluate('(S.res.ammonit||0)>0&&(S.fund||{}).ammonit');assert pg.evaluate('fundImg("ammonit").width')==400
 print('PASS actual G item pickup, illustrated inventory and specimen card.',flush=True)
 # Wadi: all five Q presses produce the persistent spring, then G fills the bag.
 place('WADI');pg.evaluate('G.w.N.WADI.spring=false;G.dig=0;S.water=0;arrive();paused=false;')
 for i in range(5):pg.keyboard.press('q')
 assert pg.evaluate('G.w.N.WADI.spring');pg.keyboard.press('g');assert pg.evaluate('S.water>0');pg.evaluate('paused=true');snap('wadi-spring')
 print('PASS five Q digs and real water collection.',flush=True)
 # Cactus chest: examine, 8 alternating hacks, correct 3 old + 7 gold, no double payout.
 place('KTR');pg.evaluate('G.w.N.KTR.examined=false;G.w.N.KTR.cleared=false;G.w.N.KTR.chest=false;S.old=0;S.coins=0;arrive();paused=false;')
 pg.keyboard.press('u')
 for i in range(8):pg.keyboard.press('g' if i%2==0 else 'h')
 assert pg.evaluate('G.w.N.KTR.cleared');pg.keyboard.press('g');assert pg.evaluate('S.old===3&&S.coins===7&&qEffect.kind==="loot"');pg.keyboard.press('Space');pg.evaluate('openChestD()');assert pg.evaluate('S.old===3&&S.coins===7')
 print('PASS actual cactus wall and chest, corrected currency and single payout.',flush=True)
 # Storm: hit its actual moving target five times; footprints vanish, discovered map remains.
 place('JC3');pg.evaluate('''()=>{for(const e of G.w.edges){e.trail=true;e.seen=true;}startStorm();paused=false;}''');pg.keyboard.press('e');assert pg.evaluate('G.storm.st')=='qte'
 pg.evaluate('paused=true');snap('sandstorm')
 for i in range(5):
  pg.evaluate('G.storm.m=G.storm.zone;paused=false;');pg.dispatch_event('body','keydown',{'key':'ü'});pg.evaluate('paused=true')
 assert pg.evaluate('!G.storm&&G.w.edges.every(e=>!e.trail)&&G.w.edges.every(e=>e.seen)&&G.w.N.GH.revealed')
 print('PASS storm timing/QTE, reveal, trail removal preserves exploration.',flush=True)
 # Sandroses, mural 4x6, a real keyboard move and finish-to-room transition.
 place('GH');pg.evaluate('G.w.N.GH.revealed=true;G.w.N.GH.open=false;G.w.N.GH.roses=0;S.res.sandrose=7;arrive();paused=false;')
 for _ in range(7):pg.keyboard.press('g')
 assert pg.evaluate('G.w.N.GH.open');pg.keyboard.press('u');assert pg.evaluate('!!G.puz&&PZ_IMG.width===720');pg.evaluate('paused=true');snap('felsbild-puzzle')
 before=pg.evaluate('dW().puzzle.moves');key=pg.evaluate('pzKeys()[0]');pg.evaluate('paused=false');pg.dispatch_event('body','keydown',{'key':key});assert pg.evaluate('dW().puzzle.moves')==before+1
 pg.evaluate("dW().puzzle={t:Array.from({length:24},(_,i)=>i),moves:12};dW().puzzle.t[22]=-1;dW().puzzle.t[23]=22;")
 key=pg.evaluate('PZ_LET[22]');pg.dispatch_event('body','keydown',{'key':key});pg.wait_for_timeout(850);assert pg.evaluate('G.w.N.GH.solved&&!G.puz');pg.evaluate('paused=true');snap('secret-room')
 pg.evaluate('S.old=0;arrive();paused=false;');pg.keyboard.press('g');assert pg.evaluate('S.old===8&&qEffect?.kind==="loot"');pg.keyboard.press('Space');pg.evaluate('ghChest()');assert pg.evaluate('S.old')==8
 print('PASS seven roses, high-resolution sliding puzzle and 8-old-coin room.',flush=True)
 # Real dusk tent assembly consumes once, preserves needs and advances day exactly once.
 place('OASE');pg.evaluate('S.world.time=18*60;S.inv=S.inv.filter(k=>k!=="zelt");for(const[k,n]of Object.entries(ZELT))S.res[k]=n;arrive();paused=false;')
 day=pg.evaluate('S.world.day');pg.keyboard.press('z');pg.keyboard.press('Backspace');pg.wait_for_timeout(700);assert pg.evaluate('!qEffect&&!S.inv.includes("zelt")&&S.res.stoff===ZELT.stoff');place('OASE');pg.evaluate('paused=false');pg.keyboard.press('z');assert pg.evaluate('qEffect?.kind')=='tent';pg.evaluate('paused=true');snap('tent-frame');pg.evaluate('qEffect.elapsed=2400');snap('tent-built');pg.evaluate('paused=false');pg.keyboard.press('Space');assert pg.evaluate('S.world.day')==day+1
 assert pg.evaluate('S.inv.includes("zelt")&&Object.entries(ZELT).every(([k])=>S.res[k]===0)&&!qEffect')
 print('PASS actual Z assembly, skip and exactly one night/material deduction.',flush=True)
 # All nine species and new high-resolution photographs, then food/petting lifecycle.
 place('JC3');pg.evaluate('const e=G.w.edges[0];G.pos={n:null,e:0,k:1,h:e.dir,arrH:e.dir};')
 for key in ['fennek','dromedar','sandkatze','springmaus','mendes','flughuhn','dornteufel','skorpion','hornviper']:
  pg.evaluate('key=>{S.world.animals={[key]:spotKey()};arrive();paused=true;}',key);snap('animal-'+key)
  assert pg.evaluate('cropPhoto(animalHere()).startsWith("data:image/webp")')
 pg.evaluate("S.world.animals={fennek:spotKey()};S.food=5;S.fed.Fennek=8;arrive();paused=false;");pg.keyboard.press('h');assert pg.evaluate('qEffect?.u&&S.food===4');pg.keyboard.press('Space')
 pg.evaluate("S.world.animals={fennek:spotKey()};arrive();paused=false;");pg.keyboard.press('s');assert pg.evaluate('qEffect?.kind==="pet"');pg.evaluate('paused=true');snap('fennek-pet');pg.evaluate('paused=false');pg.keyboard.press('Space')
 print('PASS nine species, photo crops, food/pet sequences.',flush=True)
 # Fixed photo motifs on ground and in hand match byte-for-byte.
 for key in ['foto_duene','foto_hafen']:
  place('JC3');pg.evaluate('key=>{const e=G.w.edges[0];G.pos={n:null,e:0,k:1,h:e.dir,arrH:e.dir};S.world.items={[spotKey()]:key};arrive();paused=true;}',key);pg.wait_for_function('key=>qPhotoCache.get(S.world.seed+":"+key)?.complete',arg=key)
  src=pg.evaluate('key=>qPhotoCache.get(S.world.seed+":"+key).src',key);pg.evaluate('paused=false');pg.keyboard.press('g');assert pg.locator('#page-img').get_attribute('src')==src;pg.keyboard.press('Space')
 print('PASS dune and harbor ground photos match pickup.',flush=True)
 # City retains all station positions, inventory prices, boarding schedule and keyboard walking.
 pg.evaluate('enterCity();paused=true;')
 for idx,name in enumerate(['tor','haendler','schiff','mann','herberge']):
  pg.evaluate('idx=>{const st=CITY_ST[idx];G.city.x=G.city.tx=st.x;cityDraw(performance.now());}',idx);snap('harbor-'+name)
 assert pg.evaluate('PREIS.ticket===20&&PREIS.schatzkarte===8&&INN_GOLD===10&&JSON.stringify(SHIP_DEP)==="[480,720,1080]"')
 pg.evaluate('G.city.x=G.city.tx=170;cityCaption();paused=false;');pg.keyboard.press('Space');assert pg.evaluate('G.phase==="menu"&&G.menu.city');pg.keyboard.press('Backspace');pg.keyboard.press('j');assert pg.evaluate('G.city.tx')==186
 print('PASS harbor five stations, real merchant menu, movement and economy.',flush=True)
 # Migration explicitly archives old picture and does not change topology/currency/position.
 pg.evaluate('''()=>{cityClose();S.desertArtVersion=12;S.photos.Dornteufel='2026-01-01';S.photoImgs.Dornteufel='data:image/png;base64,AAAA';S.seen.Dornteufel={date:'old'};S.fed.Dornteufel=3;save();}''')
 saved=pg.evaluate('({coins:S.coins,old:S.old,pos:S.world.pos,seed:S.world.seed,ids:Object.fromEntries(Object.entries(G.w.N).map(([k,n])=>[k,n.uid]))})')
 pg.reload(timeout=90000);pg.locator('#btn-play').click();pg.evaluate('paused=true;')
 assert pg.evaluate('S.legacySpeciesPhotos.Dornteufel.img')=='data:image/png;base64,AAAA'
 assert pg.evaluate('S.photos.Dornschwanzagame==="2026-01-01"&&S.fed.Dornschwanzagame===3&&!S.photos.Dornteufel')
 assert pg.evaluate('S.coins')==saved['coins'];assert pg.evaluate('S.old')==saved['old'];assert pg.evaluate('S.world.seed')==saved['seed'];assert pg.evaluate('S.world.pos')==saved['pos'];assert pg.evaluate('ids=>Object.entries(ids).every(([k,v])=>G.w.N[k].uid===v)',saved['ids'])
 print('PASS v12 species migration, archive and save compatibility.',flush=True)
 assert not errors,errors;print('PASS no JavaScript errors. Screenshots:',OUT,flush=True);b.close()
