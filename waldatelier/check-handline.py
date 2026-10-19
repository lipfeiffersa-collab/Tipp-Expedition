from pathlib import Path
from playwright.sync_api import sync_playwright
from tempfile import mkdtemp
OUT=Path(mkdtemp(prefix='wald-handline-'))
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':1500,'height':1000});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.goto('http://127.0.0.1:8031/shared/downloads/Wald-Spiel-v12.html');pg.locator('#btn-play').click();pg.keyboard.press('f');pg.wait_for_timeout(250);pg.keyboard.press('j');pg.wait_for_timeout(350);pg.evaluate('paused=true;startNight();startJR();trans=null')
 for index in [0,1]:
  result=pg.evaluate('''i=>{const J=G.jr,z=J.lv.zones.filter(z=>z.kind==='schlucht')[i],br=J.lv.branches[i];J.cam=z.x0-40;J.camY=Math.max(0,Math.min(90,z.gy-60));J.lamp=z.x1+16;Object.assign(J.p,{x:z.x0-10,y:z.gy,fromY:z.gy,pose:'stand',face:1,air:false,mode:null,move:null,climb:null});J.q=null;for(let k=0;k<3;k++){jrKey('h');for(let t=0;t<35;t++)jrTick(1/120);}J.cam=z.x0-40;J.camY=Math.max(0,Math.min(90,z.gy-60));jrRender(1000);draw(1000);if(J.p.pose!=='hang')throw Error('Not hanging');const gy=groundAt(br.x0+2),right=groundAt(br.x1-2);if(gy!==z.gy||right!==z.gy)throw Error('Floating anchor');return {x:J.p.x,pose:J.p.pose,anchorFloor:[gy,right]};}''',index)
  print('Hanging at real level location',index,result,flush=True);pg.wait_for_timeout(60);pg.locator('.stage').screenshot(path=str(OUT/f'jr-hang-{index}.png'))
 assert not errors,errors;b.close()
