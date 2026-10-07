# Acesso e navegação

O menu começa compacto e o logo dentro da barra lateral funciona como botão de abrir e fechar. Não há ícone de sanduíche. No celular, uma faixa estreita mantém o símbolo do logo acessível; o menu aberto fica sobre a página, pode ser fechado pelo fundo ou Escape e mantém o foco de teclado dentro dele enquanto aberto. O logo também aceita Enter e Espaço. O item ativo e a aba da atividade têm destaque azul e verde. O botão Voltar no topo retorna ao início.

A identificação exibida no topo vem da sessão autenticada no servidor, com nome e papel. Aulas, provas e nível usam o ID do usuário da sessão; o cliente não escolhe o proprietário do progresso. O servidor valida respostas e pré-requisitos. Cada aluno tem registros separados no PostgreSQL. A API rejeita acessos sem sessão e alterações sem CSRF.

Depois de configurar a empresa, entrar na conta é obrigatório para acessar os módulos. Sem banco empresarial configurado, o modo visitante continua como demonstração.

Preferências, favoritos e práticas complementares do navegador são guardados separadamente por ID do usuário. Ao trocar de conta, a página é recarregada para reinicializar as atividades com o estado correto. Alterações de sessão em outras abas também recarregam a página. Esses dados complementares ainda são locais; a sincronização entre dispositivos cobre aulas e provas do curso. A demonstração de visitante permanece separada.

## Administrador para validação local

Execute `npm run start:dev`, abra `http://127.0.0.1:3000/#account` e entre com usuário `admin` e senha `admin`. Também é aceito `admin@studyia.local`.

Esse comando usa um PostgreSQL embarcado (PGlite), persistido em `data/local-dev/`, ignorado pelo Git. O servidor só escuta em 127.0.0.1. Ele recusa NODE_ENV=production e DATABASE_URL. A senha é armazenada com scrypt; a criação é idempotente e não sobrescreve a conta existente. O apelido admin só é aceito por bancos marcados explicitamente como desenvolvimento. Cadastro e convites continuam exigindo senhas com 12 caracteres.

`npm start` continua usando a conexão PostgreSQL configurada e não cria administrador padrão. O banco embarcado é para validação local e não substitui a infraestrutura PostgreSQL de produção ou sua estratégia de alta disponibilidade.
