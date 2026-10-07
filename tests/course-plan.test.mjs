import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),A=require('../assessment.js'),P=require('../course-plan.js');
const block=()=>Object.fromEntries(Array.from({length:10},(_,i)=>[`A1-${String(i+1).padStart(3,'0')}`,[0,1,2]]));
test('resume prioritizes placement and the earliest unfinished lesson',()=>{
 assert.equal(P.plan(A.choose(A.defaults(),'B1')).id,'placement-B1');
 assert.equal(P.plan(A.defaults()).id,'A1-001');
 assert.match(P.plan(A.defaults(),{'A1-001':[0]}).label,/Retomar/);
 assert.equal(P.plan(A.defaults(),{'A1-002':[0,1,2]}).id,'A1-001');
});
test('checkpoint blocks the next lesson until the 80% approval threshold',()=>{
 const state=A.defaults(),progress=block();assert.equal(P.plan(state,progress).id,'block-A1-01');
 state.results['block-A1-01']={score:70};assert.equal(P.plan(state,progress).kind,'exam');
 state.draft={id:'block-A1-01'};assert.match(P.plan(state,progress).label,/Retomar/);
 state.results['block-A1-01'].score=80;assert.equal(P.plan(state,progress).id,'A1-011');
});
test('all approved blocks promote resume to the next level and C2 can finish',()=>{
 const state=A.defaults(),progress={};
 for(const level of ['A1','C2'])for(let n=1;n<=150;n++)progress[`${level}-${String(n).padStart(3,'0')}`]=[0,1,2];
 for(let n=1;n<=15;n++)state.results[`block-A1-${String(n).padStart(2,'0')}`]={score:80};
 assert.equal(P.plan(state,progress).id,'A2-001');
 state.entry='C2';for(let n=1;n<=15;n++)state.results[`block-C2-${String(n).padStart(2,'0')}`]={score:80};
 assert.equal(P.plan(state,progress).kind,'complete');
});
