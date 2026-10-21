import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),C=require('../curriculum.js'),S=require('../lesson-story.js');
test('each English lesson scene retains its own example, translation, context and grammar',()=>{
 for(const lesson of C.lessons){const scene=S.build(lesson);assert.ok(scene,lesson.id);assert.equal(scene.title,lesson.topic);assert.ok(scene.turns.some(t=>t.lang==='en-US'&&t.text===lesson.example.en&&t.translation===lesson.example.pt));assert.ok(scene.turns.some(t=>t.text.includes(lesson.depth.context[1])));assert.ok(scene.turns.some(t=>t.text===lesson.depth.grammar.explanation));assert.ok(scene.turns.every(t=>t.text&&['teacher','student'].includes(t.speaker)));}
});
test('scenes do not substitute English narration for missing or other-language lessons',()=>{
 assert.equal(S.build(null),null);assert.equal(S.build({id:'es-A1-001',depth:{}}),null);assert.equal(S.build({id:'A1-001'}),null);
});
