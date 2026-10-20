import {spokenText} from './spoken-text.mjs';
import {once} from 'node:events';
import {sameOrigin} from './http-security.mjs';
import {createHash} from 'node:crypto';
import {config} from './languages.mjs';
import {HttpError} from './accounts.mjs';

export function speechAudio({apiKey,model,fetchImpl,auth}){
 const cache=new Map(),limits=new Map();let active=0;
 return async(req,res,url,json)=>{
  if(url.pathname!=='/api/speech')return false;
  try{
   if(req.method==='GET'){json(res,200,{configured:Boolean(apiKey&&model)});return true;}
   if(req.method!=='POST')throw new HttpError(405,'Método inválido.');
   if(!sameOrigin(req))throw new HttpError(403,'Origem não autorizada.');
   if(!auth)throw new HttpError(503,'Ative as contas para utilizar a voz natural.');
   const session=await auth.requireUser(req);if(req.headers['x-csrf-token']!==session.csrf)throw new HttpError(403,'Sessão inválida.');
   if(req.headers['content-type']!=='application/json')throw new HttpError(415,'Envie JSON.');
   let raw='';for await(const chunk of req){raw+=chunk.toString();if(Buffer.byteLength(raw)>20000)throw new HttpError(413,'Texto muito longo.');}
   let body;try{body=JSON.parse(raw);}catch{throw new HttpError(400,'Texto inválido.');}
   if(!body||typeof body.text!=='string'||!body.text.trim()||body.text.length>3000||!['zezinho','mariazinha'].includes(body.character)||!(Object.hasOwn(config,body.language)||body.language==='pt')||!Number.isFinite(body.speed)||body.speed<.5||body.speed>1.5)throw new HttpError(400,'Escolha texto, idioma, voz e velocidade válidos.');
   if(!apiKey||!model)throw new HttpError(503,'Voz natural aguardando configuração no servidor.');
   const now=Date.now();for(const[id,l]of limits)if(now-l.time>60000)limits.delete(id);const limit=limits.get(session.user.id)||{time:now,count:0};if(limit.count>=20||active>=2)throw new HttpError(429,'Aguarde antes de solicitar outro áudio.');limit.count++;limits.set(session.user.id,limit);
   if(body.stream===true){
    body.text=spokenText(body.text);if(!body.text)throw new HttpError(400,'Não há texto para falar.');
    active++;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);const closed=()=>controller.abort();res.on('close',closed);
    try{
     const response=await fetchImpl('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model,input:body.text,voice:body.character==='zezinho'?'cedar':'marin',response_format:'mp3',speed:body.speed,instructions:'Leia exatamente o texto, com voz de professor acolhedora e clara. Preserve o idioma de cada frase, inclusive explicações em português. Não acrescente comentários.'}),signal:controller.signal});
     if(!response.ok)throw new HttpError(response.status===429?429:502,response.status===429?'O serviço de voz atingiu o limite de uso. Aguarde e tente ouvir novamente.':'O serviço de voz recusou a solicitação. Confira a configuração no servidor.');
     if(!response.body)throw new HttpError(502,'O serviço não retornou áudio.');
     let size=0;for await(const chunk of response.body){size+=chunk.length;if(size>2_000_000)throw new HttpError(502,'Áudio muito longo.');if(!res.headersSent){res.writeHead(200,{'Content-Type':'audio/mpeg','Cache-Control':'no-store','X-Accel-Buffering':'no'});res.flushHeaders();}if(!res.write(chunk))await once(res,'drain',{signal:controller.signal});}
     if(!size)throw new HttpError(502,'O serviço retornou áudio vazio.');res.end();
    }finally{clearTimeout(timer);res.off('close',closed);active--;}
    return true;
   }
   const key=createHash('sha256').update(JSON.stringify([session.user.id,body,model])).digest('hex');let audio=cache.get(key);
   if(!audio){active++;try{const response=await fetchImpl('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model,input:body.text,voice:body.character==='zezinho'?'cedar':'marin',response_format:'mp3',speed:body.speed,instructions:`Leia exatamente o texto em ${body.language==='pt'?'português brasileiro':config[body.language].name}. Use uma voz natural, acolhedora e clara, com entonação de professor, pausas entre frases e boa articulação. Não acrescente comentários nem traduções.`}),signal:AbortSignal.timeout(25000)});if(!response.ok)throw new HttpError(502,'Não foi possível gerar a voz. Confira a configuração do servidor.');audio=Buffer.from(await response.arrayBuffer());if(!audio.length||audio.length>2_000_000)throw new HttpError(502,'Áudio inválido.');if(cache.size>=30)cache.delete(cache.keys().next().value);cache.set(key,audio);}finally{active--;}}
   res.writeHead(200,{'Content-Type':'audio/mpeg','Content-Length':audio.length,'Cache-Control':'no-store'});res.end(audio);
  }catch(error){if(res.headersSent){res.destroy();return true;}const timedOut=['TimeoutError','AbortError'].includes(error.name);if(timedOut){json(res,504,{error:'O serviço de voz demorou demais. Tente ouvir a resposta novamente.'});return true;}json(res,error instanceof HttpError?error.status:502,{error:error instanceof HttpError?error.message:'Não foi possível preparar o áudio.'});}
  return true;
 };
}
