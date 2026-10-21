'use strict';
(function(root){
 function build(lesson){
  if(!lesson?.depth||!lesson.id?.match(/^(A1|A2|B1|B2|C1|C2)-/))return null;
  const focus=lesson.vocabulary.find(v=>lesson.title.endsWith(': '+v.en))||lesson.vocabulary[0];
  const related=lesson.depth.reading.find(r=>r.en!==lesson.example.en&&r.en!==lesson.depth.context[0]);
  const turn=(speaker,text,translation='',lang='pt-BR')=>({speaker,text,translation,lang});
  const exchanges={
   'My name is Ana.':['Hello! What is your name?','Olá! Qual é o seu nome?','Nice to meet you, Ana!','Prazer em conhecer você, Ana!'],
   'I am from Brazil.':['Where are you from?','De onde você é?','Brazil! Which city are you from?','Brasil! De qual cidade você é?'],
   'Nice to meet you.':['Hello! My name is Sam.','Olá! Meu nome é Sam.','Nice to meet you too!','Prazer em conhecer você também!'],
   'I am twenty years old.':['How old are you?','Quantos anos você tem?','And when is your birthday?','E quando é seu aniversário?'],
   'I would like a coffee.':['Hello! What would you like?','Olá! O que você gostaria de pedir?','Of course. Would you like milk?','Claro. Você gostaria de leite?'],
   'Coffee with milk, please.':['Would you like your coffee black or with milk?','Você gostaria do café puro ou com leite?','Sure! Anything else?','Claro! Mais alguma coisa?'],
   'I am happy.':['How are you feeling today?','Como você está se sentindo hoje?','That is good to hear!','Que bom saber disso!'],
   'I need a ticket.':['Hello! How can I help you?','Olá! Como posso ajudar?','Where would you like to go?','Para onde você gostaria de ir?']
  };
  const exchange=exchanges[lesson.example.en]||['How would you say that in English?','Como você diria isso em inglês?',"Good. Let's look at how that sentence works.",'Bem. Vamos entender como essa frase funciona.'];
  return {title:lesson.topic,objective:lesson.objective,turns:[
   turn('teacher',`Vamos praticar? ${lesson.depth.context[1]}`),
   turn('teacher',exchange[0],exchange[1],'en-US'),
   turn('student',lesson.example.en,lesson.example.pt,'en-US'),
   turn('teacher',exchange[2],exchange[3],'en-US'),
   turn('teacher',`Isso significa: ${lesson.example.pt} Aqui, “${focus.en}” significa “${focus.pt}”.`),
   turn('teacher',`${lesson.depth.grammar.explanation}`),
   ...(related?[turn('teacher','Vamos comparar com outro exemplo do mesmo tema.'),turn('student',related.en,related.pt,'en-US')]:[]),
   turn('teacher','Agora é sua vez: repita o exemplo e adapte uma informação para falar de você. Pode voltar às falas e ouvir quantas vezes quiser.')
  ]};
 }
 const api={build};root.StudyLessonStory=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
