'use strict';
(function(root){
 const irregular={take:['took','taken'],draw:['drew','drawn'],come:['came'],find:['found'],make:['made'],give:['gave','given'],get:['got','gotten'],run:['ran'],keep:['kept'],bring:['brought'],go:['went','gone'],say:['said'],think:['thought'],feel:['felt'],meet:['met'],spend:['spent'],leave:['left'],lose:['lost'],win:['won'],grow:['grew','grown']};
 const normalise=text=>String(text).toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9'-]+/g,' ').trim();
 function variants(term){const words=normalise(term).split(' ');const first=words[0];const stems=new Set([first,...(irregular[first]||[])]);if(first.length>2){stems.add(first+'s');stems.add(first+'ed');stems.add(first+'ing');if(first.endsWith('e')){stems.add(first+'d');stems.add(first.slice(0,-1)+'ing');}if(/[^aeiou]y$/.test(first)){stems.add(first.slice(0,-1)+'ies');stems.add(first.slice(0,-1)+'ied');}}return [...stems].map(stem=>[stem,...words.slice(1)].join(' '));}
 function matches(text,vocabulary){const input=' '+normalise(text)+' ';return vocabulary.some(word=>variants(word.en).some(term=>input.includes(' '+term+' ')));}
 const api={matches};root.StudyVocabularyCheck=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
