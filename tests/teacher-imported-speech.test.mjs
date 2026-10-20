import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createImportedSpeechController} from '../teacher-imported-speech.mjs';
const makeMesh=()=>({morphTargetDictionary:{jawOpen:0,mouthRound:1,mouthWide:2,eyeBlinkLeft:3,eyeBlinkRight:4,upperLipRaise:5,cheekSpeech:6,cheekLift:7},morphTargetInfluences:[0,0,0,0,0,0,0,0]});
test('audio poses drive lips and cavity together and reset fully after speech',()=>{
 const lips=makeMesh(),cavity=makeMesh(),controller=createImportedSpeechController([lips,cavity]);
 controller.setMorph('viseme_aa',.8);for(let i=0;i<8;i++)controller.update(33,.5);
 assert.ok(lips.morphTargetInfluences[0]>.5);assert.ok(lips.morphTargetInfluences[5]>.4);assert.deepEqual(lips.morphTargetInfluences,cavity.morphTargetInfluences);
 controller.reset();assert.equal(lips.morphTargetInfluences[0],0);assert.equal(cavity.morphTargetInfluences[0],0);assert.equal(lips.morphTargetInfluences[5],0);
});
test('closed-lip sounds suppress opening and invalid audio weights cannot corrupt morphs',()=>{
 const mesh=makeMesh(),controller=createImportedSpeechController([mesh]);
 controller.setMorph('viseme_aa',1);controller.setMorph('viseme_PP',1);
 controller.setMorph('viseme_O',NaN);controller.update(100,1);
 assert.equal(mesh.morphTargetInfluences[0],0);assert.equal(mesh.morphTargetInfluences[5],0);assert.ok(mesh.morphTargetInfluences.every(Number.isFinite));
 assert.equal(mesh.morphTargetInfluences[3],1);assert.equal(mesh.morphTargetInfluences[4],1);
});

test('short speech pauses release smoothly while explicit stop resets immediately',()=>{
 const mesh=makeMesh(),controller=createImportedSpeechController([mesh]);
 controller.setMorph('viseme_aa',.7);for(let i=0;i<10;i++)controller.update(33);
 const before=mesh.morphTargetInfluences[0];controller.release();controller.update(33);
 assert.ok(mesh.morphTargetInfluences[0]>0);assert.ok(mesh.morphTargetInfluences[0]<before);
 for(let i=0;i<30;i++)controller.update(33);
 assert.ok(mesh.morphTargetInfluences[0]<.001);controller.reset();assert.equal(mesh.morphTargetInfluences[0],0);
});

test('cheeks follow speech with a delayed subtle response and stop at rest',()=>{
 const mesh=makeMesh(),controller=createImportedSpeechController([mesh]);
 controller.setMorph('viseme_aa',.7);controller.update(33);
 assert.ok(mesh.morphTargetInfluences[6]>0);
 assert.ok(mesh.morphTargetInfluences[6]<mesh.morphTargetInfluences[0]);
 controller.setMorph('viseme_E',.5);for(let i=0;i<10;i++)controller.update(33);
 assert.ok(mesh.morphTargetInfluences[7]>0);
 controller.reset();assert.equal(mesh.morphTargetInfluences[6],0);assert.equal(mesh.morphTargetInfluences[7],0);
});
