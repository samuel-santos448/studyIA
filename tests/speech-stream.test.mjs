import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server.mjs';
import {testDatabase} from './postgres-helper.mjs';
test('speech streaming forwards the first bytes before synthesis completes',async()=>{
 const {db}=await testDatabase();let finish,payload;
 const server=createApp({database:db,apiKey:'test',fetchImpl:async(_url,o)=>{payload=JSON.parse(o.body);return{ok:true,body:new ReadableStream({start(c){c.enqueue(Buffer.from('first'));let ended=false;finish=()=>{if(ended)return;ended=true;c.enqueue(Buffer.from('second'));c.close();};}})};}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 try{const setup=await fetch(base+'/api/company/setup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({company:'Stream test',name:'Admin',email:'stream@example.com',password:'test-password-1234'})});const u=await setup.json(),cookie=setup.headers.get('set-cookie').split(';')[0];const r=await fetch(base+'/api/speech',{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookie,'X-CSRF-Token':u.csrf},body:JSON.stringify({text:'**Hello!** 😊',character:'zezinho',language:'en',speed:1,stream:true})});assert.equal(r.status,200);assert.equal(r.headers.get('x-accel-buffering'),'no');assert.equal(payload.input,'Hello!');const reader=r.body.getReader();assert.equal(Buffer.from((await reader.read()).value).toString(),'first');finish();let tail='';for(;;){const d=await reader.read();if(d.done)break;tail+=Buffer.from(d.value).toString();}assert.equal(tail,'second');}finally{finish?.();await new Promise(r=>server.close(r));await db.close();}
});

test('speech timeout returns a specific retryable error without revealing credentials',async()=>{
 const {speechAudio}=await import('../backend/speech.mjs');const {Readable}=await import('node:stream');const {EventEmitter}=await import('node:events');
 const handler=speechAudio({apiKey:'private-key',model:'test',auth:{requireUser:async()=>({user:{id:'alice'},csrf:'token'})},fetchImpl:async()=>{throw new DOMException('upstream delayed','TimeoutError');}});
 const req=Readable.from([JSON.stringify({text:'Hello',language:'en',character:'zezinho',speed:1,stream:true})]);req.method='POST';req.headers={host:'localhost','content-type':'application/json','x-csrf-token':'token'};let result;
 await handler(req,new EventEmitter(),new URL('http://localhost/api/speech'),(_r,status,data)=>result={status,data});assert.equal(result.status,504);assert.match(result.data.error,/demorou demais/);assert.ok(!JSON.stringify(result).includes('private-key'));
});
