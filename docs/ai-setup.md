# Professor de IA — configuração local

Esta versão integra conversação por texto com a Responses API da OpenAI. A conversa por voz com IA ainda não foi implementada. Gravação local e fala sintetizada dos exemplos continuam separadas.

## Executar

1. Tenha Node.js 22.9 ou superior instalado.
2. Copie `.env.example` para `.env` na raiz do projeto.
3. Preencha `OPENAI_API_KEY` com uma chave do seu projeto OpenAI e `OPENAI_MODEL` com um modelo disponível para sua conta e compatível com a Responses API.
4. Execute `npm start` e abra `http://127.0.0.1:3000`.
5. Entre em Conversação → Professor IA.

Sem chave e modelo, o servidor abre normalmente e informa que o professor não está configurado. O modo guiado permanece disponível. Não coloque a chave no navegador, no GitHub ou em mensagens do chat. Não é preciso instalar dependências de produção.

## Implementação

- `server.mjs`: servidor local e endpoints `/api/status` e `/api/chat`.
- `ai.js`: interface, histórico em memória e tratamento de falhas.
- `.env`: configuração privada ignorada pelo Git.
- `tests/server.test.mjs`: testes com provedor simulado, sem custos de API.

O servidor aceita até 1.000 caracteres por mensagem do aluno, 20 mensagens por solicitação, duas solicitações simultâneas e dez chamadas por minuto. O tempo limite da API é 45 segundos. O histórico recente é enviado a cada interação, com instruções pedagógicas definidas no servidor e `store: false`. Isso não equivale a uma promessa de retenção zero pelo provedor; consulte suas políticas antes de uso comercial.

O servidor escuta apenas em `127.0.0.1` e serve uma lista explícita de arquivos públicos. Não fornece arquivos `.env` ou código do servidor. O modelo não é configurável pelo cliente.

## Validação e próximos passos

Execute `npm test`. Os testes simulam a OpenAI e verificam o contrato da integração, não a qualidade das respostas reais. É necessário configurar credenciais e testar conversas reais antes de considerar o professor validado.

Esta é uma integração para desenvolvimento local. Antes de hospedagem comercial, implementar autenticação, limites por usuário, medição de custos, persistência, avaliações pedagógicas, política de privacidade e configuração da infraestrutura. Não exponha este servidor diretamente à internet.

Referências: [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) e [criação de respostas](https://developers.openai.com/api/reference/typescript/resources/responses/methods/create).
