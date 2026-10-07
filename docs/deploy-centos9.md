# StudyIA: CentOS Stream 9, domínio e PostgreSQL local

Execute em um servidor novo. Substitua studyia.example.com pelo domínio real e aponte seu registro DNS A (e AAAA apenas se IPv6 funcionar) para o servidor. Não execute os comandos de instalação de banco sobre uma instalação existente sem revisar os dados.

## 1. Pacotes

```bash
sudo dnf update -y
sudo dnf install -y nginx firewalld policycoreutils-python-utils
sudo dnf module list nodejs postgresql
sudo dnf module install -y nodejs:24 postgresql:18/server
node --version
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql firewalld
```

Confirme que os streams 24 e 18 aparecem. Se PostgreSQL 18 não estiver disponível, use o repositório oficial PGDG para EL9; os caminhos e o serviço passam a ser versionados (postgresql-18). Node deve ser >=24. Não misture os dois métodos de instalação do PostgreSQL.

## 2. Banco

```bash
sudo -u postgres psql
```

No psql, crie dois usuários sem privilégios administrativos. Use `\password` para não registrar a senha na linha de comando:

```sql
CREATE ROLE studyia_migrate LOGIN;
\password studyia_migrate
CREATE ROLE studyia_app LOGIN;
\password studyia_app
CREATE DATABASE studyia OWNER studyia_migrate;
\connect studyia
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE, CREATE ON SCHEMA public TO studyia_migrate;
GRANT USAGE ON SCHEMA public TO studyia_app;
ALTER DEFAULT PRIVILEGES FOR ROLE studyia_migrate IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO studyia_app;
ALTER DEFAULT PRIVILEGES FOR ROLE studyia_migrate IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO studyia_app;
\q
```

Em `/var/lib/pgsql/data/pg_hba.conf`, coloque estas regras antes de regras localhost mais amplas:

```text
host studyia studyia_migrate 127.0.0.1/32 scram-sha-256
host studyia studyia_app     127.0.0.1/32 scram-sha-256
```

Mantenha `listen_addresses = 'localhost'` em postgresql.conf. Recarregue com `sudo systemctl reload postgresql`. Não abra a porta 5432 no firewall.

## 3. Arquivos e variáveis

```bash
sudo useradd --system --home-dir /opt/studyia --shell /sbin/nologin studyia
sudo mkdir -p /opt/studyia
```

Transfira o código para `/opt/studyia` por SCP/SFTP. Exclua `.env`, `node_modules`, `.tools`, `data/local-dev`, logs e arquivos de preview. Não transfira a conta admin/admin de testes.

```bash
sudo chown -R studyia:studyia /opt/studyia
cd /opt/studyia
sudo -u studyia npm ci --omit=dev --ignore-scripts
sudo -u studyia cp .env.example .env
sudo chmod 600 .env
sudo -u studyia nano .env
```

Configure:

```dotenv
NODE_ENV=production
PUBLIC_ORIGIN=https://studyia.example.com
PORT=3000
DATABASE_URL=postgresql://studyia_migrate:SENHA_CODIFICADA@127.0.0.1:5432/studyia
DATABASE_TLS=
OPENAI_API_KEY=SUA_CHAVE
OPENAI_MODEL=MODELO_RESPONSES_DISPONIVEL
OPENAI_REALTIME_MODEL=MODELO_REALTIME_DISPONIVEL
OPENAI_TTS_MODEL=gpt-4o-mini-tts
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=
```

Codifique caracteres especiais da senha na URL (percent encoding). Banco localhost não precisa DATABASE_TLS. Chaves ficam somente no servidor. Azure é opcional para avaliação de pronúncia; OpenAI atende texto e voz. PUBLIC_ORIGIN não tem barra final.

```bash
sudo -u studyia npm run migrate
```

Depois altere DATABASE_URL no .env para `studyia_app` e sua senha. As permissões padrão acima abrangem as tabelas criadas pelas migrações. Em banco existente, conceda também as permissões nas tabelas/sequências existentes.

## 4. Serviço e primeiro administrador

```bash
sudo cp deploy/studyia.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now studyia
curl -f http://127.0.0.1:3000/health/ready
```

O arquivo usa `/usr/bin/node`; ajuste se `command -v node` indicar outro caminho. O serviço lê o .env do projeto. NODE_ENV=production exige banco e origem HTTPS.

Antes de publicar, crie o administrador pelo localhost. Crie um arquivo temporário com acesso restrito contendo este JSON, substituindo os valores e usando uma senha de pelo menos 12 caracteres:

```bash
umask 077
nano /tmp/studyia-setup.json
```

```json
{"company":"Sua escola","name":"Administrador","email":"seu-email@exemplo.com","password":"SUA_SENHA_FORTE"}
```

```bash
curl --fail --silent --show-error -o /dev/null \
  -H 'Content-Type: application/json' \
  --data-binary @/tmp/studyia-setup.json \
  http://127.0.0.1:3000/api/company/setup
rm /tmp/studyia-setup.json
```

O endpoint só permite criar uma empresa; o Nginx fornecido bloqueia essa rota publicamente. Faça login pelo domínio depois de instalar o certificado.

## 5. Nginx e certificado

Edite `deploy/nginx.conf`, substituindo studyia.example.com pelo domínio real:

```bash
sudo cp deploy/nginx.conf /etc/nginx/conf.d/studyia.conf
sudo setsebool -P httpd_can_network_connect 1
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
sudo nginx -t
sudo systemctl enable --now nginx
```

Instale Certbot pelo método oficial disponível para CentOS/RHEL (link abaixo). Com `certbot` instalado e DNS apontando corretamente:

```bash
sudo certbot --nginx -d studyia.example.com --redirect
sudo certbot renew --dry-run
sudo nginx -t
sudo systemctl reload nginx
```

Verifique que o instalador ativou a renovação automática. Libere 80/443 também no firewall do provedor. Node fica em 127.0.0.1:3000. Não remova o cabeçalho Origin no proxy: a aplicação valida PUBLIC_ORIGIN e mantém CSRF. O microfone remoto exige HTTPS.

## 6. Verificação e operação

```bash
curl -f https://studyia.example.com/health/ready
sudo systemctl status studyia
sudo journalctl -u studyia -n 100 --no-pager
sudo tail -n 50 /var/log/nginx/error.log
```

Teste login, convite, aula e conversa real com permissão de microfone. Login tem limite no Nginx por IP; o limite interno atual usa o IP do proxy e pode bloquear muitos logins simultâneos. Limites de IA também são por processo. Dimensione após teste de carga; uma única máquina é um ponto de falha.

Para backup, execute `pg_dump -Fc studyia` como usuário PostgreSQL com acesso adequado, guarde o arquivo com permissão restrita e copie-o criptografado para fora do servidor. Agende diariamente, defina retenção e teste restauração em outro banco. Não copie data/local-dev para produção.

Atualizações: faça backup, instale dependências do novo código, rode novas migrações com studyia_migrate, volte à credencial studyia_app e reinicie `sudo systemctl restart studyia`. Antes de mudanças destrutivas, teste a restauração.

Referências oficiais:
- https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html-single/deploying_web_servers_and_reverse_proxies/index
- https://www.postgresql.org/download/linux/redhat/
- https://nodejs.org/en/download
- https://certbot.eff.org/instructions?ws=nginx&os=snap
