import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {liveTranscription} from '../backend/live-transcription.mjs';
import {claudeVoice} from '../backend/claude-voice.mjs';
function request(body,csrf='token'){const r=Readable.from([JSON.stringify(body)]);r.method='POST';r.headers={host:'localhost','content-type':'application/json','x-csrf-token':csrf};return r;}
const auth={requireUser:async()=>({user:{id:'alice'},csrf:'token'})};
test('continuous transcription uses authenticated SDP negotiation without returning API credentials',async()=>{
 let sent;const handler=liveTranscription({apiKey:'private',model:'gpt-live-transcribe',auth,fetchImpl:async(url,o)=>{if(url.endsWith('/client_secrets')){assert.equal(o.headers.Authorization,'Bearer private');sent=JSON.parse(o.body).session;return{ok:true,json:async()=>({value:'ephemeral-token'})};}assert.equal(url,'https://api.openai.com/v1/realtime/calls');assert.equal(o.headers.Authorization,'Bearer ephemeral-token');assert.equal(o.headers['Content-Type'],'application/sdp');return{ok:true,text:async()=> 'v=0\r\nm=audio test'};}});let result;const json=(_r,status,data)=>result={status,data};const url=new URL('http://localhost/api/claude-transcription');
 await handler(request({sdp:'v=0\r\nm=audio test'},'bad'),{},url,json);assert.equal(result.status,403);
 await handler(request({sdp:'v=0\r\nm=audio test'}),{},url,json);assert.equal(result.status,200);assert.equal(sent.type,'transcription');assert.equal(sent.audio.input.turn_detection,null);assert.equal(sent.audio.input.transcription.model,'gpt-live-transcribe');assert.ok(!JSON.stringify(result).includes('private'));assert.ok(!JSON.stringify(result).includes('ephemeral-token'));
});
test('continuous transcripts go directly to Claude without another file transcription request',async()=>{
 const calls=[];const handler=claudeVoice({key:'private-claude',model:'test',apiKey:'private-openai',transcribeModel:'test',ttsModel:'test',auth,fetchImpl:async(url,o)=>{calls.push({url,body:JSON.parse(o.body)});return{ok:true,json:async()=>({content:[{type:'text',text:'Hello, Samuel!'}]})};}});let result;const json=(_r,status,data)=>result={status,data};const url=new URL('http://localhost/api/claude-voice');
 await handler(request({action:'start',character:'zezinho',level:'A1',language:'en',practice:'conversation'}),{},url,json);const id=result.data.sessionId;
 await handler(request({action:'turn',sessionId:id,text:'My name is Samuel.'}),{},url,json);assert.equal(result.status,200);assert.equal(result.data.transcript,'My name is Samuel.');assert.equal(calls.length,2);assert.ok(calls.every(c=>c.url==='https://api.anthropic.com/v1/messages'));assert.equal(calls[1].body.messages.at(-1).content,'My name is Samuel.');
 await handler(request({action:'turn',sessionId:id,text:''}),{},url,json);assert.equal(result.status,400);
});
