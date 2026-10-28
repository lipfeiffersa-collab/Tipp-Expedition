/* Size the game from measured controls, not a fixed keyboard height deduction. */
const l22Map=$('#mapbox'),l22Navigation=document.createElement('div'),l22Details=document.createElement('div');
l22Navigation.className='navigation22';l22Details.className='details22';
for(const el of [...l22Map.children])if(el===p20Board||el.id==='side-extra')l22Details.append(el);else l22Navigation.append(el);
l22Map.append(l22Navigation,l22Details);
let l22Frame=0;
function l22Measure(){l22Frame=0;if(!G||$('#screen-game').hidden)return;
 const rect=el=>el&&!el.hidden&&getComputedStyle(el).display!=='none'?el.getBoundingClientRect().height:0;
 const top=$('.playrow').getBoundingClientRect().top,dialog=rect($('#dialog')),below=['#actions','#hint','#kb','#legend'].reduce((s,id)=>s+rect($(id)),0);
 const height=Math.max(300,Math.floor(innerHeight-top-dialog-below-72));
 document.body.style.setProperty('--stage22',height+'px');
}
function l22Schedule(){if(!l22Frame)l22Frame=requestAnimationFrame(l22Measure);}
const l22Layout=d17Layout;d17Layout=function(){const result=l22Layout();l22Schedule();return result;};
const l22Observer=new ResizeObserver(l22Schedule);for(const id of ['#actions','#hint','#kb','#legend','#dialog'])l22Observer.observe($(id));l22Observer.observe(d17Toolbar);window.addEventListener('resize',l22Schedule);l22Schedule();
// Render an oasis illusion on the sand horizon, visible until reaching its node.
uMirage=function(){if(!fmShows()||G.storm)return;fctx.save();const y=113;
 const haze=fctx.createLinearGradient(0,y-5,0,y+8);haze.addColorStop(0,'#b3c6b100');haze.addColorStop(.45,'#87b9b7b8');haze.addColorStop(1,'#c9d0b000');uEllipse(fctx,160,y+2,38,6,haze);
 fctx.globalAlpha=.65;fSprite('wuestenflora',7,145,y,null,26);fSprite('wuestenflora',7,176,y+1,null,22);
 fctx.save();fctx.translate(145,y+3);fctx.scale(1,-.25);fctx.globalAlpha=.18;fSprite('wuestenflora',7,0,0,null,26);fctx.restore();
 for(let i=0;i<4;i++)uLine(fctx,[[126+i*2,y+2+i],[160,y+1+i],[194-i*2,y+2+i]],'#e2dfbf80',.4);fctx.restore();};
