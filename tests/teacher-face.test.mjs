import {test} from 'node:test';
import assert from 'node:assert/strict';
import {getTeacherSpeechShape} from '../teacher-face.mjs';

test('speech poses distinguish rounded vowels, open vowels and closed consonants',()=>{
 const vowel=getTeacherSpeechShape(new Map([['viseme_aa',1]]));
 const round=getTeacherSpeechShape(new Map([['viseme_O',1]]));
 const closed=getTeacherSpeechShape(new Map([['viseme_PP',1]]));
 assert.ok(vowel.jaw>round.jaw);assert.equal(round.round,1);assert.equal(vowel.round,0);
 assert.equal(closed.press,1);assert.equal(closed.jaw,0);
 const labiodental=getTeacherSpeechShape(new Map([['viseme_FF',1]]));
 assert.ok(labiodental.lowerLip>0);assert.ok(labiodental.press>0&&labiodental.press<1);
});

test('remaining speech sounds change lip width or opening and silence returns neutral',()=>{
 for(const name of ['E','I','TH','DD','kk','CH','SS','nn','RR','U']){
  const pose=getTeacherSpeechShape(new Map([['viseme_'+name,.8]]));
  assert.ok(pose.jaw>0,name);assert.ok(Object.values(pose).every(n=>n>=0&&n<=1));
 }
 assert.ok(Object.values(getTeacherSpeechShape(new Map())).every(n=>n===0));
 assert.ok(Object.values(getTeacherSpeechShape(new Map([['viseme_aa',NaN],['viseme_O',Infinity],['jawOpen',-20]]))).every(n=>n===0));
});
