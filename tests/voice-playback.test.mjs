import {test} from 'node:test';
import assert from 'node:assert/strict';
import {listeningRate,setListeningSpeed,startAudio} from '../voice-playback.mjs';
test('all listening speeds preserve effective speed and pitch with a stable synthesis rate',()=>{
 for(const speed of [.7,.85,1]){const audio={};setListeningSpeed(audio,speed);assert.ok(Math.abs(audio.playbackRate*.85-speed)<1e-10);assert.equal(audio.defaultPlaybackRate,audio.playbackRate);assert.equal(audio.preservesPitch,true);}
 assert.equal(listeningRate(NaN),1);
});
test('a stalled player reports an error instead of leaving the conversation busy indefinitely',async()=>{await assert.rejects(()=>startAudio({play:()=>new Promise(()=>{})},{timeoutMs:10}),/não começou/);});
