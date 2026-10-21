'use strict';
(function(root){
 const female=/\b(female|feminina|francisca|maria|luciana|vitoria|vitória|raquel|zira|aria|jenny|samantha|victoria|karen|moira|tessa|susan|sonia|hazel|libby|ana|joana|helena|catherine|allison|ava|emma)\b/i;
 const male=/\b(male|masculina|antonio|antônio|daniel|ricardo|duarte|david|mark|guy|ryan|james|george|brian|christopher|andrew|thomas|alex|fred)\b/i;
 function candidates(voices,lang){return voices.filter(v=>v.lang.toLowerCase().split('-')[0]===lang.toLowerCase().split('-')[0]);}
 function pick(voices,lang,role,uri){const available=candidates(voices,lang);if(uri){const explicit=available.find(v=>v.voiceURI===uri);if(explicit)return explicit;}const pattern=role==='teacher'?female:male;return available.filter(v=>pattern.test(v.name)).sort((a,b)=>Number(b.lang.toLowerCase()===lang.toLowerCase())-Number(a.lang.toLowerCase()===lang.toLowerCase()))[0]||null;}
 function ready(){return new Promise(resolve=>{const synth=root.speechSynthesis;if(!synth||synth.getVoices().length){resolve();return;}let timer;const finish=()=>{clearTimeout(timer);synth.removeEventListener?.('voiceschanged',finish);resolve();};synth.addEventListener?.('voiceschanged',finish,{once:true});timer=setTimeout(finish,1500);});}
 const api={pick,candidates,ready};root.StudyStoryVoices=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
