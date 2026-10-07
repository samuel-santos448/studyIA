# Ativar a voz natural

A leitura das aulas, do dicionário, do listening e das respostas por texto utiliza o endpoint de geração de fala quando a chave está configurada e o aluno está conectado. A preferência fica em Preferências → Voz da plataforma, com seleção de Zezinho (cedar) ou Mariazinha (marin). Sem configuração, a leitura continua usando as vozes do navegador e informa essa condição.

No arquivo local `.env`, preencha `OPENAI_API_KEY`. Os modelos padrão estão preparados em `OPENAI_TTS_MODEL=gpt-4o-mini-tts` e `OPENAI_REALTIME_MODEL=gpt-realtime-2.1`. Reinicie o servidor após salvar. A chave fica somente no servidor; o arquivo não deve ser publicado. O projeto OpenAI precisa ter acesso aos modelos e faturamento habilitado.

Esta função envia o texto selecionado para gerar áudio, sem usar o microfone. A conversa ao vivo é uma integração separada e envia áudio apenas quando iniciada pelo aluno.

A síntese é limitada por usuário, exige autenticação e CSRF e mantém cache temporário de até 30 áudios separado por usuário. O navegador descarta o áudio ao interromper ou navegar. A velocidade segue o controle existente. Os textos continuam disponíveis quando o serviço falha.

76 testes automatizados passaram. O navegador verificou preferência, envio do texto da aula e ciclo de reprodução com síntese simulada. Em 6 de outubro de 2026, após configurar a chave e o saldo, a geração real retornou HTTP 200. Chrome verificou reprodução efetiva e encerramento dos exemplos nas vozes Mariazinha (marin) e Zezinho (cedar). A qualidade pedagógica e dos sotaques ainda precisa de avaliação humana em cada idioma.

Referência: [Text to speech — OpenAI Docs](https://developers.openai.com/api/docs/guides/text-to-speech).
