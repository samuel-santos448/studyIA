import test from 'node:test';import assert from 'node:assert/strict';import {createApp} from '../server.mjs';
test('teacher listening uses server lesson content and validates mode and level',async()=>{
 let payload,calls=0;const server=createApp({apiKey:'test',model:'test',fetchImpl:async(_url,options)=>{calls++;payload=JSON.parse(options.body);return{ok:true,json:async()=>({output:[{type:'message',content:[{type:'output_text',text:'Anna orders tea. What does she order?'}]}]})};}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));try{
 const send=body=>fetch(`http://127.0.0.1:${server.address().port}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'Start practice'}],...body})});
 assert.equal((await send({practice:'listening',lessonId:'B2-001',level:'A1'})).status,200);assert.match(payload.instructions,/Modo listening/);assert.match(payload.instructions,/inglês B2/);assert.match(payload.instructions,/Vocabulário:/);assert.match(payload.instructions,/Exemplo estudado:/);assert.equal(payload.store,false);
 assert.equal((await send({practice:'conversation',topic:'vocabulary',level:'C1'})).status,200);assert.match(payload.instructions,/inglês C1/);assert.match(payload.instructions,/Modo conversação/);
 assert.equal((await send({practice:'override'})).status,400);assert.equal((await send({level:'C3'})).status,400);assert.equal((await send({topic:'injected'})).status,400);assert.equal(calls,2);
 }finally{await new Promise(r=>server.close(r));}
});
