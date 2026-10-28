/* Contextual, persisted task tracker. The existing optional rewards are unchanged. */
P18_TASKS.push(
 {id:'find-camera20',name:'Die Kamera zum Film',text:'Im Rucksack liegt Sofortbildfilm. Finde die passende Kamera.',metric:'camera20',goal:1,reward:null},
 {id:'ruin-shells20',name:'Die fünf Mulden',text:'An der Ruine sind fünf Mulden. Finde fünf Schneckenhäuser und setze sie mit G ein.',metric:'shells20',goal:5,reward:null},
 {id:'treasure-trail20',name:'Der Weg auf der Schatzkarte',text:'Folge dem neuen Pfad am Antilopenschädel zur verlassenen Zelthütte.',metric:'treasure20',goal:1,reward:null}
);
function p20TaskState(){const s=p18State();s.taskBoard20=s.taskBoard20||{next:0,started:{}};return s.taskBoard20;}
function p20TaskDone(task){const s=p18State();return !!s.claimed[task.id]||(s.metrics[task.metric]||0)>=task.goal;}
let p20Syncing=false;
function p20Sync(){
 if(p20Syncing)return;p20Syncing=true;
 try{const s=p18State(),state=p20TaskState(),before=JSON.stringify([state,s.metrics]);
  const forest=qForest()?S.world:S.wald,uid=Object.keys(NODE_DEF).indexOf('RU')+1,ruin=qForest()?G.w.N.RU:forest?.flags?.[uid];
  const shells=ruin?.open||S.pageFrom?.ruine?5:(S.res.schnecke||0)+(ruin?.shells||0);
  s.metrics.shells20=Math.max(s.metrics.shells20||0,Math.min(5,shells));
  s.metrics.camera20=Math.max(s.metrics.camera20||0,S.inv.includes('kamera')?1:0);
  s.metrics.treasure20=Math.max(s.metrics.treasure20||0,inDesert()&&(G?.w.N.ZH.seen||G?.pos.e==null&&G?.pos.n==='ZH')?1:0);
  const activate=id=>{if(state.started[id]==null)state.started[id]=++state.next;};
  // The order is the natural discovery order when an older save is first imported.
  if(S.inv.includes('rucksack'))activate('find-camera20');
  if(S.inv.includes('kamera'))activate('first-photo');
  const animal=G?.phase==='explore'?animalHere():null;
  if((animal&&tameable(animal)&&S.food>0)||(s.metrics.feeds||0)>0)activate('first-feed');
  if((s.metrics.feeds||0)>0||(animal&&trusted(animal)))activate('first-pet');
  if((s.metrics.pets||0)>0||(s.metrics.helps||0)>0)activate('first-help');
  if(qForest()&&(G.w.N.HUT.open||['dusk','day2','night'].includes(S.world.stage))||(s.metrics.fire||0)>0)activate('fire-ready');
  if(animal==='reh'||(s.metrics.reh||0)>0)activate('deer-five');
  if(ruin?.seen||ruin?.revealed||ruin?.shells||ruin?.open||S.pageFrom?.ruine||qForest()&&G.pos.e==null&&G.pos.n==='RU')activate('ruin-shells20');
  if(S.inv.includes('schatzkarte'))activate('treasure-trail20');
  if(JSON.stringify([state,s.metrics])!==before)save();
 }finally{p20Syncing=false;}
}
function p20OpenTasks(){const state=p20TaskState();return P18_TASKS.filter(t=>state.started[t.id]!=null&&!p20TaskDone(t)).sort((a,b)=>state.started[b.id]-state.started[a.id]).slice(0,3);}
function p20ShortTask(t){const s=p18State(),n=Math.min(t.goal,s.metrics[t.metric]||0);return {
 'find-camera20':'Kamera finden','first-photo':'Erstes eigenes Foto aufnehmen','first-feed':'Ein Tier füttern','first-pet':'Ein Tier streicheln','first-help':'Tierhilfe nutzen',
 'fire-ready':Object.entries(FIRE).reduce((sum,[k,goal])=>sum+Math.min(goal,S.res[k]||0),0)+'/12 Materialien fürs Feuer',
 'deer-five':n+'/'+t.goal+' Rehe gefüttert','ruin-shells20':n+'/5 Schneckenhäuser gefunden','treasure-trail20':'Schatzkartenweg erkunden'
 }[t.id]||t.name;}
const p20Board=document.createElement('section');p20Board.id='p20-map-tasks';p20Board.hidden=true;p20Board.setAttribute('aria-label','Aktuelle freiwillige Aufgaben');$('#map-note').after(p20Board);
function p20Render(){const tasks=p20OpenTasks();p20Board.hidden=!G||!tasks.length;const html='<div class="p20-task-heading"><strong>Aktuelle Aufgaben</strong><button class="p20-task-all" type="button" '+(!S.inv.includes('feldtagebuch')?'disabled':'')+' aria-label="Alle Aufgaben im Tagebuch öffnen · F6">F6</button></div><ul>'+tasks.map(t=>'<li data-task="'+t.id+'">'+esc(p20ShortTask(t))+'</li>').join('')+'</ul>';if(p20Board.innerHTML!==html){p20Board.innerHTML=html;p20Board.querySelector('button').onclick=()=>p18OpenJournal('Entdecken');}}
function p20Refresh(){p20Sync();p20Render();}
const p20Inv=renderInv;renderInv=function(){const result=p20Inv(...arguments);p20Refresh();return result;};
const p20Arrive=arrive;arrive=function(){const result=p20Arrive(...arguments);p20Refresh();return result;};
const p20Checks=p18CheckTasks;p18CheckTasks=function(){p20Sync();const result=p20Checks(...arguments);p20Render();return result;};
// A small row disappears when its goal is met, even if a full backpack delays
// the original reward. The journal still records completed achievements.
function p20JournalTask(task){const s=p18State(),n=Math.min(task.goal,s.metrics[task.metric]||0),done=p20TaskDone(task),started=p20TaskState().started[task.id]!=null;
 const reward=task.reward?' · Belohnung: '+task.reward[1]+' '+(task.reward[0]==='film'?'Film':task.reward[0]==='tierfutter'?'Tierfutter':'Goldmünzen'):'';
 const status=done?(task.reward&&!s.claimed[task.id]?'Erfüllt – die Belohnung wartet, bis im Rucksack Platz ist.':task.reward?'Erfolg freigeschaltet · Belohnung erhalten':'Erledigt'):started?'Aktuelle freiwillige Aufgabe':'Wird passend zu deinen Entdeckungen eingeblendet';
 return '<section class="p18-task"><h4>'+(done?'✓ ':'')+esc(task.name)+'</h4><p>'+esc(task.text)+'</p><p>'+n+'/'+task.goal+reward+'</p><small>'+status+'</small></section>';
}
const p20Ready=o19Ready.then(()=>{p20Refresh();window.forestArt.version='4.7 Waldatelier 20 – Aktuelle Entdeckeraufgaben';});
