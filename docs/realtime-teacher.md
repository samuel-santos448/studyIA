# Professor por voz em tempo real

Conversação abre o professor ao vivo. O aluno escolhe Zezinho ou Mariazinha e inicia a sessão explicitamente. O microfone envia áudio ao serviço Realtime da OpenAI por WebRTC; a resposta é áudio gerado durante a conversa. O servidor negocia a conexão usando a chave privada. O navegador recebe apenas a resposta SDP.

Os personagens são SVG animados. A boca responde à intensidade do áudio recebido via Web Audio; cabeça e braços gesticulam durante a fala. A sincronização é por energia sonora, não por fonemas. O sistema respeita a preferência de movimento reduzido.

O idioma selecionado e o contexto da aula são definidos no servidor. Conversação e listening estão disponíveis nos oito idiomas. A detecção de fala solicita resposta e permite interrupção. Há pausa de microfone, encerramento e limpeza dos recursos ao navegar, fechar ou ocultar a página. A sessão da interface encerra após 15 minutos. O limite da interface não substitui limites financeiros do projeto OpenAI.

## Configuração

Configure `OPENAI_API_KEY` no arquivo local `.env` e `OPENAI_REALTIME_MODEL` com um modelo Realtime disponível no projeto. O valor padrão é `gpt-realtime-2.1`. Reinicie `npm run start:dev` no ambiente de testes ou o servidor de produção. Nunca inclua `.env` no GitHub. A configuração da conversa por voz é independente de `OPENAI_MODEL`, usado nas respostas por texto. Em produção, ative autenticação e use HTTPS para acesso ao microfone.

O endpoint exige sessão autenticada, token CSRF, contexto válido e limita tentativas de início. Não registra aprovação de aula nem notas de pronúncia. A transcrição do professor fica apenas na tela e é descartada ao recomeçar.

## Verificação

74 testes automatizados passaram, incluindo autenticação, CSRF, idioma e contexto da sessão, limite de início e proteção da chave. Chrome em desktop e celular verificou seleção, estados, pausa, encerramento e desligamento do microfone ao navegar com conexão WebRTC simulada. A chamada externa e a qualidade das vozes ainda exigem validação com uma chave ativa.

Referência: [documentação oficial OpenAI para WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?voice-api=realtime).
# Velocidade da conversação

O seletor “Velocidade da fala” oferece lenta (0,7×), moderada (0,85×) e normal (1×) para as duas vozes. A1/A2 começam em lenta; demais níveis em normal. A escolha vale para as próximas sessões desta tela e é reiniciada ao trocar de conta. Fica bloqueada durante conexão/sessão: encerrar antes de escolher outra velocidade. O servidor valida a opção e envia audio.output.speed à OpenAI; não usa playbackRate no fluxo WebRTC. Testes de rota com provedor simulado e Chrome desktop/celular verificaram seleção, envio e bloqueio. A avaliação auditiva de uma sessão real com essas velocidades ainda está pendente.

Referência: [velocidade no Realtime](https://developers.openai.com/api/reference/resources/realtime/client-events).

