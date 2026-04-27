# Mapa do Projeto

## Visao geral

Este projeto e um sistema de chamados com:

- `backend` em Node.js + Express + MongoDB
- `frontend` em React
- `nginx` como proxy reverso
- `docker-compose` para subir a stack completa

O fluxo principal e:

1. o usuario acessa a aplicacao pelo `nginx`
2. o frontend React consome a API em `/api`
3. a API autentica o usuario com JWT
4. os dados sao persistidos no MongoDB
5. alteracoes de status podem gerar notificacoes e eventos em tempo real via Socket.IO

## Estrutura da raiz

### `backend/`

Contem toda a API, regras de negocio, autenticacao, persistencia e uploads.

### `frontend/`

Contem a interface React, contexto de autenticacao, paginas e cliente HTTP.

### `nginx/`

Contem a configuracao do proxy reverso usado para servir o frontend e encaminhar `/api`, `/socket.io` e `/uploads`.

### `docker-compose.yml`

Orquestra os servicos da stack:

- `mongodb`
- `api`
- `frontend`
- `nginx`

### `README.md`

Documentacao principal de uso, execucao local, Docker e DNS interno.

### `PROJECT_MAP.md`

Este arquivo. Serve como guia de onboarding e referencia rapida da arquitetura.

## Backend

### `backend/src/server.js`

Ponto de entrada do backend.

Responsabilidades:

- carregar variaveis de ambiente
- inicializar conexao e servicos auxiliares
- subir o servidor HTTP

### `backend/src/app.js`

Monta a aplicacao Express e o servidor Socket.IO.

Responsabilidades:

- configurar `cors`
- habilitar `express.json()`
- servir uploads
- injetar `req.io` para os controllers
- registrar as rotas da API

### `backend/src/routes.js`

Arquivo central de rotas do backend.

Agrupa:

- rotas publicas de autenticacao
- rotas autenticadas de chamados, clientes, perfil e notificacoes
- rotas administrativas de lixeira e exclusao

### `backend/src/database/connection.js`

Configura a conexao com MongoDB usando `MONGO_URI` ou `MONGO_URL`.

### `backend/src/database/seed.js`

Script utilitario para criar ou resetar o usuario administrador padrao.

## Controllers

### `backend/src/controllers/AuthController.js`

Controla autenticacao e recuperacao de conta.

Responsabilidades:

- registro
- login
- refresh token
- forgot password
- reset password

### `backend/src/controllers/ChamadoController.js`

Controller principal da aplicacao.

Responsabilidades:

- criar chamado
- listar chamados
- exibir detalhes
- atualizar chamado
- adicionar e remover comentarios
- gerar dashboard
- exportar CSV
- mover para lixeira
- restaurar itens da lixeira

### `backend/src/controllers/ClienteController.js`

Responsavel pelo CRUD basico de clientes.

### `backend/src/controllers/UserController.js`

Responsavel pelo perfil do usuario autenticado.

Responsabilidades:

- consultar perfil
- atualizar nome, email, senha e avatar

### `backend/src/controllers/NotificationController.js`

Responsavel pela central de notificacoes do usuario.

Responsabilidades:

- listar
- marcar como lidas
- limpar notificacoes

## Models

### `backend/src/models/User.js`

Representa usuarios do sistema.

Campos importantes:

- `name`
- `email`
- `password`
- `role`
- `avatar`
- `passwordResetToken`
- `passwordResetExpires`

### `backend/src/models/Cliente.js`

Representa o cliente vinculado aos chamados.

Campos importantes:

- `nome`
- `documento`
- `email`
- `telefone`
- `endereco`

### `backend/src/models/Chamado.js`

Modelo central de atendimento.

Campos importantes:

- `title`
- `description`
- `status`
- `priority`
- `user`
- `cliente`
- `attachments`
- `comments`

### `backend/src/models/Log.js`

Armazena eventos de auditoria relacionados ao chamado.

### `backend/src/models/Notification.js`

Armazena notificacoes persistidas para cada usuario.

### `backend/src/models/Trash.js`

Lixeira de comentarios removidos.

### `backend/src/models/ChamadoTrash.js`

Lixeira de chamados completos removidos.

## Middlewares

### `backend/src/middlewares/auth.js`

Valida o token JWT e injeta no request:

- `req.userId`
- `req.userRole`

Tambem exporta `isAdmin` para rotas administrativas.

### `backend/src/middlewares/validate.js`

Executa validacao de `req.body` com `zod` antes do controller.

### `backend/src/middlewares/error.js`

Centraliza tratamento de erros do backend.

Converte erros comuns de:

- Mongoose
- Multer
- validacao

em respostas HTTP coerentes.

## Schemas e configuracoes

### `backend/src/schemas.js`

Define schemas `zod` de validacao para:

- registro
- login
- criacao de chamado
- comentario

### `backend/src/config/multer.js`

Configura uploads de arquivos.

Responsabilidades:

- garantir existencia da pasta de upload
- definir nome dos arquivos
- limitar tamanho
- restringir tipos permitidos

## Services

### `backend/src/services/mail.js`

Servico de envio de e-mail.

Usado em:

- recuperacao de senha
- notificacao de abertura de chamado

### `backend/src/services/cleanupTask.js`

Agenda limpeza periodica de notificacoes antigas.

## Frontend

### `frontend/src/App.jsx`

Ponto de entrada visual da aplicacao React.

Responsabilidades:

- registrar rotas
- aplicar `PrivateRoute`
- montar `Sidebar` e `Header`
- aplicar tema escuro

### `frontend/src/AuthContext.jsx`

Contexto global de autenticacao e sessao.

Responsabilidades:

- armazenar usuario logado
- fazer login e logout
- manter tokens no `localStorage`
- carregar notificacoes
- abrir conexao Socket.IO
- controlar dark mode e sidebar mobile

### `frontend/src/services/api.js`

Cliente `axios` central do frontend.

Responsabilidades:

- definir base da API
- anexar token JWT automaticamente
- renovar token ao receber `401`
- montar URLs publicas de upload

## Paginas principais

### `frontend/src/pages/Login.jsx`

Tela de autenticacao do sistema.

### `frontend/src/pages/Register.jsx`

Tela de cadastro de usuario.

### `frontend/src/pages/ForgotPassword.jsx`

Tela para iniciar recuperacao de senha.

### `frontend/src/pages/ResetPassword.jsx`

Tela para concluir redefinicao de senha.

### `frontend/src/pages/Dashboard.jsx`

Visao geral do sistema com cards, graficos e exportacao em PDF.

### `frontend/src/pages/ListagemChamados.jsx`

Tela de consulta de chamados.

Recursos principais:

- filtros
- paginação
- exportacao CSV
- alteracao de status
- exclusao para lixeira

### `frontend/src/pages/NovoChamado.jsx`

Tela de abertura de chamado com anexos.

### `frontend/src/pages/DetalhesChamado.jsx`

Tela de detalhe do chamado.

Recursos principais:

- informacoes do chamado
- anexos
- comentarios internos
- auditoria

### `frontend/src/pages/Clientes.jsx`

Tela de cadastro e visualizacao de clientes.

### `frontend/src/pages/Perfil.jsx`

Tela de atualizacao de dados do usuario e avatar.

### `frontend/src/pages/TrashList.jsx`

Tela administrativa para lixeira de comentarios.

### `frontend/src/pages/ChamadoTrashList.jsx`

Tela administrativa para lixeira de chamados.

### `frontend/src/pages/Header.jsx`

Barra superior com:

- notificacoes
- toggle de tema
- dados do usuario
- logout

## Componentes

### `frontend/src/components/Sidebar.jsx`

Menu lateral principal da aplicacao.

Mostra itens diferentes dependendo do papel do usuario.

## Infraestrutura

### `nginx/nginx.conf`

Faz a publicacao da aplicacao.

Responsabilidades:

- servir frontend
- encaminhar `/api` para o backend
- encaminhar `/socket.io`
- servir `/uploads`
- aplicar headers de seguranca
- aplicar rate limit em API e login

### `docker-compose.yml`

Stack principal do projeto.

#### `mongodb`

Banco MongoDB persistido em volume Docker.

#### `api`

Servico Node/Express conectado ao Mongo pela rede interna do Compose.

#### `frontend`

Build e entrega estatica do React.

#### `nginx`

Ponto de entrada HTTP publico da aplicacao.

## Fluxos importantes

### Login

1. usuario envia email e senha pelo frontend
2. `AuthContext` chama `api.post('/login')`
3. `AuthController.login` valida credenciais
4. backend retorna `user`, `token` e `refreshToken`
5. frontend salva a sessao no `localStorage`

### Criacao de chamado

1. usuario acessa `NovoChamado`
2. frontend carrega lista de clientes
3. formulario envia `FormData` com anexos
4. backend salva o chamado
5. backend registra log
6. frontend exibe confirmacao

### Atualizacao de status

1. usuario altera status na listagem
2. frontend chama `PUT /chamados/:id`
3. backend atualiza o documento
4. backend cria notificacoes persistidas
5. backend emite evento `statusChanged` por Socket.IO
6. clientes conectados atualizam notificacoes

### Recuperacao de senha

1. usuario solicita recuperacao por email
2. backend gera token temporario
3. backend envia email com token
4. usuario informa email, token e nova senha
5. backend valida e atualiza a senha

## Sugestao de leitura para onboarding

Se alguem novo entrar no projeto, a ordem mais util de leitura costuma ser:

1. `README.md`
2. `docker-compose.yml`
3. `nginx/nginx.conf`
4. `backend/src/routes.js`
5. `backend/src/controllers/ChamadoController.js`
6. `backend/src/models/*.js`
7. `frontend/src/App.jsx`
8. `frontend/src/AuthContext.jsx`
9. `frontend/src/services/api.js`
10. paginas principais do frontend

## Observacoes finais

- o centro funcional do projeto e o fluxo de chamados
- autenticacao e notificacoes atravessam quase toda a aplicacao
- `nginx` e `docker-compose` sao parte importante da arquitetura, nao apenas detalhe de deploy
- boa parte dos comportamentos da interface depende da API estar sendo acessada por `/api` no mesmo host
