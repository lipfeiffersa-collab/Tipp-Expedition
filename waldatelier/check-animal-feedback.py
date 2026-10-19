"""Render feeding, portraits, hand strokes and departures for every safe forest species."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page();errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.goto('http://127.0.0.1:8000/Tipp-Expedition-4.7-Waldatelier.html');pg.locator('#btn-play').click();pg.keyboard.press('f');pg.wait_for_timeout(250);pg.keyboard.press('j');pg.wait_for_timeout(350)
 count=pg.evaluate('''()=>{paused=true;G.phase='explore';trans=null;S.world.time=600;S.world.items={};G.pos={n:null,e:0,k:1,h:0,arrH:0};let n=0;for(const a of F_ANIMALS.filter(a=>a!=='salamander')){S.world.animals={[a]:spotKey()};S.food=10;S.fed[DEAD[a].sp]=feedGoal(a);arrive();feedAnimal();if(qEffect?.a!==a)throw Error('Feed '+a);qEffect.elapsed=700;draw(performance.now());qEffect.elapsed=2000;draw(performance.now());qFinish();S.world.animals={[a]:spotKey()};arrive();petAnimal();if(qEffect?.a!==a)throw Error('Pet '+a);qEffect.elapsed=700;draw(performance.now());qEffect.elapsed=2200;draw(performance.now());qFinish();n++;}return n;}''')
 assert count==12
 pg.evaluate("G.pos={n:'REHKRIPPE',e:null,k:0,h:0,arrH:0};S.world.roeClearing={helped:0};S.inv=[...new Set([...S.inv,'kamera'])];arrive();const before=qHerdLeft();takePhoto();if(qHerdLeft()!==before)throw Error('Photo consumed deer');")
 pg.evaluate("enterCave(true);paused=true;G.phase='explore';const n=G.w.N.SPR;G.pos={n:'SPR',e:null,k:0,h:n.rdir,arrH:n.rdir};S.inv=[...new Set([...S.inv,'laterne'])];S.oil=OIL_MAX;S.world.animals={spinne:caveSpots(G.w,'spinne')[0]};arrive();const before=JSON.stringify(S);renderScene();renderScene();if(before!==JSON.stringify(S))throw Error('Spider render mutated save');")
 assert not errors,errors
 print('PASS 12 forest species: feeding, departure, portrait, hand; clearing photo preserves deer; cave spider drawing is read-only; no JS errors.')
 b.close()
