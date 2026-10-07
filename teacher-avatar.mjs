import * as THREE from '/vendor/three.module.js';
import {GLTFLoader} from '/vendor/loaders/GLTFLoader.js';
import {createTeacherMotion} from './teacher-motion.mjs';
import {styleTeacher} from './teacher-style.mjs';
import {HeadAudio} from '/assets/teachers/vendor/headaudio.min.mjs';

const clamp=THREE.MathUtils.clamp;

export async function createTeacherAvatar(stage){
 const viewport=document.createElement('div');viewport.className='teacher-3d';viewport.setAttribute('role','img');viewport.setAttribute('aria-label','Professor Zezinho em 3D');
 stage.insertBefore(viewport,stage.querySelector('.live-caption'));
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
 viewport.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(28,1,0.1,20);
 camera.position.set(0,1.60,1.38);camera.lookAt(0,1.565,0);
 scene.add(new THREE.HemisphereLight(0xffffff,0x738d82,1.65));
 const key=new THREE.DirectionalLight(0xffeee0,2.15);key.position.set(-2,3,4);scene.add(key);
 const fill=new THREE.DirectionalLight(0xdcecff,.9);fill.position.set(2,2,3);scene.add(fill);
 const rim=new THREE.DirectionalLight(0xffffff,2.5);rim.position.set(1,2,-2);scene.add(rim);
 const loader=new GLTFLoader();
 let model,schoolLogo;
 try{const loaded=await Promise.all([loader.loadAsync('/assets/teachers/teacher-base.glb'),new THREE.TextureLoader().loadAsync('/school-logo.jpg')]);model=loaded[0].scene;schoolLogo=loaded[1];schoolLogo.colorSpace=THREE.SRGBColorSpace;schoolLogo.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());}catch(error){schoolLogo?.dispose();renderer.dispose();viewport.remove();throw error;}
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
 const appearance=styleTeacher({scene,model,bones,clothing,hair,lashes,faceMeshes,schoolLogo});
 const pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(appearance.studio,.04);pmrem.dispose();
 appearance.studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 model.traverse(o=>{if(o.isMesh&&o.name.includes('high-poly')){const old=o.material;o.material=new THREE.MeshPhysicalMaterial({map:old.map,alphaTest:old.alphaTest,side:old.side,roughness:.23,clearcoat:.85,clearcoatRoughness:.10,envMap:environment.texture,envMapIntensity:.85});old.dispose();}});
 const size=()=>{const w=viewport.clientWidth||500,h=viewport.clientHeight||440;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
 const resize=new ResizeObserver(size);resize.observe(viewport);size();
 const motion=createTeacherMotion();let character='zezinho',state='idle',energy=0,node=null,audioRevision=0,visible=true,disposed=false,last=0,frame=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const setMorph=(name,value)=>{for(const m of morphs){const i=m.morphTargetDictionary[name];if(i!==undefined)m.morphTargetInfluences[i]=value;}};
 const resetMouth=()=>{for(const m of morphs)for(const [name,i]of Object.entries(m.morphTargetDictionary))if(name.startsWith('viseme_')||name==='jawOpen')m.morphTargetInfluences[i]=0;energy=0;};
 const pose=(name,x=0,y=0,z=0)=>{if(bones[name])bones[name].quaternion.copy(rest[name]).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(x,y,z)));};
 function select(value){
  character=value==='mariazinha'?'mariazinha':'zezinho';const male=character==='zezinho';
  viewport.setAttribute('aria-label',`${male?'Professor Zezinho':'Professora Mariazinha'} em 3D`);
  appearance.select(character);
  resetMouth();
 }
 select(character);
 stage.dataset.avatar='3d';stage.querySelector('.teacher-avatar').setAttribute('hidden','');
 function render(now){
  if(disposed)return;frame=requestAnimationFrame(render);
  if(!visible||document.hidden){last=now;return;}if(now-last<1000/30)return;
  const dt=Math.min(now-last,100)||33;last=now;
  const p=motion.step({time:now,delta:dt,state,character,reduced:reduced.matches});
  setMorph('eyeBlinkLeft',p.blink);setMorph('eyeBlinkRight',p.blink);
  setMorph('mouthSmileLeft',p.smile);setMorph('mouthSmileRight',p.smile*.98);
  setMorph('eyeSquintLeft',p.squint);setMorph('eyeSquintRight',p.squint);
  setMorph('eyeLookOutRight',Math.max(0,p.gaze));setMorph('eyeLookInLeft',Math.max(0,p.gaze));setMorph('eyeLookOutLeft',Math.max(0,-p.gaze));setMorph('eyeLookInRight',Math.max(0,-p.gaze));
  setMorph('browInnerUp',p.brow);appearance.setExpression(p.brow,p.hairSway);
  pose('Head',...p.head);pose('Neck',p.neck,0,0);pose('Spine2',...p.spine);
  pose('LeftArm',0,0,p.arms[0]);pose('RightArm',0,0,p.arms[1]);
  pose('LeftForeArm',0,0,-.18);pose('RightForeArm',0,0,.18);
  if(node)node.update(dt);
  else setMorph('jawOpen',state==='speaking'?energy*.50:0);
  renderer.render(scene,camera);
 }
 const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});intersection.observe(stage);
 frame=requestAnimationFrame(render);
 const api={
  select,
  setState(value){if(disposed||state===value)return;state=value;if(value!=='speaking')resetMouth();},
  setEnergy(value){if(disposed)return;energy=clamp(value*15,0,1);},
  async connectAudio(context,source){
   if(disposed)return;const rev=++audioRevision;
   try{
    await context.audioWorklet.addModule('/assets/teachers/vendor/headworklet.min.mjs');
    if(rev!==audioRevision||context.state==='closed')return;
    const next=new HeadAudio(context,{parameterData:{vadGateActiveDb:-42,vadGateInactiveDb:-52}});
    await next.loadModel('/assets/teachers/vendor/model-en-mixed.bin');
    if(rev!==audioRevision||context.state==='closed'){next.stop();next.disconnect();next.port.close();return;}
    node=next;next.onvalue=(key,value)=>setMorph(key,state==='speaking'?clamp(value*.82,0,.85):0);
    next.onprocessorerror=()=>{api.disconnectAudio();};source.connect(next);
   }catch{if(rev===audioRevision)api.disconnectAudio();} // Audio and jaw animation keep working on older browsers.
  },
  disconnectAudio(){audioRevision++;if(node){node.onvalue=null;node.stop();node.disconnect();node.port.close();node=null;}resetMouth();},
  dispose(){if(disposed)return;disposed=true;api.disconnectAudio();cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const value of Object.values(o.material))if(value?.isTexture)value.dispose();o.material.dispose();}});schoolLogo.dispose();environment.dispose();renderer.dispose();viewport.remove();}
 };
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();api.dispose();stage.dataset.avatar='fallback';stage.querySelector('.teacher-avatar').removeAttribute('hidden');stage.querySelector('.avatar-loading').textContent='Visual simplificado. A conversa por voz continua disponível.';});
 return api;
}
