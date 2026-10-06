'use strict';
(() => {
 const panel=document.createElement('div');panel.id='ai-panel';
 panel.innerHTML='<h3>Converse com seu professor</h3><p>Pratique inglês A1 com perguntas livres. Ao enviar, o texto e o contexto recente da conversa são processados pela OpenAI. A IA pode cometer erros.</p><p id="ai-status" role="status">Verificando disponibilidade…</p><div id="ai-log" role="log" aria-live="polite"></div><form id="ai-form"><label for="ai-input">Sua mensagem</label><input id="ai-input" maxlength="1000" autocomplete="off" required disabled placeholder="Hello! I want to practice English."><button class="button" disabled>Enviar ao professor</button></form><button id="ai-clear" class="reset">Nova conversa</button>';
 document.querySelector('#chat-form').closest('section').append(panel);
 const tools=document.createElement('div');tools.className='ai-tools';
 tools.innerHTML='<label for="ai-topic">Tema da prática <select id="ai-topic"><option value="introductions">Apresentação pessoal</option><option value="numbers">Números e horários</option><option value="cafe">Na cafeteria</option></select></label><p id="ai-goal" class="muted"></p><div id="ai-suggestions" class="word-bank" aria-label="Sugestões para começar"></div><label for="ai-voice-language">Idioma para ouvir a resposta <select id="ai-voice-language"><option value="en-US">Inglês</option><option value="pt-BR">Português</option></select></label><button id="ai-stop-speech" class="reset">Parar leitura</button>';
 panel.querySelector('#ai-status').before(tools);
 const status=panel.querySelector('#ai-status'), input=panel.querySelector('#ai-input'), send=panel.querySelector('#ai-form button'), log=panel.querySelector('#ai-log');
 let available=false,busy=false,history=[],controller=null;
 const topic=panel.querySelector('#ai-topic');
 const starters={introductions:['Hello! My name is Samuel.','Can we practice introductions?'],numbers:['What time is it?','Can we practice numbers?'],cafe:['I would like a coffee, please.','Can we practice ordering at a cafe?']};
 const goals={introductions:'Objetivo: apresentar-se e fazer perguntas sobre o nome.',numbers:'Objetivo: usar números e dizer horários exatos.',cafe:'Objetivo: fazer um pedido simples e agradecer.'};
 function controls(){input.disabled=!available||busy;send.disabled=!available||busy;topic.disabled=busy||history.length>0;panel.querySelectorAll('#ai-suggestions button').forEach(button=>button.disabled=!available||busy);}
 function suggestions(){const container=panel.querySelector('#ai-suggestions');container.replaceChildren();panel.querySelector('#ai-goal').textContent=goals[topic.value];starters[topic.value].forEach(text=>{const button=document.createElement('button');button.className='word';button.textContent=text;button.addEventListener('click',()=>{input.value=text;input.focus();});container.append(button);});controls();}
 topic.addEventListener('change',suggestions);panel.querySelector('#ai-stop-speech').addEventListener('click',pauseScene);
 function connectionStatus(){const target=document.querySelector('#ai-connection');if(target)target.textContent=available?'Configurado para conversar. A conexão real será verificada ao enviar uma mensagem.':'Professor indisponível. Você pode continuar nas aulas e na prática guiada.';}
 function message(text,role){const p=document.createElement('article');p.className=role==='user'?'chat-user':'chat-tutor';const content=document.createElement('p');content.textContent=`${role==='user'?'Você':'Professor'}: ${text}`;p.append(content);if(role==='assistant'){const button=document.createElement('button');button.className='listen';button.textContent='🔊 Ouvir resposta';button.addEventListener('click',()=>{pauseScene();speak(text,panel.querySelector('#ai-voice-language').value);});p.append(button);}log.append(p);log.scrollTop=log.scrollHeight;}
 async function init(){
  if(location.protocol==='file:'){status.textContent='Abra o aplicativo pelo servidor local para usar o professor. A prática guiada continua disponível.';connectionStatus();return;}
  try{const response=await fetch('/api/status',{signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error();const data=await response.json();available=data.configured===true;status.textContent=available?'Professor configurado. Envie sua primeira mensagem.':'Professor ainda não configurado. A prática guiada continua disponível.';}catch{available=false;status.textContent='Servidor do professor indisponível. A prática guiada continua disponível.';}controls();connectionStatus();
 }
 panel.querySelector('#ai-form').addEventListener('submit',async event=>{
  event.preventDefault();const text=input.value.trim();if(!text||busy||!available)return;
  busy=true;controls();status.textContent='O professor está preparando uma resposta…';controller=new AbortController();const current=controller;const timeout=setTimeout(()=>current.abort(),50000);
  try{
   const messages=[...history.slice(-18),{role:'user',content:text}];
   const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages,topic:topic.value}),signal:current.signal});const data=await response.json();
   if(!response.ok)throw Error(data.error||'Não foi possível obter uma resposta.');if(typeof data.reply!=='string'||!data.reply.trim())throw Error('Resposta inválida. Tente novamente.');
   history=[...messages,{role:'assistant',content:data.reply}];document.dispatchEvent(new CustomEvent('studyia:activity',{detail:{token:'ai-'+crypto.randomUUID()}}));message(text,'user');message(data.reply,'assistant');input.value='';status.textContent='Sua vez. Continue a conversa.';
  }catch(error){if(current.signal.aborted)status.textContent='Solicitação interrompida. Sua mensagem permanece no campo.';else status.textContent=error.message||'Falha de conexão. Tente novamente.';}finally{clearTimeout(timeout);busy=false;controller=null;controls();}
 });
 panel.querySelector('#ai-clear').addEventListener('click',()=>{if(busy){status.textContent='Aguarde a resposta ou saia do módulo para interromper.';return;}pauseScene();history=[];log.replaceChildren();input.value='';status.textContent=available?'Nova conversa. Escolha um tema e envie sua primeira mensagem.':'Professor ainda não configurado.';controls();});
 document.addEventListener('DOMContentLoaded',()=>{const settings=document.querySelector('#settings');const box=document.createElement('article');box.className='connection-card';box.innerHTML='<h3>Professor IA</h3><p id="ai-connection" role="status"></p><button id="ai-check" class="button secondary">Verificar disponibilidade</button><p class="muted">A prática guiada funciona mesmo quando o professor está indisponível.</p>';settings.append(box);box.querySelector('#ai-check').addEventListener('click',async()=>{const button=box.querySelector('#ai-check');button.disabled=true;document.querySelector('#ai-connection').textContent='Verificando…';try{await init();}finally{button.disabled=false;}});connectionStatus();});
 document.addEventListener('studyia:navigate',()=>controller?.abort());suggestions();init();
})();
