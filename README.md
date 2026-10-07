# StudyIA

Protótipo de aprendizado de inglês para falantes de português, com navegação por módulos e **900 aulas curtas geradas: 150 em cada nível A1, A2, B1, B2, C1 e C2**.

## Estudar

Abra Aula → Explorar curso completo, ou a rota `#catalog`. Escolha o nível, busque um tema e navegue por páginas de oito aulas. São 25 temas por nível, com seis aulas por tema.

Cada aula tem objetivo, seis termos relacionados, exemplo bilíngue com leitura sintetizada, dois exercícios e uma proposta de conversa. As abas Aprender, Exercitar e Conversar mostram uma atividade por vez. Os exemplos são próprios de cada lote; os desafios passam de falas simples a argumentos, nuances e reformulação entre públicos.

O progresso registra duas respostas corretas e uma prática escrita autoavaliada. A conferência escrita reconhece vocabulário e algumas flexões; não interpreta a conversa nem avalia fluência. O professor IA pode receber o contexto e o nível da aula quando a integração está configurada.

## Executar

Use Node.js 24 ou superior:

```sh
npm ci --ignore-scripts
npm start
```

Abra `http://127.0.0.1:3000`. Sem o servidor, `index.html` permite estudar o conteúdo estático, mas não acessar o professor IA. O progresso pertence ao navegador e à origem usados para abrir o aplicativo.

Para configurar a integração, siga [a configuração local da IA](docs/ai-setup.md). O servidor mantém as credenciais fora do cliente. Não inclua chaves no GitHub. Chamadas reais ao provedor ainda precisam de validação com credenciais; os testes usam respostas simuladas.

## Progresso e backup

Preferências → Progresso mostra as aulas praticadas por nível e as 13 atividades rápidas de introdução. Preferências → Backup exporta perfil, progresso, revisão, favoritos, aparência e histórico de atividades em JSON v5. Backups v1–v4 continuam aceitos.

A importação aceita até 1 MB, apresenta um resumo e pede confirmação antes de substituir dados. Conversas, gravações e credenciais não entram no arquivo. Sem conta, o progresso é local. Com PostgreSQL e conta conectada, o curso e as provas sincronizam pelo servidor; restaurar backup local não substitui as notas da conta.

## Outros módulos

- Estúdio: explicação falada, montagem de frases, demonstração animada, desafio auditivo e player de vídeos locais.
- Conversação: roteiro demonstrativo, gravação local de até 60 segundos e professor IA por texto, com leitura sintetizada das respostas.
- Vocabulário: 912 cartões com termos e expressões, filtros por nível, busca, favoritos e acesso ao dicionário.
- Dicionário: pesquisa em inglês ou português, exemplos bilíngues da base do curso e explicação pela IA quando configurada.
- Revisão: dificuldades das atividades rápidas. A fila ainda não recebe os exercícios das 900 aulas.
- Preferências: plano de estudo, meta diária, tema claro/escuro e backup.

## Validação e limites

As 900 aulas são **conteúdo gerado, sem revisão pedagógica independente**. Os rótulos A1–C2 orientam a organização e os roteiros; a contagem não comprova cobertura integral do CEFR nem certifica proficiência. Os exercícios de reconhecimento são curtos e precisam de aprofundamento pedagógico, especialmente nos níveis avançados.

O áudio depende das vozes do navegador. A avaliação automática de pronúncia nas provas exige Azure Speech configurado. Ainda não há conversa bidirecional por voz com IA, vídeos produzidos por aula ou GIFs incorporados. O microfone físico e a integração com o provedor real ainda precisam de validação.

Execute `npm test` para os testes de conteúdo, gabarito, dados, backup e servidor. A verificação desta expansão também abriu as 900 rotas no Chrome, concluiu uma aula por nível e exportou/restaurou progresso nas 900 aulas. Consulte [o registro da expansão](docs/course-status.md).

Aplicativos distribuídos nas lojas iOS, Android, Windows e macOS, pagamentos e hospedagem multiusuário permanecem no plano de produto. Este servidor serve desenvolvimento local.

## Provas e progressão

O curso libera uma aula por vez e exige prova de dez questões a cada dez aulas. Aprovação: 80%. O diagnóstico é obrigatório a partir de A2. Backup v5 preserva notas e jornada. A estrutura OIDC/Entra está preparada, mas login corporativo permanece desativado. Regras, configuração e limites estão em [jornada e identidade](docs/assessment-and-identity.md).

Validação das provas: 45 testes Node e fluxo no Chrome de bloqueio, prova com 80%, gravação WAV com avaliador simulado, restauração do backup e diagnóstico. O serviço real de áudio e a validade pedagógica do diagnóstico ainda precisam de validação.

## Empresa e PostgreSQL

A base para uma empresa inclui configuração do administrador, convites de aluno, login local, sessões, curso individual no servidor e relatório de evolução. O esquema PostgreSQL separa usuários, etapas, tentativas e respostas; transações e restrições impedem notas inconsistentes. Não há fallback para SQLite.

Configure DATABASE_URL e TLS no .env, execute npm run migrate e inicie o servidor. Sem conexão configurada, permanece a demonstração local. A infraestrutura PostgreSQL de produção, alta disponibilidade e backups ainda precisam ser provisionados. Consulte [configuração e operação](docs/postgresql-operations.md).

Validação: 52 testes Node, SQL no motor PostgreSQL embarcado de teste e fluxo Chrome com administrador, convite, isolamento, sincronização e resistência à alteração do cache. O workflow também executa testes com PostgreSQL 18 separado; a execução remota deve ser confirmada no GitHub. Login Entra, recuperação de senha e hospedagem pública ainda não estão ativados.

## Documentação

- [Vocabulário e dicionário](docs/dictionary.md)
- [Escopo do produto](docs/product.md)
- [Plano de desenvolvimento](docs/roadmap.md)
- [Estado e verificação do curso](docs/course-status.md)

O projeto ainda não tem licença de distribuição definida.
