// Keep synthesis stable across choices; adjust listening speed locally while
// preserving pitch. The generated audio is always at the supported 0.85 rate.
export const synthesisSpeed=.85;
export function listeningRate(speed){return [.7,.85,1].includes(Number(speed))?Number(speed)/synthesisSpeed:1;}
export function setListeningSpeed(audio,speed){audio.defaultPlaybackRate=listeningRate(speed);audio.playbackRate=listeningRate(speed);audio.preservesPitch=true;}
export async function startAudio(audio,{signal,timeoutMs=15000}={}){
 if(signal?.aborted)throw new DOMException('Aborted','AbortError');
 let timer,cancel;try{await Promise.race([audio.play(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('O áudio não começou a tocar. Tente ouvir a resposta novamente.')),timeoutMs);cancel=()=>reject(new DOMException('Aborted','AbortError'));signal?.addEventListener('abort',cancel,{once:true});})]);}finally{clearTimeout(timer);if(cancel)signal?.removeEventListener('abort',cancel);}
}
