from pathlib import Path
from playwright.sync_api import sync_playwright
import json,time
from tempfile import mkdtemp
out=Path(mkdtemp(prefix='wald-cave-'));url='http://127.0.0.1:8031/shared/downloads/Wald-Spiel-v12.html'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1500,'height':1000});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));external=[];pg.on('request',lambda r:external.append(r.url) if r.url.startswith('http') and not r.url.startswith('http://127.0.0.1:8031/') else None)
 pg.goto(url);pg.locator('#btn-play').click();pg.keyboard.press('f');pg.wait_for_timeout(250);pg.keyboard.press('j');pg.wait_for_timeout(350);pg.evaluate("enterCave(true);paused=true;S.settings.goal=60;S.known=[...new Set([...S.known,'f','j','g','h','k','s','d','l','ö','ä'])];")
 # Get the lantern at its actual placed spot with the G key.
 pg.evaluate("const entry=Object.entries(S.world.items).find(([k,v])=>v==='laterne'),u=entry[0].split(':'),ei=G.w.edges.findIndex(e=>e.uid===+u[1]),e=G.w.edges[ei];G.pos={n:null,e:ei,k:+u[2],h:e.dir,arrH:e.dir};arrive(false,'enter');paused=false;")
 pg.keyboard.press('g');pg.wait_for_timeout(80);assert pg.evaluate("S.inv.includes('laterne')&&!Object.values(S.world.items).includes('laterne')")
 print('PASS actual lantern G pickup',flush=True)
 # Every original node heading, plus standing/ducking/crawling in each low tunnel cell.
 sweep=pg.evaluate('''()=>{paused=true;trans=null;let n=0;const start=performance.now();for(const node of Object.values(G.w.N))for(let h=0;h<4;h++){G.pos={n:node.id,e:null,k:0,h,arrH:h};G.pose='stand';renderScene();n++;}for(let ei=0;ei<G.w.edges.length;ei++){const e=G.w.edges[ei];if(!e.prof)continue;for(let k=1;k<e.n;k++)for(const pose of ['stand','duck','crawl']){G.pos={n:null,e:ei,k,h:e.dir,arrH:e.dir};G.pose=pose;renderScene();n++;}}return {views:n,ms:performance.now()-start};}''');print('PASS cave views and poses',sweep,flush=True)
 def place(node):
  pg.evaluate('''id=>{const n=G.w.N[id];G.pos={n:id,e:null,k:0,h:n.rdir??0,arrH:n.rdir??0};G.pose='stand';G.phase='explore';G.hack=null;trans=null;paused=false;arrive(false,'enter');}''',node)
 place('ST');pg.keyboard.press('g');assert pg.evaluate("S.inv.includes('spitzhacke')")
 for node in ['V1','V2']:
  place(node)
  for i in range(8):pg.keyboard.press('g' if i%2==0 else 'h')
  assert pg.evaluate('id=>G.w.N[id].cleared',node)
 print('PASS actual pickaxe pickup and both rubble sequences',flush=True)
 place('NI');pg.keyboard.press('g');assert pg.evaluate('G.w.N.NI.got&&S.res.amethyst>0')
 place('SPR');pg.keyboard.press('g');assert pg.evaluate("G.w.N.SPR.chest&&S.inv.includes('schluessel')")
 place('TU');pg.keyboard.press('g');assert pg.evaluate("G.w.N.TU.open&&!S.inv.includes('schluessel')")
 place('GR');pg.keyboard.press('g');assert pg.evaluate('G.w.N.GR.chest&&S.res.diamant>0')
 print('PASS crystal sample, spider chest key, stone door and secret chest',flush=True)
 # Position immediately before the existing tunnel door, then operate both bolts.
 pg.evaluate("const ei=G.w.edges.findIndex(e=>e.door),e=G.w.edges[ei];G.pos={n:null,e:ei,k:e.n-1,h:e.dir,arrH:e.dir};G.pose='stand';G.bolts=0;arrive(false,'enter');")
 for i in range(2):pg.dispatch_event('body','keydown',{'key':'ö'})
 assert pg.evaluate('G.w.edges[G.pos.e].open')
 # Genuine changes of pose and original blocking heights.
 poses=pg.evaluate('''()=>{paused=true;const ei=G.w.edges.findIndex(e=>e.prof),e=G.w.edges[ei],out=[];for(const [pr,key,pose]of [['D','d','duck'],['C','k','crawl']]){const nk=e.prof.indexOf(pr)+1;G.pos={n:null,e:ei,k:nk-1,h:e.dir,arrH:e.dir};G.pose='stand';const block=stepBlock();caveHit(key);if(G.pose!==pose||stepBlock())throw Error('Pose '+pr);out.push([block,G.pose]);}return out;}''');print('PASS original tunnel door and poses',poses,flush=True)
 pg.evaluate("const ei=G.w.edges.findIndex(e=>e.roots),e=G.w.edges[ei];G.pos={n:null,e:ei,k:1,h:e.dir,arrH:e.dir};G.pose='stand';paused=false;arrive(false,'enter');")
 for i in range(3):pg.dispatch_event('body','keydown',{'key':'ä'})
 assert pg.evaluate('G.w.edges[G.pos.e].cleared')
 place('B4');pg.evaluate("S.inv=[...new Set([...S.inv,'wasserbeutel'])];S.water=0;updateControls();")
 # Correct approach direction must select an existing exit for the jump.
 pg.evaluate("G.pos.arrH=+Object.keys(G.w.N.B4.exits)[0];G.pos.h=G.pos.arrH;arrive(false,'enter');")
 pg.keyboard.press('g');assert pg.evaluate('S.water')>0
 pg.keyboard.press('s');pg.wait_for_function('G.pos.e!==null&&!trans',timeout=5000)
 # Oil bottles are original placements, not added scenery.
 pg.evaluate("const entry=Object.entries(S.world.items).find(([k,v])=>v==='oel'),u=entry[0].split(':'),ei=G.w.edges.findIndex(e=>e.uid===+u[1]),e=G.w.edges[ei];G.pos={n:null,e:ei,k:+u[2],h:e.dir,arrH:e.dir};S.oil=12;arrive(false,'enter');")
 pg.keyboard.press('g');assert pg.evaluate('S.oil===OIL_MAX')
 print('PASS roots, creek jump, water and oil refill',flush=True)
 # Photograph all cave species through K; shy species may legitimately require another attempt.
 for animal in ['spinne','maulwurf','mausohr']:
  for attempt in range(12):
   pg.evaluate('''a=>{paused=false;const spot=caveSpots(G.w,a)[0];S.world.animals={[a]:spot};const [kind,u,k]=spot.split(':');if(kind==='d'){const node=G.w.nodes[+u];G.pos={n:node.id,e:null,k:0,h:node.rdir,arrH:node.rdir};}else{const ei=G.w.edges.findIndex(e=>e.uid===+u),e=G.w.edges[ei];G.pos={n:null,e:ei,k:+k,h:e.dir,arrH:e.dir};}G.pose='stand';trans=null;arrive(false,'enter');}''',animal)
   pg.keyboard.press('k');pg.wait_for_timeout(180)
   if pg.evaluate('a=>!!S.photoImgs[DEAD[a].sp]',animal):break
  assert pg.evaluate('a=>S.photoImgs[DEAD[a].sp]?.startsWith("data:image/webp")',animal)
  pg.evaluate('paused=true;draw(performance.now())');pg.locator('.stage').screenshot(path=str(out/(animal+'.png')))
 print('PASS actual cave animal photographs',flush=True)
 photos=pg.evaluate('''()=>{const out=[];for(const key of ['foto_stollen','foto_fleder']){const before=JSON.stringify([S,G.pos]);const img=fotoScene(key);if(before!==JSON.stringify([S,G.pos]))throw Error('Remembered photo changes state');if(!img.startsWith('data:image/webp'))throw Error('Old pixel photo');out.push(key);}return out;}''');print('PASS illustrated album photos without changing save',photos,flush=True)
 pg.evaluate("S.inv=[...new Set([...S.inv,'feldtagebuch'])];show('journal');JP=journalPages().findIndex(p=>p.tab==='Höhle');renderJournal();save();");assert pg.locator('.jtab.on').inner_text()=='Höhle';pg.screenshot(path=str(out/'tagebuch.png'))
 before=pg.evaluate('JSON.stringify(S.photoImgs)');pg.reload();pg.locator('#btn-play').click();assert pg.evaluate('G.cave&&JSON.stringify(S.photoImgs)')==before
 place('AUS');pg.keyboard.press('l');assert pg.locator('#btn-cave-on').is_visible();pg.locator('#btn-cave-on').click();assert pg.evaluate('inDesert()&&!hActive()')
 print('PASS journal, saved photographs, actual ladder exit into desert',flush=True)
 assert not errors,errors;assert not external,external
 (out/'cave-results.json').write_text(json.dumps({'sweep':sweep,'poses':poses,'photos':photos,'errors':errors},ensure_ascii=False,indent=2));b.close()
