// A persistent transcription-only WebRTC connection; the API key stays on
// the server. The original microphone stream remains owned by the caller.
export async function connectLiveTranscription({stream,analyser,canListen,onSpeech,onText,onError,signal}){
 const peer=new RTCPeerConnection(),track=stream.getAudioTracks()[0].clone();peer.addTrack(track,new MediaStream([track]));const channel=peer.createDataChannel('oai-events');let stopped=false,frame=0,heard=false,last=0,begin=0,waiting=false,speechBegan=0;const seen=new Set();let cancelConnect=null;
 const stop=()=>{if(stopped)return;stopped=true;cancelConnect?.();cancelAnimationFrame(frame);track.stop();channel.onclose=null;channel.onerror=null;channel.close();peer.onconnectionstatechange=null;peer.close();signal?.removeEventListener('abort',stop);};
 const commit=()=>{if(heard&&channel.readyState==='open'&&!waiting){heard=false;waiting=true;channel.send(JSON.stringify({type:'input_audio_buffer.commit'}));}};
 signal?.addEventListener('abort',stop,{once:true});if(signal?.aborted){stop();throw new DOMException('Aborted','AbortError');}
 try{
  await new Promise(async(resolve,reject)=>{
   const timer=setTimeout(()=>reject(Error('A transcrição não conectou.')),20000);cancelConnect=()=>{clearTimeout(timer);reject(new DOMException('Aborted','AbortError'));};const finish=(e)=>{clearTimeout(timer);if(e)reject(e);else resolve();};channel.onopen=()=>finish();channel.onerror=()=>finish(Error('Falha no canal de transcrição.'));
   channel.onmessage=e=>{let d;try{d=JSON.parse(e.data);}catch{return;}
    if(d.type==='conversation.item.input_audio_transcription.completed'){waiting=false;const id=d.item_id;if(id&&seen.has(id))return;if(id){seen.add(id);if(seen.size>100)seen.delete(seen.values().next().value);}if(d.transcript?.trim())onText(d.transcript.trim());}
    if(d.type==='conversation.item.input_audio_transcription.failed'){waiting=false;onError(Error('Não foi possível transcrever esta fala.'));}
    if(d.type==='error'){waiting=false;onError(Error(d.error?.message||'A transcrição foi interrompida.'));}
   };
   try{const offer=await peer.createOffer();await peer.setLocalDescription(offer);const r=await fetch('/api/claude-transcription',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':StudyAccount.csrf()},body:JSON.stringify({sdp:offer.sdp}),signal});const d=await r.json();if(!r.ok)throw Error(d.error||'Transcrição indisponível.');if(stopped)throw new DOMException('Aborted','AbortError');await peer.setRemoteDescription({type:'answer',sdp:d.sdp});}catch(e){finish(e);}
  });
 }catch(e){stop();throw e;}
 channel.onclose=()=>{if(!stopped)onError(Error('A conexão do microfone foi interrompida.'));};peer.onconnectionstatechange=()=>{if(['failed','closed'].includes(peer.connectionState)&&!stopped)onError(Error('A conexão do microfone foi interrompida.'));};
 const bytes=new Uint8Array(analyser.fftSize);
 const tick=()=>{if(stopped)return;const allowed=canListen();track.enabled=allowed;if(!allowed){heard=false;begin=0;}else{
  analyser.getByteTimeDomainData(bytes);let sum=0;for(const b of bytes)sum+=((b-128)/128)**2;const rms=Math.sqrt(sum/bytes.length),now=performance.now();
  if(rms>.025){if(!begin)begin=now;last=now;if(!heard&&now-begin>=180&&!waiting){heard=true;speechBegan=now;onSpeech();}}
  else{begin=0;if(heard&&now-last>800)commit();}if(heard&&now-speechBegan>30000)commit();
 }frame=requestAnimationFrame(tick);};tick();
 return{stop,commit};
}
