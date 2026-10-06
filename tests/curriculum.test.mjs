import {test} from 'node:test';
import assert from 'node:assert/strict';
import C from '../curriculum.js';
import D from '../learning-data.js';
for(const level of ['A1','A2','B1'])test(`${level} contains 150 complete lessons with unique IDs and unambiguous choices`,()=>{
 const lessons=C.lessons.filter(l=>l.level===level);assert.equal(lessons.length,150);assert.equal(new Set(lessons.map(l=>l.id)).size,150);
 for(const l of lessons){assert.equal(C.get(l.id),l);assert.equal(l.vocabulary.length,6);assert.ok(l.example.en&&l.example.pt&&l.conversation.instructions&&l.conversation.prompt);assert.equal(l.questions.length,2);for(const q of l.questions){assert.equal(new Set(q.options).size,q.options.length);assert.ok(q.options[q.answer]);}}
});
test('A2 examples are distinct from the A1 examples and have complete source rows',()=>{const a1=new Set(C.lessons.filter(l=>l.level==='A1').map(l=>l.example.en));const a2=C.lessons.filter(l=>l.level==='A2');assert.equal(new Set(a2.map(l=>l.example.en)).size,150);for(const l of a2){assert.ok(!a1.has(l.example.en));assert.ok(l.vocabulary.every(w=>w.en&&w.pt));assert.match(l.conversation.instructions,/A2/);}});
test('B1 adds distinct examples and conversation tasks with reasons and follow-up questions',()=>{const earlier=new Set(C.lessons.filter(l=>l.level!=='B1').map(l=>l.example.en));const lessons=C.lessons.filter(l=>l.level==='B1');assert.equal(new Set(lessons.map(l=>l.example.en)).size,150);for(const l of lessons){assert.ok(!earlier.has(l.example.en));assert.ok(l.vocabulary.every(w=>w.en&&w.pt));assert.match(l.conversation.instructions,/inglês B1/);assert.match(l.conversation.prompt,/motivo.*exemplo.*acompanhamento/);}});
test('course progress validates lesson IDs, stages and backup migrations',()=>{
 assert.deepEqual(D.curriculum({'A1-150':[0,2],'C2-001':[]}),{'A1-150':[0,2],'C2-001':[]});
 for(const value of [{'A1-000':[]},{'A1-151':[]},{'A1-001':[0,0]},{'A1-001':[3]},[]])assert.throws(()=>D.curriculum(value));
});
