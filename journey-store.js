'use strict';
(()=>{let state=StudyAssessment.defaults(),saved=true;try{const value=localStorage.getItem(StudyAssessment.key);if(value)state=StudyAssessment.validate(JSON.parse(value));}catch{saved=false;}
 function set(value){state=StudyAssessment.validate(value);try{localStorage.setItem(StudyAssessment.key,JSON.stringify(state));saved=true;}catch{saved=false;}document.dispatchEvent(new Event('studyia:journey'));document.dispatchEvent(new Event('studyia:progress'));return saved;}
 globalThis.StudyJourney={get:()=>structuredClone(state),set,storageAvailable:()=>saved};
})();
