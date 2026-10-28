from pathlib import Path
import base64,json,re,hashlib
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
# Revision 13: retain the stable internal key, replace the Australian species in all user-facing text.
s=s.replace("{n:'Dornteufel',l:'Moloch horridus',f:'Feine Rillen in seiner Haut leiten Wasser von Tau und feuchtem Sand bis zu seinem Maul.'}","{n:'Dornschwanzagame',l:'Uromastyx acanthinura',f:'Die nordafrikanische Dornschwanzagame frisst überwiegend Pflanzen. In der Mittagshitze zieht sie sich in ihren Bau zurück. Der kräftige, stachelige Schwanz schützt sie vor Feinden.'}")
s=s.replace('Dornteufel','Dornschwanzagame').replace('Der Dornschwanzagame','Die Dornschwanzagame').replace('Das ist ein Dornschwanzagame. Er sieht gefährlich aus, ist aber harmlos.','Das ist eine Dornschwanzagame. Ihr stacheliger Schwanz dient der Verteidigung; halte Abstand.').replace('Er ist harmlos. Geh einfach weiter.','Sie ist harmlos. Geh einfach weiter.').replace('Du kannst ihn in Ruhe lassen und einfach weitergehen.','Du kannst sie in Ruhe lassen und einfach weitergehen.').replace('etwas Kleines, Stacheliges.','eine gedrungene Echse mit kräftigem, stacheligem Schwanz.')
s=s.replace('Man lässt ihn in Ruhe.','Man lässt sie in Ruhe.')
s=s.replace('Ein Händler unter einem rot-weißen Tuch. In seiner Auslage liegen Fossilien, Krüge und Fläschchen mit bunten Tränken.','Ein Händler unter einem cremefarbenen Tuch. In seiner Auslage liegen Datteln, Stoffe, Wasserkrüge und Karten.')
# Revision 14: the storm exposes the foot of the dune, not an entire vanished mountain of sand.
s=s.replace('Der Sandsturm hat die hohe Düne weggeweht! Zwischen den Felsen ist ein Eingang, mit einer Steinplatte verschlossen.','Der Sandsturm hat Sand am Fuß der hohen Düne abgetragen! Darunter ist ein Eingang frei geworden, mit einer Steinplatte verschlossen.')
# Revision 15 records only steps that have actually completed, never an entire entered edge.
a=s.index('function caveHit(ch)');b=s.index('function jumpCreek()',a)
part=s[a:b].replace('()=>{P.k=nk;arrive();}', '()=>{rTrailStep(e,P.k,nk);P.k=nk;arrive();}')
part=part.replace('()=>{P.n=nk<=0?e.a:e.b;', '()=>{rTrailStep(e,P.k,nk);P.n=nk<=0?e.a:e.b;')
part=part.replace('()=>{P.e=ei;P.h=d;', '()=>{rTrailStep(e,e.a===n.id?0:e.n,e.a===n.id?1:e.n-1);P.e=ei;P.h=d;')
s=s[:a]+part+s[b:]
s=s.replace('else if((S.res.datteln||0)>0)', "else if(rCanEat('datteln')&&(S.res.datteln||0)>0)")
s=s.replace('else if((S.res.kaktusfeigen||0)>0)', "else if(rCanEat('kaktusfeigen')&&(S.res.kaktusfeigen||0)>0)")
a=s.index('const needMin=');b=s.index('function updateNeeds()',a)
part=s[a:b].replace('(S.res.datteln||0)', "(rCanEat('datteln')?(S.res.datteln||0):0)").replace('(S.res.kaktusfeigen||0)', "(rCanEat('kaktusfeigen')?(S.res.kaktusfeigen||0):0)")
s=s[:a]+part+s[b:]
# Version 19: use familiar keys independently in each puzzle; original source stays immutable.
s=s.replace("letters:[['y','x','c','v','b'],['n','m',',','.','-']]", "letters:[['a','s','d','f','g'],['h','j','k','l','ö']]")
s=s.replace("!S.known.includes('y')?'Die drei Stücke zerfallen in kleine Schnipsel. Neu: die untere Reihe!'", "!S.known.includes('a')?'Die drei Stücke zerfallen in kleine Schnipsel. Nutze die Grundreihe.'")
s=s.replace('Kapitel 2 ist noch in Arbeit. Bis dahin kannst du den Wald weiter erkunden. Jeden Abend machst du am Lagerfeuer Rast.', 'Ruh dich am Feuer aus. Am nächsten Morgen setzt du deine Suche fort. Dein Feldtagebuch bewahrt die bisherigen Entdeckungen.')
s=s.replace('Kapitel 1 geschafft! Kapitel 2 ist noch in Arbeit. Du kannst den Wald weiter erkunden.', 'Ein neuer Tag wartet auf dich. Erkunde den Wald weiter und folge den Hinweisen in deinem Feldtagebuch.')
# The ruin trail is unlocked by its puzzle, not by befriending a riding animal.
s=s.replace('(hid&&!RIDE.some(isFriend))', '(hid&&!o19RuinPosition(w,P)&&!RIDE.some(isFriend))')
s=s.replace("'menu','lantern','jr','city'].includes(G.phase)","'menu','lantern','jr','city','ship'].includes(G.phase)")
# Isolated direct ship preview: a fragment never overwrites the regular save.
s=s.replace("const STORE='tipp-expedition-rpg-v1';","const STORE=location.hash==='#schiff'?'tipp-expedition-schiff-demo-v21':'tipp-expedition-rpg-v1';")
# Keep the mirage visible on the final approach step; it vanishes upon arrival.
s=s.replace("ahead.id==='FM'&&dist>=2&&fmShows()","ahead.id==='FM'&&dist>=1&&fmShows()")
# Rendering-source changes follow.
a=s.index('function draw(now){');b=s.index('\nfunction loop(now)',a)
segment=s[a:b].replace('vx.drawImage(bc,','forestBlit(')
# The warm light fades to zero on both sides of the horizon, over the whole image.
segment=segment.replace("const g=vx.createLinearGradient(0,0,0,HOR+10);g.addColorStop(0,'rgba(255,120,50,0)');g.addColorStop(1,'rgba(255,120,50,.22)');vx.fillStyle=g;vx.fillRect(0,0,W,HOR+10);", "const g=vx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(255,145,82,0)');g.addColorStop(.35,'rgba(255,145,82,.055)');g.addColorStop(.53,'rgba(255,145,82,.10)');g.addColorStop(.76,'rgba(255,145,82,.035)');g.addColorStop(1,'rgba(255,145,82,0)');vx.fillStyle=g;vx.fillRect(0,0,W,H);")
segment=segment.replace("if(!reduceMotion){vx.fillStyle='rgba(235,240,215,.55)'","if(!reduceMotion&&!uActive()){vx.fillStyle='rgba(235,240,215,.55)'")
segment=re.sub(r"for\(let i=0;i<9;i\+\+\)\{const x=150.*?vx\.fillRect\(Math\.round\(x\),Math\.round\(124-hh\),2,Math\.round\(hh\)\);\}",'',segment,flags=re.S)
segment=segment.replace("if(G&&G.phase==='explore'&&!trans&&!G.cave){","if(G&&G.phase==='explore'&&!trans&&!G.cave&&!(fActive()&&(fLastItem||fLastFocus))){")
segment=segment.replace("  if(G&&G.enc&&G.enc.max","  if(fActive()){fDrawFire();fDrawPickupHint(now);}\n  if(G&&G.enc&&G.enc.max")
s=s[:a]+segment+s[b:]
assets={f.stem:'data:image/webp;base64,'+base64.b64encode(f.read_bytes()).decode() for f in sorted((root/'assets').glob('*.webp')) if f.stem in {'sofortbild','lehmruine','wuestenhimmel','stadtzugang','stadtgang','wuestengang','duenen','wuestenmaterial','wuestenflora','wuestenmarker','wuestenfunde','wuestentiere','wuestenorte','hafenbauten','hafenpanorama','saharafelsbild','tierportraets','felspassagen','spechtflug','begegnungen','hoehlenobjekte','hoehlenbewohner','hoehlenmaterial','nachtmaterial','nachtwald','waldtiere','gegenstaende','wegmarker','requisiten','baeume','nachtpfad','waldflora','grundwald','orte5a','orte5b','wegmaterial','zustaende5'}}
bound_file=root/'atlas-bounds.json'
bound_data=json.loads(bound_file.read_text()) if bound_file.exists() else {}
bounds={k:v['bounds'] for k,v in bound_data.items() if k in assets and hashlib.sha256((root/'assets'/f'{k}.webp').read_bytes()).hexdigest()==v['sha256']}
# Refresh contextual hints on every completed step, including ordinary steps after a find.
s=s.replace("else if(G.capEvent)lines=['Du gehst weiter.','F und J, immer abwechselnd.'];", "else lines=['Du gehst weiter.','F und J, immer abwechselnd.'];")
for name,fallback in [('desertLines',"[desertDest(h,P.h),'F und J, immer abwechselnd.']"),('caveLines',"[caveDest(h,P.h),stepHint()]")]:
 a=s.index('function '+name+'(');b=s.index('\n  if(h.t===',a)
 part=s[a:b];assert part.count('return null;')==1
 s=s[:a]+part.replace('return null;','return '+fallback+';')+s[b:]
s=s.replace("'menu','lantern','jr'].includes(G.phase)","'menu','lantern','jr','city','innSleep','ship'].includes(G.phase)")
ship_assets={p.stem.removeprefix('schiff21-'):'data:image/webp;base64,'+base64.b64encode(p.read_bytes()).decode() for p in (root/'assets').glob('schiff21-*.webp')}
assert len(ship_assets)==10
code='\nconst S21_IMAGE_DATA='+json.dumps(ship_assets,separators=(',',':'))+';\nconst S21_BOUNDS='+(root/'schiff21-art.json').read_text()+';\nconst O19_SKETCH='+json.dumps('data:image/webp;base64,'+base64.b64encode((root/'assets'/'tagebuch-skizze19.webp').read_bytes()).decode())+';\nconst F_IMAGE_DATA='+json.dumps(assets,separators=(',',':'))+';\nconst F_BOUNDS='+json.dumps(bounds,separators=(',',':'))+';\n'+(root/'wald.js').read_text()+'\n'+(root/'nachtpfad.js').read_text()+'\n'+(root/'dezent.js').read_text()+'\n'+(root/'hoehle.js').read_text()+'\n'+(root/'belohnungen.js').read_text()+'\n'+(root/'erlebnisse.js').read_text()+'\n'+(root/'wueste.js').read_text().replace("ahead.id==='FM'&&dist>=2&&fmShows()","ahead.id==='FM'&&dist>=1&&fmShows()")+'\n'+(root/'revision15.js').read_text()+'\n'+(root/'revision16.js').read_text()+'\n'+(root/'nachthimmel.js').read_text()+'\n'+(root/'wege-und-wetter.js').read_text()+'\n'+(root/'desktop.js').read_text()+'\n'+(root/'kuestenweg.js').read_text()+'\n'+(root/'zelt.js').read_text()+'\n'+(root/'polaroid.js').read_text()+'\n'+(root/'entdecker.js').read_text()+'\n'+(root/'orientierung19.js').read_text()+'\n'+(root/'aufgaben20.js').read_text()+'\n'+(root/'schiff21.js').read_text()+'\n'+(root/'lesbarkeit22.js').read_text()+'\n'+(root/'wege23.js').read_text()+'\n'+(root/'klang25.js').read_text()
init="buildIcons();\nsyncSound();\nshow('home');"
assert s.count(init)==1
s=s.replace(init,code+"\n$('#btn-play').disabled=true;$('#home-note').textContent='Illustrationen werden geladen …';sh21Ready.then(()=>{buildIcons();syncSound();show('home');$('#btn-play').disabled=false;$('#home-note').textContent='';}).catch(error=>{console.error(error);$('#home-note').textContent='Die Illustrationen konnten nicht geladen werden. Bitte die vollständige HTML-Datei erneut öffnen.';});")
s=s.replace('</style>',(root/'wald.css').read_text()+'\n'+(root/'desktop.css').read_text()+'\n'+(root/'expedition18.css').read_text()+'\n'+(root/'orientierung19.css').read_text()+'\n'+(root/'aufgaben20.css').read_text()+'\n'+(root/'schiff21.css').read_text()+'\n'+(root/'lesbarkeit22.css').read_text()+'\n'+(root/'wege23.css').read_text()+'\n'+(root/'klang25.css').read_text()+'\n</style>',1)
(root.parent/'Tipp-Expedition-4.7-Waldatelier.html').write_text(s)
print('Built',len(s.encode()),'bytes with',len(assets),'embedded sheets')
