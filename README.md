# StudyIA

Aplicativo de aprendizado de idiomas com aulas estruturadas e um professor de inteligência artificial para praticar conversação por texto e voz.

## Estado do projeto

Protótipo inicial disponível: uma aula de inglês A1 com exemplos, três exercícios, correções e progresso salvo no navegador. A integração com IA e voz ainda não está implementada.

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

A arquitetura e as dependências ainda serão escolhidas. Nenhuma chave de IA deve ser incluída no código ou enviada ao GitHub. As chamadas autenticadas ao provedor deverão passar por um servidor.

O projeto ainda não tem licença de distribuição definida.

## Executar o protótipo

### Estúdio interativo

Os exemplos têm botões para ouvir, com voz sintetizada do navegador e velocidade ajustável. Inclui explicação em português, montagem de frases e demonstração animada de uma conversa. As animações respeitam a preferência de movimento reduzido do sistema.

O player aceita vídeos locais sem upload. Ainda não há vídeos de aula produzidos nem GIFs incorporados. As animações atuais são feitas em CSS. A disponibilidade e a qualidade do áudio dependem das vozes do dispositivo; não se trata do professor de IA.

Abra index.html em um navegador moderno. Não exige instalação de dependências. O progresso é local e pode variar conforme o navegador ou o endereço usado para abrir a página.

Verificação inicial: sintaxe de app.js validada com Node.js. Interface e comportamento ainda precisam de validação no navegador.
