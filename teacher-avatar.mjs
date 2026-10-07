import * as THREE from '/vendor/three.module.js';
import {createTeacherMotion} from './teacher-motion.mjs';
import {createTeacherCharacter} from './teacher-character.mjs';
import {HeadAudio} from '/assets/teachers/vendor/headaudio.min.mjs';

const clamp=THREE.MathUtils.clamp;

export async function createTeacherAvatar(stage){
 const viewport=document.createElement('div');viewport.className='teacher-3d';viewport.setAttribute('role','img');viewport.setAttribute('aria-label','Professor Zezinho em 3D');
 stage.insertBefore(viewport,stage.querySelector('.live-caption'));
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch(error){viewport.remove();throw error;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.10;
 viewport.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(30,1,0.1,20);
 camera.position.set(0,1.60,1.40);camera.lookAt(0,1.565,0);
 scene.add(new THREE.HemisphereLight(0xfff4e5,0x647a84,.95));
 const key=new THREE.DirectionalLight(0xffe9d3,3.3);key.position.set(-2,3,4);scene.add(key);
 const fill=new THREE.DirectionalLight(0xe3edff,.70);fill.position.set(2,1,3);scene.add(fill);
 const rim=new THREE.DirectionalLight(0xffe3bd,3.3);rim.position.set(1,2,-2);scene.add(rim);
 const studio=new THREE.Scene();studio.background=new THREE.Color(0x333b42);
 for(const [x,y,z,w,h]of [[-2,2,3,2,3],[2,1,3,1,2],[0,4,-1,3,1]]){
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:0xffffff}));panel.position.set(x,y,z);panel.lookAt(0,0,0);studio.add(panel);
 }
 const pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(studio,.04);pmrem.dispose();
 studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 let schoolLogo,actor;
 try{
  schoolLogo=await new THREE.TextureLoader().loadAsync('/school-logo.jpg');schoolLogo.colorSpace=THREE.SRGBColorSpace;schoolLogo.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
  actor=createTeacherCharacter({logo:schoolLogo,environment:environment.texture});scene.add(actor.root);
 }catch(error){schoolLogo?.dispose();environment.dispose();renderer.dispose();viewport.remove();throw error;}
 const size=()=>{const w=viewport.clientWidth||500,h=viewport.clientHeight||440;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
 const resize=new ResizeObserver(size);resize.observe(viewport);size();
 const motion=createTeacherMotion();let character='zezinho',state='idle',energy=0,node=null,audioSource=null,audioRevision=0,visible=true,disposed=false,last=0,frame=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const setMorph=(name,value)=>actor.setMorph(name,value);
 const resetMouth=()=>{actor.resetSpeech();energy=0;};
 function select(value){
  character=value==='mariazinha'?'mariazinha':'zezinho';
  viewport.setAttribute('aria-label',`${character==='zezinho'?'Professor Zezinho':'Professora Mariazinha'} em 3D`);actor.select(character);resetMouth();
 }
 select(character);
 stage.dataset.avatar='3d';stage.querySelector('.teacher-avatar').setAttribute('hidden','');
 function render(now){
  if(disposed)return;frame=requestAnimationFrame(render);
  if(!visible||document.hidden){last=now;return;}if(now-last<1000/30)return;
  const dt=Math.min(now-last,100)||33;last=now;
  const p=motion.step({time:now,delta:dt,state,character,reduced:reduced.matches});
  if(node)node.update(dt);else setMorph('jawOpen',state==='speaking'?energy*.65:0);
  actor.update(p,dt);renderer.render(scene,camera);
 }
 const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});intersection.observe(stage);
 frame=requestAnimationFrame(render);
 const api={
  select,
  setState(value){if(disposed||state===value)return;state=value;if(value!=='speaking')resetMouth();},
  setEnergy(value){if(disposed)return;energy=clamp(value*15,0,1);},
  async connectAudio(context,source){
   if(disposed)return;api.disconnectAudio();const rev=++audioRevision;
   try{
    await context.audioWorklet.addModule('/assets/teachers/vendor/headworklet.min.mjs');
    if(rev!==audioRevision||context.state==='closed')return;
    const next=new HeadAudio(context,{parameterData:{vadGateActiveDb:-42,vadGateInactiveDb:-52}});
    await next.loadModel('/assets/teachers/vendor/model-en-mixed.bin');
    if(rev!==audioRevision||context.state==='closed'){next.stop();next.disconnect();next.port.close();return;}
    node=next;next.onvalue=(key,value)=>setMorph(key,state==='speaking'?clamp(value*.82,0,.85):0);
    next.onprocessorerror=()=>{api.disconnectAudio();};source.connect(next);audioSource=source;
   }catch{if(rev===audioRevision)api.disconnectAudio();}
  },
  disconnectAudio(){audioRevision++;if(node){try{audioSource?.disconnect(node);}catch{}audioSource=null;node.onvalue=null;node.stop();node.disconnect();node.port.close();node=null;}resetMouth();},
  dispose(){if(disposed)return;disposed=true;api.disconnectAudio();cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();actor.dispose();const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());schoolLogo.dispose();environment.dispose();renderer.dispose();viewport.remove();}
 };
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();api.dispose();stage.dataset.avatar='fallback';stage.querySelector('.teacher-avatar').removeAttribute('hidden');stage.querySelector('.avatar-loading').textContent='Visual simplificado. A conversa por voz continua disponível.';});
 return api;
}
