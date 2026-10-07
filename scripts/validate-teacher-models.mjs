import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export const teacherModelRequirements=Object.freeze({
 bones:['Head','Neck','Spine2','LeftArm','RightArm','LeftForeArm','RightForeArm','LeftHand','RightHand'],
 morphs:['eyeBlinkLeft','eyeBlinkRight','eyeLookInLeft','eyeLookInRight','eyeLookOutLeft','eyeLookOutRight','eyeSquintLeft','eyeSquintRight','browInnerUp','mouthSmileLeft','mouthSmileRight','jawOpen',...'sil PP FF TH DD kk CH SS nn RR aa E I O U'.split(' ').map(n=>'viseme_'+n)],
 clips:['idle','listening','thinking','explaining','greeting'],
 maxBytes:20*1024*1024,maxTriangles:100000
});

// A structural delivery check; visual quality and deformation need browser review.
export function validateTeacherGLB(bytes){
 const errors=[],fail=message=>({ok:false,errors:[message]});
 if(!Buffer.isBuffer(bytes)||bytes.length<28)return fail('Arquivo não é um GLB completo.');
 if(bytes.readUInt32LE(0)!==0x46546c67||bytes.readUInt32LE(4)!==2)return fail('Esperado GLB em glTF 2.0.');
 if(bytes.readUInt32LE(8)!==bytes.length)return fail('Tamanho do contêiner GLB não corresponde ao arquivo.');
 let offset=12,doc=null,binLength=0;
 try{
  while(offset<bytes.length){
   if(offset+8>bytes.length)return fail('Cabeçalho de chunk incompleto.');
   const length=bytes.readUInt32LE(offset),type=bytes.readUInt32LE(offset+4);offset+=8;
   if(length%4||offset+length>bytes.length)return fail('Chunk GLB desalinhado ou incompleto.');
   if(!doc){if(type!==0x4e4f534a)return fail('O primeiro chunk deve conter o JSON.');doc=JSON.parse(bytes.subarray(offset,offset+length).toString('utf8'));}
   else if(type===0x004e4942){if(binLength)return fail('GLB contém chunks binários duplicados.');binLength=length;}
   offset+=length;
  }
 }catch{return fail('JSON do GLB inválido.');}
 if(doc?.asset?.version!=='2.0')return fail('Metadados devem declarar glTF 2.0.');
 if(!Array.isArray(doc.nodes)||!Array.isArray(doc.meshes)||!Array.isArray(doc.accessors))return fail('GLB não contém nós, malhas e accessors válidos.');
 const req=teacherModelRequirements;
 if(bytes.length>req.maxBytes)errors.push('Arquivo excede a meta de 20 MiB.');
 if(!Array.isArray(doc.buffers)||doc.buffers.length!==1||doc.buffers[0].uri!==undefined||!binLength||doc.buffers[0].byteLength>binLength)errors.push('Buffer deve estar incorporado em um chunk binário válido.');
 if((doc.images||[]).some(image=>image.uri!==undefined||!Number.isInteger(image.bufferView)))errors.push('Todas as texturas devem estar incorporadas ao GLB.');
 const jointIndices=new Set((doc.skins||[]).flatMap(skin=>skin.joints||[]));
 const boneNames=new Set([...jointIndices].map(i=>doc.nodes[i]?.name));
 const missingBones=req.bones.filter(name=>!boneNames.has(name));
 if(missingBones.length)errors.push('Ossos ausentes no skin: '+missingBones.join(', '));
 const skinned=doc.nodes.filter(node=>Number.isInteger(node.mesh)&&Number.isInteger(node.skin)&&doc.skins?.[node.skin]&&doc.meshes[node.mesh]);
 if(!skinned.length)errors.push('Não há uma malha vinculada ao esqueleto.');
 const usableMorphs=new Set();let triangles=0;
 for(const mesh of doc.meshes){
  if(!Array.isArray(mesh.primitives)){errors.push('Malha sem primitives válidos.');continue;}
  for(const primitive of mesh.primitives){
   const position=doc.accessors[primitive.attributes?.POSITION];
   if(skinned.some(node=>doc.meshes[node.mesh]===mesh)){
    const joints=doc.accessors[primitive.attributes?.JOINTS_0],weights=doc.accessors[primitive.attributes?.WEIGHTS_0];
    if(!position||!joints||!weights||joints.count!==position.count||weights.count!==position.count)errors.push('Malha com skin sem pesos e índices de juntas correspondentes aos vértices.');
   }
   const count=doc.accessors[primitive.indices??primitive.attributes?.POSITION]?.count;
   if(!Number.isInteger(count)||count<=0){errors.push('Primitive com accessor de geometria inválido.');continue;}
   if((primitive.mode??4)!==4){errors.push('Esperadas malhas trianguladas (modo TRIANGLES).');continue;}
   if(count%3)errors.push('Contagem de índices/vértices não é múltipla de três.');triangles+=count/3;
   for(let i=0;i<(mesh.extras?.targetNames||[]).length;i++){
    const target=primitive.targets?.[i],accessor=doc.accessors[target?.POSITION];
    if(accessor?.count>0&&accessor.count===position?.count&&skinned.some(node=>doc.meshes[node.mesh]===mesh))usableMorphs.add(mesh.extras.targetNames[i]);
   }
  }
 }
 if(triangles>req.maxTriangles)errors.push('Malhas excedem a meta de 100 mil triângulos.');
 const missingMorphs=req.morphs.filter(name=>!usableMorphs.has(name));
 if(missingMorphs.length)errors.push('Controles faciais ausentes: '+missingMorphs.join(', '));
 const clips=new Set((doc.animations||[]).filter(a=>a.channels?.length&&a.samplers?.length).map(a=>a.name));
 const missingClips=req.clips.filter(name=>!clips.has(name));
 if(missingClips.length)errors.push('Clipes ausentes: '+missingClips.join(', '));
 return{ok:errors.length===0,errors,triangles,bytes:bytes.length};
}

if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 const paths=process.argv.slice(2);
 if(!paths.length){console.error('Uso: node scripts/validate-teacher-models.mjs zezinho.glb mariazinha.glb');process.exitCode=1;}
 for(const path of paths){
  try{const result=validateTeacherGLB(await readFile(path));console.log(path+': '+(result.ok?'estrutura aprovada':'entrega incompleta'));for(const error of result.errors)console.error('  '+error);if(result.ok)console.log('  '+result.triangles+' triângulos; revisão visual ainda necessária.');else process.exitCode=1;}
  catch(error){console.error(path+': '+error.message);process.exitCode=1;}
 }
}
