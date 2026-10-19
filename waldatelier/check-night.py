from pathlib import Path
from playwright.sync_api import sync_playwright
import json
from tempfile import mkdtemp
out=Path(mkdtemp(prefix='wald-night-'));url='http://127.0.0.1:8031/shared/downloads/Wald-Spiel-v12.html'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1500,'height':1000});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto(url);pg.locator('#btn-play').click();pg.keyboard.press('f');pg.wait_for_timeout(250);pg.keyboard.press('j');pg.wait_for_timeout(350)
 # Each discovery pattern must keep both halves of every spread in the same section.
 journal=pg.evaluate('''()=>{paused=true;S.inv=[...new Set([...S.inv,'feldtagebuch'])];const results=[];for(const mode of ['unknown','mouse','all']){S.seen={};S.photos={};if(mode==='mouse'){const s=SPECIES[0].find(s=>SP2KEY[s.n]==='maus');S.seen[s.n]={};S.photos[s.n]=true;}if(mode==='all')for(const s of SPECIES[0]){S.seen[s.n]={};S.photos[s.n]=true;}const P=journalPages();for(let i=0;i<P.length;i+=2)if(P[i].tab!==P[i+1].tab)throw Error('Mixed spread '+i);const forest=P.filter(p=>p.tab==='Wald').map(p=>p.html).join('');const desert=P.filter(p=>p.tab==='Wüste').map(p=>p.html).join('');for(const s of SPECIES[0])if(S.photos[s.n]&&!forest.includes(s.n))throw Error('Missing forest animal '+s.n);if(desert.includes('Waldmaus'))throw Error('Mouse in desert');results.push([mode,P.filter(p=>p.tab==='Wald').length]);}JP=journalPages().findIndex(p=>p.tab==='Wald');show('journal');renderJournal();save();return results;}''');print('journal',journal,flush=True);pg.screenshot(path=str(out/'journal.png'))
 pg.evaluate("show('game');paused=true;trans=null;G.phase='explore';G.enc=null;G.guide=null;S.world.lanternDone=false;S.world.fires=0;")
 triggers=pg.evaluate('''()=>{const a=[];for(const [fires,seen,expected]of [[0,true,false],[1,false,false],[1,true,true],[2,false,true]]){S.world.fires=fires;G.w.edges.forEach(e=>e.seen=seen);if(lanternDue()!==expected)throw Error('Trigger '+fires+seen);a.push([fires,seen,expected]);}S.world.fires=2;newDay();if(G.phase!=='lantern')throw Error('No night');return a;}''');print('triggers',triggers,flush=True)
 pg.evaluate('draw(performance.now())');pg.wait_for_timeout(60);pg.locator('.stage').screenshot(path=str(out/'lantern-clearing.png'))
 # Actual alternating keys and normal transitions, no direct startJR.
 pg.evaluate('paused=false');
 for ch in ['f','j','f','j','f']:
  pg.keyboard.press(ch);pg.wait_for_timeout(480)
 assert pg.evaluate("G.phase==='jr'"),pg.evaluate('[G.phase,G.lan]')
 pg.evaluate('paused=true;G.jr.camY=90;jrRender(performance.now());draw(performance.now())');pg.wait_for_timeout(60);pg.locator('.stage').screenshot(path=str(out/'jr-start.png'))
 coin=pg.evaluate('''()=>{const J=G.jr,it=J.lv.items.find(i=>i.kind==='muenze');const before=S.coins||0;J.p.x=it.x;J.p.y=it.y+10;jrCollect();if(!it.got||S.coins!==before+1)throw Error('Coin pickup');jrCollect();if(S.coins!==before+1)throw Error('Double collection');startJR();return true;}''');print('single coin collection',coin,flush=True)
 results=pg.evaluate('''()=>{const results=[];const settle=()=>{for(let i=0;i<240&&(G.jr.p.air||G.jr.p.move);i++)jrTick(1/120);if(G.jr.flash)throw Error('Unexpected injury');};
 const set=(x,y)=>{const p=G.jr.p;Object.assign(p,{x,y,face:1,air:false,move:null,climb:null,mode:null,pose:'stand',vx:0,vy:0,fromY:y,hop:0});G.jr.q=null;G.jr.flash=0;G.jr.hold=null;};
 const L=G.jr.lv;
 for(const kind of ['log','crate','igel','dornen']){const s=L.solids.find(s=>s.kind===kind),gy=groundAt(s.x0-1);set(s.x0-16,gy);jrKey('s');settle();if(kind==='crate'?!s.broken:G.jr.p.x<=s.x1)throw Error('Jump failed '+kind);results.push(kind);}
 const gate=L.solids.find(s=>s.kind==='tor');set(gate.x0-15,groundAt(gate.x0-1));jrKey('ö');if(gate.open||gate.bolts!==1)throw Error('First bolt');jrKey('ö');if(!gate.open)throw Error('Gate');results.push('two bolts');
 const fund=L.solids.find(s=>s.kind==='fund');set(fund.x0-10,groundAt(fund.x0-1));const n=S.res[fund.item]||0;jrKey('g');if(!fund.got||(S.res[fund.item]||0)!==n+1)throw Error('Pickup');results.push('pickup');
 for(const [kind,key]of [['ast','d'],['tunnel','k']]){const z=L.zones.find(z=>z.kind===kind);set(z.x0-10,z.gy);if(jrBlocked(z.x0+5,z.gy,20)!==kind)throw Error('Missing ceiling');jrKey(key);for(let i=0;i<16&&G.jr.p.x<=z.x1+5;i++){jrKey('j');settle();}if(G.jr.p.x<=z.x1)throw Error('Cannot traverse '+kind);jrKey(key);if(G.jr.p.mode)throw Error('Cannot stand');results.push(kind);}
 for(const [kind,key]of [['bienen','a'],['zapfen','a'],['aeste','ä'],['schlucht','h']]){const z=L.zones.find(z=>z.kind===kind);set(z.x0-10,z.gy);for(let i=0;i<z.n+1&&!z.done;i++){jrKey(key);settle();}if(!z.done||G.jr.p.x<=z.x1)throw Error('Cannot traverse '+kind);results.push(kind);}
 const ld=L.ladders[0];set(ld.x,ld.yBot);for(let i=0;i<12&&G.jr.p.y>ld.yTop;i++){jrKey('l');settle();}if(G.jr.p.y!==ld.yTop)throw Error('Ladder');results.push('ladder');
 const water=L.water[0];set(water[0]-15,water[2]);jrKey('s');settle();if(G.jr.p.x<water[1])throw Error('Waterjump');results.push('water');return results;}''');print('mechanics',results,flush=True)
 # Render every actual obstacle at its own height and check render purity.
 sweep=pg.evaluate('''()=>{const J=G.jr,L=J.lv;let count=0;for(const o of [...L.solids,...L.zones,...L.ladders]){const x=o.x0??o.x,y=o.gy??o.yBot??groundAt(x+1);J.cam=Math.max(0,x-50);J.camY=Math.max(0,Math.min(90,y-60));const before=JSON.stringify([S,J]);jrRender(1000);if(before!==JSON.stringify([S,J]))throw Error('Rendering changed state');count++;}return count;}''');print('rendered obstacles',sweep,flush=True)
 for name,kind in [('jr-tunnel','tunnel'),('jr-ravine','schlucht'),('jr-pine','zapfen')]:
  pg.evaluate('''kind=>{const J=G.jr,z=J.lv.zones.find(z=>z.kind===kind);J.lamp=z.x0+60;J.cam=z.x0-40;J.camY=Math.max(0,Math.min(90,z.gy-60));Object.assign(J.p,{x:z.x0-15,y:z.gy,pose:'stand',mode:null,air:false,climb:null});jrRender(1000);draw(1000);}''',kind);pg.wait_for_timeout(60);pg.locator('.stage').screenshot(path=str(out/(name+'.png')))
 pg.evaluate("const J=G.jr,t=J.lv.tower;J.lamp=t.x0+110;J.cam=t.x0;J.camY=0;Object.assign(J.p,{x:t.x0+30,y:t.t3,pose:'stand'});jrRender(1000);draw(1000)");pg.wait_for_timeout(60);pg.locator('.stage').screenshot(path=str(out/'jr-tower.png'))
 pg.evaluate('''const J=G.jr,a=J.lv.shaft[0];Object.assign(J.p,{x:a-8,y:groundAt(a-1),pose:'stand',air:false,move:null,climb:null,mode:null,face:1});J.cam=a-55;J.camY=68;J.lamp=a+12;J.shaftT=J.t;jrRender(1000);draw(1000)''');pg.wait_for_timeout(60);pg.locator('.stage').screenshot(path=str(out/'jr-shaft.png'))
 pg.evaluate("jrKey('j');for(let i=0;i<500&&!G.jr.done;i++)jrTick(1/120)");assert pg.evaluate("G.jr.done&&S.world.lanternDone&&!S.world.jrActive")
 pg.wait_for_timeout(1900);pg.locator('#btn-jr-camp').click();assert pg.evaluate('!!G.cave');print('shaft fall and actual cave button PASS',flush=True)
 assert not errors,errors
 # Narrow journal uses one page, forest/desert tab clicks remain correct.
 pg.set_viewport_size({'width':390,'height':844});pg.evaluate("show('journal');JP=journalPages().findIndex(p=>p.tab==='Wald');renderJournal()");pg.locator('.jtab',has_text='Wüste').click();assert pg.evaluate("journalPages()[JP].tab==='Wüste'");pg.locator('.jtab',has_text='Wald').click();assert pg.evaluate("journalPages()[JP].tab==='Wald'");print('mobile chapter tabs PASS',flush=True)
 (out/'results.json').write_text(json.dumps({'journal':journal,'triggers':triggers,'mechanics':results,'obstacles':sweep,'errors':errors},ensure_ascii=False,indent=2));b.close()
