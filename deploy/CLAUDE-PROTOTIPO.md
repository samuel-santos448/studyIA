# Protótipo de conversa com Claude

Na Conversação, escolha **Professor IA → Claude · teste por turnos**. A integração atual OpenAI continua disponível e é o padrão.

## Configuração

No `.env` do servidor, mantenha `OPENAI_API_KEY`, `OPENAI_TTS_MODEL` e `ANTHROPIC_API_KEY`. O Compose encaminha a chave Anthropic ao container. Modelos padrão: `claude-sonnet-4-6`, `gpt-4o-mini-transcribe` e o TTS já existente. `ANTHROPIC_MODEL` e `OPENAI_TRANSCRIBE_MODEL` são opcionais e precisam estar no ambiente do container para sobrescrever os padrões. Não publique `.env` nem chaves no Git.

## Uso

1. Acesse por HTTPS e entre na conta da escola.
2. Escolha o professor, idioma, prática e velocidade.
3. Selecione Claude e clique em **Iniciar teste com Claude**.
4. Depois da fala do professor, o microfone começa a ouvir. Uma pausa de cerca de 1,2 segundo envia sua fala. O botão **Enviar fala** também encerra a gravação.
5. Durante o áudio do professor, **Interromper e falar** interrompe a reprodução e abre o microfone. **Pausar escuta** desliga a captura até retomar; **Encerrar teste** encerra a sessão e desliga o microfone.

Cada fala tem limite de 30 segundos. A sessão dura até 20 minutos, com instruções para conduzir uma prática de pelo menos 16 minutos. Sair da tela pausa a escuta e mantém a sessão dentro do limite original de 20 minutos. Trocar de aula ou sair da conta encerra o teste. Falhas temporárias de transcrição, rede ou voz pausam o turno sem descartar a sessão: use Retomar conversa ou Ouvir resposta novamente. O histórico é mantido em memória, separado por usuário, com janela de 20 pares de mensagens. Reiniciar o container encerra as sessões do protótipo.

O fluxo é por turnos, sem áudio bidirecional nativo: gravação → transcrição OpenAI → resposta Claude → voz OpenAI. Há uma pausa entre os turnos. Interromper a reprodução não cancela créditos já consumidos. As respostas consomem créditos Anthropic; transcrição e síntese consomem créditos OpenAI. Os avatares acompanham o áudio gerado.

A aplicação não grava o áudio em disco e não salva esse histórico no banco. O áudio é enviado à OpenAI, a transcrição e o contexto vão à Anthropic, e o texto da resposta volta à OpenAI para síntese. A transcrição não permite medir a pronúncia do aluno; o professor oferece modelos sem afirmar que ouviu foneticamente o áudio original.

## Verificação

Testes automatizados verificam login/CSRF, parâmetros, histórico controlado pelo servidor, propriedade e expiração das sessões, limites de áudio, configuração e seleção de credenciais. O navegador foi testado com microfone sintético e respostas simuladas: iniciar, ouvir, enviar fala, reproduzir resposta, pausar, retomar, encerrar e iniciar novamente. Não foram usadas chaves reais nem créditos durante esses testes. Uma conversa real de 16 minutos ainda precisa ser medida no servidor.

## Atualização

Atualize a branch main e execute `docker compose up -d --build --no-deps app`. Preserve as personalizações locais de `compose.yaml` e `.env`. Se o servidor recebeu os ZIPs anteriores, guarde as alterações locais antes de atualizar com Git; não use reset destrutivo. Valide com `docker compose config --quiet`, que não imprime as chaves.

## Correção de estabilidade e espera

O analisador facial é conectado uma vez por sessão, sem bloquear a reprodução de áudio; a energia sonora serve de alternativa enquanto ele carrega. Respostas orientadas a 2–4 frases e até 60 palavras reduzem o trabalho de geração e síntese. A espera mostra segundos decorridos. Atualizações de conta que mantêm o usuário autenticado não encerram a sessão. O servidor retorna tempos de transcrição e Claude em milissegundos para permitir medir o serviço real; nenhum texto ou áudio é registrado em logs por esse mecanismo.

Verificação com falhas simuladas: transcrição 422 e voz 503 mantiveram o identificador da conversa; repetir a voz, retomar, enviar novo turno e encerrar funcionaram sem erro no navegador. Um analisador de boca artificialmente bloqueado não impediu a reprodução. Sem medição com as chaves reais, não há promessa de latência em segundos.

## Áudio progressivo

O Claude recebe instruções para produzir texto falado, sem emojis ou Markdown. O texto é limpo antes da síntese. O endpoint de voz permite enviar MP3 progressivo, com limite de 45 segundos para a solicitação inteira e erro específico de timeout. O navegador usa MediaSource quando suporta MP3 e mantém fallback de arquivo completo sem pedir uma segunda síntese. A interrupção cancela o download restante. Os Nginx do repositório desativam buffering e encaminham X-Accel-Buffering para um eventual proxy externo. Recarregue o proxy após atualizar: docker compose exec -T proxy nginx -t e docker compose exec -T proxy nginx -s reload. Um Nginx externo personalizado também precisa permitir streaming.

Teste de streaming: o servidor entregou os primeiros bytes antes de completar a geração simulada; no Edge, um MP3 sintético começou a tocar antes de chegar o restante dos bytes. Esses testes não medem a latência nem identificam retrospectivamente a causa da falha na API do servidor.

## Sobreposição de texto e voz

O navegador solicita liveAudio no turno autenticado. O servidor consome deltas SSE do Claude, encontra frases completas e começa a síntese de voz antes de terminar o texto inteiro. Metadados, texto e bytes MP3 são enviados em eventos NDJSON; o navegador transforma o áudio em um fluxo contínuo para o player existente. O histórico definitivo só é atualizado após completar a resposta. Cancelar a transmissão interrompe as solicitações ainda em andamento. A rota JSON anterior permanece compatível para clientes antigos e testes.

Teste específico confirmou que o primeiro áudio sai antes do evento final do Claude; a interface foi verificada com MP3 sintético e transcrição simulada, incluindo envio de fala, pausa, retomada e reinício. O fluxo ainda precisa da transcrição da fala e da primeira frase do modelo; não é a API nativa de áudio bidirecional. A velocidade real depende dos três serviços e da rede.

## Velocidade estável

No modo Claude, as frases são sintetizadas em 0,85x. O navegador aplica playbackRate = velocidade escolhida / 0,85 com preservesPitch ligado, mantendo a velocidade efetiva de 0,7x, 0,85x ou 1x. Isso também vale para ouvir a resposta novamente. OpenAI Realtime permanece como antes. Se a reprodução não iniciar em 15 segundos, o turno apresenta um erro recuperável. Os testes no Edge validaram as três velocidades com MP3 sintético, sem chamadas reais às APIs.

## Escuta contínua com Claude

A entrada agora tenta uma conexão WebRTC persistente de transcrição, com modelo OPENAI_LIVE_TRANSCRIBE_MODEL (padrão gpt-live-transcribe), usando a chave OpenAI já configurada. O microfone envia áudio continuamente enquanto a escuta está ativa; o VAD local confirma uma fala após cerca de 180 ms e envia commit após 800 ms de silêncio. O texto final é enviado ao Claude diretamente, sem upload nem nova transcrição de arquivo. Ao detectar nova fala, o cliente interrompe a resposta e cancela o áudio restante, mantendo a sessão e o contexto parcial marcado como interrompido. A síntese continua progressiva por frases, com os avatares existentes.

A interface mostra Escuta contínua ativa quando o canal conecta. Se não houver acesso ao modelo ou a conexão falhar, o cliente volta à gravação por turnos e identifica esse modo na tela. A duração permanece em 20 minutos. Pausar escuta desliga os tracks enviados, e encerrar fecha o WebRTC e desliga tanto o track original quanto seu clone. Recomenda-se testar interrupções com fones para reduzir a influência do áudio do professor no microfone.

Transcrição e voz usam créditos OpenAI; respostas usam créditos Anthropic. A implementação não transforma Claude em um modelo nativo speech-to-speech e não promete igualdade de latência. Verificação: autenticação/CSRF no endpoint SDP, transcrição textual sem chamada de arquivo, e navegador com WebRTC/transcrição simulados validando interrupção pela fala, novo turno com texto, reprodução e fechamento dos tracks. Nenhuma chave real foi usada. É necessário validar acesso ao modelo e latência no servidor.
