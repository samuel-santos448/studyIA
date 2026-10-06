# StudyIA

Aplicativo de aprendizado de idiomas com aulas estruturadas e um professor de inteligência artificial para praticar conversação por texto e voz.

## Estado do projeto

Protótipo disponível com duas unidades de inglês A1, exemplos em áudio, exercícios, conversa guiada e gravação local de voz. O progresso é salvo no navegador. Integração por texto com professor de IA implementada para uso local, aguardando configuração e teste com credenciais reais.

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

Verificação inicial: sintaxe de app.js validada com Node.js. Interface e comportamento ainda precisam de validação no navegador.
