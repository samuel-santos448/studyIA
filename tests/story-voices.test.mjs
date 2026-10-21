import test from 'node:test';
import assert from 'node:assert/strict';
import{createRequire}from'node:module';
const V=createRequire(import.meta.url)('../story-voices.js');
const voice=(name,lang)=>({name,lang,voiceURI:name});
const voices=[voice('Microsoft Daniel','pt-BR'),voice('Microsoft Francisca Online (Natural)','pt-BR'),voice('Microsoft Maria','pt-PT'),voice('Microsoft David','en-US'),voice('Microsoft Aria Online (Natural)','en-US')];
test('teacher and student keep separate language-appropriate voices regardless of system default order',()=>{assert.equal(V.pick(voices,'pt-BR','teacher').name,voices[1].name);assert.equal(V.pick(voices,'en-US','teacher').name,voices[4].name);assert.equal(V.pick(voices,'pt-BR','student').name,voices[0].name);assert.equal(V.pick(voices,'en-US','student').name,voices[3].name);});
test('missing female voices do not silently use the default male voice or another language',()=>{assert.equal(V.pick([voices[0],voices[4]],'pt-BR','teacher'),null);assert.equal(V.pick([voice('Unknown default','en-US')],'en-US','teacher'),null);});
test('manual voice overrides stay within the spoken language and absent choices recover automatically',()=>{const custom=voice('Custom installed voice','pt-BR');assert.equal(V.pick([...voices,custom],'pt-BR','teacher',custom.voiceURI),custom);assert.equal(V.pick(voices,'en-US','teacher',voices[1].voiceURI),voices[4]);assert.equal(V.pick(voices,'pt-BR','teacher','removed voice'),voices[1]);});
