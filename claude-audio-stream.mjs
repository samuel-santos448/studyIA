// Convert authenticated text/audio events to one continuous MP3 response.
export function readClaudeAudio(response,onEvent,{signal}={}){
 const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';
 const body=new ReadableStream({async start(controller){try{
  let completed=false;
  for(;;){if(signal?.aborted)throw new DOMException('Aborted','AbortError');const {done,value}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});if(buffer.length>3_000_000)throw Error('Resposta de áudio inválida.');let end;
   while((end=buffer.indexOf('\n'))>=0){const raw=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!raw.trim())continue;const event=JSON.parse(raw);
    if(event.type==='error'){const error=Error(event.error||'A transmissão foi interrompida.');error.status=event.status;throw error;}
    if(event.type==='audio'){const raw=atob(event.data);controller.enqueue(Uint8Array.from(raw,c=>c.charCodeAt(0)));}
    else{onEvent(event);if(event.type==='done')completed=true;}
   }
  }
  if(!completed)throw Error('A resposta foi interrompida. Sua conversa pode ser retomada.');controller.close();
 }catch(e){controller.error(e);}finally{reader.releaseLock();}},cancel(){return reader.cancel();}});
 signal?.addEventListener('abort',()=>reader.cancel().catch(()=>{}),{once:true});
 return new Response(body,{headers:{'Content-Type':'audio/mpeg'}});
}
