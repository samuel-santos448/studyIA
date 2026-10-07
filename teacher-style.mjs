import * as THREE from '/vendor/three.module.js';
import {mergeGeometries} from '/vendor/utils/BufferGeometryUtils.js';

// Appearance stays on the same facial rig, including all speech shape keys.
export function styleTeacher({scene,model,bones,clothing,hair,lashes,faceMeshes}){
 const head=bones.Head,torso=bones.Spine2;
 const originalFace=faceMeshes.map(m=>m.geometry.attributes.position.array.slice());
 const originalShirt=clothing?.geometry.attributes.position.array.slice();
 const attach=(object,bone)=>{scene.add(object);model.updateMatrixWorld(true);bone?.attach(object);};
 const makeMaterial=color=>new THREE.MeshStandardMaterial({color,roughness:.74});
 const hairMaterials=[0x30221b,0x34241e,0x392820,0x3e2c22].map(makeMaterial);
 const maleHair=new THREE.Group(),femaleHair=new THREE.Group();
 const hairCap=()=>{
  const geometry=new THREE.SphereGeometry(1,48,30,0,Math.PI*2,0,1.98);
  const positions=geometry.attributes.position;
  for(let i=0;i<positions.count;i++){
   const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);
   const theta=Math.acos(THREE.MathUtils.clamp(y,-1,1));
   const phi=Math.atan2(z,-x),front=Math.max(0,Math.sin(phi));
   const angle=theta/1.98*(1.95-.64*front+.12*front*Math.cos(phi));
   positions.setXYZ(i,-Math.cos(phi)*Math.sin(angle)*.095,1.698+Math.cos(angle)*.087,.040+Math.sin(phi)*Math.sin(angle)*.113);
  }
  geometry.computeVertexNormals();return new THREE.Mesh(geometry,hairMaterials[0]);
 };
 maleHair.add(hairCap());femaleHair.add(hairCap());
 const strand=(group,points,radius,index)=>{
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  group.add(new THREE.Mesh(new THREE.TubeGeometry(curve,20,radius,5,false),hairMaterials[index%hairMaterials.length]));
 };
 // Hair follows the scalp surface, with a restrained side part.
 const scalpPoint=(theta,phi,offset=.001)=>[-Math.cos(phi)*Math.sin(theta)*(.095+offset),1.698+Math.cos(theta)*(.087+offset),.040+Math.sin(phi)*Math.sin(theta)*(.113+offset)];
 for(let i=0;i<64;i++){
  const phi=i/64*Math.PI*2,front=Math.max(0,Math.sin(phi)),end=1.95-.64*front+.12*front*Math.cos(phi);
  const points=Array.from({length:7},(_,j)=>{const t=j/6;return scalpPoint(.12+(end-.12)*t,phi+.4*(1-t),.0013);});
  strand(maleHair,points,.00045,i);strand(femaleHair,points,.0005,i);
 }
 // A continuous bob silhouette gives volume around the ears and shoulders.
 const bobPoint=(t,angle,offset=0)=>{
  const wave=Math.sin(t*Math.PI*1.35+angle*.5)*.004;
  const width=.089+.014*Math.sin(t*Math.PI*.8)+wave+offset;
  return[Math.sin(angle)*width,1.718-t*.27,.035+Math.cos(angle)*(.107+.010*t+offset)];
 };
 const positions=[],indices=[],columns=64,rows=24;
 for(let row=0;row<=rows;row++)for(let column=0;column<=columns;column++)positions.push(...bobPoint(row/rows,.78+column/columns*(Math.PI*2-1.56)));
 for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){const i=row*(columns+1)+col;indices.push(i,i+columns+1,i+1,i+1,i+columns+1,i+columns+2);}
 const shell=new THREE.BufferGeometry();shell.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));shell.setIndex(indices);shell.computeVertexNormals();
 const bobMaterial=hairMaterials[0].clone();bobMaterial.side=THREE.DoubleSide;femaleHair.add(new THREE.Mesh(shell,bobMaterial));
 for(let i=0;i<64;i++){
  const angle=.78+i/63*(Math.PI*2-1.56),points=Array.from({length:7},(_,j)=>bobPoint(j/6,angle+.016*Math.sin(j*.6),.001));
  strand(femaleHair,points,.00075,i);
 }
 // Merge the static hair strands to avoid hundreds of draw calls on phones.
 const mergeGroup=group=>{
  const buckets=new Map();
  for(const mesh of group.children){const key=mesh.material.uuid+':'+Object.keys(mesh.geometry.attributes).sort().join(',');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(mesh);}
  for(const meshes of buckets.values())if(meshes.length>1){const geometry=mergeGeometries(meshes.map(m=>m.geometry));if(!geometry)continue;group.add(new THREE.Mesh(geometry,meshes[0].material));for(const mesh of meshes){group.remove(mesh);mesh.geometry.dispose();}}
 };
 mergeGroup(maleHair);mergeGroup(femaleHair);
 attach(maleHair,head);attach(femaleHair,head);
 const brows=new THREE.Group();
 model.traverse(o=>{if(o.isMesh&&o.name.includes('eyebrows'))o.visible=false;});
 for(const side of [-1,1])for(let i=0;i<7;i++)strand(brows,[[side*.053,1.667+i*.0003,.156],[side*.044,1.672+i*.0003,.163],[side*.030,1.673+i*.0003,.166],[side*.017,1.669+i*.0002,.160]],.00022,0);
 mergeGroup(brows);attach(brows,head);
 if(hair)hair.visible=false;if(lashes)lashes.visible=false;

 // A small studio reflection adds life to the eyes without remote HDR files.
 const studio=new THREE.Scene();studio.background=new THREE.Color(0x333b42);
 for(const [x,y,z,w,h]of [[-2,2,3,2,3],[2,1,3,1,2],[0,4,-1,3,1]]){
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:0xffffff}));
  panel.position.set(x,y,z);panel.lookAt(0,0,0);studio.add(panel);
 }
 const collarMaterial=makeMaterial(0x245a87),accessories=new THREE.Group();
 const panel=points=>{
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));geometry.setIndex([0,1,2,0,2,3]);geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,collarMaterial);mesh.material.side=THREE.DoubleSide;accessories.add(mesh);
 };
 for(const side of [-1,1])panel([[side*.030,1.493,.130],[side*.068,1.481,.143],[side*.059,1.440,.174],[side*.014,1.465,.160]]);
 const buttonMaterial=new THREE.MeshStandardMaterial({color:0xe8e5dc,roughness:.45});
 for(const y of [1.427,1.395]){
  const button=new THREE.Mesh(new THREE.SphereGeometry(.0028,12,8),buttonMaterial);button.scale.z=.4;button.position.set(0,y,.161);accessories.add(button);
 }
 const badgeMaterial=makeMaterial(0x4caf45);
 const badge=new THREE.Mesh(new THREE.CircleGeometry(.009,24),badgeMaterial);badge.position.set(.104,1.402,.168);accessories.add(badge);
 attach(accessories,torso);
 const earrings=new THREE.Group();
 for(const side of [-1,1]){
  const stud=new THREE.Mesh(new THREE.SphereGeometry(.0028,12,10),new THREE.MeshStandardMaterial({color:0xf0dfb7,metalness:.6,roughness:.25}));stud.position.set(side*.071,1.621,.076);earrings.add(stud);
 }attach(earrings,head);

 const maleUniform={value:1};
 for(const mesh of faceMeshes){
  mesh.material.roughness=.63;
  mesh.material.onBeforeCompile=shader=>{
   shader.uniforms.teacherMale=maleUniform;
   shader.vertexShader='varying vec3 teacherSkinPoint;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nteacherSkinPoint=position;');
   shader.fragmentShader='uniform float teacherMale;\nvarying vec3 teacherSkinPoint;\n'+shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
    vec3 p=teacherSkinPoint;
    float chin=smoothstep(1.537,1.55,p.y)*(1.-smoothstep(1.589,1.610,p.y));
    float sides=smoothstep(.036,.054,abs(p.x))*(1.-smoothstep(.075,.086,abs(p.x)))*smoothstep(1.552,1.574,p.y)*(1.-smoothstep(1.62,1.64,p.y));
    float front=smoothstep(.070,.120,p.z);
    float grain=fract(sin(dot(p.xy*17000.,vec2(12.9898,78.233)))*43758.5453);
    float stubble=teacherMale*max(chin,sides)*front*(.028+.055*grain);
    diffuseColor.rgb*=1.-stubble;
   `);
  };
  mesh.material.customProgramCacheKey=()=> 'studyia-skin-v2';
 }
 function select(character){
  const male=character==='zezinho';maleUniform.value=male?1:0;
  maleHair.visible=male;femaleHair.visible=!male;earrings.visible=!male;
  collarMaterial.color.setHex(male?0x286294:0xece7db);
  badgeMaterial.color.setHex(male?0x4caf45:0x164574);
  if(clothing){clothing.material.map=null;clothing.material.color.setHex(male?0x17436b:0x3f785c);clothing.material.roughness=.8;}
  for(let j=0;j<faceMeshes.length;j++){
   const mesh=faceMeshes[j],position=mesh.geometry.attributes.position,base=originalFace[j];
   mesh.material.color.setHex(male?0xe9d3be:0xffe4d7);
   for(let i=0;i<position.count;i++){
    const x=base[i*3],y=base[i*3+1],z=base[i*3+2];
    const jaw=y>1.53&&y<1.65?1+(male?.21:-.025)*Math.sin((y-1.53)/.12*Math.PI):1;
    const nose=male&&Math.abs(x)<.022&&y>1.608&&y<1.65&&z>.14?1.10:1;
    const chest=male&&y>1.18&&y<1.49&&Math.abs(x)<.18&&z>.07;
    position.setXYZ(i,x*jaw*nose,y,chest?.07+(z-.07)*.65:z);
   }position.needsUpdate=true;mesh.geometry.computeVertexNormals();
  }
  if(clothing&&originalShirt){
   const position=clothing.geometry.attributes.position;
   for(let i=0;i<position.count;i++){const x=originalShirt[i*3],y=originalShirt[i*3+1],z=originalShirt[i*3+2];const chest=male&&y>1.18&&y<1.49&&Math.abs(x)<.18&&z>.07;position.setXYZ(i,x,y,chest?.075+(z-.075)*.65:z);}position.needsUpdate=true;clothing.geometry.computeVertexNormals();
  }
 }
 return{select,studio};
}
