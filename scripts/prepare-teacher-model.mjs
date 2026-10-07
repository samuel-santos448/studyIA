// Run: node scripts/prepare-teacher-model.mjs input.glb output.glb
// Optimizes the CC0 MPFB model; preserves facial shape keys and the skeleton.
import {readFile,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const [input,output]=process.argv.slice(2);
if(!input||!output)throw Error('Specify input.glb and output.glb');
const file=await readFile(input),length=file.readUInt32LE(12);
const doc=JSON.parse(file.subarray(20,20+length).toString());
const binary=file.subarray(28+length);
const keep=/^viseme_|^eyeBlink|^eyeLook|^mouthSmile|^browInnerUp$|^browOuterUp|^jawOpen$/;
for(const mesh of doc.meshes){
 const names=mesh.extras?.targetNames;if(!names)continue;
 const indices=names.map((name,i)=>keep.test(name)?i:-1).filter(i=>i>=0);
 mesh.extras.targetNames=indices.map(i=>names[i]);
 mesh.weights=indices.map(()=>0);
 for(const p of mesh.primitives)p.targets=indices.map(i=>({POSITION:p.targets[i].POSITION}));
 for(const node of doc.nodes.filter(n=>n.mesh===doc.meshes.indexOf(mesh)))delete node.weights;
}
const resized=new Map();
for(const img of doc.images){
 const view=doc.bufferViews[img.bufferView];
 const data=binary.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);
 // Hair and the eye overlay need alpha. Skin and clothing use JPEG.
 const alpha=/ponytail|brown_eye/.test(img.name);
 const pipeline=sharp(data).resize({width:1024,height:1024,fit:'inside',withoutEnlargement:true});
 resized.set(img.bufferView,await(alpha?pipeline.png():pipeline.jpeg({quality:85})).toBuffer());
 img.mimeType=alpha?'image/png':'image/jpeg';
}
const used=new Set();
for(const mesh of doc.meshes)for(const p of mesh.primitives){for(const a of Object.values(p.attributes))used.add(a);if(p.indices!==undefined)used.add(p.indices);for(const target of p.targets||[])for(const a of Object.values(target))used.add(a);}
for(const skin of doc.skins||[])if(skin.inverseBindMatrices!==undefined)used.add(skin.inverseBindMatrices);
for(const animation of doc.animations||[])for(const sampler of animation.samplers){used.add(sampler.input);used.add(sampler.output);}
const accessors=[...used].sort((a,b)=>a-b),accessorMap=new Map(accessors.map((a,i)=>[a,i]));
for(const mesh of doc.meshes)for(const p of mesh.primitives){for(const k of Object.keys(p.attributes))p.attributes[k]=accessorMap.get(p.attributes[k]);if(p.indices!==undefined)p.indices=accessorMap.get(p.indices);for(const target of p.targets||[])for(const k of Object.keys(target))target[k]=accessorMap.get(target[k]);}
for(const skin of doc.skins||[])if(skin.inverseBindMatrices!==undefined)skin.inverseBindMatrices=accessorMap.get(skin.inverseBindMatrices);
for(const animation of doc.animations||[])for(const sampler of animation.samplers){sampler.input=accessorMap.get(sampler.input);sampler.output=accessorMap.get(sampler.output);}
doc.accessors=accessors.map(i=>doc.accessors[i]);
const views=new Set(doc.images.map(i=>i.bufferView));
for(const a of doc.accessors){if(a.bufferView!==undefined)views.add(a.bufferView);if(a.sparse){views.add(a.sparse.indices.bufferView);views.add(a.sparse.values.bufferView);}}
const list=[...views].sort((a,b)=>a-b),viewMap=new Map(list.map((v,i)=>[v,i]));
const chunks=[];let offset=0;
const newViews=list.map(i=>{const v=doc.bufferViews[i];const b=resized.get(i)||binary.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength);const pad=(4-offset%4)%4;if(pad){chunks.push(Buffer.alloc(pad));offset+=pad;}const result={...v,buffer:0,byteOffset:offset,byteLength:b.length};chunks.push(b);offset+=b.length;return result;});
for(const a of doc.accessors){if(a.bufferView!==undefined)a.bufferView=viewMap.get(a.bufferView);if(a.sparse){a.sparse.indices.bufferView=viewMap.get(a.sparse.indices.bufferView);a.sparse.values.bufferView=viewMap.get(a.sparse.values.bufferView);}}
for(const img of doc.images)img.bufferView=viewMap.get(img.bufferView);
doc.bufferViews=newViews;doc.buffers=[{byteLength:offset}];
doc.asset.extras={source:'MPFB avatar by met4citizen, CC0',sourceCommit:'b3e277b3b46f88e557bf28a2c5612a5b04e075c3',modifications:'Reduced texture sizes and facial targets for StudyIA'};
const json=Buffer.from(JSON.stringify(doc));const jsonPad=Buffer.alloc((4-json.length%4)%4,32);const binPad=Buffer.alloc((4-offset%4)%4);const body=Buffer.concat(chunks.concat(binPad));
const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+jsonPad.length+body.length,8);header.writeUInt32LE(json.length+jsonPad.length,12);header.writeUInt32LE(0x4e4f534a,16);
const binHeader=Buffer.alloc(8);binHeader.writeUInt32LE(body.length,0);binHeader.writeUInt32LE(0x004e4942,4);
await writeFile(output,Buffer.concat([header,json,jsonPad,binHeader,body]));
console.log(`Prepared ${output}: ${(header.readUInt32LE(8)/1024/1024).toFixed(2)} MB`);
