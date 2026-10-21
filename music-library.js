'use strict';
(function(root){
 const policy={version:1,excluded:['drogas e uso de substâncias','morte e automutilação','sexo e conteúdo sexual','violência e ameaças','discriminação e discurso de ódio','palavrões e linguagem explícita','abuso e exploração'],note:'Revisar a versão completa: letra, tradução, áudio e alusões. Filtro de palavras não substitui a análise do contexto.'};
 const songs=[{
  id:'mary-lamb-celestianpower-2006',version:1,title:'Mary Had a Little Lamb',artist:'Celestianpower · voz sem acompanhamento',level:'A1',topic:'Animais e descrições',
  description:'Uma canção tradicional curta para reconhecer palavras, repetições e uma comparação em inglês.',
  audio:{path:'assets/music/mary-had-a-little-lamb.mp3',kind:'vocal',sha256:'4bf99fcfac983c6dbec36149870bbc57c5871b43e9e3cc057dac9502f786816c',originalSha256:'f21bb5cecf2e9a32ff0c67622c8c5001049f995abec5e8cce475aba7d9d21260'},
  rights:{status:'cleared',audio:'Domínio público por declaração do autor da gravação. Conversão para MP3 sem cortes nem mudança de conteúdo.',lyrics:'Texto tradicional do século XIX, em domínio público. Tradução didática própria.',source:'https://commons.wikimedia.org/wiki/File:Mary_Had_a_Little_Lamb.ogg',lyricsSource:'https://en.wikisource.org/wiki/Mary_Had_a_Little_Lamb'},
  lyrics:[
   {en:'Mary had a little lamb,',pt:'Mary tinha um pequeno cordeiro,'},
   {en:'Little lamb, little lamb,',pt:'Pequeno cordeiro, pequeno cordeiro,'},
   {en:'Mary had a little lamb,',pt:'Mary tinha um pequeno cordeiro,'},
   {en:'Its fleece was white as snow.',pt:'A lã dele era branca como a neve.'},
   {en:'And everywhere that Mary went,',pt:'E a todo lugar a que Mary ia,'},
   {en:'Mary went, Mary went,',pt:'Mary ia, Mary ia,'},
   {en:'And everywhere that Mary went,',pt:'E a todo lugar a que Mary ia,'},
   {en:'The lamb was sure to go.',pt:'O cordeiro certamente a acompanhava.'}
  ],
  vocabulary:[{en:'little',pt:'pequeno'},{en:'lamb',pt:'cordeiro'},{en:'fleece',pt:'lã do animal'},{en:'white',pt:'branco'},{en:'snow',pt:'neve'},{en:'everywhere',pt:'em todo lugar'}],
  explanation:'Little descreve o tamanho do cordeiro. White as snow compara a cor da lã à neve: branca como a neve. Você também ouve had, was e went, formas do passado de have, be e go. Nesta prática inicial, concentre-se no significado e nas repetições; não é necessário dominar todos esses verbos para acompanhar.',
  practice:{prompt:'Complete com a palavra para “neve”: Its fleece was white as _____.',answer:'snow',explanation:'Muito bem! Snow significa neve. White as snow = branca como a neve.'},
  review:{status:'approved-ai',version:1,policyVersion:1,date:'2026-10-21',note:'Letra e tradução analisadas por IA; conteúdo sobre um cordeiro acompanhando Mary. Transcrição local da gravação identifica somente as duas estrofes exibidas. Não foram identificadas referências aos temas excluídos. Revisão humana independente pendente.'}
 }];
 function published(song){return song.review?.status==='approved-ai'&&song.review.version===song.version&&song.review.policyVersion===policy.version&&song.rights?.status==='cleared'&&/^assets\/music\/[a-z0-9-]+\.mp3$/.test(song.audio?.path||'')&&song.lyrics?.length>0;}
 function list(){return songs.filter(published);}
 function search({query='',level='all'}={}){const normal=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();return list().filter(s=>(level==='all'||s.level===level)&&normal([s.title,s.artist,s.topic,...s.vocabulary.map(v=>v.en)].join(' ')).includes(normal(query.trim())));}
 const api={policy,songs,list,search,published};root.StudyMusicLibrary=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
