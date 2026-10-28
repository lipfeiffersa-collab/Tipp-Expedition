/* Version 17: keyboard-first desktop framing; UI state is separate from saved worlds. */
const d17Toolbar=document.createElement('div');
d17Toolbar.className='desktop-tools';
d17Toolbar.innerHTML='<button class="btn small" id="btn-inventory" aria-controls="inventory-dialog" aria-expanded="false">Inventar · F2</button><button class="btn small" id="btn-keyboard" aria-controls="kb" aria-expanded="false">Tastatur einblenden · F3</button><span>Esc: Pause · Enter: bestätigen / weiter</span>';
$('#screen-game').insertBefore(d17Toolbar,$('.playrow'));
const d17Modal=document.createElement('div');
d17Modal.id='inventory-dialog';d17Modal.hidden=true;d17Modal.className='inventory-dialog';d17Modal.setAttribute('role','dialog');d17Modal.setAttribute('aria-modal','true');d17Modal.setAttribute('aria-labelledby','inventory-title');
d17Modal.innerHTML='<div class="inventory-card"><div class="inventory-heading"><div><p class="eyebrow">Rucksack</p><h2 id="inventory-title">Dein Inventar</h2></div><button class="btn small" id="btn-inventory-close">Zurück · Esc / F2</button></div><p class="note">Pfeiltasten: Gegenstand wählen · Enter: Details · Tab: nächstes Feld</p><p id="inventory-detail" aria-live="polite">Wähle einen Gegenstand, um Name und Menge zu lesen.</p></div>';
$('#screen-game').append(d17Modal);$('.inventory-card').append($('#invbox'));$('#invbox > .eyebrow').hidden=true;
let d17InventoryState=null,d17Expanded=false;
try{d17Expanded=localStorage.getItem('tipp-desktop-keyboard')==='true';}catch(_){}
function d17Layout(){
 document.body.classList.toggle('puzzle-focus',!!G&&(!!G.puz||G.phase==='lock'||G.phase==='moss'));
 document.body.classList.toggle('keyboard-expanded',d17Expanded);
 $('#kb').setAttribute('aria-hidden',String(!d17Expanded));$('#btn-keyboard').setAttribute('aria-expanded',String(d17Expanded));$('#btn-keyboard').textContent=d17Expanded?'Tastatur ausblenden · F3':'Tastatur einblenden · F3';
}
function d17Keyboard(){d17Expanded=!d17Expanded;try{localStorage.setItem('tipp-desktop-keyboard',String(d17Expanded));}catch(_){}d17Layout();}
function d17OpenInventory(){
 if(!G||trans||G.city?.moving||!$('#ov-goal').hidden||!$('#ov-done').hidden)return;
 d17InventoryState={game:G,paused,focus:document.activeElement};paused=true;renderInv();d17Modal.hidden=false;$('#btn-inventory').setAttribute('aria-expanded','true');updateControls();
 ($('#inv button')||$('#btn-inventory-close')).focus();
}
function d17CloseInventory(){
 if(!d17InventoryState)return;const state=d17InventoryState;d17InventoryState=null;d17Modal.hidden=true;$('#btn-inventory').setAttribute('aria-expanded','false');
 if(G===state.game){paused=state.paused;lastInput=performance.now();updateControls();}
 if(state.focus?.isConnected)state.focus.focus({preventScroll:true});
}
const d17Groups=[['Ausrüstung',null],['Nahrung & Versorgung',new Set(['tierfutter','beeren','honig','datteln','kaktusfeigen','oel','tropfen'])],['Baumaterial',new Set(['holz','feder','zapfen','tannenzapfen','feuerstein','palmwedel','akazienzweig','stoff'])],['Rätsel & Dokumente',new Set(['seite','schnecke','sandrose','eichel','kiesel','schluessel','schatzkarte','ticket'])],['Fundstücke & Münzen',null]];
const d17RenderInv=renderInv;
renderInv=function(fresh){
 d17RenderInv(fresh);const groups=d17Groups.map(()=>[]);
 for(const li of [...$('#inv').children]){if(li.classList.contains('sep'))continue;const src=li.querySelector('img')?.src,k=Object.keys(ICON).find(k=>ICON[k]===src),name=li.querySelector('span:not(.cnt)')?.textContent||li.title;
  let group=d17Groups.findIndex(([,keys])=>keys?.has(k));if(group<0)group=S.inv.includes(k)?0:4;
  const count=li.querySelector('.cnt')?.textContent||'',button=document.createElement('button');button.type='button';button.className='inventory-item';button.dataset.item=k||'';button.setAttribute('aria-label',name+(count?' · '+count:''));while(li.firstChild)button.append(li.firstChild);li.append(button);button.onclick=()=>{$('#inventory-detail').textContent=name+(count?' · Menge '+count.replace('×',''):'');};groups[group].push(li);
 }
 $('#inv').replaceChildren();groups.forEach((items,i)=>{if(!items.length)return;const heading=document.createElement('li');heading.className='sep';heading.textContent=d17Groups[i][0];$('#inv').append(heading,...items);});
};
const d17Controls=updateControls;updateControls=function(){const result=d17Controls();d17Layout();return result;};
const d17Show=show;show=function(name){if(d17InventoryState)d17CloseInventory();const value=d17Show(name);d17Layout();return value;};
$('#btn-inventory').onclick=()=>d17OpenInventory();$('#btn-inventory-close').onclick=d17CloseInventory;$('#btn-keyboard').onclick=d17Keyboard;
$('#btn-resume').textContent='Weiterspielen · Enter';
let d17Menu=null,d17MenuIndex=0;
function d17MarkMenu(){const rows=[...$('#tm-items').children];rows.forEach((el,i)=>{el.classList.toggle('menu-selected',i===d17MenuIndex);el.tabIndex=i===d17MenuIndex?0:-1;el.setAttribute('role','button');el.setAttribute('aria-label',G.menu.items[i]?.label||el.textContent);});}
const d17MenuRender=renderMenu;renderMenu=function(){const value=d17MenuRender();if(d17Menu!==G.menu){d17Menu=G.menu;d17MenuIndex=0;}d17MarkMenu();$('#tm-info').textContent+=' · Pfeiltasten: wählen · Enter: bestätigen';return value;};
function d17Consume(e){e.preventDefault();e.stopImmediatePropagation();}
function d17FocusMove(root,key){const nodes=[...root.querySelectorAll('button:not(:disabled),select,input,[tabindex="0"]')].filter(el=>el.getClientRects().length);if(!nodes.length)return;let index=nodes.indexOf(document.activeElement),step=key==='ArrowLeft'||key==='ArrowUp'?-1:1;
 if(root===d17Modal&&(key==='ArrowDown'||key==='ArrowUp')&&document.activeElement.matches('.inventory-item')){const first=document.activeElement.getBoundingClientRect();const candidates=nodes.filter(el=>el.matches('.inventory-item')).map(el=>({el,r:el.getBoundingClientRect()})).filter(({r})=>step*(r.top-first.top)>4).sort((a,b)=>Math.abs(a.r.top-first.top)-Math.abs(b.r.top-first.top)||Math.abs(a.r.left-first.left)-Math.abs(b.r.left-first.left));if(candidates.length){candidates[0].el.focus();return;}}
 nodes[(index+step+nodes.length)%nodes.length].focus();
}
window.addEventListener('keydown',e=>{if(typeof a25Dialog!=='undefined'&&a25Dialog.open)return;
 if(e.ctrlKey||e.metaKey||e.altKey)return;
 if(typeof p18ModalActive==='function'&&p18ModalActive())return;
 if(!d17Modal.hidden){
  if(['Escape','F2'].includes(e.key)){d17Consume(e);if(!e.repeat)d17CloseInventory();return;}
  if(e.key==='Tab'){d17Consume(e);d17FocusMove(d17Modal,e.shiftKey?'ArrowLeft':'ArrowRight');return;}
  if(e.key.startsWith('Arrow')){d17Consume(e);d17FocusMove(d17Modal,e.key);return;}
  if(['PageDown','PageUp','Home','End'].includes(e.key)){d17Consume(e);const list=$('#invbox');if(e.key==='Home'||e.key==='End'){const buttons=[...$('#inv').querySelectorAll('button')];buttons[e.key==='Home'?0:buttons.length-1]?.focus();}else list.scrollBy({top:list.clientHeight*(e.key==='PageDown'?1:-1)});return;}
  if(e.key==='Enter'||e.key===' '){d17Consume(e);if(!e.repeat)document.activeElement?.click();return;}
  d17Consume(e);return;
 }
 if(!$('#screen-game').hidden&&G){
  if(e.key==='F2'){d17Consume(e);if(!e.repeat)d17OpenInventory();return;}
  if(e.key==='F3'){d17Consume(e);if(!e.repeat)d17Keyboard();return;}
  const overlay=['#ov-pause','#ov-goal','#ov-page','#ov-done'].map(id=>$(id)).find(el=>!el.hidden);
  if(overlay){if(e.key==='Escape'){d17Consume(e);if(!e.repeat&&overlay.id==='ov-pause')$('#btn-resume').click();return;}if(e.key.startsWith('Arrow')){d17Consume(e);d17FocusMove(overlay,e.key);return;}if(e.key==='Enter'){d17Consume(e);if(e.repeat)return;const focused=overlay.contains(document.activeElement)&&document.activeElement.matches('button')?document.activeElement:null;(focused||overlay.querySelector('.primary')||overlay.querySelector('button'))?.click();return;}}
  if(G.phase==='menu'&&(e.key==='Enter'||e.key.startsWith('Arrow'))){d17Consume(e);if(e.repeat)return;if(e.key==='Enter'){const row=document.activeElement?.closest('#tm-items > .tm-it');if(row)d17MenuIndex=[...$('#tm-items').children].indexOf(row);const item=G.menu.items[d17MenuIndex];if(item)handleKey(item.k);}else if(G.menu.items.length){d17MenuIndex=(d17MenuIndex+(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1)+G.menu.items.length)%G.menu.items.length;d17MarkMenu();$('#tm-items').children[d17MenuIndex]?.focus();}return;}
  if(e.key==='Escape'&&G.phase==='menu'){d17Consume(e);if(!e.repeat)handleKey('Backspace');return;}
  if(e.key==='Escape'&&(G.puz||G.phase==='lock'||G.phase==='moss')){d17Consume(e);if(!e.repeat)handleKey('Backspace');return;}
 }
},true);
d17Layout();
// Enlarge the puzzle itself as well as its viewport; keep its labels inside the frame.
const d17PuzzleDraw=pzDraw;pzDraw=function(now){if(!uActive()||!G.puz)return d17PuzzleDraw(now);vx.save();vx.translate(160,86);vx.scale(1.2,1.2);vx.translate(-160,-86);d17PuzzleDraw(now);vx.restore();};
forestReady.then(()=>{window.forestArt.version='4.7 Waldatelier 17 – Desktop und Tastaturbedienung';});
