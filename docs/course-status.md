# Expansão do curso — 6 de outubro de 2026

## Conteúdo disponível

| Nível | Aulas | Temas | Prática proposta |
| --- | ---: | ---: | --- |
| A1 | 150 | 25 | Falas simples e situações cotidianas |
| A2 | 150 | 25 | Trocas com informações adicionais, relatos e pedidos |
| B1 | 150 | 25 | Experiências, motivos, exemplos e acompanhamento |
| B2 | 150 | 25 | Argumentação, contrapontos e concessões |
| C1 | 150 | 25 | Nuances, síntese e reformulação de registro |
| C2 | 150 | 25 | Sentidos implícitos, precisão e mediação entre públicos |

Total: 900 aulas curtas, 900 exemplos bilíngues e 1.800 exercícios de reconhecimento. Cada aula mostra os seis termos do tema, que são reutilizados nas seis aulas desse tema; isso não corresponde a 5.400 palavras distintas.

O conteúdo está em `curriculum.js` e nos cinco arquivos de nível `curriculum-a2.js` a `curriculum-c2.js`. Todos os registros têm status `generated`. A revisão pedagógica independente, a cobertura integral dos descritores do CEFR e o desenho de avaliações de proficiência continuam pendentes.

## Evidências da implementação

| Requisito | Verificação realizada |
| --- | --- |
| Pelo menos 150 aulas por nível | Testes contam exatamente 150 em cada um dos seis níveis, IDs contínuos 001–150 e 25 temas por nível |
| Vocabulário e exemplos | Todos os registros têm seis termos, tradução e exemplo; a conferência lexical reconhece os exemplos fornecidos |
| Exercícios | Gabaritos preservados após rotação de alternativas; escolhas sem duplicatas em cada questão |
| Práticas de conversa | Roteiros específicos por nível em todos os registros; contexto da aula validado no servidor e transmissão testada com provedor simulado |
| Navegação modular | Chrome abriu as 900 rotas, exibindo título, exemplo, vocabulário e nível corretos, com isolamento dos módulos |
| Progresso persistente | Uma aula completa por nível, com recarga e conservação das etapas |
| Backup | Download, importação confirmada e restauração das 900 aulas pelo fluxo real do navegador; teste do maior histórico permitido abaixo de 1 MB |
| Layout responsivo | Verificação de transbordamento nas 900 rotas a 390 px; inspeção visual em 390 e 1.440 px |
| Código salvo | Lotes publicados na branch `main` de `samuel-santos448/studyIA`, preservando o histórico |

Os testes de servidor não fazem chamadas reais à OpenAI. A leitura sintetizada e o microfone dependem do dispositivo; a qualidade de áudio e a conversa com credenciais reais não foram comprovadas por esta verificação.

## Próxima etapa pedagógica

Revisar traduções e exemplos com professores, mapear objetivos aos descritores, aprofundar os exercícios avançados e observar alunos praticando os roteiros. Conclusão local de uma aula registra atividade, não domínio do nível.
