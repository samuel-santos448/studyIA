import {test} from 'node:test';
import assert from 'node:assert/strict';
import {streamClaudeAudio} from '../backend/claude-audio-stream.mjs';
test('first phrase is voiced before Claude finishes the response',async()=>{
 const encoder=new TextEncoder(),events=[];let release,syntheses=[];const sse=o=>encoder.encode('data: '+JSON.stringify(o)+'\n\n');
 const response={body:new ReadableStream({start(c){c.enqueue(sse({type:'content_block_delta',delta:{type:'text_delta',text:'Hello Samuel, welcome to class! '}}));release=()=>{c.enqueue(sse({type:'content_block_delta',delta:{type:'text_delta',text:'What do you do every morning?'}}));c.enqueue(sse({type:'message_delta',delta:{stop_reason:'end_turn'}}));c.enqueue(sse({type:'message_stop'}));c.close();};}})};
 let first;const firstAudio=new Promise(r=>first=r);
 const work=streamClaudeAudio(response,{res:{write:line=>{const e=JSON.parse(line);events.push(e);if(e.type==='audio')first();}},session:{character:'zezinho',speed:.7},apiKey:'secret',ttsModel:'test',signal:new AbortController().signal,fetchImpl:async(_u,o)=>{const p=JSON.parse(o.body);syntheses.push(p);return{ok:true,body:new ReadableStream({start(c){c.enqueue(Buffer.from('mp3'));c.close();}})};}});
 await firstAudio;assert.equal(syntheses.length,1);assert.equal(syntheses[0].input,'Hello Samuel, welcome to class!');release();assert.equal(await work,'Hello Samuel, welcome to class! What do you do every morning?');assert.equal(syntheses.length,2);assert.equal(syntheses[0].voice,'cedar');assert.ok(events.some(e=>e.type==='audio'));
});
test('provider stream errors fail the turn instead of silently completing it',async()=>{
 const bytes=new TextEncoder().encode('data: '+JSON.stringify({type:'error'})+'\n\n');await assert.rejects(()=>streamClaudeAudio({body:new ReadableStream({start(c){c.enqueue(bytes);c.close();}})},{res:{write(){}},session:{},signal:new AbortController().signal}),/interrompeu/);
});
