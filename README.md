# Chamados.io

Sistema de chamados com backend em Node.js/Express + MongoDB e frontend em React.

O projeto hoje roda com:
- API em `http://localhost:5000`
- Frontend em `http://localhost:3000`

## Stack

- Node.js
- Express
- MongoDB
- Mongoose
- React
- React Router
- React Hook Form
- Tailwind CSS
- Socket.IO
- JWT
- Multer
- Docker / Docker Compose

## Principais funcionalidades

- Cadastro e login de usuarios
- Autenticacao com JWT e refresh token
- CRUD de chamados
- Dashboard com estatisticas
- Gestao de clientes
- Perfil de usuario com avatar
- Comentarios internos em chamados
- Upload de anexos
- Exportacao CSV
- Logs de auditoria
- Notificacoes em tempo real via Socket.IO
- Lixeira de notas e chamados para administradores

## Estrutura atual

Hoje o repositorio ainda mistura backend e frontend na mesma base:

- API Express em `src/server.js`, `src/app.js`, `src/routes.js`
- Frontend React em `src/index.js`, `src/App.jsx` e `src/controllers/*.jsx`

Funciona assim, mas no futuro vale separar em:

- `backend/`
- `frontend/`

## Requisitos

- Node.js 18+ ou 20+
- MongoDB local ou Docker Desktop

## Variaveis de ambiente

### Backend

Arquivo: [`.env`](C:\Users\asssa\Documents\LINGUAGEM\Old_Chamados-api\.env)

Exemplo:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/chamados_db
JWT_SECRET=SuaChaveSuperSecreta123
```

Observacoes:

- O projeto aceita `MONGO_URL` ou `MONGO_URI`
- No estado atual, o arquivo usa `MONGO_URL`

### Frontend

Arquivo: [`.env.development`](C:\Users\asssa\Documents\LINGUAGEM\Old_Chamados-api\.env.development)

```env
PORT=3000
REACT_APP_API_URL=http://localhost:5000
```

Isso garante:

- frontend em `3000`
- backend em `5000`

## Instalacao

No PowerShell do Windows, prefira `npm.cmd` em vez de `npm` se sua maquina bloquear scripts do PowerShell.

```powershell
npm.cmd install
```

## Como rodar localmente

### 1. Subir o MongoDB

Se voce tiver MongoDB local instalado, deixe o servico rodando.

Se preferir Docker:

```powershell
docker compose up -d mongodb
```

### 2. Rodar a API

```powershell
npm.cmd start
```

API disponivel em:

- [http://localhost:5000](http://localhost:5000)
- [http://localhost:5000/health](http://localhost:5000/health)

### 3. Rodar o frontend

Em outro terminal:

```powershell
npm.cmd run web
```

Frontend disponivel em:

- [http://localhost:3000](http://localhost:3000)

## Fluxo recomendado de execucao

Abra dois terminais:

Terminal 1:

```powershell
npm.cmd start
```

Terminal 2:

```powershell
npm.cmd run web
```

## Criar usuario administrador inicial

Para popular o banco com um admin padrao:

```powershell
npm.cmd run seed
```

Credenciais criadas:

- email: `admin@admin.com`
- senha: `adminpassword123`

## Scripts disponiveis

```json
{
  "dev": "nodemon -L src/server.js",
  "start": "node src/server.js",
  "seed": "node src/database/seed.js",
  "web": "react-scripts start"
}
```

Uso:

- `npm.cmd run dev`: sobe a API com nodemon
- `npm.cmd start`: sobe a API em modo normal
- `npm.cmd run seed`: cria ou reseta o admin inicial
- `npm.cmd run web`: sobe o frontend React

## Endpoints uteis

### Publicos

- `GET /`
- `GET /health`
- `POST /register`
- `POST /login`
- `POST /refresh`
- `POST /forgot-password`
- `POST /reset-password`

### Protegidos

- `GET /chamados`
- `GET /chamados/:id`
- `POST /chamados`
- `PUT /chamados/:id`
- `POST /chamados/:id/comments`
- `DELETE /chamados/:id/comments/:commentId`
- `GET /clientes`
- `POST /clientes`
- `PUT /clientes/:id`
- `GET /me`
- `PUT /profile`

### Admin

- `GET /dashboard`
- `GET /trash`
- `GET /trash/tickets`
- `POST /trash/:id/restore`
- `POST /trash/tickets/:id/restore`
- `DELETE /trash/tickets/:id/hard`
- `DELETE /chamados/:id`

## Uploads

Os uploads ficam expostos em:

- `http://localhost:5000/uploads/<arquivo>`

## Docker

O projeto possui:

- [docker-compose.yml](C:\Users\asssa\Documents\LINGUAGEM\Old_Chamados-api\docker-compose.yml)
- [Dockerfile](C:\Users\asssa\Documents\LINGUAGEM\Old_Chamados-api\Dockerfile)

Para subir tudo via Docker:

```powershell
docker compose up --build
```

Observacao:

- o frontend em Docker usa `npm run web`
- a API em Docker usa `npm run dev`

## Melhorias feitas recentemente

As seguintes correcoes e melhorias foram aplicadas:

- ajuste da leitura de `MONGO_URL` e `MONGO_URI`
- correcao da inicializacao da API
- instalacao e declaracao de dependencias faltantes
- criacao de rotas publicas `/` e `/health`
- correcao de imports quebrados no frontend
- criacao de `public/index.html`
- configuracao do frontend para rodar em `3000`
- configuracao do Tailwind CSS
- repaginacao visual das telas principais
- correcao de bugs em telas React, incluindo `Clientes`
- validacao do build do frontend com sucesso

## Comandos de verificacao

### Verificar API

```powershell
Invoke-WebRequest http://localhost:5000/health
```

Resposta esperada:

```json
{"status":"ok"}
```

### Verificar frontend

Abra:

- [http://localhost:3000](http://localhost:3000)

## Problemas comuns

### 1. PowerShell bloqueia `npm`

Erro comum:

`npm.ps1 cannot be loaded because running scripts is disabled`

Solucao:

```powershell
npm.cmd install
npm.cmd start
npm.cmd run web
```

### 2. `User not found` no login

O banco nao possui usuario cadastrado.

Solucao:

```powershell
npm.cmd run seed
```

### 3. Frontend sobe sem estilo

Verifique se as dependencias foram instaladas:

```powershell
npm.cmd install
```

E reinicie:

```powershell
npm.cmd run web
```

### 4. Porta ocupada

O backend usa `5000` e o frontend usa `3000`.

Confira:

- [`.env`](C:\Users\asssa\Documents\LINGUAGEM\Old_Chamados-api\.env)
- [`.env.development`](C:\Users\asssa\Documents\LINGUAGEM\Old_Chamados-api\.env.development)

## Proximos passos sugeridos

- separar frontend e backend em pastas independentes
- adicionar script `build` no `package.json`
- melhorar cobertura de testes
- padronizar encoding dos arquivos
- revisar algumas telas secundarias para manter o novo padrao visual
