'use strict';
(() => {
  const panel = document.createElement('section'); panel.className = 'practice';
  panel.innerHTML = `<p class="eyebrow">PRÁTICA GUIADA · SEM IA</p><h2>Vamos conversar?</h2><p>Pratique uma apresentação com um roteiro. As respostas são programadas e não avaliam sua pronúncia.</p><div id="chat-log" role="log" aria-live="polite"></div><form id="chat-form"><label for="chat-input">Sua resposta em inglês</label><input id="chat-input" maxlength="160" required autocomplete="off" placeholder="My name is…"><button class="button">Enviar resposta</button></form><p id="chat-tip" role="status"></p><button id="chat-restart" class="reset">Recomeçar conversa</button><hr><h3>Ouça sua própria voz</h3><p>Grave até 60 segundos para comparar com os exemplos. A gravação não é enviada nem salva ao fechar a página.</p><button id="record-start" class="button">Gravar minha voz</button><button id="record-stop" class="button secondary" disabled>Parar gravação</button><p id="record-status" role="status"></p><audio id="record-audio" controls hidden></audio><button id="record-delete" class="reset" hidden>Excluir gravação</button>`;
  document.querySelector('#reset').before(panel);
  let step = 0;
  const log = panel.querySelector('#chat-log');
  const input = panel.querySelector('#chat-input');
  const tip = panel.querySelector('#chat-tip');
  function message(text, author) { const p = document.createElement('p'); p.className = author === 'Você' ? 'chat-user' : 'chat-tutor'; p.textContent = `${author}: ${text}`; log.append(p); }
  function restart() { step = 0; log.replaceChildren(); message('Hello! My name is Ana. What is your name?', 'Guia'); input.disabled = false; panel.querySelector('#chat-form button').disabled = false; input.value = ''; tip.textContent = 'Dica: comece com “My name is” ou “I am”.'; }
  panel.querySelector('#chat-form').addEventListener('submit', event => {
    event.preventDefault(); const text = input.value.trim(); if (!text || step > 2) return;
    message(text, 'Você'); input.value = '';
    if (step === 0) {
      const match = text.match(/^(?:my name is|i am|i'm|i’m)\s+(.+?)[.!]?$/i);
      if (!match) { message('Para este exercício, tente “My name is” seguido do seu nome.', 'Guia'); return; }
      message(`Nice to meet you, ${match[1]}! Agora pergunte meu nome em inglês.`, 'Guia'); tip.textContent = 'Dica: What is your name?'; step++;
    } else if (step === 1) {
      if (!/^(what is|what's|what’s) your name[?.!]*$/i.test(text)) { message('Tente “What is your name?” para praticar a pergunta da aula.', 'Guia'); return; }
      message('My name is Ana. Responda “Prazer em conhecer você” em inglês.', 'Guia'); tip.textContent = 'Dica: Nice to meet you.'; step++;
    } else {
      if (!/^nice to meet you(?: too)?[.!]*$/i.test(text)) { message('Nesta etapa, pratique “Nice to meet you”.', 'Guia'); return; }
      message('Nice to meet you too! Você completou a conversa guiada.', 'Guia'); tip.textContent = 'Conversa concluída. Recomece para praticar de novo.'; step++; input.disabled = true; panel.querySelector('#chat-form button').disabled = true;
    }
  });
  panel.querySelector('#chat-restart').addEventListener('click', restart);
  const start = panel.querySelector('#record-start'), stop = panel.querySelector('#record-stop'), status = panel.querySelector('#record-status'), audio = panel.querySelector('#record-audio'), remove = panel.querySelector('#record-delete');
  let stream, recorder, url, timer, requesting = false, disposed = false;
  function deleteRecording() { audio.pause(); audio.removeAttribute('src'); audio.load(); audio.hidden = true; remove.hidden = true; if (url) URL.revokeObjectURL(url); url = null; }
  function release() { clearTimeout(timer); stream?.getTracks().forEach(track => track.stop()); stream = null; }
  function stopRecording() { if (recorder?.state === 'recording') recorder.stop(); release(); stop.disabled = true; }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { start.disabled = true; status.textContent = 'Gravação indisponível. Use HTTPS ou localhost em um navegador compatível. Você pode continuar por texto.'; }
  start.addEventListener('click', async () => {
    if (requesting || recorder?.state === 'recording') return;
    requesting = true; start.disabled = true; status.textContent = 'Aguardando permissão do microfone…';
    try {
      pauseScene(); stream = await navigator.mediaDevices.getUserMedia({audio:true});
      if (disposed) { release(); return; }
      deleteRecording(); const chunks = []; recorder = new MediaRecorder(stream);
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => { release(); start.disabled = false; stop.disabled = true; if (!disposed && chunks.length) { url = URL.createObjectURL(new Blob(chunks, {type:recorder.mimeType})); audio.src = url; audio.hidden = false; remove.hidden = false; status.textContent = 'Gravação pronta. Ouça e compare com os exemplos.'; } };
      recorder.onerror = () => { stopRecording(); start.disabled = false; status.textContent = 'A gravação foi interrompida. Tente novamente.'; };
      recorder.start(); stop.disabled = false; status.textContent = 'Gravando… Clique em Parar quando terminar (limite de 60 segundos).'; timer = setTimeout(stopRecording, 60000);
    } catch { release(); start.disabled = false; status.textContent = 'Não foi possível acessar o microfone. Confira a permissão no navegador ou continue por texto.'; }
    finally { requesting = false; }
  });
  stop.addEventListener('click', stopRecording); remove.addEventListener('click', () => { deleteRecording(); status.textContent = 'Gravação excluída.'; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopRecording(); });
  window.addEventListener('pagehide', () => { disposed = true; stopRecording(); deleteRecording(); });
  document.addEventListener('studyia:navigate', stopRecording);
  restart();
})();
