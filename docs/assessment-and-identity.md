# Jornada, provas e identidade

## Regras implementadas

- Cada aula do curso tem duas questões e uma prática de conversação. As três etapas liberam a próxima aula.
- A cada dez aulas, a prova bloqueia o próximo bloco até obter **80%**. São 90 provas de bloco, quinze por nível, com dez questões: três alternativas, três listening, duas de escrita controlada e duas de pronúncia. As questões usam o conteúdo das dez aulas do bloco.
- Cada questão vale dez pontos na prova. A escrita reproduz uma frase estudada; não avalia redação livre. Listening usa fala sintetizada pelo navegador.
- A pronúncia compara áudio à frase de referência no Azure Speech. PronScore e CompletenessScore precisam atingir 80 para acertar a questão. Falha de serviço ou ausência de configuração deixa a questão pendente, sem atribuir nota.
- A1 inicia no básico. A2 ou superior exige diagnóstico no nível declarado. Reprovação desce um nível e exige novo diagnóstico; reprovação em A2 inicia A1. Aprovação define o nível de entrada. É uma estimativa interna, sem validade de certificação CEFR.
- Quinze provas aprovadas promovem o nível estimado. A barra de desempenho é a soma das melhores notas das quinze provas dividida por quinze; provas não realizadas contam como zero. Portanto quinze notas de 80 aprovam o nível e mostram 80% de desempenho, não 100%. O número de blocos aprovados aparece separadamente.
- Repetir uma prova preserva a melhor nota do bloco. Backup v5 inclui jornada, notas e prova pendente; backups v1–v4 preservam aulas mas não criam aprovações fictícias.

## Limites do protótipo

Na demonstração sem conta, o bloqueio e progresso são locais. Com PostgreSQL configurado e aluno conectado, etapas, tentativas, notas e pré-requisitos são validados no servidor e isolados por usuário. O endpoint de áudio exige sessão e CSRF quando a empresa está configurada, escolhe a referência no servidor e registra a nota na tentativa atual. O cache e o backup local não substituem a jornada da conta. Isso não elimina acesso ao gabarito estático nem equivale a um ambiente de provas supervisionadas. Consulte [a estrutura da empresa e operação PostgreSQL](postgresql-operations.md).

O currículo gerado e os diagnósticos precisam de revisão pedagógica e validação de dificuldade e representatividade. A prova diagnóstica atual cobre o primeiro bloco do nível, não todas as competências do CEFR.

## Configuração de áudio

Preencha AZURE_SPEECH_KEY e AZURE_SPEECH_REGION no .env do servidor e reinicie. Não inclua o .env em commits. O navegador pede microfone, permite ouvir a gravação e envia WAV mono PCM16 a 16 kHz ao solicitar avaliação. Máximo: 30 segundos. O servidor não grava áudio em disco e o backup não contém gravações. O processamento externo obedece ao serviço contratado.

Referência: [REST e avaliação de pronúncia](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-speech-to-text-short).

## Estrutura para autenticação corporativa futura

auth/identity.mjs define configuração local, Entra ou OIDC e uma chave de identidade baseada em issuer + subject, não em email. AUTH_PROVIDER, ENTRA_TENANT_ID, AUTH_CLIENT_ID, AUTH_REDIRECT_URI e OIDC_ISSUER estão documentados no .env.example. GET /api/auth/status expõe apenas estado e provedor, sem segredos. signInEnabled permanece false mesmo quando a configuração está preenchida.

Próxima implementação: adaptador OIDC com biblioteca mantida, fluxo Authorization Code + PKCE, state e nonce por sessão; descoberta e validação criptográfica de assinatura, issuer, audience e expiração; cookies HttpOnly/Secure/SameSite; logout e sessões no servidor. identityKey recebe identidade já verificada: o campo verified não substitui a verificação criptográfica e nunca deve vir diretamente do cliente.

Organizações e usuários deverão ter armazenamento separado por tenant e issuer/subject, política explícita de tenants permitidos, vínculo administrativo de contas e controle de acesso aplicado no servidor. Migração do progresso local deve ser uma importação validada e consentida, não associação automática por email.

Active Directory local entra por federação OIDC/AD FS compatível ou integração com Entra. Não coletar senhas AD nem fazer LDAP no navegador. Nenhum login corporativo, cadastro de aplicação ou tenant foi ativado nesta etapa.

Referências: [OIDC no Entra](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc) e [arquitetura de autenticação](https://learn.microsoft.com/en-us/entra/architecture/authenticate-applications-and-users).
