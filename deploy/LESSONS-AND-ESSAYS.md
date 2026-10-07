# Aulas ampliadas e redação

O curso de inglês (900 aulas, A1–C2) inclui contextos cotidianos bilíngues,
exemplos relacionados, explicações de gramática, erros comuns, orientações de
pronúncia e prática escrita livre. As duas etapas objetivas têm cinco alternativas;
a apresentação embaralha a ordem mantendo os índices usados pelo servidor.

As provas e diagnósticos de inglês têm dez questões: quatro de alternativas,
três de listening, duas de reprodução escrita e uma redação sobre o bloco.
A pronúncia com Azure continua desativada nessas provas. Os outros idiomas
mantêm a composição anterior.

A redação exige uma conta e OPENAI_API_KEY/OPENAI_MODEL configurados no servidor.
Cada correção consome a API OpenAI. A1: 25–60 palavras; A2: 40–90;
B1: 60–120; B2: 80–150; C1: 100–180; C2: 120–220.
O texto é enviado à OpenAI com store:false. Texto e feedback ficam no banco.
A rubrica tem quatro critérios de 25 pontos: tema, vocabulário, gramática e
coerência. Com 80 pontos e pelo menos 15 em tema, a questão recebe 100;
caso contrário recebe 0, mantendo o peso de uma questão na prova.
A avaliação é uma estimativa feita por IA. Falha de configuração ou serviço
deixa a questão pendente, permitindo tentar novamente sem registrar nota.
Resultados e respostas históricos são preservados pela migração 007.

## Atualização na VM

Execute em /opt/studyia, preservando .env, certificados e compose.override.yaml:

```bash
cd /opt/studyia
mkdir -p backups
# Backup lógico do banco antes da migração.
docker compose exec -T db pg_dump -U postgres -d studyia > "backups/studyia-$(date +%Y%m%d-%H%M%S).sql"
# Baixa a atualização. Se houver conflito, pare para revisar as alterações locais.
git pull --ff-only origin main
# Prepara a imagem, pausa a aplicação e aplica a migração.
docker compose build app migrate
docker compose stop app
docker compose run --rm migrate
# Se a migração terminou com sucesso, inicia a versão nova.
docker compose up -d app proxy
docker compose ps
```

Se a migração falhar, consulte sua saída antes de iniciar a aplicação.
Acesse a plataforma, atualize com Ctrl+F5 e entre na conta para testar a redação.
