'use strict';
(function(root){
 const irregular={take:['took','taken'],draw:['drew','drawn'],come:['came'],find:['found'],make:['made'],give:['gave','given'],get:['got','gotten'],run:['ran'],keep:['kept'],bring:['brought'],go:['went','gone'],say:['said'],think:['thought'],feel:['felt'],meet:['met'],spend:['spent'],leave:['left'],lose:['lost'],win:['won'],grow:['grew','grown']};
 irregular.fall=['fell','fallen'];irregular.be=['am','is','are','was','were','been'];
 const normalise=text=>String(text).toLowerCase().replace(/[’‘]/g,"'").replace(/\bi'm\b/g,'i am').replace(/\byou're\b/g,'you are').replace(/\bwe're\b/g,'we are').replace(/\bthey're\b/g,'they are').replace(/[^a-z0-9'-]+/g,' ').trim();
 function variants(term){const words=normalise(term).split(' ');const first=words[0];const stems=new Set([first,...(irregular[first]||[])]);if(first.length>2){stems.add(first+'s');stems.add(first+'ed');stems.add(first+'ing');if(first.endsWith('e')){stems.add(first+'d');stems.add(first.slice(0,-1)+'ing');}if(/[^aeiou]y$/.test(first)){stems.add(first.slice(0,-1)+'ies');stems.add(first.slice(0,-1)+'ied');}}return [...stems].map(stem=>[stem,...words.slice(1)].join(' '));}
 const separable=new Set(['call back','bring up','take over','sort out','find out','set up','back up','give up','cut back','take out of context','draw attention to']);
 function forms(term){const result=variants(term);for(const variant of [...result]){const words=variant.split(' ');if(['a','an','the'].includes(words[1]))for(const article of ['a','an','the','this','that'])result.push([words[0],article,...words.slice(2)].join(' '));if(separable.has(normalise(term)))for(const pronoun of ['me','you','him','her','us','them','it'])result.push([words[0],pronoun,...words.slice(1)].join(' '));}return result;}
 function matches(text,vocabulary){const input=' '+normalise(text)+' ';return vocabulary.some(word=>forms(word.en).some(term=>input.includes(' '+term+' ')));}
 const api={matches};root.StudyVocabularyCheck=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
