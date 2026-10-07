import {sameOrigin} from './http-security.mjs';
import {conversationPolicy} from './teaching.mjs';
import {createHash} from 'node:crypto';
import {courses,config} from './languages.mjs';
import {HttpError} from './accounts.mjs';

export function realtime({apiKey,model,fetchImpl,auth}){
 const starts=new Map();let active=0;
 return async(req,res,url,json)=>{
  if(url.pathname!=='/api/realtime/session')return false;
  try{
   if(req.method==='GET'){json(res,200,{configured:Boolean(apiKey&&model),requiresLogin:true});return true;}
   if(req.method!=='POST')throw new HttpError(405,'Método inválido.');
   if(!sameOrigin(req))throw new HttpError(403,'Origem não autorizada.');
   if(!auth)throw new HttpError(503,'Ative as contas para iniciar uma conversa ao vivo.');
   const session=await auth.requireUser(req);
   if(req.headers['x-csrf-token']!==session.csrf)throw new HttpError(403,'Sessão inválida. Recarregue a página.');
   if(req.headers['content-type']!=='application/json')throw new HttpError(415,'Envie JSON.');
   let raw='';for await(const chunk of req){raw+=chunk.toString();if(Buffer.byteLength(raw)>64000)throw new HttpError(413,'Solicitação muito grande.');}
   let body;try{body=JSON.parse(raw);}catch{throw new HttpError(400,'Solicitação inválida.');}
   if(!body||typeof body!=='object'||!Object.hasOwn(courses,body.language)||!['zezinho','mariazinha'].includes(body.character)||!courses.en.levels.includes(body.level)||!['conversation','listening'].includes(body.practice))throw new HttpError(400,'Escolha idioma, professor, nível e prática válidos.');
   if(typeof body.sdp!=='string'||body.sdp.length>60000||!body.sdp.startsWith('v=0')||!body.sdp.includes('m=audio'))throw new HttpError(400,'Conexão de áudio inválida.');
   const themes={general:'Situações do dia a dia.',introductions:'Apresentação pessoal.',numbers:'Números e horários.',cafe:'Pedidos na cafeteria.',vocabulary:'Vocabulário contextualizado.'};
   if(body.topic!==undefined&&!Object.hasOwn(themes,body.topic))throw new HttpError(400,'Tema inválido.');
   const lesson=body.lessonId===undefined?null:courses[body.language].get(body.lessonId);
   if(body.lessonId!==undefined&&!lesson)throw new HttpError(400,'Aula não encontrada.');
   const speed=body.speed??(['A1','A2'].includes(lesson?.level||body.level)?0.7:1);
   if(![0.7,0.85,1].includes(speed))throw new HttpError(400,'Escolha uma velocidade de fala válida.');
   if(!apiKey||!model)throw new HttpError(503,'Conversa ao vivo ainda não configurada no servidor.');
   const now=Date.now();for(const[id,value]of starts)if(now-value.time>60000)starts.delete(id);
   const limit=starts.get(session.user.id)||{time:now,count:0};if(limit.count>=5||active>=2)throw new HttpError(429,'Aguarde um minuto antes de iniciar outra conversa.');limit.count++;starts.set(session.user.id,limit);active++;
   try{
    const name=body.character==='zezinho'?'Zezinho':'Mariazinha';
    const context=lesson?`Aula ${lesson.id}: ${lesson.title}. ${lesson.conversation.instructions} Vocabulário: ${lesson.vocabulary.map(w=>w.en).join(', ')}. Exemplo: ${lesson.example.en}.`:themes[body.topic||'general'];
    const instructions=`Você é ${name}, professor IA de ${config[body.language].name} para um aluno que fala português, nível ${lesson?.level||body.level}. Converse ao vivo com frases curtas, naturais e adequadas ao nível. Ouça e responda ao que o aluno acabou de dizer. Faça uma pergunta por vez e espere. Corrija um erro relevante com gentileza; não atribua notas nem declare aprovação ou certificação. Explique os erros em português sem esperar que o aluno peça. Não invente informações pessoais do aluno. ${context} ${body.practice==='listening'?'Faça um trecho curto no idioma estudado e uma pergunta de compreensão; aguarde a resposta.':'Comece se apresentando no idioma estudado e faça uma pergunta simples sobre o tema. '+conversationPolicy(body.language,{audio:true})}`;
    const form=new FormData();form.set('sdp',body.sdp);form.set('session',JSON.stringify({type:'realtime',model,instructions:instructions+' Articule claramente e use pausas naturais entre as frases para dar ao aluno tempo de compreender.',output_modalities:['audio'],max_output_tokens:600,audio:{input:{turn_detection:{type:'server_vad',create_response:true,interrupt_response:true}},output:{voice:body.character==='zezinho'?'cedar':'marin',speed}}}));
    const response=await fetchImpl('https://api.openai.com/v1/realtime/calls',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'OpenAI-Safety-Identifier':createHash('sha256').update(session.user.id).digest('hex')},body:form,signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw new HttpError(502,'O serviço de voz não conectou. Confira a configuração no servidor.');
    const sdp=await response.text();if(!sdp.startsWith('v=0'))throw new HttpError(502,'Resposta de conexão inválida.');
    json(res,200,{sdp});
   }finally{active--;}
  }catch(error){json(res,error instanceof HttpError?error.status:502,{error:error instanceof HttpError?error.message:'Não foi possível conectar ao professor. Tente novamente.'});}
  return true;
 };
}
