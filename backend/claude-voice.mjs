import {randomUUID} from 'node:crypto';
import {sameOrigin} from './http-security.mjs';
import {HttpError} from './accounts.mjs';
import {courses,config} from './languages.mjs';
import {conversationPolicy} from './teaching.mjs';
export function claudeVoice({key,model,apiKey,transcribeModel,ttsModel,fetchImpl,auth,now=Date.now}){
 const sessions=new Map(),busy=new Set(),limits=new Map();
 const configured=Boolean(key&&model&&apiKey&&transcribeModel&&ttsModel);
 return async(req,res,url,json)=>{
  if(url.pathname!=='/api/claude-voice')return false;
  let owner;
  try{
   if(req.method==='GET'){json(res,200,{configured,requiresLogin:true,durationMinutes:20});return true;}
   if(req.method!=='POST')throw new HttpError(405,'Método inválido.');
   if(!sameOrigin(req))throw new HttpError(403,'Origem não autorizada.');
   if(!auth)throw new HttpError(503,'Ative as contas para testar o Claude.');
   const user=await auth.requireUser(req);owner=user.user.id;
   if(req.headers['x-csrf-token']!==user.csrf)throw new HttpError(403,'Sessão inválida.');
   if(req.headers['content-type']!=='application/json')throw new HttpError(415,'Envie JSON.');
   let raw='';for await(const chunk of req){raw+=chunk.toString();if(Buffer.byteLength(raw)>3_000_000)throw new HttpError(413,'Grave até 30 segundos por fala.');}
   let body;try{body=JSON.parse(raw);}catch{throw new HttpError(400,'Solicitação inválida.');}
   if(!body||!['start','turn','end'].includes(body.action))throw new HttpError(400,'Ação inválida.');
   for(const [id,s] of sessions)if(now()>=s.expiresAt)sessions.delete(id);
   for(const [id,l] of limits)if(now()-l.time>60000)limits.delete(id);
   let session=body.action==='start'?null:sessions.get(body.sessionId);
   if(body.action!=='start'&&(!session||session.owner!==owner))throw new HttpError(404,'Conversa encerrada ou expirada. Inicie novamente.');
   if(body.action==='end'){sessions.delete(body.sessionId);json(res,200,{ended:true});return true;}
   if(!configured)throw new HttpError(503,'Configure Claude API e os serviços de áudio no servidor.');
   const rate=limits.get(owner)||{time:now(),count:0};
   if(rate.count>=20||busy.has(owner)||busy.size>=4)throw new HttpError(429,'Aguarde a resposta antes de enviar outra fala.');
   if(body.action==='start'){
    if(!Object.hasOwn(courses,body.language)||!['zezinho','mariazinha'].includes(body.character)||!courses.en.levels.includes(body.level)||!['conversation','listening'].includes(body.practice))throw new HttpError(400,'Escolha idioma, professor, nível e prática válidos.');
    const lesson=body.lessonId===undefined?null:courses[body.language].get(body.lessonId);
    if(body.lessonId!==undefined&&!lesson)throw new HttpError(400,'Aula não encontrada.');
    const topics={general:'Situações do dia a dia.',introductions:'Apresentação pessoal.',numbers:'Números e horários.',cafe:'Na cafeteria.',vocabulary:'Vocabulário contextualizado.'};
    if(body.topic!==undefined&&!Object.hasOwn(topics,body.topic))throw new HttpError(400,'Tema inválido.');
    session={owner,id:randomUUID(),expiresAt:now()+20*60000,language:body.language,messages:[],system:`Você é ${body.character==='zezinho'?'Zezinho':'Mariazinha'}, professor de ${config[body.language].name} para brasileiros, nível ${lesson?.level||body.level}. Conduza prática interativa por pelo menos 16 minutos dentro de uma sessão de 20 minutos. Faça uma pergunta por vez e espere. Responda em até 120 palavras, com frases curtas. Alterne conversa, explicações e exemplos. Não encerre após poucas perguntas; respeite se o aluno pedir para parar. Não invente tempo decorrido, notas ou certificação. Você recebe transcrição de áudio, não o som original: não diagnostique pronúncia como se tivesse ouvido o aluno. Ofereça modelos de pronúncia e peça repetição se a transcrição for pouco clara. ${conversationPolicy(body.language)} ${body.practice==='listening'?'Apresente um trecho curto e pergunte sobre sua compreensão.':''} ${lesson?`Aula ${lesson.id}: ${lesson.title}. ${lesson.conversation.instructions} Exemplo: ${lesson.example.en}.`:topics[body.topic||'general']}`};
   }
   let transcript='';
   if(body.action==='turn'){
    if(typeof body.audio!=='string'||body.audio.length>2_800_000||!body.audio.length||!/^[A-Za-z0-9+/]+={0,2}$/.test(body.audio)||!['audio/webm','audio/ogg','audio/mp4'].includes(body.mime))throw new HttpError(400,'Áudio inválido. Grave uma fala curta novamente.');
   }
   rate.count++;limits.set(owner,rate);busy.add(owner);
   try{
    if(body.action==='turn'){
     const bytes=Buffer.from(body.audio,'base64');if(bytes.length<20||bytes.length>2_000_000)throw new HttpError(400,'Áudio inválido.');
     const form=new FormData();form.set('model',transcribeModel);form.set('file',new Blob([bytes],{type:body.mime}),'speech.'+({ 'audio/webm':'webm','audio/ogg':'ogg','audio/mp4':'mp4'}[body.mime]));
     const r=await fetchImpl('https://api.openai.com/v1/audio/transcriptions',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`},body:form,signal:AbortSignal.timeout(35000)});
     if(!r.ok)throw new HttpError(502,'Não foi possível transcrever sua fala.');const data=await r.json();transcript=typeof data.text==='string'?data.text.trim():'';
     if(!transcript||transcript.length>4000)throw new HttpError(422,'Não identifiquei uma fala clara. Tente novamente.');
    }
    const messages=[...session.messages,{role:'user',content:body.action==='start'?'Comece se apresentando brevemente e faça a primeira pergunta.':transcript}];
    const r=await fetchImpl('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'x-api-key':key,'anthropic-version':'2023-06-01','Content-Type':'application/json'},body:JSON.stringify({model,max_tokens:450,system:session.system,messages}),signal:AbortSignal.timeout(40000)});
    if(!r.ok)throw new HttpError(r.status===429?429:502,'Claude não respondeu. Confira créditos, modelo e configuração no servidor.');
    const data=await r.json();const reply=(data.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\n').trim();
    if(!reply||reply.length>3000||data.stop_reason==='max_tokens')throw new HttpError(502,'A resposta do professor ficou incompleta. Tente novamente.');
    if(now()>=session.expiresAt||body.action==='turn'&&!sessions.has(session.id))throw new HttpError(409,'Esta conversa já foi encerrada.');
    session.messages=[...messages,{role:'assistant',content:reply}].slice(-40);
    if(body.action==='start'){
     for(const [id,s] of sessions)if(s.owner===owner)sessions.delete(id);
     if(sessions.size>=1000)throw new HttpError(503,'Serviço ocupado. Tente novamente em instantes.');
    }
    sessions.set(session.id,session);json(res,200,{sessionId:session.id,expiresAt:session.expiresAt,transcript,reply});
   }finally{busy.delete(owner);}
  }catch(e){json(res,e instanceof HttpError?e.status:502,{error:e instanceof HttpError?e.message:'Não foi possível conversar com o Claude. Tente novamente.'});}
  return true;
 };
}
