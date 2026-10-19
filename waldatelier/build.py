from pathlib import Path
import base64,json,re
root=Path(__file__).parent
s=(root/'Spiel-4.7-Ausgangsversion.html').read_text()
# Preserve the uploaded source; apply the user's explicit chest reward corrections at build time.
a=s.index('function caveChest(n)');b=s.index('function breakDruse()',a)
part=s[a:b]
part=part.replace('function caveChest(n){n.chest=true;', 'function caveChest(n){if(n.chest)return;n.chest=true;')
assert part.count('else{S.coins=(S.coins||0)+10;')==1
part=part.replace('else{S.coins=(S.coins||0)+10;', "else{S.coins=(S.coins||0)+5;S.old=(S.old||0)+5;markCoinReward('mineSecret');")
part=part.replace('In der Truhe: 10 Münzen, 10 Portionen Tierfutter, Beeren und Honig.', 'In der Truhe: 5 alte Münzen, 5 Goldmünzen, 10 Portionen Tierfutter, Beeren und Honig.')
s=s[:a]+part+s[b:]
# Revision 12 keeps every existing node/edge UID stable by appending the ruin trail.
s=s.replace("const passable=(n,d)=>n.exits[d]!=null&&", "const passable=(n,d)=>n.exits[d]!=null&&qRuinPassable(n,d)&&")
s=s.replace("const animalHere=()=>G&&G.phase==='explore'?animalAt(spotKey()):null;", "const animalHere=()=>G&&G.phase==='explore'?(qHerdHere()?'reh':animalAt(spotKey())):null;")
s=s.replace('ACTIVE_N=11,ROTATE_MOVES=18','ACTIVE_N=12,ROTATE_MOVES=12')
s=s.replace("const tameable=a=>DEAD[a].tame!==false;", "const tameable=a=>DEAD[a].tame!==false&&a!=='salamander';")
s=s.replace("GOAL:{x:3,y:10,t:'goal'}", "GOAL:{x:3,y:10,t:'goal'},\n  RU_WEG:{x:-1,y:3,t:'j',lm:'farn',c:0,hidden:true},\n  REHKRIPPE:{x:-1,y:4,t:'dead',block:'dickicht',hidden:true,say:'Eine stille Lichtung mit einer Futterkrippe.'}")
s=s.replace("['T3','GOAL']];", "['T3','GOAL'],['RU','RU_WEG'],['RU_WEG','REHKRIPPE']];")
s=s.replace("const allPathsSeen=()=>G&&G.w.edges.every(e=>e.hidden||e.closed||e.seen);", "const allPathsSeen=()=>G&&G.w.edges.every(e=>e.hidden||e.closed||e.seen);")
s=s.replace("tunnel:['Ein niedriger Gang unter den Büschen.'", "tunnel:['Ein niedriger Felsspalt.'")
a=s.index('function openChestD()');b=s.index('function placeOpts(',a)
part=s[a:b]
assert part.count('S.coins=(S.coins||0)+10;')==1
part=part.replace('const n=curNode();n.chest=true;', 'const n=curNode();if(n.chest)return;n.chest=true;')
part=part.replace('S.coins=(S.coins||0)+10;', "S.coins=(S.coins||0)+7;S.old=(S.old||0)+3;markCoinReward('cactusChest');")
part=part.replace('In der Truhe liegen 10 Goldmünzen!', 'In der Truhe liegen 3 alte Münzen und 7 Goldmünzen!')
s=s[:a]+part+s[b:]
# Rendering-source changes follow.
a=s.index('function draw(now){');b=s.index('\nfunction loop(now)',a)
segment=s[a:b].replace('vx.drawImage(bc,','forestBlit(')
# The warm light fades to zero on both sides of the horizon, over the whole image.
segment=segment.replace("const g=vx.createLinearGradient(0,0,0,HOR+10);g.addColorStop(0,'rgba(255,120,50,0)');g.addColorStop(1,'rgba(255,120,50,.22)');vx.fillStyle=g;vx.fillRect(0,0,W,HOR+10);", "const g=vx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(255,145,82,0)');g.addColorStop(.35,'rgba(255,145,82,.055)');g.addColorStop(.53,'rgba(255,145,82,.10)');g.addColorStop(.76,'rgba(255,145,82,.035)');g.addColorStop(1,'rgba(255,145,82,0)');vx.fillStyle=g;vx.fillRect(0,0,W,H);")
segment=re.sub(r"for\(let i=0;i<9;i\+\+\)\{const x=150.*?vx\.fillRect\(Math\.round\(x\),Math\.round\(124-hh\),2,Math\.round\(hh\)\);\}",'',segment,flags=re.S)
segment=segment.replace("if(G&&G.phase==='explore'&&!trans&&!G.cave){","if(G&&G.phase==='explore'&&!trans&&!G.cave&&!(fActive()&&(fLastItem||fLastFocus))){")
segment=segment.replace("  if(G&&G.enc&&G.enc.max","  if(fActive()){fDrawFire();fDrawPickupHint(now);}\n  if(G&&G.enc&&G.enc.max")
s=s[:a]+segment+s[b:]
assets={f.stem:'data:image/webp;base64,'+base64.b64encode(f.read_bytes()).decode() for f in sorted((root/'assets').glob('*.webp')) if f.stem in {'tierportraets','felspassagen','spechtflug','begegnungen','hoehlenobjekte','hoehlenbewohner','hoehlenmaterial','nachtmaterial','nachtwald','waldtiere','gegenstaende','wegmarker','requisiten','baeume','nachtpfad','waldflora','grundwald','orte5a','orte5b','wegmaterial','zustaende5'}}
code='\nconst F_IMAGE_DATA='+json.dumps(assets,separators=(',',':'))+';\n'+(root/'wald.js').read_text()+'\n'+(root/'nachtpfad.js').read_text()+'\n'+(root/'dezent.js').read_text()+'\n'+(root/'hoehle.js').read_text()+'\n'+(root/'belohnungen.js').read_text()+'\n'+(root/'erlebnisse.js').read_text()
init="buildIcons();\nsyncSound();\nshow('home');"
assert s.count(init)==1
s=s.replace(init,code+"\n$('#btn-play').disabled=true;$('#home-note').textContent='Waldzeichnungen werden geladen …';forestReady.then(()=>{buildIcons();syncSound();show('home');$('#btn-play').disabled=false;$('#home-note').textContent='';}).catch(error=>{console.error(error);$('#home-note').textContent='Die Waldzeichnungen konnten nicht geladen werden. Bitte die vollständige HTML-Datei erneut öffnen.';});")
s=s.replace('</style>',(root/'wald.css').read_text()+'\n</style>',1)
(root.parent/'Tipp-Expedition-4.7-Waldatelier.html').write_text(s)
print('Built',len(s.encode()),'bytes with',len(assets),'embedded sheets')
