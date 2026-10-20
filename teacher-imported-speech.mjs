import {getTeacherSpeechShape} from './teacher-face.mjs';
const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
// Shared by the imported character and deterministic speech/reset tests.
export function createImportedSpeechController(meshes){
 const values=new Map();let jaw=0,round=0,wide=0,upper=0,cheek=0,lift=0;
 const write=(name,value)=>{for(const mesh of meshes){const i=mesh.morphTargetDictionary?.[name];if(i!==undefined)mesh.morphTargetInfluences[i]=value;}};
 return{
  setMorph(name,value){values.set(name,clamp(value));},
  release(){values.clear();},
  reset(){values.clear();jaw=round=wide=upper=cheek=lift=0;for(const n of ['jawOpen','mouthRound','mouthWide','upperLipRaise','cheekSpeech','cheekLift'])write(n,0);},
  update(delta,blink=0){
   const shape=getTeacherSpeechShape(values),dt=Math.max(0,Math.min(100,delta));
   // Audio visemes are low-amplitude: preserve their rhythm but expose the
   // rounded central opening instead of leaving a narrow lip slit.
   const target=Math.min(.9,shape.jaw*3.6)*(1-shape.press);
   // Keep syllables distinct without snapping shut on short pauses.
   const jawEase=1-Math.exp(-dt/(shape.press>.65?45:target>jaw?70:115));
   const lipEase=1-Math.exp(-dt/85);
   jaw+=(target-jaw)*jawEase;
   // A separate upper lip control makes vowels visible without lifting the nose.
   const upperTarget=Math.min(.65,shape.jaw*2.8+shape.wide*.12)*(1-shape.press);
   upper+=(upperTarget-upper)*lipEase;
   round+=(shape.round-round)*lipEase;wide+=(shape.wide*(1-shape.round)-wide)*lipEase;
   // Broad cheek motion trails the lips slightly, with no idle oscillation.
   const cheekEase=1-Math.exp(-dt/120);
   cheek+=(jaw*.75*(1-round*.3)-cheek)*cheekEase;
   lift+=(wide*.35*(1-shape.press)-lift)*cheekEase;
   write('cheekSpeech',cheek);write('cheekLift',lift);
   write('upperLipRaise',upper);write('jawOpen',jaw);write('mouthRound',round*.35);write('mouthWide',wide*.35);
   write('eyeBlinkLeft',clamp(blink));write('eyeBlinkRight',clamp(blink));
   return{jaw,round,wide,upper,cheek,lift};
  }
 };
}
