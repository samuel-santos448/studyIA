import * as THREE from '/vendor/three.module.js';
import {mergeGeometries} from '/vendor/utils/BufferGeometryUtils.js';

// Appearance stays on the same facial rig, including all speech shape keys.
export function styleTeacher({scene,model,bones,clothing,hair,lashes,faceMeshes,schoolLogo}){
 const head=bones.Head,torso=bones.Spine2;
 const originalFace=faceMeshes.map(m=>m.geometry.attributes.position.array.slice());
 const originalShirt=clothing?.geometry.attributes.position.array.slice();
 const attach=(object,bone)=>{scene.add(object);model.updateMatrixWorld(true);bone?.attach(object);};
 const makeMaterial=color=>new THREE.MeshStandardMaterial({color,roughness:.74});
 const hairMaterials=[0x30221b,0x34241e,0x392820,0x3e2c22].map(makeMaterial);
 const maleHair=new THREE.Group(),femaleHair=new THREE.Group();
 const hairPoint=(theta,phi,male,offset=0)=>{
  const front=Math.max(0,Math.sin(phi));
  const lift=(male?.015:.007)*Math.exp(-Math.pow((theta-.70)/.48,2))*Math.max(.25,front);
  return[-Math.cos(phi)*Math.sin(theta)*((male?.093:.097)+offset),1.698+Math.cos(theta)*(.087+offset)+lift,.040+Math.sin(phi)*Math.sin(theta)*(.113+offset)];
 };
 const hairLimit=(phi,male)=>{const front=Math.max(0,Math.sin(phi));return 1.95-(male?.64:.62)*front+(male?.12:-.10)*front*Math.cos(phi);};
 const hairCap=male=>{
  const geometry=new THREE.SphereGeometry(1,48,30,0,Math.PI*2,0,1.98),positions=geometry.attributes.position;
  for(let i=0;i<positions.count;i++){
   const theta=Math.acos(THREE.MathUtils.clamp(positions.getY(i),-1,1)),phi=Math.atan2(positions.getZ(i),-positions.getX(i));
   const edge=hairLimit(phi,male)+.010*Math.sin(phi*9)+.004*Math.sin(phi*19);
   positions.setXYZ(i,...hairPoint(theta/1.98*edge,phi,male));
  }
  geometry.computeVertexNormals();return new THREE.Mesh(geometry,hairMaterials[0]);
 };
 maleHair.add(hairCap(true));femaleHair.add(hairCap(false));
 const strand=(group,points,radius,index)=>{
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  group.add(new THREE.Mesh(new THREE.TubeGeometry(curve,20,radius,5,false),hairMaterials[index%hairMaterials.length]));
 };
 // Hair follows the scalp surface, with a restrained side part.
 for(let i=0;i<76;i++){
  const phi=i/76*Math.PI*2;
  for(const [group,male] of [[maleHair,true],[femaleHair,false]]){
   const end=hairLimit(phi,male)+.007*Math.sin(phi*9);
   const points=Array.from({length:8},(_,j)=>{const t=j/7;return hairPoint(.12+(end-.12)*t,phi+(male?.53:-.40)*(1-t),male,.0011);});
   strand(group,points,male?.00044:.00055,i);
  }
 }
 // A continuous bob silhouette gives volume around the ears and shoulders.
 const bobPoint=(t,angle,offset=0)=>{
  const curve=Math.sin(t*Math.PI*2.1+angle*.6)*.0045;
  const width=.090+.013*Math.sin(t*Math.PI*.8)+curve+offset;
  const swept=angle+.09*Math.sin(t*Math.PI);
  const length=.249+.018*Math.cos(angle*2+.5);
  return[Math.sin(swept)*width,1.718-t*length+.003*Math.sin(angle*5)*t*t,.035+Math.cos(swept)*(.109+.011*t+offset)];
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
 for(const mesh of femaleHair.children)mesh.geometry.translate(0,-1.66,-.04);femaleHair.position.set(0,1.66,.04);
 attach(maleHair,head);attach(femaleHair,head);const hairRest=femaleHair.quaternion.clone(),hairTurn=new THREE.Quaternion();
 const brows=new THREE.Group();
 model.traverse(o=>{if(o.isMesh&&o.name.includes('eyebrows'))o.visible=false;});
 for(const side of [-1,1])for(let i=0;i<7;i++)strand(brows,[[side*.053,1.667+i*.0003,.156],[side*.044,1.672+i*.0003,.163],[side*.030,1.673+i*.0003,.166],[side*.017,1.669+i*.0002,.160]],.00022,0);
 mergeGroup(brows);attach(brows,head);const browRest=brows.position.clone();
 if(hair)hair.visible=false;if(lashes){lashes.visible=true;lashes.material.transparent=true;lashes.material.depthWrite=false;lashes.material.color.setHex(0x483a30);lashes.material.roughness=.8;}

 // A small studio reflection adds life to the eyes without remote HDR files.
 const studio=new THREE.Scene();studio.background=new THREE.Color(0x333b42);
 for(const [x,y,z,w,h]of [[-2,2,3,2,3],[2,1,3,1,2],[0,4,-1,3,1]]){
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:0xffffff}));
  panel.position.set(x,y,z);panel.lookAt(0,0,0);studio.add(panel);
 }
 const collarMaterial=makeMaterial(0x245a87),accessories=new THREE.Group();
 const panel=points=>{
  const vertices=[],uvs=[],indices=[],segments=12,p=points.map(v=>new THREE.Vector3(...v));
  for(let row=0;row<=segments;row++)for(let col=0;col<=segments;col++){
   const u=col/segments,v=row/segments,top=p[0].clone().lerp(p[1],u),bottom=p[3].clone().lerp(p[2],u),point=top.lerp(bottom,v);
   point.z+=.003*Math.sin(u*Math.PI)*Math.sin(v*Math.PI);vertices.push(point.x,point.y,point.z);uvs.push(u,v);
  }
  for(let row=0;row<segments;row++)for(let col=0;col<segments;col++){const i=row*(segments+1)+col;indices.push(i,i+1,i+segments+1,i+1,i+segments+2,i+segments+1);}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,collarMaterial);mesh.material.side=THREE.DoubleSide;accessories.add(mesh);
 };
 for(const side of [-1,1])panel([[side*.030,1.493,.130],[side*.068,1.481,.143],[side*.059,1.440,.174],[side*.014,1.465,.160]]);
 const buttonMaterial=new THREE.MeshStandardMaterial({color:0xe8e5dc,roughness:.45});
 for(const y of [1.427,1.395]){
  const button=new THREE.Mesh(new THREE.SphereGeometry(.0028,12,8),buttonMaterial);button.scale.z=.4;button.position.set(0,y,.161);accessories.add(button);
 }
  const placketMaterial=makeMaterial(0x23547e);
 const placket=new THREE.Mesh(new THREE.PlaneGeometry(.012,.077),placketMaterial);placket.position.set(0,1.414,.159);accessories.add(placket);
 if(clothing){
  clothing.material.onBeforeCompile=shader=>{
   shader.uniforms.teacherSchoolLogo={value:schoolLogo};
   shader.vertexShader='varying vec3 teacherClothPoint;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nteacherClothPoint=position;');
   shader.fragmentShader='uniform sampler2D teacherSchoolLogo;\nvarying vec3 teacherClothPoint;\n'+shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
    vec3 fabricPoint=teacherClothPoint;
    float weave=sin(fabricPoint.x*8000.)*sin(fabricPoint.y*8000.);
    float pixelSize=max(length(dFdx(fabricPoint.xy)),length(dFdy(fabricPoint.xy)));
    diffuseColor.rgb*=1.+weave*.022*clamp(1.-pixelSize*4000.,0.,1.);
    vec2 logoUV=(fabricPoint.xy-vec2(.100,1.403))/vec2(.110,.0493)+.5;
    if(fabricPoint.z>.085&&logoUV.x>0.&&logoUV.x<1.&&logoUV.y>0.&&logoUV.y<1.){
     float edge=min(min(logoUV.x,1.-logoUV.x),min(logoUV.y,1.-logoUV.y));
     float coverage=smoothstep(0.,.013,edge);
     vec3 schoolInk=texture2D(teacherSchoolLogo,logoUV).rgb;
     diffuseColor.rgb=mix(diffuseColor.rgb,schoolInk*.88,coverage);
    }
   `);
  };
  clothing.material.customProgramCacheKey=()=> 'studyia-school-uniform-v1';
 }

 attach(accessories,torso);
 const earrings=new THREE.Group();
 for(const side of [-1,1]){
  const stud=new THREE.Mesh(new THREE.SphereGeometry(.0028,12,10),new THREE.MeshStandardMaterial({color:0xf0dfb7,metalness:.6,roughness:.25}));stud.position.set(side*.071,1.621,.076);earrings.add(stud);
 }attach(earrings,head);

 const glasses=new THREE.Group(),frameMaterial=new THREE.MeshStandardMaterial({color:0x27394b,roughness:.4,metalness:.25});
 const frame=points=>{const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));glasses.add(new THREE.Mesh(new THREE.TubeGeometry(curve,32,.00095,7,false),frameMaterial));};
 for(const side of [-1,1]){
  const cx=side*.035,cy=1.655,cz=.176,w=.027,h=.017,r=.008;
  const points=[],centers=[[w-r,h-r],[-w+r,h-r],[-w+r,-h+r],[w-r,-h+r]];
  for(let corner=0;corner<4;corner++)for(let i=0;i<=8;i++){const a=corner*Math.PI/2+i/8*Math.PI/2,[dx,dy]=centers[corner];points.push([cx+dx+r*Math.cos(a),cy+dy+r*Math.sin(a),cz]);}
  points.push(points[0]);frame(points);
  frame([[side*.062,1.66,.176],[side*.071,1.66,.152],[side*.076,1.663,.064]]);
 }
 frame([[-.010,1.663,.176],[0,1.667,.181],[.010,1.663,.176]]);
 attach(glasses,head);
 const maleUniform={value:1};
 for(const mesh of faceMeshes){
  mesh.material.roughness=.58;
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
    float cheeks=exp(-pow((abs(p.x)-.046)/.017,2.)-pow((p.y-1.623)/.024,2.))*front;
    diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.028,.975,.963),cheeks*.5);
   `);
  };
  mesh.material.customProgramCacheKey=()=> 'studyia-skin-v3';
 }
 function select(character){
  const male=character==='zezinho';maleUniform.value=male?1:0;
  const shades=male?[0x281f1b,0x2d221c,0x34271f,0x392b22]:[0x35251a,0x3d2a1e,0x453226,0x4d382d];hairMaterials.forEach((m,i)=>m.color.setHex(shades[i]));bobMaterial.color.setHex(shades[0]);
  maleHair.visible=male;femaleHair.visible=!male;earrings.visible=!male;glasses.visible=male;if(lashes)lashes.material.opacity=male?.14:.28;
  collarMaterial.color.setHex(male?0x286294:0xece7db);
  placketMaterial.color.setHex(male?0x23547e:0x487f65);
  if(clothing){clothing.material.map=null;clothing.material.color.setHex(male?0x17436b:0x3f785c);clothing.material.roughness=.91;if(clothing.material.normalScale)clothing.material.normalScale.set(.6,.6);}
  for(let j=0;j<faceMeshes.length;j++){
   const mesh=faceMeshes[j],position=mesh.geometry.attributes.position,base=originalFace[j];
   mesh.material.color.setHex(male?0xf0dfcf:0xffeadf);
   for(let i=0;i<position.count;i++){
    const x=base[i*3],y=base[i*3+1],z=base[i*3+2];
    const jaw=y>1.53&&y<1.65?1+(male?.12:-.020)*Math.sin((y-1.53)/.12*Math.PI):1;
    const nose=male&&Math.abs(x)<.022&&y>1.608&&y<1.65&&z>.14?1.04:1;
    const chest=male&&y>1.18&&y<1.49&&Math.abs(x)<.18&&z>.07;
    const cheek=male&&Math.abs(x)>.040&&Math.abs(x)<.076&&y>1.604&&y<1.65&&z>.095?-.003:0;
    const chin=male&&y>1.542&&y<1.585&&z>.11?.002:0;
    position.setXYZ(i,x*jaw*nose,y,chest?.07+(z-.07)*.65:z+cheek+chin);
   }position.needsUpdate=true;mesh.geometry.computeVertexNormals();
  }
  if(clothing&&originalShirt){
   const position=clothing.geometry.attributes.position;
   for(let i=0;i<position.count;i++){const x=originalShirt[i*3],y=originalShirt[i*3+1],z=originalShirt[i*3+2];const chest=male&&y>1.18&&y<1.49&&Math.abs(x)<.18&&z>.07;position.setXYZ(i,x,y,chest?.075+(z-.075)*.65:z);}position.needsUpdate=true;clothing.geometry.computeVertexNormals();
  }
 }
 return{select,studio,setExpression(value,sway=0){brows.position.copy(browRest);brows.position.y+=value*.0018;hairTurn.setFromEuler(new THREE.Euler(0,0,sway));femaleHair.quaternion.copy(hairRest).multiply(hairTurn);}};
}
