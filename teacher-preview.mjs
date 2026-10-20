import {createTeacherAvatar} from './teacher-avatar.mjs';
const stage=document.querySelector('#stage'),status=document.querySelector('#status'),audio=document.querySelector('#audio'),button=document.querySelector('#sample');
let avatar,context,source,analyser,frame=0,url=null,ready=false,revision=0;
try{avatar=await createTeacherAvatar(stage);if(stage.dataset.model!=='imported')throw Error('O modelo refinado não carregou.');avatar.select('mariazinha');stage.querySelector('.live-caption').textContent='Mariazinha';status.textContent='Pronta. Clique em “Ouvir fala de teste”.';button.disabled=false;ready=true;}catch(error){status.textContent='Não foi possível carregar o personagem: '+error.message;}
async function connect(){
 if(!ready)return;const current=++revision;
 if(!context){context=new AudioContext();source=context.createMediaElementSource(audio);analyser=context.createAnalyser();analyser.fftSize=512;source.connect(analyser);source.connect(context.destination);}
 await context.resume();await avatar.connectAudio(context,source);
 if(current!==revision)return;
 const data=new Uint8Array(analyser.fftSize);let lastSound=-Infinity;
 const update=()=>{analyser.getByteTimeDomainData(data);let sum=0;for(const n of data)sum+=((n-128)/128)**2;const rms=Math.sqrt(sum/data.length);avatar.setEnergy(rms);const now=performance.now();if(rms>.009)lastSound=now;avatar.setState(now-lastSound<150?'speaking':'listening');frame=requestAnimationFrame(update);};
 cancelAnimationFrame(frame);update();status.textContent='Reproduzindo e analisando a fala…';
}
function stop(){revision++;cancelAnimationFrame(frame);avatar?.disconnectAudio();avatar?.setState('idle');status.textContent='Áudio pausado. A boca voltou ao repouso.';}
audio.addEventListener('play',()=>connect().catch(e=>{stop();status.textContent='Falha ao iniciar áudio: '+e.message;}));audio.addEventListener('pause',stop);audio.addEventListener('ended',stop);
button.onclick=()=>{audio.pause();audio.src='/assets/teachers/speech-test.wav';audio.play().catch(e=>status.textContent=e.message);};
document.querySelector('#file').onchange=e=>{const file=e.target.files[0];if(!file)return;audio.pause();if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(file);audio.src=url;audio.play().catch(e=>status.textContent=e.message);};
window.addEventListener('pagehide',()=>{stop();avatar?.dispose();context?.close();if(url)URL.revokeObjectURL(url);});

document.querySelector('#teacher').onchange=e=>{audio.pause();stop();avatar?.select(e.target.value);stage.querySelector('.live-caption').textContent=e.target.value==='zezinho'?'Zezinho':'Mariazinha';status.textContent='Pronto. Clique em “Ouvir fala de teste”.';};
