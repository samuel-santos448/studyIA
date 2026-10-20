import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('Zezinho exports skinned facial controls and embedded textures in a neutral rest pose',async()=>{
 const b=await readFile(new URL('../assets/teachers/zezinho-facial.glb',import.meta.url));
 assert.equal(b.readUInt32LE(0),0x46546c67);assert.equal(b.readUInt32LE(8),b.length);
 const d=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)));
 const names=d.meshes.flatMap(m=>m.extras?.targetNames||[]);
 for(const n of ['jawOpen','upperLipRaise','mouthRound','mouthWide','cheekSpeech','cheekLift','eyeBlinkLeft','eyeBlinkRight'])assert.ok(names.includes(n),n);
 for(const m of d.meshes.filter(m=>m.extras?.targetNames?.length)){
  assert.ok((m.weights||[]).every(w=>w===0));
  for(const p of m.primitives){assert.ok(p.attributes.JOINTS_0!==undefined);assert.ok(p.attributes.WEIGHTS_0!==undefined);assert.equal(p.targets.length,m.extras.targetNames.length);}
 }
 assert.ok(d.animations.some(a=>a.name==='idle'));
 assert.ok(d.images.every(i=>i.uri===undefined));assert.ok(b.length<20*1024*1024);
});
