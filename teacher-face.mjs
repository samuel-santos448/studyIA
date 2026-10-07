const clamp=value=>Math.max(0,Math.min(1,Number.isFinite(value)?value:0));

// Relative lip poses inferred from sound, not a speech/pronunciation assessment.
export function getTeacherSpeechShape(values){
 const weight=name=>clamp(values.get(name));
 const aa=weight('viseme_aa'),o=weight('viseme_O'),u=weight('viseme_U');
 const e=weight('viseme_E'),i=weight('viseme_I'),ff=weight('viseme_FF');
 const th=weight('viseme_TH'),dd=weight('viseme_DD'),kk=weight('viseme_kk');
 const ch=weight('viseme_CH'),ss=weight('viseme_SS'),nn=weight('viseme_nn'),rr=weight('viseme_RR');
 return{
  jaw:Math.max(weight('jawOpen'),aa*.8,o*.58,u*.32,e*.30,i*.24,th*.15,dd*.13,kk*.35,ch*.20,ss*.10,nn*.13,rr*.24),
  round:Math.max(o,u,rr*.30,ch*.25),
  press:Math.max(weight('viseme_PP'),ff*.55),
  wide:Math.max(e,i,ss*.45,dd*.25),
  lowerLip:ff
 };
}
