'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelector('#home .module-cards').remove();document.querySelector('#home .review-home').remove();
 document.querySelector('#home .hero h1').textContent='Seu próximo passo começa aqui.';
 document.querySelector('#home .hero > p:not(.eyebrow)').textContent='Aprenda, pratique e revise inglês no seu ritmo.';
 document.querySelector('#home .dashboard article:first-child small').textContent='PROGRESSO · UNIDADE 01';
 const themeBox=document.createElement('article');themeBox.className='connection-card';themeBox.innerHTML='<h3>Do seu jeito</h3><label for="appearance-theme">Aparência <select id="appearance-theme"><option value="system">Seguir o sistema</option><option value="light">Claro</option><option value="dark">Escuro</option></select></label><p id="appearance-status" role="status"></p>';
 document.querySelector('#settings-panel-0').append(themeBox);const media=matchMedia('(prefers-color-scheme: dark)');let theme='system';try{const saved=localStorage.getItem(StudyData.keys.appearance);if(saved)theme=StudyData.appearance(JSON.parse(saved));}catch{}
 const select=themeBox.querySelector('select');select.value=theme;
 function apply(){document.documentElement.dataset.theme=theme==='system'?(media.matches?'dark':'light'):theme;}
 select.addEventListener('change',()=>{theme=select.value;apply();try{localStorage.setItem(StudyData.keys.appearance,JSON.stringify(theme));themeBox.querySelector('#appearance-status').textContent='Aparência salva.';}catch{themeBox.querySelector('#appearance-status').textContent='A aparência foi aplicada apenas nesta sessão.';}});media.addEventListener('change',apply);apply();
 const hint=document.createElement('p');hint.id='next-step-hint';document.querySelector('#home .hero a').before(hint);
 function nextStep(){const link=document.querySelector('#home .hero a'),journey=StudyJourney.get();if(journey.pending){link.href='#exam?test=placement-'+journey.pending;link.textContent='Definir meu nível →';hint.textContent='Conclua o diagnóstico '+journey.pending+' para começar seu curso.';return;}const pending=Number(document.querySelector('#review-count').textContent);if(pending){link.href='#review';link.textContent='Revisar minhas dificuldades →';hint.textContent='Você tem '+pending+' itens pendentes de revisão.';return;}link.href='#catalog';link.textContent='Continuar meu curso →';hint.textContent='Nível estimado: '+StudyAssessment.currentLevel(journey)+'. Avance por aulas e provas com aprovação de 80%.';}
 document.addEventListener('studyia:progress',nextStep);document.addEventListener('studyia:journey',nextStep);for(const selector of ['#progress','#review-count'])new MutationObserver(nextStep).observe(document.querySelector(selector),{childList:true});nextStep();
});
