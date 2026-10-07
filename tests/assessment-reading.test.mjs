import {test} from 'node:test';
import assert from 'node:assert/strict';
import A from '../assessment.js';
import {courses} from '../backend/languages.mjs';
test('temporary reading replacements are graded in every language and placement level',()=>{
 for(const [language,C] of Object.entries(courses)){
  const assessment=A.create(C,language);
  for(const level of C.levels){
   const exam=assessment.exam(`placement-${level}`);
   for(const q of exam.questions.slice(8)){
    const lesson=C.get(q.lessonId);
    assert.equal(q.type,'choice');
    assert.ok(q.prompt.includes(lesson.example.en));
    assert.equal(q.options[q.answer],lesson.example.pt);
    assert.equal(assessment.grade(q,q.answer),100);
    assert.equal(assessment.grade(q,(q.answer+1)%q.options.length),0);
   }
   const marks=exam.questions.map(q=>assessment.grade(q,q.type==='writing'?q.reference:q.answer));
   const result=assessment.finish(assessment.choose(assessment.defaults(),level),exam.id,marks);
   assert.equal(result.score,100);
   assert.equal(result.passed,true);
  }
 }
});
