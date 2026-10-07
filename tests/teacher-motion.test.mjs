import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createTeacherMotion} from '../teacher-motion.mjs';

test('speech and listening blend facial expressions instead of jumping to another pose',()=>{
 const motion=createTeacherMotion();let previous;
 for(let time=0;time<=3000;time+=33){
  const state=time<1000?'idle':time<2000?'speaking':'listening';
  const pose=motion.step({time,delta:33,state});
  assert.ok(pose.blink>=0&&pose.blink<=1);assert.ok(pose.smile>=0&&pose.smile<=.4);
  assert.ok(pose.head.every(n=>Number.isFinite(n)&&Math.abs(n)<.06));
  if(previous)assert.ok(Math.abs(pose.smile-previous.smile)<.04);
  previous=pose;
 }
 assert.ok(previous.smile>.25);assert.ok(previous.gesture>=0&&previous.gesture<=.76);
 const resumed=motion.step({time:63000,delta:60000,state:'speaking'});
 assert.ok(Math.abs(resumed.smile-previous.smile)<.1);
});

test('reduced motion disables decorative head, body, gaze and hair movement',()=>{
 const motion=createTeacherMotion();
 for(const state of ['idle','speaking','listening','thinking']){
  const pose=motion.step({time:5000,delta:33,state,reduced:true});
  assert.ok(pose.head.every(n=>n===0));assert.ok(pose.spine.every(n=>n===0));
  assert.ok(pose.gaze===0);assert.ok(pose.hairSway===0);assert.ok(pose.neck===0);assert.ok(pose.gesture===0);
  assert.ok(Number.isFinite(pose.smile));
 }
});
