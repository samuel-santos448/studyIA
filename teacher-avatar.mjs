import * as THREE from '/vendor/three.module.js';
import {GLTFLoader} from '/vendor/loaders/GLTFLoader.js';
import {HeadAudio} from '/assets/teachers/vendor/headaudio.min.mjs';

const COLORS={zezinho:0x164574,mariazinha:0x428e48};
const clamp=THREE.MathUtils.clamp;

export async function createTeacherAvatar(stage){
 const viewport=document.createElement('div');viewport.className='teacher-3d';viewport.setAttribute('role','img');viewport.setAttribute('aria-label','Professor Zezinho em 3D');
 stage.insertBefore(viewport,stage.querySelector('.live-caption'));
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 viewport.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(28,1,0.1,20);
 camera.position.set(0,1.59,1.6);camera.lookAt(0,1.55,0);
 scene.add(new THREE.HemisphereLight(0xffffff,0x738d82,1.65));
 const key=new THREE.DirectionalLight(0xfff0df,2.5);key.position.set(-2,3,4);scene.add(key);
 const fill=new THREE.DirectionalLight(0xdcecff,1.4);fill.position.set(2,2,3);scene.add(fill);
 const rim=new THREE.DirectionalLight(0xffffff,2.5);rim.position.set(1,2,-2);scene.add(rim);
 const loader=new GLTFLoader();
 let model;
 try{model=(await loader.loadAsync('/assets/teachers/teacher-base.glb')).scene;}catch(error){renderer.dispose();viewport.remove();throw error;}
 scene.add(model);model.updateMatrixWorld(true);
 const bones={},rest={},morphs=[],faceMeshes=[];let clothing,hair,lashes;

 model.traverse(o=>{
  if(o.isBone){bones[o.name]=o;rest[o.name]=o.quaternion.clone();}
  if(o.isMesh){
   o.frustumCulled=false;
   if(o.morphTargetDictionary&&o.morphTargetInfluences)morphs.push(o);
   if(o.name==='Human')faceMeshes.push(o);
   if(o.name.includes('female_casualsuit'))clothing=o;
   if(o.name.includes('ponytail'))hair=o;if(o.name.includes('eyelashes'))lashes=o;
   if(o.material){o.material=o.material.clone();o.material.roughness=Math.max(.55,o.material.roughness||0);}
  }
 });
 // Store the unmodified geometry: gender variants preserve the same facial rig.
 if(clothing){clothing.material.map=null;}
 const costumeOriginal=clothing?.geometry.attributes.position.array.slice();
 const originals=faceMeshes.map(m=>m.geometry.attributes.position.array.slice());
 const head=bones.Head;
 const shortHair=new THREE.Group();shortHair.name='StudyIA-short-hair';
 const hairMat=new THREE.MeshStandardMaterial({color:0x30241f,roughness:.88});
 const cap=new THREE.Mesh(new THREE.SphereGeometry(1,40,24,0,Math.PI*2,0,1.4),hairMat);
 cap.scale.set(.094,.085,.108);cap.position.set(0,1.698,.047);shortHair.add(cap);
 // Swept locks give the short haircut a silhouette rather than a flat cap.
 for(let i=0;i<7;i++){
  const lock=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),hairMat);
  lock.scale.set(.047,.015,.028);lock.position.set(-.050+i*.015,1.731+Math.sin(i*.4)*.009,.117);lock.rotation.z=-.3;shortHair.add(lock);
 }
 scene.add(shortHair);model.updateMatrixWorld(true);head?.attach(shortHair);
 const pin=new THREE.Mesh(new THREE.CircleGeometry(.016,24),new THREE.MeshStandardMaterial({color:0x4caf45,roughness:.65}));
 pin.position.set(.105,1.405,.179);scene.add(pin);
 const size=()=>{const w=viewport.clientWidth||500,h=viewport.clientHeight||440;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
 const resize=new ResizeObserver(size);resize.observe(viewport);size();
 let character='zezinho',state='idle',energy=0,node=null,audioRevision=0,visible=true,disposed=false,last=0,frame=0,blinkAt=performance.now()+2200,blinkStart=-1000;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const setMorph=(name,value)=>{for(const m of morphs){const i=m.morphTargetDictionary[name];if(i!==undefined)m.morphTargetInfluences[i]=value;}};
 const resetMouth=()=>{for(const m of morphs)for(const [name,i]of Object.entries(m.morphTargetDictionary))if(name.startsWith('viseme_')||name==='jawOpen')m.morphTargetInfluences[i]=0;energy=0;};
 const pose=(name,x=0,y=0,z=0)=>{if(bones[name])bones[name].quaternion.copy(rest[name]).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(x,y,z)));};
 function select(value){
  character=value==='mariazinha'?'mariazinha':'zezinho';const male=character==='zezinho';
  viewport.setAttribute('aria-label',`${male?'Professor Zezinho':'Professora Mariazinha'} em 3D`);
  if(hair)hair.visible=!male;if(lashes)lashes.visible=!male;shortHair.visible=male;
  if(clothing){clothing.material.color.setHex(COLORS[character]);clothing.material.roughness=.85;}
  pin.material.color.setHex(male?0x4caf45:0xf0dfb9);
  for(let j=0;j<faceMeshes.length;j++){
   const mesh=faceMeshes[j],p=mesh.geometry.attributes.position,base=originals[j];
   for(let i=0;i<p.count;i++){
    const x=base[i*3],y=base[i*3+1],z=base[i*3+2];
    // Broader jaw and neck; keeps positions and shape key indices compatible.
    const jaw=male&&y>1.53&&y<1.65?1+.17*Math.sin((y-1.53)/.12*Math.PI):1;
    const chest=male&&y>1.18&&y<1.49&&Math.abs(x)<.18&&z>.07;
    p.setXYZ(i,x*jaw,y,chest?.07+(z-.07)*.65:z+(male&&y>1.56&&y<1.61&&z>.1?.003:0));
   }
   p.needsUpdate=true;mesh.geometry.computeVertexNormals();
  }
  if(clothing&&costumeOriginal){const p=clothing.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=costumeOriginal[i*3],y=costumeOriginal[i*3+1],z=costumeOriginal[i*3+2];const chest=male&&y>1.18&&y<1.49&&Math.abs(x)<.18&&z>.07;p.setXYZ(i,x,y,chest?.075+(z-.075)*.65:z);}p.needsUpdate=true;clothing.geometry.computeVertexNormals();}
  resetMouth();
 }
 select(character);
 stage.dataset.avatar='3d';stage.querySelector('.teacher-avatar').setAttribute('hidden','');
 function render(now){
  if(disposed)return;frame=requestAnimationFrame(render);
  if(!visible||document.hidden){last=now;return;}if(now-last<1000/30)return;
  const dt=Math.min(now-last,100)||33;last=now;
  const t=now/1000,speaking=state==='speaking',listening=state==='listening';
  if(now>=blinkAt){blinkStart=now;blinkAt=now+3200+Math.random()*2200;}
  const blink=clamp(1-Math.abs(now-blinkStart-100)/100,0,1);
  setMorph('eyeBlinkLeft',blink);setMorph('eyeBlinkRight',blink);
  const smile=speaking?.06:.12;setMorph('mouthSmileLeft',smile);setMorph('mouthSmileRight',smile);
  setMorph('browInnerUp',state==='thinking'?.15:listening?.08:0);
  const move=reduced.matches?0:1;
  pose('Head',move*(listening?.025:Math.sin(t*1.6)*.012),move*Math.sin(t*.65)*.025,move*(listening?-.035:Math.sin(t*.8)*.018));
  pose('Neck',move*Math.sin(t*.6)*.008,0,0);
  pose('Spine2',move*Math.sin(t*1.4)*.006,move*Math.sin(t*.5)*.009,0);
  pose('LeftArm',0,0,.45+move*(speaking?Math.sin(t*1.8)*.055:0));
  pose('RightArm',0,0,-.45+move*(speaking?Math.sin(t*1.4)*.055:0));
  pose('LeftForeArm',0,0,-.18);pose('RightForeArm',0,0,.18);
  if(node)node.update(dt);
  else setMorph('jawOpen',speaking?energy*.6:0);
  renderer.render(scene,camera);
 }
 const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});intersection.observe(stage);
 frame=requestAnimationFrame(render);
 const api={
  select,
  setState(value){if(disposed)return;state=value;if(value!=='speaking')resetMouth();},
  setEnergy(value){if(disposed)return;energy=clamp(value*15,0,1);},
  async connectAudio(context,source){
   if(disposed)return;const rev=++audioRevision;
   try{
    await context.audioWorklet.addModule('/assets/teachers/vendor/headworklet.min.mjs');
    if(rev!==audioRevision||context.state==='closed')return;
    const next=new HeadAudio(context,{parameterData:{vadGateActiveDb:-42,vadGateInactiveDb:-52}});
    await next.loadModel('/assets/teachers/vendor/model-en-mixed.bin');
    if(rev!==audioRevision||context.state==='closed'){next.stop();next.disconnect();next.port.close();return;}
    node=next;next.onvalue=(key,value)=>setMorph(key,state==='speaking'?value:0);
    next.onprocessorerror=()=>{api.disconnectAudio();};source.connect(next);
   }catch{if(rev===audioRevision)api.disconnectAudio();} // Audio and jaw animation keep working on older browsers.
  },
  disconnectAudio(){audioRevision++;if(node){node.onvalue=null;node.stop();node.disconnect();node.port.close();node=null;}resetMouth();},
  dispose(){if(disposed)return;disposed=true;api.disconnectAudio();cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const value of Object.values(o.material))if(value?.isTexture)value.dispose();o.material.dispose();}});renderer.dispose();viewport.remove();}
 };
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();api.dispose();stage.dataset.avatar='fallback';stage.querySelector('.teacher-avatar').removeAttribute('hidden');stage.querySelector('.avatar-loading').textContent='Visual simplificado. A conversa por voz continua disponível.';});
 return api;
}
