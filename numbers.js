'use strict';
(() => {
  const root = document.createElement('section'); root.id = 'numbers'; root.className = 'module lesson';
  root.innerHTML = `<p class="eyebrow">UNIDADE 02 / NÚMEROS E HORÁRIOS</p><h2>What time is it?</h2><p>Pratique números de um a doze e horários exatos. Use “It is” ou a forma curta “It's” para dizer a hora.</p><nav class="subnav" aria-label="Atividades de números"><button aria-pressed="true" aria-controls="numbers-learn">Aprender</button><button aria-pressed="false" aria-controls="numbers-practice">Exercitar</button></nav><div id="numbers-learn"><div id="number-cards" class="number-cards"></div><div class="clock-example"><div class="clock-face" aria-hidden="true"><span>12</span><span>3</span><span>6</span><span>9</span><i class="clock-hour"></i><i class="clock-minute"></i></div><div><h3>It's three o'clock.</h3><p>São três horas. “O'clock” indica uma hora exata, sem minutos.</p><button id="hear-time" class="button secondary">🔊 Ouvir exemplo</button></div></div><a class="button" href="#numbers" id="start-numbers">Praticar agora →</a></div><div id="numbers-practice" hidden><p id="numbers-counter" class="eyebrow"></p><h3 id="numbers-question"></h3><form id="numbers-form"><label for="numbers-answer">Escreva em inglês</label><input id="numbers-answer" required maxlength="100" autocomplete="off"><button class="button">Verificar</button></form><p id="numbers-feedback" role="status"></p><button id="numbers-next" class="button secondary" hidden>Continuar →</button><a id="numbers-finish" class="button" href="#units" hidden>Voltar à trilha →</a></div><p id="numbers-progress" class="muted" aria-live="polite"></p><button id="numbers-reset" class="reset">Reiniciar esta unidade</button><p id="numbers-storage" role="status"></p>`;
  document.querySelector('#reset').before(root);
  const words = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
  words.forEach((word, i) => { const button = document.createElement('button'); button.className = 'number-card'; button.setAttribute('aria-label', `Ouvir ${i + 1}: ${word}`); const number = document.createElement('strong'); number.textContent = i + 1; const name = document.createElement('span'); name.textContent = word; button.append(number, name); button.addEventListener('click', () => { pauseScene(); speak(word); }); root.querySelector('#number-cards').append(button); });
  root.querySelector('#hear-time').addEventListener('click', () => { pauseScene(); speak("It's three o'clock."); });
  const tabs = [...root.querySelectorAll('.subnav button')];
  function select(index) { pauseScene(); tabs.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index))); root.querySelector('#numbers-learn').hidden = index !== 0; root.querySelector('#numbers-practice').hidden = index !== 1; }
  tabs.forEach((button, i) => button.addEventListener('click', () => select(i)));
  root.querySelector('#start-numbers').addEventListener('click', event => { event.preventDefault(); select(1); });
  const exercises = [
    {question:'Escreva o número 7 em inglês.', answers:['seven'], hint:'O número 7 começa com “s”. Consulte os cartões na aba Aprender.', explanation:'Seven significa sete.'},
    {question:'Escreva o número 12 em inglês.', answers:['twelve'], hint:'O número 12 começa com “tw”. Volte aos cartões para ouvir e revisar.', explanation:'Twelve significa doze.'},
    {question:'Como dizer “São três horas” em inglês?', answers:["it's three o'clock", "it is three o'clock"], hint:'Use “It is” ou “It’s”, depois “three” e “o’clock”.', explanation:'It’s three o’clock. — São três horas exatas.'},
    {question:'Como dizer “São nove horas” em inglês?', answers:["it's nine o'clock", "it is nine o'clock"], hint:'Troque “three” por “nine” no exemplo da aula.', explanation:'It’s nine o’clock. — São nove horas exatas.'}
  ];
  const key = 'studyia.a1.numbers.v1'; let completed = [];
  try { const saved = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(saved)) completed = [...new Set(saved.filter(i => Number.isInteger(i) && i >= 0 && i < exercises.length))]; } catch { root.querySelector('#numbers-storage').textContent = 'Não foi possível recuperar o progresso. Você pode continuar.'; }
  let current = exercises.findIndex((_, i) => !completed.includes(i));
  const normalize = text => text.trim().toLowerCase().replace(/[’‘]/g, "'").replace(/[.!?]+$/g, '').replace(/\s+/g, ' ');
  function updateProgress() { root.querySelector('#numbers-progress').textContent = `${completed.length} de ${exercises.length} exercícios concluídos`; document.dispatchEvent(new CustomEvent('studyia:progress', {detail:{unit:'numbers',count:completed.length,total:exercises.length}})); }
  function save() { try { localStorage.setItem(key, JSON.stringify(completed)); } catch { root.querySelector('#numbers-storage').textContent = 'Não foi possível salvar no navegador. O progresso permanece nesta sessão.'; } }
  function render() {
    const done = current < 0; root.querySelector('#numbers-counter').textContent = done ? 'UNIDADE CONCLUÍDA' : `EXERCÍCIO ${current + 1} DE ${exercises.length}`;
    root.querySelector('#numbers-question').textContent = done ? 'Você praticou números e horários!' : exercises[current].question;
    root.querySelector('#numbers-form').hidden = done; root.querySelector('#numbers-finish').hidden = !done; root.querySelector('#numbers-next').hidden = true;
    root.querySelector('#numbers-feedback').textContent = done ? 'Pratique outras horas usando os números dos cartões. Esta atividade não é uma certificação de nível.' : '';
    root.querySelector('#numbers-answer').value = ''; root.querySelector('#numbers-answer').disabled = false; root.querySelector('#numbers-form button').disabled = false; updateProgress();
  }
  root.querySelector('#numbers-form').addEventListener('submit', event => {
    event.preventDefault(); if (current < 0 || completed.includes(current)) return;
    const answer = normalize(root.querySelector('#numbers-answer').value); if (!answer) return;
    const exercise = exercises[current]; const correct = exercise.answers.includes(answer);
    root.querySelector('#numbers-feedback').textContent = correct ? `Correto! ${exercise.explanation}` : `Ainda não. ${exercise.hint}`;
    if (correct) { completed.push(current); save(); updateProgress(); root.querySelector('#numbers-next').hidden = false; root.querySelector('#numbers-answer').disabled = true; root.querySelector('#numbers-form button').disabled = true; }
  });
  root.querySelector('#numbers-next').addEventListener('click', () => { current = exercises.findIndex((_, i) => !completed.includes(i)); render(); if (current >= 0) root.querySelector('#numbers-answer').focus(); });
  root.querySelector('#numbers-reset').addEventListener('click', () => { if (!confirm('Reiniciar os exercícios de números e horários?')) return; completed = []; current = 0; save(); render(); });
  render();
})();
