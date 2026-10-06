'use strict';
(()=>{let code='en';try{code=localStorage.getItem('studyia.language')==='es'?'es':'en';}catch{}globalThis.StudyLanguage={code,name:code==='es'?'espanhol':'inglês',speech:code==='es'?'es-ES':'en-US'};})();
