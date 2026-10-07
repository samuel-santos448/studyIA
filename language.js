'use strict';
(()=>{let code='en';try{const saved=localStorage.getItem('studyia.language');if(Object.hasOwn(StudyLanguages,saved))code=saved;}catch{}globalThis.StudyLanguage={code,...StudyLanguages[code]};})();
