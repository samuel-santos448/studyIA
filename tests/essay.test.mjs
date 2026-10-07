import {test} from 'node:test';
import assert from 'node:assert/strict';
import {essayEvaluator} from '../backend/essay.mjs';
import A from '../assessment.js';
import C from '../curriculum.js';
const q=A.exam('block-A1-01').questions[9];
const text='My name is Ana. I am a student. I live in Brazil and I study English every day. My family is small. I like my school.';
test('essay respects level and requires server grading; all lessons have expanded content and five alternatives',()=>{
 assert.equal(q.minWords,25);assert.equal(A.exam('block-C2-15').questions[9].maxWords,220);assert.throws(()=>A.grade(q,text),/servidor/);
 for(const lesson of C.lessons){assert.ok(lesson.depth.reading.length>=5);assert.ok(lesson.depth.grammar.explanation&&lesson.depth.pronunciation);for(const question of lesson.questions){assert.equal(question.options.length,5);assert.equal(new Set(question.options).size,5);}}
});
test('essay rubric uses structured response and rejects unavailable or malformed grading',async()=>{
 let request;
 const evaluate=essayEvaluator({apiKey:'test-key',model:'test-model',fetchImpl:async(url,options)=>{request=JSON.parse(options.body);return{ok:true,json:async()=>({output:[{content:[{type:'output_text',text:JSON.stringify({task:22,vocabulary:20,grammar:20,coherence:21,feedback:'Revise a concordância.'})}]}]})};}});
 const result=await evaluate(q,text);assert.equal(result.mark,100);assert.equal(result.score,83);assert.equal(request.store,false);assert.equal(request.text.format.strict,true);assert.ok(request.input.includes(text));
 await assert.rejects(evaluate(q,'Too short'),/entre 25 e 60/);
 await assert.rejects(essayEvaluator({})(q,text),/OPENAI_API_KEY/);
 for(const data of [{status:'incomplete'},{output:[{content:[{type:'output_text',text:'{"task":100}'}]}]}])await assert.rejects(essayEvaluator({apiKey:'test',model:'test',fetchImpl:async()=>({ok:true,json:async()=>data})})(q,text),/Nenhuma nota/);
 const failed=await essayEvaluator({apiKey:'test',model:'test',fetchImpl:async()=>({ok:true,json:async()=>({output:[{content:[{type:'output_text',text:JSON.stringify({task:0,vocabulary:25,grammar:25,coherence:25,feedback:'Responda ao tema.'})}]}]})})})(q,text);assert.equal(failed.mark,0);
});
