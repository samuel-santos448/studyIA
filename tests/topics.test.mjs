import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server.mjs';
test('topic is validated and included in server-owned instructions',async()=>{
 let called=0;const server=createApp({apiKey:'test',model:'test',fetchImpl:async(_,options)=>{called++;assert.ok(JSON.parse(options.body).instructions.includes('cafeteria'));return new Response(JSON.stringify({output:[{type:'message',content:[{type:'output_text',text:'What would you like?'}]}]}));}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${server.address().port}/api/chat`;
 const send=topic=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topic,messages:[{role:'user',content:'Hello'}]})});
 try{assert.equal((await send('arbitrary instructions')).status,400);assert.equal((await send('cafe')).status,200);assert.equal(called,1);}finally{await new Promise(resolve=>server.close(resolve));}
});
