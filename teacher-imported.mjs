import * as THREE from '/vendor/three.module.js';
import {GLTFLoader} from '/vendor/loaders/GLTFLoader.js';
import {createImportedSpeechController} from './teacher-imported-speech.mjs';
export async function createImportedTeacherCharacter(){
 const root=new THREE.Group();
 const characters=new Map();
 const loaded=await Promise.allSettled([
  new GLTFLoader().loadAsync('/assets/teachers/zezinho-facial.glb'),
  new GLTFLoader().loadAsync('/assets/teachers/mariazinha-preview.glb')
 ]);
 for(const [i,result] of loaded.entries()){
  if(result.status!=='fulfilled'){console.warn('Não foi possível carregar o personagem 3D.',result.reason);continue;}
  const id=i===0?'zezinho':'mariazinha',gltf=result.value,model=gltf.scene;
  model.scale.setScalar(1.8);root.add(model);
  const meshes=[];model.traverse(o=>{
   if(o.isMesh&&o.morphTargetInfluences){meshes.push(o);
    if(o.morphTargetDictionary?.jawOpen!==undefined&&o.morphTargetDictionary?.mouthWide!==undefined){
     const materials=[].concat(o.material);o.material=materials.map(m=>{const next=m.clone();if(next.normalMap){next.normalScale.set(.15,.15);next.roughness=.85;next.metalness=0;}return next;});
     if(o.material.length===1)o.material=o.material[0];
    }
   }
  });
  const speech=createImportedSpeechController(meshes),mixer=new THREE.AnimationMixer(model);
  const idle=gltf.animations.find(a=>a.name==='idle'||a.name.toLowerCase().includes('idle'));
  if(idle)mixer.clipAction(idle).play();
  characters.set(id,{model,speech,mixer});
 }
 if(characters.size!==2)throw Error('Não foi possível carregar os dois professores 3D.');
 let character='zezinho';
 function select(value){
  character=value==='mariazinha'?'mariazinha':'zezinho';
  for(const [id,c] of characters){c.model.visible=id===character;c.speech.reset();}
 }
 select(character);
 return{root,select,
  setMorph(name,value){const c=characters.get(character);if(c)c.speech.setMorph(name,value);},
  releaseSpeech(){for(const c of characters.values())c.speech.release();},
  resetSpeech(){for(const c of characters.values())c.speech.reset();},
  update(p,delta){const c=characters.get(character);if(c){c.mixer.update(delta/1000);c.speech.update(delta,p.blink);}},
  dispose(){const textures=new Set(),materials=new Set(),geometries=new Set();for(const c of characters.values()){c.speech.reset();c.mixer.stopAllAction();c.mixer.uncacheRoot(c.model);c.model.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of [].concat(o.material||[])){materials.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v);}});}for(const t of textures)t.dispose();for(const m of materials)m.dispose();for(const g of geometries)g.dispose();}
 };
}
