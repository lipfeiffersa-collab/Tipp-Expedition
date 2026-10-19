/* Explicit v11 correction: split the two rewards into ancient coins and gold. */
function markCoinReward(key){const w=S.world;w.coinRewardsV11=w.coinRewardsV11||{};w.coinRewardsV11[key]=true;}
function reconcileCoinRewards(){
 const worlds=[...new Set([S.world,S.hoehle].filter(Boolean))],due=[];
 for(const w of worlds){const key=w.kind==='hoehle'?'mineSecret':w.kind==='wueste'?'cactusChest':null;if(!key||w.coinRewardsV11?.[key])continue;
 const defs=w.kind==='hoehle'?CAVE_NODES:DESERT_NODES,id=w.kind==='hoehle'?'GR':'KTR',uid=Object.keys(defs).indexOf(id)+1;
 if(w.flags?.[uid]?.chest)due.push([w,key,key==='mineSecret'?5:3]);
 }
 if(!due.length)return 0;
 // Retain the pre-correction save locally before changing an already-opened chest reward.
 try{const backup=STORE+'-vor-muenzkorrektur-v11';if(!localStorage.getItem(backup)){const raw=localStorage.getItem(STORE);if(raw)localStorage.setItem(backup,raw);}}catch(e){}
 let total=0;for(const [w,key,amount]of due){S.old=(S.old||0)+amount;S.coins=Math.max(0,(S.coins||0)-amount);w.coinRewardsV11=w.coinRewardsV11||{};w.coinRewardsV11[key]=true;total+=amount;}
 save();return total;
}
reconcileCoinRewards();
