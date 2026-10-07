# Implantação planejada — CentOS Stream 9

Perfil aprovado: uma VM com 8 vCPU, 16 GB de RAM e 300 GB de disco. Aplicação e PostgreSQL na mesma VM; IA em API externa. Este roteiro não significa que a VM foi acessada ou que a implantação foi concluída.

## Recursos iniciais

- PostgreSQL: orçamento aproximado de 6 GB de RAM, incluindo conexões e cache; começar com shared_buffers=2GB, work_mem=8MB e maintenance_work_mem=256MB. effective_cache_size=8GB é uma estimativa para o planejador, não uma reserva de memória. Ajustar por métricas e carga real.
- Aplicação Node 24 ou superior: começar com um processo e orçamento de até 3 GB; manter margem para picos, Nginx, sistema e cache de disco. Não iniciar oito processos automaticamente: limites e caches atuais são locais a cada processo.
- Disco: orçamento lógico de 40 GB para sistema/aplicação, 100 GB para dados PostgreSQL, 100 GB para mídia, 20 GB para logs/arquivos temporários e 40 GB de margem. Não reparticionar um disco existente automaticamente. WAL e staging de backup precisam caber no orçamento e ser monitorados.
- Backups definitivos no armazenamento da empresa, fora desta VM. A réplica de alta disponibilidade, se adicionada, também precisa ficar fora dela.

Esses valores são hipóteses de partida, não capacidade comprovada para 2.000 usuários simultâneos. Validar 100/200 usuários simultâneos e depois o pico esperado, observando latência, CPU, memória, disco, conexões e limites do provedor de IA.

## Topologia

Navegador → HTTPS/Nginx → Node em 127.0.0.1:3000 → PostgreSQL local.

Somente HTTPS público; HTTP para redirecionamento ou validação do certificado. PostgreSQL e porta 3000 não devem ser publicados. SSH restrito à rede administrativa/VPN. Manter SELinux enforcing; configurar a permissão necessária para o proxy em vez de desativá-lo.

Instalar Node compatível com engines do package.json, PostgreSQL em versão suportada compatível com o sistema e Nginx. Verificar repositórios antes da instalação: instruções PGDG para RHEL não implicam suporte automático a CentOS Stream.

## Sequência de implantação

1. Confirmar IP, acesso administrativo, domínio, DNS, saída HTTPS para APIs e destino externo dos backups. Não enviar senhas nem chaves de API no chat.
2. Atualizar o sistema, criar usuário de serviço sem privilégios administrativos e diretório /opt/studyia. Instalar dependências com npm ci --omit=dev --ignore-scripts, sem copiar node_modules do Windows.
3. Criar banco e credenciais distintas de migração e execução; conceder à aplicação somente os privilégios exigidos, inclusive sequences quando aplicável. Proteger o arquivo de ambiente fora do diretório público.
4. Aplicar npm run migrate com a credencial de migração. Iniciar server.mjs com a credencial de execução; nunca usar dev-server.mjs ou admin/admin na produção.
5. Configurar Nginx, certificado, domínio e integração HTTPS da aplicação. Validar login, cookie Secure, CSRF, dicionário, voz e logout pelo endereço público.
6. Criar administrador real em acesso controlado antes de expor o bootstrap. Testar dois alunos diferentes para isolamento de progresso e notas.
7. Ativar backup, monitoramento e teste de restauração em banco isolado. Validar /health/live e /health/ready.
8. Executar carga e um piloto; só depois liberar o acesso geral.

## Ajustes da aplicação ainda necessários

- As verificações de origem atuais usam http://host. Definir origem pública HTTPS explícita e usá-la consistentemente em todas as rotas; não confiar livremente em cabeçalhos forwarded vindos do cliente. Rever bootstrap e cookies antes de exposição pública.
- Falhar na inicialização de produção se DATABASE_URL estiver ausente, impedindo demonstração acidental.
- Limites atuais de geração/negociação de voz e caches em memória não comprovam capacidade para o piloto. Dimensionar filas, quotas de IA no servidor e cache persistente compartilhado para áudios das aulas.
- Conferir proteção de acesso de arquivos, observabilidade, retenção de logs e procedimentos de atualização/rollback.

## Operação

Backups diários são uma proteção inicial; combinar base backups e arquivamento WAL para recuperação a um instante específico quando a meta de perda de dados exigir. Monitorar falhas de backup e testar restauração. Definir RPO/RTO e retenção com a empresa; uma única VM não oferece failover nem disponibilidade absoluta.

Alertar antes de esgotar disco (por exemplo, 75%/85%), sobre serviço indisponível e crescimento anormal de consumo de API. Atualizações devem preservar o banco, mídias e segredos; copiar código não substitui backup.

Referências: [PostgreSQL para a família Red Hat](https://www.postgresql.org/download/linux/redhat/), [backup e recuperação](https://www.postgresql.org/docs/current/continuous-archiving.html).
