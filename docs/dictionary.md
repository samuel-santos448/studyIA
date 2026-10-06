# Vocabulário e dicionário

A biblioteca reúne 912 cartões: os doze iniciais e um termo ou expressão de cada uma das 900 aulas. Não são necessariamente 912 palavras únicas: um termo pode aparecer em contextos diferentes. Cada cartão do curso tem nível, tema, significado e exemplo bilíngue. Os doze IDs originais de favoritos permanecem iguais; o backup v5 aceita favoritos dos novos cartões. Os favoritos ainda são locais ao navegador.

Dicionário é um módulo próprio da navegação. A busca aceita inglês ou português, dá preferência a correspondências exatas e mostra até quatro referências da base. A busca normaliza caixa e acentos. Exemplos podem ser ouvidos com a voz sintetizada do navegador. O botão Abrir no dicionário conecta a biblioteca à pesquisa.

Com OPENAI_API_KEY e OPENAI_MODEL configurados no servidor, pesquisar também solicita uma explicação didática à IA: significado em português, uso, até três exemplos em inglês com tradução e termos relacionados. Sem configuração, a busca na base do curso continua funcionando e a interface informa a indisponibilidade da IA. Não há um serviço externo de dicionário tradicional consultado, nem fontes ou citações externas verificadas; os exemplos adicionais são gerados por IA.

POST /api/dictionary recebe query e level. O servidor valida tamanho e formato da consulta, solicita saída estruturada pela Responses API, verifica o resultado e trata recusa, incompletude e falha do provedor. A chave fica no servidor, store=false e a consulta não é gravada no PostgreSQL. Os limites de chamadas e concorrência são compartilhados com o professor IA. Com empresa configurada, a consulta exige sessão e CSRF. O cliente cancela consultas quando a pesquisa muda ou o aluno sai do módulo; respostas antigas não substituem a consulta atual.

O conteúdo gerado deve ser conferido no contexto e passar por revisão pedagógica. A integração real continua dependendo da configuração e validação das credenciais; testes de respostas de IA usam serviço simulado. A base local vem do currículo gerado, também sujeito a revisão.

Referência técnica: [OpenAI Docs — Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses).
