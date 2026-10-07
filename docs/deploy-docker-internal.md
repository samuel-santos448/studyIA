# Docker e Git: StudyIA na rede interna

Endereço: https://studyia.escolamobile.com.br:8443, resolvido internamente para 192.168.19.21. Não publique DNS externo nem encaminhe portas no roteador. O proxy publica somente no IP LAN; Node e PostgreSQL não publicam portas no host. O banco usa volume Docker independente do PostgreSQL 13 existente. Esse serviço antigo continua precisando de recuperação separada.

A VM precisa de saída para repositórios/imagens na instalação e para OpenAI/Azure quando usar IA. Ausência de exposição pública não significa operação offline. Escolha um repositório Git privado. Credenciais, certificados e dados ficam fora do Git e da imagem.

## Windows: enviar o código ao Git

Crie um repositório privado vazio (sem README inicial) no seu GitHub/GitLab ou Git interno. Use sua URL real:

```powershell
Set-Location 'C:\Users\Administrador\Documents\StudyIA'
git init -b main
git config user.name 'SEU NOME'
git config user.email 'SEU EMAIL'
git check-ignore .env
git add .
git status --short
git diff --cached --stat
git commit -m 'Prepara StudyIA para Docker na rede interna'
git remote add origin URL_DO_REPOSITORIO_PRIVADO
git push -u origin main
```

Confira que .env, deploy/certs, backups e dados locais não estão na lista. Autentique com chave SSH ou gerenciador de credenciais; não coloque token na URL.

## CentOS Stream 9: instalar Docker

Em shell root, sem instalar Node/PostgreSQL no host:

```bash
dnf install -y dnf-plugins-core git openssl nano
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
docker version
docker compose version
docker run --rm hello-world
```

Se DNF relatar conflitos com Podman/runc, revise antes de remover pacotes: esta VM já tem aplicações. Docker altera regras de encaminhamento de rede; confirme o funcionamento dos serviços existentes.

## Clonar e configurar

```bash
mkdir -p /opt
git clone URL_DO_REPOSITORIO_PRIVADO /opt/studyia
cd /opt/studyia
cp deploy/docker.env.example .env
chmod 600 .env
sed -i "s/REPLACE_WITH_RANDOM_HEX/$(openssl rand -hex 32)/" .env
sed -i "s/REPLACE_WITH_DIFFERENT_RANDOM_HEX/$(openssl rand -hex 32)/" .env
nano .env
```

Confirme LAN_IP=192.168.19.21, HTTPS_PORT=8443 e PUBLIC_ORIGIN=https://studyia.escolamobile.com.br:8443. Preencha chave e modelos de IA se usar essas funções. Senhas geradas são hexadecimais e não exigem codificação na URL. Evite imprimir o .env ou usar `docker compose config` sem --quiet, pois pode mostrar segredos.

As senhas do banco só inicializam um volume novo. Alterar o .env posteriormente não altera automaticamente senhas de usuários já criados.

## HTTPS interno

Use a CA corporativa existente, se houver. Como alternativa, este script gera uma CA privada e certificado com os nomes do navegador e do banco:

```bash
export LAN_IP=192.168.19.21
export INTERNAL_NAME=studyia.escolamobile.com.br
bash deploy/docker/create-certs.sh
docker compose config --quiet
```

O script não sobrescreve certificados existentes. Importe somente deploy/certs/ca.crt como autoridade confiável nos dispositivos dos alunos. Não distribua ca.key/server.key. O certificado do servidor dura 365 dias; a renovação deve ser programada antes do vencimento. Com CA corporativa, o certificado usado também precisa de SAN DNS:db para a verificação TLS do PostgreSQL, ou adapte para certificados separados.

Configure no DNS interno o nome studyia.escolamobile.com.br -> 192.168.19.21. Para um teste em Windows, abra o Bloco de Notas como administrador e edite C:\Windows\System32\drivers\etc\hosts, adicionando:

```text
192.168.19.21 studyia.escolamobile.com.br
```

## Iniciar e criar administrador

```bash
docker compose up -d --build
docker compose ps -a
docker compose logs --tail=100 db migrate app proxy
curl --cacert deploy/certs/ca.crt --resolve studyia.escolamobile.com.br:8443:192.168.19.21 https://studyia.escolamobile.com.br:8443/health/ready
```

migrate deve terminar com código 0; db/app devem ficar healthy. Compose aguarda banco e migrações antes da aplicação. Não é preciso postgresql-setup no host.

Crie o administrador sem expor o endpoint no proxy:

```bash
umask 077
nano /tmp/studyia-setup.json
```

Conteúdo, com valores reais e senha de ao menos 12 caracteres:

```json
{"company":"Escola Móbile","name":"Administrador","email":"SEU_EMAIL","password":"SUA_SENHA_FORTE"}
```

```bash
docker compose exec -T app node --input-type=module -e 'import fs from "node:fs"; const body=fs.readFileSync(0,"utf8"); const r=await fetch("http://127.0.0.1:3000/api/company/setup",{method:"POST",headers:{"Content-Type":"application/json"},body}); if(!r.ok){console.error((await r.json()).error);process.exit(1)} console.log("Administrador criado.");' < /tmp/studyia-setup.json
rm /tmp/studyia-setup.json
```

## Acesso, firewall e limites

Não encaminhe 8443 no roteador nem exponha a VM por NAT público. A porta é vinculada ao IP privado. Docker instala regras próprias: abrir/fechar uma porta com firewalld não equivale a filtrar portas publicadas pelo Docker. Para limitar por VLAN/sub-rede use ACL na rede ou regras específicas DOCKER-USER (backend iptables), confirmando a máscara real antes. Não aplique regras globais que possam afetar outros containers.

Depois de confiar na CA e resolver o nome, abra https://studyia.escolamobile.com.br:8443. Use sempre esse endereço, correspondente a PUBLIC_ORIGIN. HTTPS confiável é necessário para microfone. IA faz conexões externas; não fica inteiramente na VM.

O usuário SQL studyia não é superusuário; ele é proprietário do banco e aplica migrações nesta implantação interna. Para produção maior, separe credenciais de migração/aplicação. Limites atuais de login no backend usam IP do proxy e podem afetar logins simultâneos; dimensione após validar.

## Backup e atualização

```bash
cd /opt/studyia
mkdir -p backups
chmod 700 backups
umask 077
docker compose exec -T db pg_dump -U postgres -d studyia -Fc > "backups/studyia-$(date +%Y%m%d-%H%M%S).dump"
```

Só prossiga se o backup tiver concluído sem erro. Copie para fora da VM e teste restauração em outro banco.

```bash
git pull --ff-only
docker compose build app migrate
docker compose stop app proxy
docker compose run --rm migrate
docker compose up -d
docker compose ps -a
```

Execute cada comando separadamente e não continue se migração falhar. Teste antes atualizações destrutivas. Nunca use `docker compose down -v` para atualizar: -v remove volumes.

```bash
docker compose stop
docker compose start
docker compose restart app
docker compose logs -f --tail=100 app
```

## Validação disponível

Compose validado com `docker compose --env-file deploy/docker.env.example config --quiet`. Testes Node de origem HTTPS e servidor passaram. Containers ainda precisam ser construídos e executados na VM: o Docker Engine local não estava ativo.

Referências:
- https://docs.docker.com/engine/install/centos/
- https://docs.docker.com/compose/how-tos/startup-order/
- https://hub.docker.com/_/postgres
- https://docs.docker.com/engine/network/firewall-iptables/
