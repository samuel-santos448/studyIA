# Plano de desenvolvimento

## Etapa 1 — Protótipo funcional local

Criar interface responsiva com início, trilha, aula, revisão e progresso. Incluir uma unidade de apresentação pessoal, exercícios com respostas verificáveis e persistência local. Identificar explicitamente qualquer conversa demonstrativa.

Conclusão: o usuário consegue fazer uma aula completa, revisar erros e recuperar seu progresso depois de reabrir o aplicativo.

## Etapa 2 — Professor por texto

Definir provedor e arquitetura, implementar servidor com credenciais protegidas, integrar contexto da aula e respostas do professor. Incluir limites de uso, tratamento de falhas e medição de custo.

Conclusão: conversas reais seguem o nível e o objetivo da aula; falhas não apagam o progresso; nenhuma credencial é exposta no cliente.

## Etapa 3 — Voz

Implementar captura e resposta em áudio, permissão de microfone, interrupção e alternativa por texto. Verificar latência e compatibilidade nos dispositivos disponíveis. Documentar quais aspectos da fala são avaliados.

Conclusão: o usuário mantém uma conversa audível, pode encerrar a captura e entende como o áudio é processado.

## Etapa 4 — Validação pedagógica

Expandir o conteúdo A1, revisar explicações, avaliar retenção e adequação das correções. Ajustar avaliações e experimentar com um pequeno grupo de usuários autorizados.

Conclusão: conteúdo revisado, problemas conhecidos documentados e custo por sessão medido.

## Etapa 5 — Produto comercial

Adicionar contas e sincronização, assinaturas, suporte, monitoramento, exclusão de dados e políticas. Escolher distribuição móvel e desktop e preparar requisitos das lojas antes da submissão.

Conclusão: serviço validado para múltiplos usuários, cobrança testada e publicação preparada para cada plataforma.

## Decisões pendentes

- Tecnologia de interface e servidor.
- Provedor de IA, modelos, áudio e orçamento mensal.
- Banco de dados, autenticação e hospedagem.
- Identidade visual e nome comercial definitivo.
- Licença do código e modelo de assinatura.

## Versionamento

Manter alterações pequenas e descritivas. Não versionar credenciais, dados pessoais de alunos ou gravações. Preservar arquivos e histórico existentes ao conectar este diretório ao repositório remoto.
