import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('preview model exports skinned lips, separate blinks and the cavity morph used by the audio controller',async()=>{
 const b=await readFile(new URL('../assets/teachers/mariazinha-preview.glb',import.meta.url));
 assert.equal(b.readUInt32LE(0),0x46546c67);assert.ok(b.length<20*1024*1024);
 const d=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)));
 const targets=d.meshes.flatMap(m=>m.extras?.targetNames||[]);
 for(const name of ['jawOpen','mouthRound','mouthWide','eyeBlinkLeft','eyeBlinkRight','upperLipRaise','cheekSpeech','cheekLift'])assert.ok(targets.includes(name),name);
 assert.equal(targets.filter(n=>n==='jawOpen').length,3);
 for(const mesh of d.meshes){
  for(const name of ['mouthRound','mouthWide']){const index=mesh.extras?.targetNames?.indexOf(name)??-1;if(index<0)continue;for(const p of mesh.primitives){const accessor=d.accessors[p.targets[index].POSITION];assert.ok(Math.abs(accessor.min?.[1]||0)<1e-6,name+' must not inherit jaw opening');assert.ok(Math.abs(accessor.max?.[1]||0)<1e-6,name+' must not inherit jaw opening');}}
 }
 for(const mesh of d.meshes.filter(m=>m.extras?.targetNames?.length)){
  for(const p of mesh.primitives){assert.ok(p.attributes.JOINTS_0!==undefined);assert.ok(p.attributes.WEIGHTS_0!==undefined);assert.equal(p.targets.length,mesh.extras.targetNames.length);}
 }
 const lips=d.meshes.filter(m=>m.extras?.targetNames?.includes('mouthWide')&&m.extras?.targetNames?.includes('jawOpen')).sort((a,b)=>d.accessors[b.primitives[0].attributes.POSITION].count-d.accessors[a.primitives[0].attributes.POSITION].count)[0];
 assert.equal(targets.filter(n=>n==='upperLipRaise').length,2);
 const upperIndex=lips.extras.targetNames.indexOf('upperLipRaise');
 assert.ok(lips.primitives.some(p=>d.accessors[p.targets[upperIndex].POSITION].max[1]>.0035),'upper lip must lift during opening');
 assert.ok((lips.weights||[]).every(w=>w===0),'rest pose must remain neutral');
 assert.ok(d.animations.some(a=>a.name==='idle'));
 assert.ok(d.images.every(i=>i.uri===undefined));
});
