'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelector('#home .module-cards').remove();document.querySelector('#home .review-home').remove();
 document.querySelector('#home .hero h1').textContent='Seu próximo passo começa aqui.';
 document.querySelector('#home .hero > p:not(.eyebrow)').textContent='Aprenda, pratique e revise inglês no seu ritmo.';
 const dashboard=document.querySelector('#home .dashboard');dashboard.hidden=true;
 const courseHome=document.createElement('section');courseHome.className='dashboard';courseHome.setAttribute('aria-label','Seu curso atual');courseHome.innerHTML='<article><small id="home-course-level"></small><h2 id="home-course-count"></h2><progress id="home-course-bar" max="150" value="0" aria-label="Aulas concluídas no nível"></progress><p id="home-course-tests"></p></article><article><small>PRÓXIMA ATIVIDADE</small><h2 id="home-course-title"></h2><p id="home-course-detail"></p><a href="#catalog" class="reset">Explorar todas as aulas →</a></article>';dashboard.after(courseHome);
 document.querySelector('#home .hero').after(courseHome);
 const shortcuts=document.createElement('nav');shortcuts.className='home-shortcuts';shortcuts.setAttribute('aria-label','Práticas complementares');shortcuts.innerHTML='<a class="button secondary" href="#dictionary">Dicionário bilíngue</a><a class="button secondary" href="#vocabulary">Vocabulário e cartões</a><a class="button secondary" href="#conversation">Conversar com IA</a><a class="button secondary" href="#review" id="home-review-link">Revisar dificuldades</a>';courseHome.after(shortcuts);
 const themeBox=document.createElement('article');themeBox.className='connection-card';themeBox.innerHTML='<h3>Do seu jeito</h3><label for="appearance-theme">Aparência <select id="appearance-theme"><option value="system">Seguir o sistema</option><option value="light">Claro</option><option value="dark">Escuro</option></select></label><p id="appearance-status" role="status"></p>';
 document.querySelector('#settings-panel-0').append(themeBox);const media=matchMedia('(prefers-color-scheme: dark)');let theme='system';try{const saved=localStorage.getItem(StudyData.keys.appearance);if(saved)theme=StudyData.appearance(JSON.parse(saved));}catch{}
 const select=themeBox.querySelector('select');select.value=theme;
 function apply(){document.documentElement.dataset.theme=theme==='system'?(media.matches?'dark':'light'):theme;}
 select.addEventListener('change',()=>{theme=select.value;apply();try{localStorage.setItem(StudyData.keys.appearance,JSON.stringify(theme));themeBox.querySelector('#appearance-status').textContent='Aparência salva.';}catch{themeBox.querySelector('#appearance-status').textContent='A aparência foi aplicada apenas nesta sessão.';}});media.addEventListener('change',apply);apply();
 const hint=document.createElement('p');hint.id='next-step-hint';document.querySelector('#home .hero a').before(hint);
 function nextStep(){
  const link=document.querySelector('#home .hero a'),journey=StudyJourney.get();let progress={};try{progress=StudyData.curriculum(JSON.parse(localStorage.getItem(StudyData.keys.curriculum)||'{}'));}catch{}
  const next=StudyCoursePlan.plan(journey,progress),level=next.level;link.href=next.href;link.textContent=next.label;
  const count=StudyCurriculum.lessons.filter(l=>l.level===level&&progress[l.id]?.length===3).length;
  courseHome.querySelector('#home-course-level').textContent=journey.pending?'DIAGNÓSTICO · '+level:'SEU CURSO · '+level;
  courseHome.querySelector('#home-course-count').textContent=journey.pending?'Vamos definir seu ponto de partida':`${count} de 150 aulas concluídas`;
  courseHome.querySelector('#home-course-bar').value=count;courseHome.querySelector('#home-course-bar').hidden=!!journey.pending;
  const approved=Array.from({length:15},(_,i)=>StudyAssessment.passed(journey,level,i+1)).filter(Boolean).length;
  courseHome.querySelector('#home-course-tests').textContent=journey.pending?'O resultado define seu nível de entrada.':`${approved} de 15 provas aprovadas · mínimo de 80% por prova`;
  let title,detail;
  if(next.kind==='placement'){title='Diagnóstico '+level;detail='Responda às dez questões para começar no nível adequado.';}
  else if(next.kind==='lesson'){title=`Aula ${next.lesson.number} · ${next.lesson.title}`;detail=`${progress[next.id]?.length||0} de 3 etapas concluídas · ${next.lesson.topic}`;}
  else if(next.kind==='exam'){title=`Prova do bloco ${next.block} · ${level}`;const answered=journey.draft?.id===next.id?journey.draft.marks.filter(m=>m!==null).length:0;detail=`${answered} de 10 questões respondidas. Aprove para liberar o próximo bloco.`;}
  else{title='Curso concluído';detail='Você pode revisitar as aulas e continuar suas práticas.';}
  courseHome.querySelector('#home-course-title').textContent=title;courseHome.querySelector('#home-course-detail').textContent=detail;hint.textContent=detail;
  const pending=Number(document.querySelector('#review-count').textContent)||0;document.querySelector('#home-review-link').textContent=pending?`Revisar dificuldades (${pending})`:'Revisar dificuldades';
 }
 document.addEventListener('studyia:progress',nextStep);document.addEventListener('studyia:journey',nextStep);document.addEventListener('studyia:server-state',nextStep);window.addEventListener('focus',nextStep);for(const selector of ['#progress','#review-count'])new MutationObserver(nextStep).observe(document.querySelector(selector),{childList:true});nextStep();
});
