import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sameOrigin,publicOrigin,secureCookie} from '../backend/http-security.mjs';
import {createApp} from '../server.mjs';
test('HTTPS origin rejects foreign sites and ignores spoofed proxy headers',()=>{
 const env={NODE_ENV:'production',PUBLIC_ORIGIN:'https://studyia.example.com'};
 const req={headers:{host:'127.0.0.1:3000',origin:env.PUBLIC_ORIGIN,'x-forwarded-proto':'http'}};
 assert.equal(sameOrigin(req,env),true);
 req.headers.origin='https://evil.example';req.headers['x-forwarded-host']='evil.example';
 assert.equal(sameOrigin(req,env),false);
 assert.equal(secureCookie(env),'; Secure');
 assert.throws(()=>publicOrigin({NODE_ENV:'production'}),/PUBLIC_ORIGIN/);
 for(const value of ['http://example.com','https://example.com/','https://example.com/path','https://user:pass@example.com'])assert.throws(()=>publicOrigin({PUBLIC_ORIGIN:value}));
 assert.equal(sameOrigin({headers:{host:'localhost:3000',origin:'http://localhost:3000'}},{}),true);
 assert.equal(secureCookie({}),'');
});
test('HTTPS origin reaches HTTP upstream APIs while foreign origin is rejected',async()=>{
 const previous=process.env.PUBLIC_ORIGIN;process.env.PUBLIC_ORIGIN='https://studyia.example.com';
 const app=createApp();await new Promise(r=>app.listen(0,'127.0.0.1',r));
 try{const base=`http://127.0.0.1:${app.address().port}`;
 for(const [route,body,status] of [['/api/chat',{},503],['/api/realtime/session',{},503]]){
 const response=await fetch(base+route,{method:'POST',headers:{Origin:process.env.PUBLIC_ORIGIN,'Content-Type':'application/json'},body:JSON.stringify(body)});
 assert.equal(response.status,status);
 }
 assert.equal((await fetch(base+'/api/chat',{method:'POST',headers:{Origin:'https://evil.example'}})).status,403);
 }finally{await new Promise(r=>app.close(r));if(previous===undefined)delete process.env.PUBLIC_ORIGIN;else process.env.PUBLIC_ORIGIN=previous;}
});
