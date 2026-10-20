import {sameOrigin} from './http-security.mjs';
import {HttpError} from './accounts.mjs';
export function liveTranscription({apiKey,model,auth,fetchImpl}){
 const limits=new Map();let active=0;
 return async(req,res,url,json)=>{
  if(url.pathname!=='/api/claude-transcription')return false;
  try{
   if(req.method!=='POST')throw new HttpError(405,'Método inválido.');
   if(!sameOrigin(req))throw new HttpError(403,'Origem não autorizada.');
   if(!auth)throw new HttpError(503,'Entre na sua conta.');const user=await auth.requireUser(req);
   if(req.headers['x-csrf-token']!==user.csrf)throw new HttpError(403,'Sessão inválida.');
   if(!apiKey||!model)throw new HttpError(503,'Transcrição contínua indisponível.');
   if(req.headers['content-type']!=='application/json')throw new HttpError(415,'Envie JSON.');
   let raw='';for await(const part of req){raw+=part.toString();if(Buffer.byteLength(raw)>65000)throw new HttpError(413,'Conexão inválida.');}
   let body;try{body=JSON.parse(raw);}catch{throw new HttpError(400,'Conexão inválida.');}
   if(typeof body?.sdp!=='string'||!body.sdp.startsWith('v=0')||!body.sdp.includes('m=audio'))throw new HttpError(400,'Áudio inválido.');
   const now=Date.now();for(const [id,l] of limits)if(now-l.time>60000)limits.delete(id);const l=limits.get(user.user.id)||{time:now,count:0};if(l.count>=3||active>=4)throw new HttpError(429,'Aguarde antes de reconectar o microfone.');l.count++;limits.set(user.user.id,l);active++;
   try{
    const tokenResponse=await fetchImpl('https://api.openai.com/v1/realtime/client_secrets',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({session:{type:'transcription',audio:{input:{transcription:{model},turn_detection:null}}}}),signal:AbortSignal.timeout(10000)});
    if(!tokenResponse.ok)throw new HttpError(502,'Transcrição contínua indisponível para esta conta.');const token=await tokenResponse.json();if(typeof token.value!=='string'||!token.value)throw new HttpError(502,'Não foi possível preparar a transcrição.');
    const r=await fetchImpl('https://api.openai.com/v1/realtime/calls',{method:'POST',headers:{Authorization:`Bearer ${token.value}`,'Content-Type':'application/sdp'},body:body.sdp,signal:AbortSignal.timeout(10000)});
    if(!r.ok)throw new HttpError(502,'Transcrição contínua indisponível para esta conexão.');const sdp=await r.text();if(!sdp.startsWith('v=0'))throw new HttpError(502,'Conexão de transcrição inválida.');json(res,200,{sdp});
   }finally{active--;}
  }catch(e){json(res,e instanceof HttpError?e.status:502,{error:e instanceof HttpError?e.message:'Não foi possível conectar a transcrição.'});}
  return true;
 };
}
