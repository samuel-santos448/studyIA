export function publicOrigin(env=process.env){
 const value=env.PUBLIC_ORIGIN;
 if(!value){if(env.NODE_ENV==='production')throw Error('Configure PUBLIC_ORIGIN=https://seu-dominio em produção.');return null;}
 const url=new URL(value);
 if(url.origin!==value||url.protocol!=='https:'||url.username||url.password)throw Error('PUBLIC_ORIGIN deve conter somente uma origem HTTPS, sem barra final.');
 return value;
}
export function sameOrigin(req,env=process.env){
 const expected=publicOrigin(env)||`http://${req.headers.host}`;
 return !req.headers.origin||req.headers.origin===expected;
}
export function allowedHost(req,env=process.env){
 const host=req.headers.host||'';
 const origin=publicOrigin(env);
 return /^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host)||(Boolean(origin)&&host===new URL(origin).host);
}
export function secureCookie(env=process.env){return env.NODE_ENV==='production'||Boolean(publicOrigin(env))?'; Secure':'';}
