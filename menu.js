'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const sidebar=document.querySelector('.sidebar'),header=document.querySelector('header');sidebar.id='main-menu';
 const controls=document.createElement('div');controls.className='header-controls';controls.innerHTML='<button id="menu-toggle" class="icon-button" aria-controls="main-menu" aria-expanded="false" aria-label="Abrir menu">☰</button><a id="page-back" class="back-button" href="#home" aria-label="Voltar ao início">← <span>Voltar</span></a>';header.prepend(controls);
 const menuContent=document.createElement('div');menuContent.className='menu-content';menuContent.append(...sidebar.childNodes);sidebar.append(menuContent);sidebar.prepend(controls.querySelector('#menu-toggle'));
 const badge=document.createElement('a');badge.id='session-user';badge.href='#account';badge.className='session-user';badge.textContent='Visitante';header.append(badge);
 const backdrop=document.createElement('button');backdrop.className='menu-backdrop';backdrop.hidden=true;backdrop.tabIndex=-1;backdrop.setAttribute('aria-label','Fechar menu');document.body.append(backdrop);
 const toggle=document.querySelector('#menu-toggle'),mobile=matchMedia('(max-width:700px)');let expanded=false;
 sidebar.querySelectorAll('nav a').forEach(link=>{const name=link.querySelector('span')?.textContent||link.textContent.trim();link.setAttribute('aria-label',name);link.title=name;});
 function apply(){document.body.classList.toggle('menu-collapsed',!expanded);document.body.classList.toggle('menu-open',expanded&&mobile.matches);toggle.setAttribute('aria-expanded',String(expanded));toggle.setAttribute('aria-label',expanded?'Fechar menu':'Abrir menu');backdrop.hidden=!(expanded&&mobile.matches);menuContent.inert=mobile.matches&&!expanded;if(mobile.matches&&!expanded)menuContent.setAttribute('aria-hidden','true');else menuContent.removeAttribute('aria-hidden');}
 function close(){expanded=false;apply();toggle.focus();}
 toggle.addEventListener('click',()=>{expanded=!expanded;apply();if(expanded&&mobile.matches)sidebar.querySelector('nav a')?.focus();});backdrop.addEventListener('click',close);sidebar.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{if(mobile.matches)close();}));mobile.addEventListener('change',()=>{expanded=false;apply();});
 document.addEventListener('keydown',e=>{if(!expanded||!mobile.matches)return;if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const items=[toggle,...sidebar.querySelectorAll('a')],first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 function update(){document.querySelector('#page-back').hidden=!location.hash||location.hash==='#home';const user=globalThis.StudyAccount?.user?.();badge.textContent=user?`${user.name} · ${user.role==='admin'?'Admin':'Aluno'}`:'Visitante · Entrar';badge.title=user?user.email:'Entre para carregar seu progresso pessoal';}
 window.addEventListener('hashchange',update);document.addEventListener('studyia:account',update);apply();update();
});
