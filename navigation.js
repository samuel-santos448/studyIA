'use strict';
(() => {
  const main = document.querySelector('main');
  const hero = document.querySelector('.hero');
  const dashboard = document.querySelector('.dashboard');
  const lesson = document.querySelector('#lesson');
  const studio = document.querySelector('.media-lab');
  const conversation = document.querySelector('#chat-form').closest('section');
  const intro = [...main.querySelectorAll(':scope > .practice')].find(el => el !== studio && el !== conversation);
  intro?.remove();
  const home = document.createElement('section'); home.id = 'home'; home.className = 'module';
  main.prepend(home); home.append(hero, dashboard);
  hero.querySelector('a').href = '#lesson';
  const cards = document.createElement('div'); cards.className = 'module-cards';
  cards.innerHTML = `<a href="#lesson"><span class="tile-icon">Aa</span><small>APRENDA</small><h3>Sua primeira aula</h3><p>Exemplos e exercícios para se apresentar.</p><strong>Entrar na aula ↗</strong></a><a href="#studio"><span class="tile-icon orange">♫</span><small>EXPLORE</small><h3>Estúdio de prática</h3><p>Áudio, palavras e uma conversa animada.</p><strong>Abrir estúdio ↗</strong></a><a href="#conversation"><span class="tile-icon pink">✦</span><small>PRATIQUE</small><h3>Vamos conversar</h3><p>Pratique por texto ou grave sua voz.</p><strong>Iniciar prática ↗</strong></a>`;
  home.append(cards);
  const review=document.querySelector('#review');
  const reviewCard=document.createElement('article');reviewCard.className='review-home';reviewCard.innerHTML='<div><h3>Reforce o que você aprendeu</h3><p id="home-review-count">Nenhuma revisão pendente</p></div><a href="#review" class="button secondary">Revisar agora →</a>';home.append(reviewCard);
  const numbers = document.querySelector('#numbers');
  const units = document.createElement('section'); units.id = 'units'; units.className = 'module';
  units.innerHTML = `<p class="eyebrow">INGLÊS / NÍVEL A1</p><h2>Escolha seu próximo passo.</h2><p>As unidades estão disponíveis para estudar e revisar no seu ritmo.</p><div class="unit-list"><a class="unit-link" href="#lesson"><div><small>UNIDADE 01</small><h3>Hello, world!</h3><p>Saudações e apresentação pessoal</p></div><strong class="unit-count" id="unit-one-count"></strong></a><a class="unit-link" href="#numbers"><div><small>UNIDADE 02</small><h3>What time is it?</h3><p>Números de 1 a 12 e horários exatos</p></div><strong class="unit-count" id="unit-two-count"></strong></a></div>`;
  main.append(units);
  const vocabulary=document.querySelector('#vocabulary');const vocabularyLink=document.createElement('a');vocabularyLink.href='#vocabulary';vocabularyLink.className='button secondary';vocabularyLink.textContent='Explorar vocabulário e cartões →';units.querySelector('h2').after(vocabularyLink);
  const cafe=document.querySelector('#cafe');const cafeLink=document.createElement('a');cafeLink.className='unit-link';cafeLink.href='#cafe';cafeLink.innerHTML='<div><small>UNIDADE 03</small><h3>A coffee, please.</h3><p>Pedidos, agradecimentos e preços</p></div><strong class="unit-count" id="unit-cafe-count"></strong>';units.querySelector('.unit-list').append(cafeLink);
  function cafeCount(){document.querySelector('#unit-cafe-count').textContent=cafe.querySelector('.quiz-progress').textContent;}document.addEventListener('studyia:progress',cafeCount);cafeCount();
  const trail = dashboard.querySelector('article:last-child');
  trail.innerHTML = '<small>SUA TRILHA</small><h2>Três unidades para explorar</h2><p>Apresentação · Números e horários · Cafeteria</p><a href="#units" class="button secondary">Ver unidades →</a>';
  const lessonBack = document.createElement('a'); lessonBack.href = '#units'; lessonBack.className = 'reset'; lessonBack.textContent = '← Voltar à trilha'; lesson.prepend(lessonBack);
  const numbersBack = lessonBack.cloneNode(true); numbers.prepend(numbersBack);
  function updateUnitCounts() { document.querySelector('#unit-one-count').textContent = document.querySelector('#progress').textContent; document.querySelector('#unit-two-count').textContent = document.querySelector('#numbers-progress').textContent; }
  document.addEventListener('studyia:progress', updateUnitCounts);
  new MutationObserver(updateUnitCounts).observe(document.querySelector('#progress'), {childList:true});
  updateUnitCounts();
  studio.id = 'studio'; conversation.id = 'conversation';
  [lesson, studio, conversation].forEach(el => el.classList.add('module'));
  const settings = document.createElement('section'); settings.id = 'progress'; settings.className = 'module practice';
  // The existing progress heading keeps its ID; use a distinct route target.
  settings.id = 'settings'; settings.innerHTML = '<p class="eyebrow">SEU APRENDIZADO</p><h2>Progresso e preferências</h2><p>Seu progresso fica salvo neste navegador. Reiniciar limpa os exercícios da primeira aula.</p>';
  settings.append(document.querySelector('#reset'), document.querySelector('#storage-message')); main.append(settings);
  const sidebar = document.createElement('aside'); sidebar.className = 'sidebar';
  sidebar.innerHTML = `<a class="brand" href="#home">Study<span>IA</span><span class="brand-dot">✦</span></a><p class="sidebar-caption">SEU ESPAÇO DE APRENDIZADO</p><nav aria-label="Módulos"><a href="#home">⌂ <span>Início</span></a><a href="#lesson">▤ <span>Aula</span></a><a href="#studio">♫ <span>Estúdio</span></a><a href="#conversation">◌ <span>Conversação</span></a><a href="#settings">⚙ <span>Preferências</span></a></nav><div class="sidebar-note"><strong>Um passo por dia.</strong><p>Pequenas práticas, novas possibilidades.</p><span>INGLÊS · A1</span></div>`;
  document.body.prepend(sidebar);
  document.querySelector('header').innerHTML = '<div><small>SEU PRÓXIMO PASSO</small><strong id="module-title">Início</strong></div><span class="level-chip">🇬🇧 Inglês <b>A1</b></span>';
  function submodules(container, items) {
    const nav = document.createElement('nav'); nav.className = 'subnav'; nav.setAttribute('aria-label', 'Atividades do módulo');
    const panels = items.map(([title, nodes], index) => {
      const panel = document.createElement('div'); panel.id = `${container.id}-activity-${index}`; panel.className = 'activity-panel'; nodes.forEach(node => panel.append(node)); container.append(panel);
      const button = document.createElement('button'); button.textContent = title; button.setAttribute('aria-controls', panel.id); nav.append(button);
      button.addEventListener('click', () => { pauseScene(); document.dispatchEvent(new Event('studyia:navigate')); container.querySelectorAll('video,audio').forEach(media => media.pause()); select(index); });
      return {panel, button};
    });
    function select(index) { panels.forEach((entry, i) => { entry.panel.hidden = i !== index; entry.button.setAttribute('aria-pressed', String(i === index)); }); }
    container.querySelector('h2').after(nav); select(0);
  }
  submodules(lesson, [['Aprender', [lesson.querySelector('.examples')]], ['Exercitar', [lesson.querySelector('.exercise')]]]);
  const grid = studio.querySelector('.studio-grid'); const parts = [...grid.children];
  submodules(studio, [['Ouvir', [parts[0]]], ['Montar frases', [parts[1]]], ['Demonstração', [studio.querySelector('.mini-lesson')]], ['Vídeo', [studio.querySelector('.video-section')]], ['Desafio auditivo', [studio.querySelector('#listening-panel')]]]); grid.remove();
  const voice = document.createElement('div');
  const hr = conversation.querySelector('hr'); let node = hr.nextSibling;
  while (node) { const next = node.nextSibling; voice.append(node); node = next; } hr.remove();
  const chat = document.createElement('div');
  ['#chat-log','#chat-form','#chat-tip','#chat-restart'].forEach(selector => chat.append(conversation.querySelector(selector)));
  const aiPanel = voice.querySelector('#ai-panel');
  submodules(conversation, [['Por texto', [chat]], ['Minha voz', [voice]], ['Professor IA', [aiPanel]]]);
  sidebar.querySelector('nav a[href="#lesson"]').href = '#units';
  const reviewLink=document.createElement('a');reviewLink.href='#review';reviewLink.innerHTML='↻ <span>Revisão</span>';sidebar.querySelector('nav a[href="#settings"]').before(reviewLink);
  const modules = {home, units, lesson, numbers, cafe, vocabulary, studio, conversation, review, settings};
  const titles = {home:'Seu aprendizado',units:'Sua trilha de inglês',lesson:'Aula · Hello, world!',numbers:'Aula · Números e horários',cafe:'Aula · Na cafeteria',vocabulary:'Vocabulário e cartões',studio:'Estúdio de prática',conversation:'Conversação guiada',review:'Sua revisão',settings:'Progresso e preferências'};
  function route() {
    const key = location.hash.slice(1) || 'home'; const active = modules[key] ? key : 'home';
    pauseScene(); document.querySelectorAll('video,audio').forEach(media => media.pause()); document.dispatchEvent(new Event('studyia:navigate'));
    Object.entries(modules).forEach(([id, el]) => { el.hidden = id !== active; });
    const navigationKey = ['lesson','numbers','cafe','vocabulary'].includes(active) ? 'units' : active;
    sidebar.querySelectorAll('nav a').forEach(link => { if (link.hash === `#${navigationKey}`) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
    document.querySelector('#module-title').textContent = titles[active]; document.title = `${titles[active]} — StudyIA`; window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route); route();
})();
