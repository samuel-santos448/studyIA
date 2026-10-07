const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
const finite=(n,fallback)=>Number.isFinite(n)?n:fallback;

// State changes blend instead of snapping; no camera or face tracking is used.
export function createTeacherMotion(){
 let smile=.27,attention=0,gaze=0,brow=.02,gestureStrength=0,lastState='idle',stateSince=0;
 let nextBlink=null,blinkSince=-10000,nextGlance=0,gazeTarget=0,lastNod=-10000;
 let randomSeed=719;
 const random=()=>{randomSeed=(Math.imul(randomSeed,1664525)+1013904223)>>>0;return randomSeed/4294967296;};
 return{
  step({time,delta,state='idle',character='zezinho',reduced=false}){
   const now=finite(time,0),dt=clamp(finite(delta,33),0,100),ease=1-Math.exp(-dt/340);
   if(nextBlink===null){nextBlink=now+2300;nextGlance=now+3500;stateSince=now;}
   if(state!==lastState){
    if(state==='listening'&&['speaking','thinking'].includes(lastState)&&now-lastNod>2000)lastNod=now;
    stateSince=now;lastState=state;
   }
   const speaking=state==='speaking',listening=state==='listening',thinking=state==='thinking';
   const targetSmile=speaking?.085:thinking?.16:listening?.31:state==='connecting'?.19:.28;
   smile+=(targetSmile+(character==='mariazinha'&&!speaking?.025:0)-smile)*ease;
   attention+=((listening?1:0)-attention)*ease;
   brow+=((thinking?.10:listening?.055:.020)-brow)*ease;
   if(now>=nextBlink){blinkSince=now;nextBlink=now+3100+random()*2500;}
   const blinkAge=now-blinkSince;
   const blink=blinkAge>=0&&blinkAge<190?Math.sin(blinkAge/190*Math.PI):0;
   if(now>nextGlance){gazeTarget=(random()-.5)*.11;nextGlance=now+2800+random()*2500;}
   gaze+=((thinking?.10:listening?0:gazeTarget)-gaze)*ease;
   const t=now/1000,nodAge=(now-lastNod)/1000;
   const nod=nodAge>=0&&nodAge<.8?Math.sin(nodAge/.8*Math.PI)*.018:0;
   const gesture=speaking?.020*Math.max(0,Math.sin((now-stateSince)/1100)):0;
   gestureStrength+=((speaking?.46+.30*Math.max(0,Math.sin((now-stateSince)/1500)):listening?.10:0)-gestureStrength)*ease;
   const motion=reduced?0:1;
   return{
    smile,blink,brow,gaze:motion*gaze,squint:speaking?.008:smile*.14,
    gesture:motion*gestureStrength,
    head:[motion*(attention*.012+nod+Math.sin(t*.73)*.005),motion*(gaze*.12+Math.sin(t*.31)*.006),motion*(-attention*.014+Math.sin(t*.45)*.007)],
    neck:motion*Math.sin(t*.53)*.004,
    spine:[motion*Math.sin(t*1.15)*.003,motion*Math.sin(t*.40)*.004,0],
    arms:[.79+motion*gesture,-.79-motion*gesture*.85],
    hairSway:motion*Math.sin(t*.72)*.0035
   };
  }
 };
}
