'use strict';
(function(root){
 const C=typeof module!=='undefined'?require('./curriculum.js'):root.StudyCurriculum;
 const A=typeof module!=='undefined'?require('./assessment.js'):root.StudyAssessment;
 function plan(state,progress={}){
  if(state.pending)return{kind:'placement',level:state.pending,id:`placement-${state.pending}`,href:`#exam?test=placement-${state.pending}`,label:'Definir meu nível →'};
  const level=A.currentLevel(state),lessons=C.lessons.filter(l=>l.level===level);
  for(const lesson of lessons){
   if(progress[lesson.id]?.length!==3)return{kind:'lesson',level,id:lesson.id,lesson,href:`#learning?lesson=${lesson.id}`,label:progress[lesson.id]?.length?'Retomar minha aula →':'Começar próxima aula →'};
   if(lesson.number%10===0&&!A.passed(state,level,lesson.number/10)){const id=`block-${level}-${String(lesson.number/10).padStart(2,'0')}`;return{kind:'exam',level,id,block:lesson.number/10,href:`#exam?test=${id}`,label:state.draft?.id===id?'Retomar minha prova →':'Fazer prova do bloco →'};}
  }
  return{kind:'complete',level,href:'#catalog',label:'Revisitar meu curso →'};
 }
 root.StudyCoursePlan={plan};if(typeof module!=='undefined')module.exports=root.StudyCoursePlan;
})(globalThis);
