'use strict';
const audioStatus = document.querySelector('#audio-status');
let sceneTimer = null;
let sceneIndex = 0;
let videoURL = null;
const dialogue = [
  ['Hello!', 'Olá!'], ['My name is Ana.', 'Meu nome é Ana.'],
  ['What is your name?', 'Qual é o seu nome?'], ['My name is Samuel.', 'Meu nome é Samuel.'],
  ['Nice to meet you.', 'Prazer em conhecer você.']
];
function stopAudio() { globalThis.StudyNaturalVoice?.stop(); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); audioStatus.textContent = ''; }
function speak(text, lang = globalThis.StudyLanguage?.speech||'en-US', onEnd) {
  if(globalThis.StudyNaturalVoice?.enabled()){stopAudio();StudyNaturalVoice.play(text,lang,Number(document.querySelector('#speed').value),onEnd,audioStatus);return;}
  if (!('speechSynthesis' in window)) { audioStatus.textContent = 'Áudio indisponível neste navegador. Use os textos da aula.'; if (onEnd) onEnd(); return; }
  stopAudio();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.toLowerCase() === lang.toLowerCase()) || voices.find(v => v.lang.startsWith(lang.slice(0, 2)));
  if (voice) utterance.voice = voice;
  utterance.rate = Number(document.querySelector('#speed').value);
  utterance.onstart = () => { audioStatus.textContent = 'Reproduzindo áudio…'; };
  utterance.onend = () => { audioStatus.textContent = ''; if (onEnd) onEnd(); };
  utterance.onerror = event => { if (event.error !== 'canceled' && event.error !== 'interrupted') audioStatus.textContent = 'Não foi possível reproduzir. A disponibilidade das vozes depende do navegador.'; };
  speechSynthesis.speak(utterance);
}
function pauseScene() { clearTimeout(sceneTimer); sceneTimer = null; stopAudio(); document.querySelector('#scene-play').disabled = false; }
document.querySelectorAll('.examples article').forEach(article => {
  const phrase = article.querySelector('strong').textContent;
  const button = document.createElement('button'); button.className = 'listen'; button.textContent = '🔊 Ouvir'; button.setAttribute('aria-label', `Ouvir ${phrase}`);
  button.addEventListener('click', () => { pauseScene(); speak(phrase); }); article.append(button);
});
document.querySelector('#explain').addEventListener('click', () => { pauseScene(); speak('Nesta aula, você aprende a se apresentar. Comece com uma saudação. Depois diga seu nome. Para perguntar o nome da outra pessoa, use a pergunta dos exemplos. Ao conhecer alguém, finalize com a expressão de prazer em conhecer você. Ouça cada exemplo em inglês e repita no seu ritmo.', 'pt-BR'); });
document.querySelector('#stop-audio').addEventListener('click', pauseScene);
let selectedWords = [];
const words = ['Ana.', 'is', 'My', 'name'];
function renderWords() {
  const bank = document.querySelector('#word-bank'); bank.replaceChildren();
  words.forEach((word, i) => { const button = document.createElement('button'); button.className = 'word'; button.textContent = word; button.disabled = selectedWords.includes(i); button.addEventListener('click', () => { selectedWords.push(i); document.querySelector('#sentence-feedback').textContent = ''; renderWords(); }); bank.append(button); });
  document.querySelector('#sentence').textContent = selectedWords.map(i => words[i]).join(' ') || 'Sua frase aparece aqui…';
}
document.querySelector('#clear-sentence').addEventListener('click', () => { selectedWords = []; document.querySelector('#sentence-feedback').textContent = ''; renderWords(); });
document.querySelector('#check-sentence').addEventListener('click', () => { const correct = selectedWords.map(i => words[i]).join(' ') === 'My name is Ana.'; document.querySelector('#sentence-feedback').textContent = correct ? 'Muito bem! My name is Ana. — Meu nome é Ana.' : 'Tente começar com “My”, seguido de “name”. Limpe a frase para tentar novamente.'; if (correct) { pauseScene(); speak('My name is Ana.'); } });
function renderScene() { document.querySelector('#scene-text').textContent = dialogue[sceneIndex][0]; document.querySelector('#scene-translation').textContent = dialogue[sceneIndex][1]; document.querySelector('.avatar').textContent = sceneIndex % 2 ? '🧑' : '🙂'; }
function playScene() {
  renderScene(); speak(dialogue[sceneIndex][0], 'en-US', () => { sceneTimer = setTimeout(() => { if (sceneIndex < dialogue.length - 1) { sceneIndex++; playScene(); } else { pauseScene(); } }, 1400); });
}
document.querySelector('#scene-play').addEventListener('click', () => { pauseScene(); sceneIndex = 0; document.querySelector('#scene-play').disabled = true; playScene(); });
document.querySelector('#scene-stop').addEventListener('click', pauseScene);
document.querySelector('#scene-next').addEventListener('click', () => { pauseScene(); sceneIndex = (sceneIndex + 1) % dialogue.length; renderScene(); });
const video = document.querySelector('#lesson-video');
document.querySelector('#video-file').addEventListener('change', event => {
  const file = event.target.files[0]; if (!file) return;
  pauseScene(); video.pause(); video.removeAttribute('src'); video.load();
  if (videoURL) { URL.revokeObjectURL(videoURL); videoURL = null; }
  if (!file.type.startsWith('video/')) { video.hidden = true; document.querySelector('#video-status').textContent = 'Escolha um arquivo de vídeo compatível com seu navegador.'; return; }
  videoURL = URL.createObjectURL(file); video.src = videoURL; video.hidden = false; document.querySelector('#video-status').textContent = `Vídeo local: ${file.name}`;
});
video.addEventListener('error', () => { document.querySelector('#video-status').textContent = 'Este formato não pôde ser reproduzido. Experimente um MP4 compatível com seu navegador.'; });
video.addEventListener('play', pauseScene);
window.addEventListener('pagehide', () => { pauseScene(); if (videoURL) URL.revokeObjectURL(videoURL); });
renderWords();
