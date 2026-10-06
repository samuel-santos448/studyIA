# Professor IA nas aulas e módulos

As 900 aulas têm uma aba Professor IA. Ela mantém o contexto do nível, tema e vocabulário da aula, sem abandonar a página. Nas práticas complementares, os botões de conversação e listening abrem o professor com o tema do módulo e o nível atual da jornada.

Conversação permite escrever ou ditar uma resposta. Listening pede à IA um trecho curto e uma pergunta de compreensão; o texto começa oculto e pode ser revelado pelo aluno. O botão Ouvir usa a síntese de voz do navegador, com velocidade normal ou reduzida. Não há reprodução automática.

A transcrição usa SpeechRecognition quando disponível. O aluno autoriza o microfone, fala por até 30 segundos, revisa o texto e envia explicitamente. O navegador pode usar um serviço externo de voz. Nenhum áudio do microfone é enviado por esta implementação à API do professor; somente o texto confirmado. Navegadores sem reconhecimento continuam por texto. Isto não é avaliação de pronúncia nem conversa de áudio em tempo real.

O servidor valida modo, tema e nível, recupera o conteúdo da aula pelo ID e usa instruções próprias na Responses API. Chaves permanecem no servidor. São mantidas as regras de autenticação, CSRF e limites existentes. Praticar com o professor não aprova aulas nem provas automaticamente.

OPENAI_API_KEY e OPENAI_MODEL precisam estar configurados para respostas reais. Sem configuração, a interface informa indisponibilidade e permite ouvir o exemplo da aula. Validação automatizada usa um provedor simulado; integração real depende das credenciais.

Referência: https://developers.openai.com/api/docs/guides/text
