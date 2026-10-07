'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const target=document.querySelector('#learning-learn');
 if(!target)return;
 const container=document.createElement('div');container.id='lesson-depth';target.append(container);
 const add=(tag,text,parent=container)=>{const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;};
 const render=()=>{
  container.replaceChildren();const id=new URLSearchParams(location.hash.split('?')[1]||'').get('lesson');
  const lesson=StudyCurriculum.get(id),d=lesson?.depth;if(!d||!location.hash.startsWith('#learning'))return;
  const section=title=>{const a=document.createElement('article');a.className='lesson-depth-card';container.append(a);add('h3',title,a);return a;};
  let a=section('Na vida real');add('p',d.context[1],a);add('p',d.usage,a);
  a=section('Leitura em contexto');add('p','Leia a situação e os exemplos relacionados. Observe como cada frase cumpre uma intenção diferente.',a);
  d.reading.forEach(row=>{const p=add('p',row.en,a);p.lang='en';add('p',row.pt,a).className='muted';});
  const listen=add('button','Ouvir a leitura',a);listen.className='button secondary';listen.onclick=()=>{pauseScene();speak(d.reading.map(r=>r.en).join(' '));};
  a=section(d.grammar.title);add('p',d.grammar.explanation,a);add('blockquote',d.grammar.example,a);add('h4','Atenção ao erro comum',a);add('p',d.grammar.trap,a);
  a=section('Pronúncia e ritmo');add('p',d.pronunciation,a);add('p','Ouça o exemplo, repita em grupos de palavras e depois fale sem o áudio. Essas orientações não geram nota de pronúncia.',a);
  a=section('Pratique além das alternativas');d.practice.forEach((text,i)=>add('p',`${i+1}. ${text}`,a));
  const label=add('label','Rascunho para praticar',a),text=document.createElement('textarea');text.rows=5;text.maxLength=2000;label.append(text);
  add('p','Este rascunho é livre e não é enviado nem salvo. Use o professor IA para discutir sua resposta.',a).className='muted';
 };
 window.addEventListener('hashchange',render);document.addEventListener('studyia:language',render);render();
});
