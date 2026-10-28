/* Version 17.1: discoverable daytime assembly; original evening sleep and reusable materials. */
function t17Node(){return G?.ex&&inDesert()&&!G.city&&G.pos.e==null?G.w.N[G.pos.n]:null;}
function t17Ready(){return S.inv.includes('zelt')||!tentNeed().length;}
function t17Camp(){const n=t17Node();return n&&S.inv.includes('zelt')&&S.world.tentCamp17===n.id;}
function t17Status(){const n=t17Node(),has=S.inv.includes('zelt');if(!canTentHere(n))return 'Ein geschützter Zeltplatz liegt an der Oase oder im Kakteenfeld.';
 if(!t17Ready())return 'Für das Zelt fehlen noch: '+tentNeed().map(([k,total])=>`${total-(S.res[k]||0)} ${PLURAL[k][1]}`).join(', ')+'.';
 if(t17Camp())return dTime()>=REST_FROM?'Z: im Zelt schlafen.':'Dein Zelt steht. Schlafen ist ab 18 Uhr möglich. Z: Zelt ansehen oder einpacken.';
 return has?'Z: dein Zelt aufbauen'+(dTime()>=REST_FROM?' und schlafen.':'. Schlafen ist ab 18 Uhr möglich.'):'Z: aus Palmwedeln, Zweigen und Stoff ein Zelt aufbauen'+(dTime()>=REST_FROM?' und schlafen.':'.');
}
function t17Plan(){const n=t17Node(),items=[];if(t17Camp())items.push({label:'Zelt einpacken',run:()=>{closeMenu(false);delete S.world.tentCamp17;save();renderScene();setCaption(['Du packst dein Zelt ein. Es ist wieder im Rucksack.','Du kannst es an der Oase oder im Kakteenfeld erneut aufbauen.'],true);updateControls();}});
 items.push({label:'Zurück zum Weg',run:()=>closeMenu()});openMenu('Zelt und Nachtlager',items,null);setCaption([t17Status(),S.inv.includes('zelt')?'Das fertige Zelt lässt sich wiederverwenden. Es verbraucht kein weiteres Baumaterial.':'Benötigt: 10 Palmwedel, 6 Akazienzweige und 4 Stück Stoff.'],true);
}
function t17Commit(sleep){const n=t17Node();if(!canTentHere(n)||!t17Ready()||sleep&&dTime()<REST_FROM)return;
 S.world.tentCamp17=n.id;
 if(sleep){uSleepTent();return;}
 if(!S.inv.includes('zelt')){for(const[k,count]of Object.entries(ZELT))S.res[k]-=count;S.inv.push('zelt');}
 SND.done();save();renderInv('zelt');renderScene();updateClock();setCaption(['Dein Zelt steht. Palmwedel, Zweige und Stoff bilden ein geschütztes Nachtlager.','Ab 18 Uhr kannst du mit Z darin schlafen. Beim Weitergehen packst du es wieder ein.'],true);updateControls();
}
sleepTent=function(){if(!G||G.phase!=='explore'||paused||qEffect||G.puz||G.storm||vSky)return;const n=t17Node();if(!canTentHere(n)||!t17Ready()||t17Camp()&&dTime()<REST_FROM){t17Plan();return;}
 const sleep=dTime()>=REST_FROM,standing=!!t17Camp();qBegin('tent',{duration:sleep?7000:3600,tent17:true,sleep,standing,onFinish:()=>t17Commit(sleep)});
 setCaption([standing?'Du machst es dir in deinem Zelt bequem.':'Du richtest das Gestell auf, verbindest die Zweige und bespannst es mit Stoff und Palmwedeln.',sleep?'Die Nacht bricht an. Leertaste: Aufbau und Nacht abschließen. Rücktaste: abbrechen.':'Leertaste: Aufbau abschließen. Rücktaste: abbrechen.'],true);
};
const t17Opts=desertOpts;desertOpts=function(){const out=t17Opts().filter(([key,,run])=>key!=='z'||run!==sleepTent);if(out.some(([key])=>key==='z'))return out;if(!G.storm&&!vSky){const n=t17Node(),label=canTentHere(n)&&t17Ready()?(t17Camp()?(dTime()>=REST_FROM?'im Zelt schlafen':'Zelt ansehen / einpacken'):'Zelt aufbauen'+(dTime()>=REST_FROM?' und schlafen':'')):'Zeltplatz / Material prüfen';out.push(['z',label,sleepTent]);}return out;};DESERT_EX.opts=desertOpts;
const t17Lines=desertLines;desertLines=function(){const lines=t17Lines(...arguments),n=t17Node();if(lines&&canTentHere(n)){const status=t17Status();return [lines[0],(lines[1]||'').replace(/\s*(?:Hier wäre ein guter Platz für ein Zelt\.|Hier kannst du abends dein Zelt aufbauen\.|Z: Zelt aufbauen und schlafen\.|Fürs Zelt fehlen noch:.*?\.)/g,'')+' '+status];}return lines;};DESERT_EX.lines=desertLines;
const t17Arrive=arrive;arrive=function(){if(G?.ex&&S.world.tentCamp17&&(G.pos.e!=null||G.pos.n!==S.world.tentCamp17))delete S.world.tentCamp17;return t17Arrive(...arguments);};
function t17WorldTent(stage){const x=248,y=163,w=75;uShadow(x,y,40,4);if(stage===2){fSprite('wuestenfunde',22,x,y,w,null,fctx);return;}fSprite('wuestenfunde',23,x,y,w,null,fctx);if(stage===1){const b=F_ATLAS.wuestenfunde.bounds[22],h=w*b.h/b.w;fctx.save();fctx.beginPath();fctx.rect(x-w/2,y-h,w,h*.65);fctx.clip();fSprite('wuestenfunde',22,x,y,w,null,fctx);fctx.restore();}}
const t17Render=renderDesert;renderDesert=function(){const camp=t17Camp(),building=qEffect?.tent17&&qEffect.game===G&&qEffect.pos===JSON.stringify(G.pos)?qEffect:null;if(!camp&&!building)return t17Render();const light=uLight;uLight=function(){};try{t17Render();t17WorldTent(building?(building.worldStage??(building.standing?2:0)):2);uLastFocus=uLastFocus||{x:248,y:123,base:163,keyHint:'Z'};}finally{uLight=light;}uLight();};DESERT_EX.render=renderDesert;
const t17TentDraw=uDrawTent;uDrawTent=function(e,t){if(!e.tent17)return t17TentDraw(e,t);if(reduceMotion)t=e.sleep?e.elapsed:2400;const stage=e.standing||t>=2400?2:t<1200?0:1,label=stage===0?'Du richtest das Gestell am Lagerplatz auf.':stage===1?'Du bespannst das Gestell mit Stoff und Palmwedeln.':e.sleep?(t<3900?'Dein Nachtlager ist bereit.':t<5600?'Du schläfst im Schutz deines Zelts.':'Der Morgen bricht an.'):'Dein Zelt steht am Lagerplatz.';
 if(e.worldStage!==stage){e.worldStage=stage;renderScene();forestBlit(0,0);}if(e.worldCaption!==label){e.worldCaption=label;setCaption([label,e.sleep?'Leertaste: Aufbau und Nacht abschließen. Rücktaste: abbrechen.':'Leertaste: Aufbau abschließen. Rücktaste: abbrechen.'],true);}
 if(e.sleep&&t>=3300){const darkness=t<4700?Math.min(.88,(t-3300)/1400*.88):t<5600?.88:Math.max(0,.88-(t-5600)/1400*.88);uRect(vx,0,0,W,H,`rgba(7,15,30,${darkness})`);}
};
const t17Actions=actionsNow;actionsNow=function(){if(qEffect?.tent17)return [[' ',qEffect.sleep?'Aufbau und Nacht abschließen':'Zeltaufbau abschließen'],['Backspace','abbrechen und umdrehen']];return t17Actions();};
const t17Quests=desertQuests;desertQuests=function(){return t17Quests()+(!S.inv.includes('zelt')?'<p class="tent-guide">Zeltplätze: Oase und Kakteenfeld.<br>Schlafen ab 18 Uhr.</p>':'');};
forestReady.then(()=>{window.forestArt.version='4.7 Waldatelier 17.2 – Zelt in der Landschaft und Stadtannäherung';});
