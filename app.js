'use strict';
const exercises = [
  { question: 'Como você diz “Meu nome é Ana”?', options: ['My name is Ana.', 'Your name is Ana.', 'My Ana name.'], correct: 0, explanation: '“My name is…” significa “Meu nome é…”. Use essa estrutura para se apresentar.' },
  { question: 'Como perguntar o nome de outra pessoa?', options: ['Nice to meet you.', 'What is your name?', 'My name is what?'], correct: 1, explanation: '“What is your name?” significa “Qual é o seu nome?”. “Your” indica que estamos falando do nome da outra pessoa.' },
  { question: 'Você acabou de conhecer alguém. Qual frase significa “Prazer em conhecer você”?', options: ['Good night.', 'What is your name?', 'Nice to meet you.'], correct: 2, explanation: '“Nice to meet you” é uma expressão usada ao conhecer alguém.' }
];
const key = 'studyia.a1.introductions.v1';
let completed = [];
try { const saved = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(saved)) completed = [...new Set(saved.filter(n => Number.isInteger(n) && n >= 0 && n < exercises.length))]; } catch { document.querySelector('#storage-message').textContent = 'Não foi possível recuperar o progresso. Você pode continuar a aula.'; }
let current = exercises.findIndex((_, i) => !completed.includes(i));
function save() { try { localStorage.setItem(key, JSON.stringify(completed)); } catch { document.querySelector('#storage-message').textContent = 'O navegador não permitiu salvar. O progresso será mantido apenas enquanto esta página estiver aberta.'; } }
function render() {
  document.querySelector('#progress').textContent = `${completed.length} de 3 exercícios`;
  document.querySelector('#bar').value = completed.length;
  const done = current === -1;
  document.querySelector('#status').textContent = done ? 'Prática concluída. Experimente se apresentar em voz alta!' : 'Primeiro passo: apresentar-se.';
  document.querySelector('#counter').textContent = done ? 'AULA CONCLUÍDA' : `EXERCÍCIO ${current + 1} DE 3`;
  document.querySelector('#question').textContent = done ? 'Você praticou sua primeira apresentação!' : exercises[current].question;
  document.querySelector('#answer-form').hidden = done;
  document.querySelector('#next').hidden = true;
  document.querySelector('#feedback').textContent = done ? 'Revise os exemplos e use seu próprio nome. Esta atividade é uma prática inicial, não uma avaliação completa de nível.' : '';
  const choices = document.querySelector('#choices');
  choices.replaceChildren();
  if (!done) exercises[current].options.forEach((option, i) => { const label = document.createElement('label'); const input = document.createElement('input'); input.type = 'radio'; input.name = 'answer'; input.value = i; input.required = true; label.append(input, document.createTextNode(option)); choices.append(label); });
}
document.querySelector('#answer-form').addEventListener('submit', event => {
  event.preventDefault();
  const answer = new FormData(event.currentTarget).get('answer');
  if (current < 0 || answer === null) return;
  const correct = Number(answer) === exercises[current].correct;
  document.querySelector('#feedback').textContent = correct ? `Correto! ${exercises[current].explanation}` : 'Tente novamente. Consulte os exemplos acima e observe de quem estamos falando.';
  if (correct) { if (!completed.includes(current)) completed.push(current); save(); document.querySelector('#progress').textContent = `${completed.length} de 3 exercícios`; document.querySelector('#bar').value = completed.length; document.querySelector('#next').hidden = false; }
});
document.querySelector('#next').addEventListener('click', () => { current = exercises.findIndex((_, i) => !completed.includes(i)); render(); document.querySelector('#question').tabIndex = -1; document.querySelector('#question').focus(); });
document.querySelector('#reset').addEventListener('click', () => { if (!confirm('Reiniciar os exercícios desta aula?')) return; completed = []; current = 0; save(); render(); });
render();
