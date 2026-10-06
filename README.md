# StudyIA

Aplicativo de aprendizado de idiomas com aulas estruturadas e um professor de inteligência artificial para praticar conversação por texto e voz.

## Estado do projeto

Protótipo disponível com três unidades de inglês A1 e desafio auditivo, exemplos em áudio, exercícios, conversa guiada e gravação local de voz. O progresso é salvo no navegador. Integração por texto com professor de IA implementada para uso local, aguardando configuração e teste com credenciais reais.

## Objetivo

Permitir que falantes de português aprendam um idioma desde o básico, pratiquem situações reais e acompanhem sua evolução. Começar com inglês A1 e ampliar para A2, espanhol e outros níveis após validar a qualidade pedagógica.

## Primeira versão

- Perfil com objetivo de estudo e tempo disponível.
- Trilha de inglês A1 com aulas curtas e exercícios.
- Conversação por texto com correções e explicações em português.
- Conversação por voz, com autorização de microfone e alternativa por texto.
- Revisão dos erros e vocabulário estudado.
- Progresso baseado em atividades e avaliações de habilidades.

## Plataformas

A primeira interface será responsiva e acessível pelo navegador em celulares e computadores. Aplicativos para iOS, Android, Windows e macOS fazem parte do plano de expansão; a tecnologia de distribuição será definida após testar áudio e experiência de uso.

## Documentação

- [Escopo e experiência do aluno](docs/product.md)
- [Plano de desenvolvimento e critérios de conclusão](docs/roadmap.md)

## Desenvolvimento

Para usar o professor de IA, siga [a configuração local](docs/ai-setup.md). O servidor requer Node.js 22.9 ou superior; execute `npm start`. Os testes do servidor usam `npm test` e não fazem chamadas reais à OpenAI. A versão estática continua funcionando sem o professor de IA.

A arquitetura e as dependências ainda serão escolhidas. Nenhuma chave de IA deve ser incluída no código ou enviada ao GitHub. As chamadas autenticadas ao provedor deverão passar por um servidor.

O projeto ainda não tem licença de distribuição definida.

## Executar o protótipo

### Vocabulário, cartões e aparência

Aula → Explorar vocabulário e cartões abre uma biblioteca com 12 termos e expressões, tradução, exemplos e áudio. A lista tem busca, filtro de favoritos e paginação de quatro itens. Favoritos são salvos localmente.

Cartões permitem praticar todos os termos ou só favoritos, revelar significado, ouvir e marcar a prática. Cada termo marcado conta uma vez por dia na meta; não gera uma nota de domínio e não implementa repetição espaçada.

O botão principal da tela inicial sugere primeiro revisões pendentes, depois a próxima unidade incompleta, o desafio auditivo e, finalmente, vocabulário. É uma sequência baseada no progresso, não uma recomendação gerada por IA. A tela inicial foi compactada para evitar cartões de navegação duplicados.

Preferências → Meu plano oferece tema claro, escuro ou seguindo o sistema. A aparência e os favoritos entram no backup v3; arquivos v1 e v2 continuam aceitos. Nove testes automatizados passaram, além de busca, favoritos após recarga, cartões, recomendação, tema escuro e exportação dos novos dados no Chrome.

### Cafeteria, compreensão auditiva e painel de progresso

A terceira unidade ensina pedidos, agradecimentos e preços em uma cafeteria, com exemplos em áudio e três exercícios. Estúdio → Desafio auditivo oferece três frases sintetizadas para reconhecer o significado; a transcrição é opcional e não há nota de avaliação auditiva.

Preferências → Progresso reúne as três unidades e o desafio auditivo, totalizando 13 atividades. Conclusão de exercícios não é uma certificação de fluência. Os novos exercícios entram na meta diária e seus erros podem ser revisados.

O backup agora usa o formato v2, incluindo cafeteria e compreensão auditiva. Backups v1 são aceitos e inicializam as novas atividades sem progresso. Oito testes automatizados passaram; fluxos de cafeteria, transcrição, conclusão, persistência e total agregado foram verificados no Chrome.

### Perfil, meta diária e backup

Em Preferências → Meu plano, salve um nome opcional, objetivo (dia a dia, viagens ou trabalho) e meta de 3, 5 ou 10 atividades. O nome e o objetivo personalizam o painel inicial; ainda não alteram o currículo nem são enviados automaticamente à IA.

O painel conta exercícios corretos e revisões concluídas, uma vez por item por dia, e respostas recebidas do professor de IA. Não conta tentativas incorretas, cliques em áudio ou minutos de estudo. O calendário usa a data local do dispositivo; mantém até 90 dias e 100 atividades por dia. Atividades anteriores a esta versão não são reconstruídas.

Em Preferências → Backup, baixe perfil, progresso das aulas, fila de revisão e atividades em JSON. A restauração mostra um resumo e exige confirmação antes de substituir os dados. Conversas, gravações e credenciais não entram no arquivo. Não há sincronização automática entre dispositivos.

Verificação: perfil após recarga, contagem diária, download, rejeição de arquivos inválidos, cancelamento e restauração completa testados no Chrome. Validação de dados e servidor cobertos por sete testes automatizados.

### Navegação por módulos

### Revisão de dificuldades

O módulo Revisão recebe os exercícios errados das duas unidades a partir desta versão. Cada exercício entra uma única vez na fila; acertá-lo durante a aula não o remove. Na revisão, o aluno escreve a resposta, pode consultar um exemplo e conclui o item quando acerta. A fila e o contador de revisões ficam salvos no navegador. A tela inicial mostra a quantidade pendente.

Limpar o histórico de revisão não limpa o progresso das aulas. A revisão usa regras fixas para os exercícios disponíveis; não analisa a conversa com IA nem implementa agendamento por repetição espaçada. Verificação no Chrome: captura de erro, persistência, resposta incorreta, exemplo, conclusão e recarga.

O módulo Aula abre uma trilha com duas unidades: apresentação pessoal (três exercícios) e números/horários (quatro exercícios). A segunda unidade inclui números de 1 a 12, exemplo visual de relógio, áudio e correções para respostas escritas. Seu progresso é salvo separadamente; ambas as unidades podem ser estudadas e revisadas livremente. `numbers.js` e `numbers.css` contêm essa unidade.

Verificação adicional no Chrome: resposta incorreta não avança, quatro respostas corretas concluem a unidade, apóstrofos tipográficos são aceitos e o progresso permanece após recarregar.

A aplicação mostra uma tela por vez: Início, Aula, Estúdio, Conversação e Preferências. A aula separa exemplos e exercícios; o estúdio separa áudio, montagem de frases, demonstração e vídeo; a conversação separa texto e gravação de voz.

No computador há menu lateral; no celular, navegação inferior. As rotas usam o fragmento da URL, com suporte a links diretos e voltar/avançar. Trocar de módulo interrompe áudio e gravação. O progresso dos exercícios é preservado.

Navegação implementada em navigation.js e identidade visual em layout.css, mantendo os recursos pedagógicos nos arquivos app.js, media.js e conversation.js. Não há dependências de produção.

Verificação no Chrome: módulos visíveis isoladamente, exercícios, montagem de frase, conversa, painel de voz, histórico e ausência de transbordamento horizontal em telas de 390 px.

### Estúdio interativo

### Conversação guiada e gravação

O painel de conversa segue um roteiro de apresentação pessoal, aceita respostas por texto e oferece dicas. Não usa IA e não classifica respostas fora do roteiro como erros gerais de inglês.

A prática permite gravar até 60 segundos, reproduzir e excluir o áudio. As gravações ficam apenas em memória e não são enviadas ao servidor. O microfone requer permissão e um contexto aceito pelo navegador, normalmente HTTPS ou localhost. Não há avaliação de pronúncia.

Verificação: conversa, conclusão, reinício e largura móvel testados no Chrome automatizado. Gravação com microfone real ainda não validada.

Os exemplos têm botões para ouvir, com voz sintetizada do navegador e velocidade ajustável. Inclui explicação em português, montagem de frases e demonstração animada de uma conversa. As animações respeitam a preferência de movimento reduzido do sistema.

O player aceita vídeos locais sem upload. Ainda não há vídeos de aula produzidos nem GIFs incorporados. As animações atuais são feitas em CSS. A disponibilidade e a qualidade do áudio dependem das vozes do dispositivo; não se trata do professor de IA.

Abra index.html em um navegador moderno. Não exige instalação de dependências. O progresso é local e pode variar conforme o navegador ou o endereço usado para abrir a página.

Interface e fluxos principais verificados no Chrome automatizado. Gravação com microfone físico e conversas com IA real ainda precisam de validação.
# Curso ampliado — primeiro lote A1

O catálogo contém 150 aulas A1 de inglês, em 25 temas com seis aulas cada. Cada aula apresenta seis termos do tema, exemplo bilíngue com leitura sintetizada, dois exercícios e uma prática escrita. O catálogo tem busca e páginas de oito aulas. Os outros níveis permanecem sinalizados como em preparação.

O progresso é separado por aula e etapa, salvo localmente e incluído no backup v4, com migração dos backups anteriores. A prática escrita registra autoavaliação após uma checagem simples de vocabulário; ela não avalia fluência. O professor IA recebe o contexto da aula por um ID validado no servidor, quando a integração está configurada.

As aulas são conteúdo gerado, ainda sem revisão pedagógica independente. A presença de 150 aulas não certifica cobertura completa do CEFR. Não há vídeos produzidos para cada aula nem avaliação automática de pronúncia. Verificação: testes de conteúdo, armazenamento e servidor, além do fluxo no navegador em tamanho móvel.

