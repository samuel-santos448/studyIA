'use strict';
(() => {
 const panel=document.createElement('div');panel.id='ai-panel';
 panel.innerHTML='<h3>Converse com seu professor</h3><p>Pratique inglês A1 com perguntas livres. Ao enviar, o texto e o contexto recente da conversa são processados pela OpenAI. A IA pode cometer erros.</p><p id="ai-status" role="status">Verificando disponibilidade…</p><div id="ai-log" role="log" aria-live="polite"></div><form id="ai-form"><label for="ai-input">Sua mensagem</label><input id="ai-input" maxlength="1000" autocomplete="off" required disabled placeholder="Hello! I want to practice English."><button class="button" disabled>Enviar ao professor</button></form><button id="ai-clear" class="reset">Nova conversa</button>';
 document.querySelector('#chat-form').closest('section').append(panel);
 const status=panel.querySelector('#ai-status'), input=panel.querySelector('#ai-input'), send=panel.querySelector('#ai-form button'), log=panel.querySelector('#ai-log');
 let available=false,busy=false,history=[],controller=null;
 function controls(){input.disabled=!available||busy;send.disabled=!available||busy;}
 function message(text,role){const p=document.createElement('p');p.className=role==='user'?'chat-user':'chat-tutor';p.textContent=`${role==='user'?'Você':'Professor'}: ${text}`;log.append(p);log.scrollTop=log.scrollHeight;}
 async function init(){
  if(location.protocol==='file:'){status.textContent='Abra o aplicativo pelo servidor local para usar o professor. A prática guiada continua disponível.';return;}
  try{const response=await fetch('/api/status',{signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error();const data=await response.json();available=data.configured===true;status.textContent=available?'Professor disponível. Envie sua primeira mensagem.':'Professor ainda não configurado. A prática guiada continua disponível.';}catch{status.textContent='Servidor do professor indisponível. A prática guiada continua disponível.';}controls();
 }
 panel.querySelector('#ai-form').addEventListener('submit',async event=>{
  event.preventDefault();const text=input.value.trim();if(!text||busy||!available)return;
  busy=true;controls();status.textContent='O professor está preparando uma resposta…';controller=new AbortController();const current=controller;const timeout=setTimeout(()=>current.abort(),50000);
  try{
   const messages=[...history.slice(-18),{role:'user',content:text}];
   const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages}),signal:current.signal});const data=await response.json();
   if(!response.ok)throw Error(data.error||'Não foi possível obter uma resposta.');if(typeof data.reply!=='string'||!data.reply.trim())throw Error('Resposta inválida. Tente novamente.');
   history=[...messages,{role:'assistant',content:data.reply}];message(text,'user');message(data.reply,'assistant');input.value='';status.textContent='Sua vez. Continue a conversa.';
  }catch(error){if(current.signal.aborted)status.textContent='Solicitação interrompida. Sua mensagem permanece no campo.';else status.textContent=error.message||'Falha de conexão. Tente novamente.';}finally{clearTimeout(timeout);busy=false;controller=null;controls();}
 });
 panel.querySelector('#ai-clear').addEventListener('click',()=>{if(busy){status.textContent='Aguarde a resposta ou saia do módulo para interromper.';return;}history=[];log.replaceChildren();input.value='';status.textContent=available?'Nova conversa. Envie sua primeira mensagem.':'Professor ainda não configurado.';});
 document.addEventListener('studyia:navigate',()=>controller?.abort());init();
})();
