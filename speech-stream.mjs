// Feed MP3 bytes to the player as they arrive; retain a Blob fallback for
// browsers without MPEG MediaSource support. Never request a second synthesis.
export async function attachSpeechStream(audio,response,{signal,onError}={}){
 const supported=response.headers.get('content-type')?.includes('audio/mpeg')&&globalThis.MediaSource?.isTypeSupported('audio/mpeg');
 if(!supported){const url=URL.createObjectURL(await response.blob());audio.src=url;return{url,dispose(){URL.revokeObjectURL(url);}};}
 const media=new MediaSource(),url=URL.createObjectURL(media);audio.src=url;let reader=null,disposed=false;
 const dispose=()=>{if(disposed)return;disposed=true;reader?.cancel().catch(()=>{});URL.revokeObjectURL(url);};
 signal?.addEventListener('abort',dispose,{once:true});
 const finished=new Promise((resolve,reject)=>{
  media.addEventListener('sourceopen',async()=>{try{
   if(disposed)throw new DOMException('Aborted','AbortError');const buffer=media.addSourceBuffer('audio/mpeg');reader=response.body.getReader();
   for(;;){if(disposed)throw new DOMException('Aborted','AbortError');const {done,value}=await reader.read();if(done)break;if(!value.length)continue;
    await new Promise((yes,no)=>{const cleanup=()=>{buffer.removeEventListener('updateend',end);buffer.removeEventListener('error',error);signal?.removeEventListener('abort',error);};const end=()=>{cleanup();yes();};const error=()=>{cleanup();no(Error('A transmissão do áudio foi interrompida.'));};buffer.addEventListener('updateend',end,{once:true});buffer.addEventListener('error',error,{once:true});signal?.addEventListener('abort',error,{once:true});try{buffer.appendBuffer(value);}catch(e){cleanup();no(e);}});
   }
   if(media.readyState==='open')media.endOfStream();resolve();
  }catch(e){reject(e);}}, {once:true});
 });
 finished.catch(e=>{if(!disposed){dispose();onError?.(e);}});
 return{url,finished,dispose(){signal?.removeEventListener('abort',dispose);dispose();}};
}
