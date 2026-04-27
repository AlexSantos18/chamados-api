const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// O Socket.IO compartilha o mesmo servidor HTTP da API para simplificar deploy e proxy no Nginx.
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

app.use(cors());
app.use(express.json());

// Serve arquivos estáticos (fotos de perfil e anexos)
app.use('/uploads', express.static(path.resolve(__dirname, '..', '..', 'uploads')));

// Injeta a instância do socket em cada request para permitir eventos em controllers.
app.use((req, res, next) => {
  req.io = io;
  return next();
});

// Carrega as rotas da API
app.use(require('./routes'));

module.exports = { app, server, io };
