# Chamados-api

Sistema de chamados com backend em Node.js/Express + MongoDB e frontend em React.

## Estrutura

O projeto foi separado em duas aplicacoes:

- `backend/`: API Express, Socket.IO, modelos, controllers e seed
- `frontend/`: app React, paginas, componentes e cliente HTTP

Na raiz ficaram apenas arquivos de orquestracao, como `docker-compose.yml`, scripts utilitarios e comandos de conveniencia.

## Requisitos

- Node.js 18+ ou 20+
- MongoDB local ou Docker Desktop

## Variaveis de ambiente

### Backend

Arquivo: [`backend/.env`](C:\Users\asssa\Documents\LINGUAGEM\chamados-api\backend\.env)

Exemplo:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/chamados_db
JWT_SECRET=SuaChaveSuperSecreta123
```

Observacoes:

- o projeto aceita `MONGO_URL` ou `MONGO_URI`
- uploads ficam em `backend/uploads/`

### Frontend

Arquivo: [`frontend/.env.development`](C:\Users\asssa\Documents\LINGUAGEM\chamados-api\frontend\.env.development)

```env
PORT=3000
REACT_APP_API_URL=http://localhost:5000
```

## Instalacao

No PowerShell do Windows, prefira `npm.cmd`.

Para instalar tudo:

```powershell
npm.cmd run install:all
```

Ou separadamente:

```powershell
npm.cmd install --prefix backend
npm.cmd install --prefix frontend
```

## Como rodar localmente

### Pela raiz

Backend:

```powershell
npm.cmd start
```

Frontend:

```powershell
npm.cmd run web
```

Seed:

```powershell
npm.cmd run seed
```

### Diretamente nas pastas

Backend:

```powershell
cd backend
npm.cmd start
```

Frontend:

```powershell
cd frontend
npm.cmd start
```

## Enderecos padrao

- API: [http://localhost:5000](http://localhost:5000)
- Healthcheck: [http://localhost:5000/health](http://localhost:5000/health)
- Frontend: [http://localhost:3000](http://localhost:3000)
- Uploads: `http://localhost:5000/uploads/<arquivo>`

## Scripts da raiz

```json
{
  "dev": "npm --prefix backend run dev",
  "start": "npm --prefix backend start",
  "seed": "npm --prefix backend run seed",
  "web": "npm --prefix frontend start",
  "build:web": "npm --prefix frontend run build",
  "install:all": "npm install --prefix backend && npm install --prefix frontend"
}
```

## Docker

Cada aplicacao agora possui seu proprio `Dockerfile`:

- [`backend/Dockerfile`](C:\Users\asssa\Documents\LINGUAGEM\chamados-api\backend\Dockerfile)
- [`frontend/Dockerfile`](C:\Users\asssa\Documents\LINGUAGEM\chamados-api\frontend\Dockerfile)

Para subir tudo:

```powershell
docker compose up --build
```

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

## Verificacao

API:

```powershell
Invoke-WebRequest http://localhost:5000/health
```

Frontend:

- abra [http://localhost:3000](http://localhost:3000)

## Observacoes da migracao

- backend e frontend foram separados fisicamente
- URLs hardcoded do frontend foram ajustadas para usar a configuracao da API
- uploads do backend agora sao servidos a partir de `backend/uploads`
- `docker-compose.yml` passou a buildar cada app da sua propria pasta
