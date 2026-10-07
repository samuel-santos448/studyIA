import * as THREE from '/vendor/three.module.js';
import {mergeGeometries} from '/vendor/utils/BufferGeometryUtils.js';
import {getTeacherSpeechShape} from './teacher-face.mjs';

const clamp=THREE.MathUtils.clamp;
const v=p=>new THREE.Vector3(...p);

// Original parametric characters. Facial controls remain independent from voice transport.
export function createTeacherCharacter({logo,environment}){
 const root=new THREE.Group(),body=new THREE.Group(),head=new THREE.Group();root.add(body);body.add(head);
 head.position.set(0,1.62,0);
 const material=(color,roughness=.6)=>new THREE.MeshPhysicalMaterial({color,roughness,envMap:environment,envMapIntensity:.28});
 const skin=material(0xf0b987,.64);skin.clearcoat=.08;skin.clearcoatRoughness=.6;
 const earSkin=material(0xd98a70,.7),lipSkin=material(0xc27969,.66);
 const shirt=material(0x164c79,.82),collar=material(0x205c89,.76),seam=material(0x113855,.88);
 const hair=material(0x352018,.64),hairLight=material(0x483024,.68),hairDark=material(0x291b16,.70);
 const sclera=material(0xfffaf0,.22),irisMat=material(0x74452b,.29),pupil=material(0x11191d,.17);
 const mouthMat=material(0x542a2c,.9),teethMat=material(0xfff5dc,.38),tongueMat=material(0xb66468,.8);
 const gold=material(0xe5bb69,.25);gold.metalness=.65;
 const sphere=new THREE.SphereGeometry(1,36,24);
 const ellipsoid=(parent,mat,pos,scale)=>{const mesh=new THREE.Mesh(sphere,mat);mesh.position.set(...pos);mesh.scale.set(...scale);parent.add(mesh);return mesh;};
 const tube=(parent,points,radius,mat,segments=32)=>{const curve=new THREE.CatmullRomCurve3(points.map(v));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,segments,radius,8,false),mat);parent.add(mesh);return mesh;};
 const tapered=(parent,points,width,depth,mat)=>{
  const curve=new THREE.CatmullRomCurve3(points.map(v)),frames=curve.computeFrenetFrames(40,false),vertices=[],indices=[],uv=[];
  for(let i=0;i<=40;i++){
   const t=i/40,p=curve.getPointAt(t),r=Math.max(.025,Math.pow(Math.sin(Math.PI*t),.38));
   for(let j=0;j<=10;j++){const a=j/10*Math.PI*2,q=p.clone().addScaledVector(frames.normals[i],Math.cos(a)*width*r).addScaledVector(frames.binormals[i],Math.sin(a)*depth*r);vertices.push(q.x,q.y,q.z);uv.push(t,j/10);}
  }
  for(let i=0;i<40;i++)for(let j=0;j<10;j++){const a=i*11+j;indices.push(a,a+1,a+11,a+1,a+12,a+11);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,mat);parent.add(mesh);return mesh;
 };
 const patch=(parent,points,mat)=>{
  const vertices=[],indices=[],uvs=[],segments=12,p=points.map(v);
  for(let row=0;row<=segments;row++)for(let col=0;col<=segments;col++){
   const u=col/segments,t=row/segments,q=p[0].clone().lerp(p[1],u).lerp(p[3].clone().lerp(p[2],u),t);q.z+=.003*Math.sin(u*Math.PI)*Math.sin(t*Math.PI);vertices.push(q.x,q.y,q.z);uvs.push(u,t);
  }
  for(let row=0;row<segments;row++)for(let col=0;col<segments;col++){const a=row*(segments+1)+col;indices.push(a,a+1,a+segments+1,a+1,a+segments+2,a+segments+1);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals();mat.side=THREE.DoubleSide;const mesh=new THREE.Mesh(geo,mat);parent.add(mesh);return mesh;
 };
 const torsoProfile=[[.185,.88],[.205,.98],[.218,1.15],[.230,1.29],[.224,1.36],[.172,1.415],[.065,1.445]];
 const torsoCurve=new THREE.SplineCurve(torsoProfile.map(([x,y])=>new THREE.Vector2(x,y)));
 const torsoGeo=new THREE.LatheGeometry(torsoCurve.getPoints(48),64),tp=torsoGeo.attributes.position;
 for(let i=0;i<tp.count;i++)tp.setZ(i,tp.getZ(i)*.48);
 torsoGeo.computeVertexNormals();const torso=new THREE.Mesh(torsoGeo,shirt);body.add(torso);
 ellipsoid(body,skin,[0,1.455,0],[.055,.127,.052]);
 // Tailored open polo collar, piping and buttons, with the unchanged school artwork.
 for(const side of [-1,1]){
  patch(body,[[side*.019,1.439,.069],[side*.070,1.428,.083],[side*.086,1.367,.115],[side*.030,1.391,.109]],collar);
  tube(body,[[side*.022,1.441,.072],[side*.069,1.429,.086],[side*.087,1.367,.117]],.0007,seam,16);
 }
 const placket=new THREE.Mesh(new THREE.PlaneGeometry(.017,.136),collar);placket.position.set(0,1.327,.115);body.add(placket);
 for(const y of [1.369,1.324,1.279])ellipsoid(body,teethMat,[0,y,.117],[.0031,.0031,.0015]);
 const badgeMat=new THREE.MeshStandardMaterial({map:logo,roughness:.92,envMap:environment,envMapIntensity:.15});
 // A curved embroidered patch shares the chest contour and rotates with the body.
 const badgeGeo=new THREE.PlaneGeometry(.103,.0462,16,6),bp=badgeGeo.attributes.position;
 for(let i=0;i<bp.count;i++){const x=bp.getX(i)+.096,y=bp.getY(i)+1.311;bp.setXYZ(i,x,y,.230*.48*Math.sqrt(Math.max(.02,1-(x/.230)**2))+.0035);}badgeGeo.computeVertexNormals();body.add(new THREE.Mesh(badgeGeo,badgeMat));

 // The head is sculpted from a closed surface: broad cheeks, a tapered jaw, soft forehead.
 const faceGeo=new THREE.SphereGeometry(1,64,48),fp=faceGeo.attributes.position;
 for(let i=0;i<fp.count;i++){
  const x=fp.getX(i),y=fp.getY(i),z=fp.getZ(i),jaw=y<-.20?1-(Math.abs(y)-.20)*.23:1;
  const cheek=Math.exp(-Math.pow((Math.abs(x)-.66)/.28,2)-Math.pow((y+.25)/.35,2))*Math.max(0,z)*.012;
  fp.setXYZ(i,x*.142*jaw,y*.187*(y<0?.91:1),z*.117+cheek);
 }faceGeo.computeVertexNormals();
 const faceSkin=skin.clone();faceSkin.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 teacherFacePoint;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nteacherFacePoint=position;');
  shader.fragmentShader='varying vec3 teacherFacePoint;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   vec3 p=teacherFacePoint;
   float blush=exp(-pow((abs(p.x)-.082)/.035,2.)-pow((p.y+.047)/.025,2.))*smoothstep(.05,.1,p.z);
   diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.07,.88,.84),blush*.42);
  `);
 };faceSkin.customProgramCacheKey=()=> 'studyia-stylized-skin-v1';head.add(new THREE.Mesh(faceGeo,faceSkin));
 for(const side of [-1,1]){
  ellipsoid(head,skin,[side*.128,-.010,-.004],[.027,.047,.025]);
  ellipsoid(head,earSkin,[side*.141,-.009,.016],[.011,.027,.008]);
  tube(head,[[side*.136,.019,.021],[side*.145,.009,.024],[side*.143,-.015,.024]],.0035,skin,12);
 }
 const nose=new THREE.Group();head.add(nose);
 ellipsoid(nose,skin,[0,-.003,.118],[.018,.042,.020]);
 ellipsoid(nose,skin,[0,-.034,.141],[.022,.020,.025]);
 for(const side of [-1,1]){ellipsoid(nose,skin,[side*.017,-.042,.131],[.010,.009,.011]);ellipsoid(nose,earSkin,[side*.012,-.049,.145],[.004,.002,.001]);}

 // Iris detail and catchlights are local geometry/texture, not external image assets.
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d');
 const grad=ctx.createRadialGradient(64,64,15,64,64,62);grad.addColorStop(0,'#402b20');grad.addColorStop(.4,'#aa7847');grad.addColorStop(.8,'#785034');grad.addColorStop(1,'#292c27');ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);
 for(let i=0;i<120;i++){const a=i/120*Math.PI*2;ctx.strokeStyle=i%3?'#5a3b2866':'#d2ac7066';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(64+Math.cos(a)*22,64+Math.sin(a)*22);ctx.lineTo(64+Math.cos(a+.01)*58,64+Math.sin(a+.01)*58);ctx.stroke();}
 const irisTexture=new THREE.CanvasTexture(canvas);irisTexture.colorSpace=THREE.SRGBColorSpace;irisMat.map=irisTexture;irisMat.color.setHex(0xffffff);
 const eyes=[],brows=[],earrings=new THREE.Group();head.add(earrings);
 for(const side of [-1,1]){
  const eye=new THREE.Group();eye.position.set(side*.055,.025,.106);eye.rotation.y=side*.15;head.add(eye);
  const eyeGeo=sphere.clone(),ep=eyeGeo.attributes.position;
  for(let k=0;k<ep.count;k++)if(ep.getY(k)>0)ep.setY(k,ep.getY(k)*.80);eyeGeo.computeVertexNormals();
  const globe=new THREE.Mesh(eyeGeo,sclera);globe.scale.set(.040,.032,.018);eye.add(globe);
  const look=new THREE.Group();eye.add(look);
  const iris=new THREE.Mesh(new THREE.CircleGeometry(.021,48),irisMat);iris.position.z=.020;look.add(iris);
  ellipsoid(look,pupil,[0,0,.022],[.010,.011,.002]);
  ellipsoid(look,new THREE.MeshBasicMaterial({color:0xffffff}),[-.005,.006,.025],[.003,.003,.001]);
  ellipsoid(look,new THREE.MeshBasicMaterial({color:0xffffff}),[.005,-.005,.025],[.0013,.0013,.001]);
  const upper=[],lower=[];
  for(let j=0;j<=16;j++){const t=j/16*Math.PI;upper.push([-.039*Math.cos(t),.023*Math.sin(t),.007+.006*Math.sin(t)]);lower.push([-.039*Math.cos(t),-.027*Math.sin(t),.005+.009*Math.sin(t)]);}
  const upperLid=tube(eye,upper,.0054,skin,32),lowerLid=tube(eye,lower,.0032,skin,32);
  const lash=tube(eye,upper.map(p=>[p[0],p[1]-.002,p[2]+.003]),.0011,hairDark,32);
  const brow=new THREE.Group();brow.position.set(side*.056,.078,.108);head.add(brow);
  tapered(brow,[[side*-.041,-.005,-.002],[side*-.022,.006,.006],[side*.005,.008,.010],[side*.034,-.005,0]],.0075,.004,hair,24);
  eyes.push({eye,globe,look,iris,upperLid,lowerLid,lash});brows.push({group:brow,side});
  ellipsoid(earrings,gold,[side*.137,-.043,.023],[.007,.009,.004]);
 }

 // Reusable mouth meshes are deformed in place for every viseme; no per-frame allocations.
 const mouth=new THREE.Group();mouth.position.set(0,-.094,.105);head.add(mouth);
 const segments=48,ring=8;
 function mouthSurface(mat,rows=1){const geo=new THREE.PlaneGeometry(1,1,segments,rows);const mesh=new THREE.Mesh(geo,mat);mouth.add(mesh);return mesh;}
 const cavity=mouthSurface(mouthMat),teeth=mouthSurface(teethMat),tongue=mouthSurface(tongueMat);
 const lipGeo=new THREE.BufferGeometry(),lipPositions=new Float32Array((segments+1)*(ring+1)*3),lipIndices=[];
 for(let i=0;i<segments;i++)for(let j=0;j<ring;j++){const a=i*(ring+1)+j;lipIndices.push(a,a+ring+1,a+1,a+1,a+ring+1,a+ring+2);}
 lipGeo.setAttribute('position',new THREE.BufferAttribute(lipPositions,3));lipGeo.setIndex(lipIndices);const lips=new THREE.Mesh(lipGeo,lipSkin);mouth.add(lips);
 let smoothJaw=0,smoothRound=0,lastWidth=-1,lastOpen=-1,lastSmile=-1;
 const speech=new Map();
 function updateMouth(smile,delta){
  const shape=getTeacherSpeechShape(speech),oh=shape.round,pressed=shape.press;
  const jaw=clamp(shape.jaw,0,.9)*(1-pressed);
  const ease=1-Math.exp(-delta/65);smoothJaw+=(jaw-smoothJaw)*ease;smoothRound+=(oh-smoothRound)*ease;
  const width=.050+smile*.025+shape.wide*.005-smoothRound*.026,open=(.015+smile*.014+smoothJaw*.042)*(1-pressed*.97),lift=.007+smile*.032;
  if(Math.abs(width-lastWidth)+Math.abs(open-lastOpen)+Math.abs(lift-lastSmile)<.00003)return;lastWidth=width;lastOpen=open;lastSmile=lift;
  const top=x=>lift*x*x+open*.20*(1-x*x),bottom=x=>lift*x*x-open*Math.pow(Math.max(0,1-x*x),.72);
  for(const [mesh,type]of [[cavity,'cavity'],[teeth,'teeth'],[tongue,'tongue']]){
   const p=mesh.geometry.attributes.position;
   for(let row=0;row<2;row++)for(let col=0;col<=segments;col++){
    const x=col/segments*2-1,y1=top(x),y2=bottom(x),f=Math.max(0,1-x*x);
    let y=row?y2+shape.lowerLip*.004*f:y1,z=.013*(1-x*x);
    if(type==='teeth'){y=row?Math.max(y2+.003,y1-Math.min(.009,open*.68)*f):y1;z+=.0018;}
    if(type==='tongue'){y=row?y2:y2+Math.min(.006,open*.25)*f;z+=.001;}
    p.setXYZ(row*(segments+1)+col,x*width,y,z);
   }p.needsUpdate=true;mesh.geometry.computeVertexNormals();
  }
  for(let i=0;i<=segments;i++){
   const a=i/segments*Math.PI*2,x=Math.cos(a),upper=Math.sin(a)>=0,y=upper?top(x):bottom(x)+shape.lowerLip*.004*(1-x*x),radius=upper?.0032:.0045;
   for(let j=0;j<=ring;j++){const b=j/ring*Math.PI*2,index=(i*(ring+1)+j)*3;lipPositions[index]=x*width+Math.cos(a)*Math.cos(b)*radius;lipPositions[index+1]=y+Math.sin(a)*Math.cos(b)*radius;lipPositions[index+2]=.013*(1-x*x)+Math.sin(b)*radius+.001;}
  }lipGeo.attributes.position.needsUpdate=true;lipGeo.computeVertexNormals();
 }

 const maleHair=new THREE.Group(),femaleHair=new THREE.Group();head.add(maleHair,femaleHair);
 const scalpGeo=new THREE.SphereGeometry(1,48,32,0,Math.PI*2,0,1.72);
 const maleScalp=new THREE.Mesh(scalpGeo,hair);maleScalp.position.set(0,.105,-.022);maleScalp.scale.set(.147,.101,.117);maleHair.add(maleScalp);
 // Large swept locks, each with an intentional silhouette and two fine grooves.
 for(let i=0;i<6;i++){
  const pts=[[.112,.094+i*.004,.035-i*.014],[.072,.158+i*.009,.109-i*.025],[-.037,.184+i*.008,.121-i*.026],[-.122,.130+i*.004,.065-i*.013],[-.127,.066,-.006-i*.006]];
  tapered(maleHair,pts,.023,.021,i%3===0?hairLight:hair);
  tube(maleHair,pts.map(p=>[p[0],p[1]+.008,p[2]+.018]),.00065,hairLight,32);
 }
 for(const side of [-1,1])tapered(maleHair,[[side*.106,.094,.03],[side*.128,.066,.010],[side*.120,.009,-.005]],.015,.012,hair);
 ellipsoid(femaleHair,hair,[0,.090,-.041],[.150,.115,.114]);
 // Sculpted bob: separate flowing locks rather than a flat curtain of strands.
 for(const side of [-1,1])for(let i=0;i<6;i++){
  const angle=.15+i/5*1.50,x=side*(.114+Math.sin(angle)*.034),z=.020-Math.sin(angle)*.118;
  const pts=[[side*.042,.178,-.014],[x,.091,z],[x+side*.007,-.035,z+.007],[x-side*.008,-.163-i*.002,z+.025],[x-side*.033,-.176-i*.002,z+.028]];
  tapered(femaleHair,pts,.027,.022,i%4===0?hairLight:hair);
  tube(femaleHair,pts.map(p=>[p[0]-side*.004,p[1],p[2]+.020]),.0006,hairLight,32);
 }
 for(let i=0;i<4;i++)tapered(femaleHair,[[.084,.146+i*.009,.020-i*.018],[.030,.180+i*.008,.105-i*.024],[-.065,.142+i*.006,.111-i*.023],[-.128,.056,.042-i*.01]],.023,.021,i%3===0?hairLight:hair);
 // Static locks share geometries/materials; separate pivots remain animatable.
 function mergeStatic(group){const buckets=new Map();for(const m of [...group.children]){if(!m.isMesh)continue;m.updateMatrix();const key=m.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(m);}for(const meshes of buckets.values()){if(meshes.length<2)continue;const geometries=meshes.map(m=>m.geometry.clone().applyMatrix4(m.matrix));const merged=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());if(!merged)continue;group.add(new THREE.Mesh(merged,meshes[0].material));for(const m of meshes){group.remove(m);if(m.geometry!==sphere)m.geometry.dispose();}}}
 mergeStatic(maleHair);mergeStatic(femaleHair);

 const arms=[];
 for(const side of [-1,1]){
  const shoulder=new THREE.Group();shoulder.position.set(side*.192,1.370,0);body.add(shoulder);
  ellipsoid(shoulder,shirt,[side*.012,-.047,0],[.069,.100,.061]);
  ellipsoid(shoulder,skin,[0,-.142,0],[.043,.079,.043]);
  const elbow=new THREE.Group();elbow.position.y=-.205;shoulder.add(elbow);
  ellipsoid(elbow,skin,[0,-.086,0],[.037,.105,.035]);
  const wrist=new THREE.Group();wrist.position.y=-.177;elbow.add(wrist);
  ellipsoid(wrist,skin,[0,-.035,0],[.035,.049,.021]);
  const fingers=[];
  for(let i=0;i<4;i++){
   const finger=new THREE.Group();finger.position.set((i-1.5)*.017,-.061,.002);wrist.add(finger);const length=[.052,.063,.058,.045][i];
   ellipsoid(finger,skin,[0,-length*.26,0],[.009,length*.34,.010]);const tip=new THREE.Group();tip.position.y=-length*.50;finger.add(tip);ellipsoid(tip,skin,[0,-length*.20,0],[.008,length*.28,.009]);
   fingers.push({finger,tip});
  }
  const thumb=new THREE.Group();thumb.position.set(-side*.030,-.026,.007);thumb.rotation.z=-side*.65;wrist.add(thumb);ellipsoid(thumb,skin,[0,-.019,0],[.011,.028,.011]);
  arms.push({side,shoulder,elbow,wrist,fingers});
 }
 let female=false;
 function select(character){
  female=character==='mariazinha';maleHair.visible=!female;femaleHair.visible=female;earrings.visible=female;
  skin.color.setHex(female?0xf1b695:0xe9aa7f);faceSkin.color.copy(skin.color);earSkin.color.setHex(female?0xda947d:0xd88a68);lipSkin.color.setHex(female?0xbe7a73:0xba806b);
  shirt.color.setHex(female?0x36785e:0x164c79);collar.color.setHex(female?0xe9e4d7:0x205c89);seam.color.setHex(female?0xc5c4b3:0x113855);
  hair.color.setHex(female?0x2d211c:0x352018);hairLight.color.setHex(female?0x413026:0x513626);
  head.scale.set(female?.98:1,female?1.01:1,1);nose.scale.x=female?.86:1;body.scale.x=female?.96:1;
  eyes.forEach(e=>{e.lash.scale.setScalar(female?1.4:1);});brows.forEach(b=>b.group.scale.y=female?.8:1.12);
  speech.clear();
 }
 function update(p,delta){
  head.rotation.set(p.head[0],p.head[1],p.head[2]);head.position.y=1.62+p.neck*.4;
  body.rotation.set(p.spine[0],p.spine[1],p.spine[2]);femaleHair.rotation.z=p.hairSway;
  eyes.forEach(({globe,look,upperLid,lowerLid,lash},i)=>{
   const blink=clamp(p.blink+p.squint*.45,0,.98),openness=1-blink;globe.scale.y=.032*openness;look.scale.y=openness;look.position.x=p.gaze*.040;
   upperLid.scale.y=openness;lowerLid.scale.y=openness;lash.scale.y=openness*(female?1.4:1);
   brows[i].group.position.y=.078+p.brow*.055;brows[i].group.rotation.z=(i?1:-1)*(p.brow*.15);
  });
  for(const a of arms){
   const lift=(p.gesture||0)*(a.side<0?1:.80);
   a.shoulder.rotation.set(-lift*.85,0,a.side*(.22+lift*.24));a.elbow.rotation.set(-.24-lift*2.55,0,-a.side*lift*.35);a.wrist.rotation.set(-lift*.12,a.side*lift*.15,a.side*lift*.20);
   a.fingers.forEach(({finger,tip},i)=>{const curl=a.side<0&&i>0?lift*.85:lift*.18;finger.rotation.x=-.18-curl;finger.rotation.z=(i-1.5)*(.025+lift*.035);tip.rotation.x=-.12-curl;});
  }
  updateMouth(p.smile,delta);
 }
 select('zezinho');updateMouth(.28,33);
 return{root,select,update,setMorph(name,value){speech.set(name,clamp(value,0,1));},resetSpeech(){speech.clear();},dispose(){irisTexture.dispose();}};
}
