import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createApp} from '../server.mjs';

test('3D teachers load self-hosted assets without exposing arbitrary dependency files',async()=>{
 const server=createApp();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 try{
  for(const path of ['/teacher-character.mjs','/teacher-face.mjs','/teacher-motion.mjs','/teacher-style.mjs','/teacher-avatar.mjs','/vendor/three.module.js','/vendor/three.core.js','/vendor/loaders/GLTFLoader.js','/vendor/utils/BufferGeometryUtils.js','/vendor/utils/SkeletonUtils.js','/assets/teachers/vendor/headaudio.min.mjs','/assets/teachers/vendor/headworklet.min.mjs']){
   const response=await fetch(base+path);assert.equal(response.status,200,path);assert.match(response.headers.get('content-type'),/javascript/);
  }
  const model=await fetch(base+'/assets/teachers/teacher-base.glb');assert.equal(model.status,200);assert.equal(model.headers.get('content-type'),'model/gltf-binary');
  assert.equal((await fetch(base+'/assets/teachers/vendor/model-en-mixed.bin')).status,200);
  const logo=await fetch(base+'/school-logo.jpg');assert.equal(logo.status,200);assert.equal(logo.headers.get('content-type'),'image/jpeg');
  assert.equal((await fetch(base+'/node_modules/three/package.json')).status,404);
  assert.equal((await fetch(base+'/vendor/package.json')).status,404);
 }finally{await new Promise(r=>server.close(r));}
});

test('human model retains face rig, alpha eye texture and only embedded resources',async()=>{
 const file=await readFile(new URL('../assets/teachers/teacher-base.glb',import.meta.url));
 assert.equal(file.readUInt32LE(0),0x46546c67);assert.equal(file.readUInt32LE(8),file.length);
 const doc=JSON.parse(file.subarray(20,20+file.readUInt32LE(12)).toString());
 const face=doc.meshes.find(m=>m.name==='base');
 for(const name of ['viseme_aa','viseme_PP','viseme_O','eyeBlinkLeft','eyeBlinkRight','eyeSquintLeft','eyeSquintRight'])assert.ok(face.extras.targetNames.includes(name),name);
 assert.ok(doc.nodes.some(n=>n.name==='Head'));assert.ok(doc.skins.length);
 assert.equal(doc.images.find(i=>i.name==='brown_eye').mimeType,'image/png');
 assert.ok(doc.images.every(i=>i.uri===undefined));assert.ok(doc.buffers.every(b=>b.uri===undefined));
 assert.ok(file.length<10*1024*1024);
});
