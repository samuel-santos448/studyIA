import {spokenText} from './spoken-text.mjs';
import {HttpError} from './accounts.mjs';
// Consume Claude text deltas, synthesize complete phrases, and forward MP3
// chunks immediately. The full text is returned for server-owned history.
export async function streamClaudeAudio(response,{res,session,apiKey,ttsModel,fetchImpl,signal}){
 const send=event=>{if(res.destroyed)throw new Error('Client disconnected');res.write(JSON.stringify(event)+'\n');};
 let text='',pending='',stopReason=null,completed=false,voices=0;
 const voice=async phrase=>{
  const input=spokenText(phrase);if(!input)return;send({type:'text',text:spokenText(text)});if(++voices>8)throw new HttpError(502,'A resposta ficou longa demais.');
  const r=await fetchImpl('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model:ttsModel,input,voice:session.character==='zezinho'?'cedar':'marin',response_format:'mp3',speed:session.speed,instructions:'Leia exatamente o texto com voz natural de professor. Preserve o idioma de cada frase, inclusive português. Não acrescente nada.'}),signal:AbortSignal.any([signal,AbortSignal.timeout(45000)])});
  if(!r.ok||!r.body)throw new HttpError(502,'Não foi possível gerar uma parte da voz. Tente ouvir a resposta novamente.');
  let size=0;for await(const bytes of r.body){size+=bytes.length;if(size>2_000_000)throw new HttpError(502,'Áudio muito longo.');send({type:'audio',data:Buffer.from(bytes).toString('base64')});}
  if(!size)throw new HttpError(502,'O serviço de voz retornou áudio vazio.');
 };
 const consume=async data=>{
  if(data.type==='error')throw new HttpError(502,'O Claude interrompeu a resposta. Tente novamente.');
  if(data.type==='message_delta')stopReason=data.delta?.stop_reason;
  if(data.type==='message_stop'){completed=true;return;}
  if(data.type!=='content_block_delta'||data.delta?.type!=='text_delta')return;
  const delta=data.delta.text||'';text+=delta;pending+=delta;if(text.length>3000)throw new HttpError(502,'A resposta ficou longa demais.');
  // Require a complete phrase; avoid synthesizing individual tokens/words.
  const boundary=pending.match(/^([\s\S]{18,}?[.!?](?:["”']?)(?=\s|$))/);
  if(boundary){const phrase=boundary[1];pending=pending.slice(phrase.length);await voice(phrase);}
 };
 if(!response.body)throw new HttpError(502,'Claude não retornou uma resposta progressiva.');
 const decoder=new TextDecoder();let buffer='';
 for await(const bytes of response.body){buffer=(buffer+decoder.decode(bytes,{stream:true})).replace(/\r\n/g,'\n');if(buffer.length>100000)throw new HttpError(502,'Resposta inválida do Claude.');let end;
  while((end=buffer.indexOf('\n\n'))>=0){const event=buffer.slice(0,end);buffer=buffer.slice(end+2);const raw=event.split('\n').filter(l=>l.startsWith('data:')).map(l=>l.slice(5).trim()).join('\n');if(raw&&raw!=='[DONE]')await consume(JSON.parse(raw));}
 }
 if(!completed||stopReason==='max_tokens')throw new HttpError(502,'A resposta do professor foi interrompida.');
 await voice(pending);const reply=spokenText(text);if(!reply)throw new HttpError(502,'Claude retornou uma resposta vazia.');return reply;
}
