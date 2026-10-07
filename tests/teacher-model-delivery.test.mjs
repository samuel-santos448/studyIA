import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateTeacherGLB,teacherModelRequirements as req} from '../scripts/validate-teacher-models.mjs';

// Minimal structural fixture, not a character or a visual-quality sample.
function fixture({morphs=true,external=false,weights=true}={}){
 const binary=Buffer.alloc(172);
 for(let i=0;i<3;i++)binary.writeFloatLE(1,36+i*16);
 binary.writeUInt16LE(0,108);binary.writeUInt16LE(1,110);binary.writeUInt16LE(2,112);binary.writeFloatLE(1,132);
 const doc={asset:{version:'2.0'},scene:0,scenes:[{nodes:[0,9]}],
  nodes:[...req.bones.map((name,i)=>({name,...(i===0?{children:[1,2,3,4,5,6,7,8]}:{})})),{mesh:0,skin:0}],
  buffers:[{byteLength:binary.length,...(external?{uri:'https://example.invalid/model.bin'}:{})}],
  bufferViews:[{buffer:0,byteOffset:0,byteLength:36},{buffer:0,byteOffset:36,byteLength:48},{buffer:0,byteOffset:84,byteLength:24},{buffer:0,byteOffset:108,byteLength:6},{buffer:0,byteOffset:116,byteLength:4},{buffer:0,byteOffset:120,byteLength:16},{buffer:0,byteOffset:136,byteLength:36}],
  accessors:[{bufferView:0,componentType:5126,count:3,type:'VEC3',min:[0,0,0],max:[0,0,0]},{bufferView:1,componentType:5126,count:3,type:'VEC4'},{bufferView:2,componentType:5123,count:3,type:'VEC4'},{bufferView:3,componentType:5123,count:3,type:'SCALAR'},{bufferView:4,componentType:5126,count:1,type:'SCALAR',min:[0],max:[0]},{bufferView:5,componentType:5126,count:1,type:'VEC4'},{bufferView:6,componentType:5126,count:3,type:'VEC3'}],
  skins:[{skeleton:0,joints:req.bones.map((_,i)=>i)}],
  meshes:[{extras:{targetNames:morphs?req.morphs:[]},primitives:[{attributes:{POSITION:0,...(weights?{WEIGHTS_0:1,JOINTS_0:2}:{})},indices:3,targets:morphs?req.morphs.map(()=>({POSITION:6})):[]}]}],
  animations:req.clips.map(name=>({name,samplers:[{input:4,output:5,interpolation:'LINEAR'}],channels:[{sampler:0,target:{node:0,path:'rotation'}}]}))};
 const json=Buffer.from(JSON.stringify(doc));const padded=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);
 const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+padded.length+binary.length,8);header.writeUInt32LE(padded.length,12);header.writeUInt32LE(0x4e4f534a,16);
 const binHeader=Buffer.alloc(8);binHeader.writeUInt32LE(binary.length);binHeader.writeUInt32LE(0x004e4942,4);return Buffer.concat([header,padded,binHeader,binary]);
}

test('delivery checker detects corrupt containers and missing facial controls',()=>{
 assert.equal(validateTeacherGLB(Buffer.from('not a model')).ok,false);
 const bytes=fixture();assert.equal(validateTeacherGLB(bytes.subarray(0,-4)).ok,false);
 const result=validateTeacherGLB(fixture({morphs:false}));assert.equal(result.ok,false);assert.ok(result.errors.some(e=>e.includes('Controles faciais')));
});

test('delivery checker requires embedded resources, working skin attributes and named controls',()=>{
 const valid=validateTeacherGLB(fixture());assert.equal(valid.ok,true);assert.equal(valid.triangles,1);
 assert.equal(validateTeacherGLB(fixture({external:true})).ok,false);
 assert.ok(validateTeacherGLB(fixture({weights:false})).errors.some(e=>e.includes('pesos')));
});

test('previous human asset is not mistaken for a completed new character delivery',async()=>{
 const bytes=await readFile(new URL('../assets/teachers/teacher-base.glb',import.meta.url));
 const result=validateTeacherGLB(bytes);assert.equal(result.ok,false);assert.ok(result.errors.some(e=>e.includes('Clipes ausentes')));
});
