const express = require('express');
const routes = express.Router();
const multer = require('multer');

const AuthController = require('./controllers/AuthController');
const ChamadoController = require('./controllers/ChamadoController');
const ClienteController = require('./controllers/ClienteController');
const NotificationController = require('./controllers/NotificationController');
const UserController = require('./controllers/UserController');
const multerConfig = require('./config/multer');
const authMiddleware = require('./middlewares/auth');
const validate = require('./middlewares/validate');
const { registerSchema, loginSchema, chamadoSchema, commentSchema } = require('./schemas');

// Rotas publicas
routes.get('/', (req, res) => {
  return res.json({ status: 'ok', message: 'API Chamados online' });
});

routes.get('/health', (req, res) => {
  return res.json({ status: 'ok' });
});

routes.post('/register', validate(registerSchema), AuthController.register);
routes.post('/login', validate(loginSchema), AuthController.login);
routes.post('/refresh', AuthController.refresh);
routes.post('/forgot-password', AuthController.forgotPassword);
routes.post('/reset-password', AuthController.resetPassword);

// Middleware de autenticacao
routes.use(authMiddleware);

// Rotas de chamados
routes.get('/chamados', ChamadoController.list);
routes.get('/chamados/export/csv', ChamadoController.exportCSV);
routes.get('/chamados/:id', ChamadoController.show);
routes.post('/chamados', multer(multerConfig).array('attachments', 5), validate(chamadoSchema), ChamadoController.create);
routes.put('/chamados/:id', ChamadoController.update);
routes.post('/chamados/:id/comments', validate(commentSchema), ChamadoController.addComment);
routes.delete('/chamados/:id/comments/:commentId', ChamadoController.deleteComment);

// Notificacoes
routes.get('/notifications', NotificationController.list);
routes.patch('/notifications/read', NotificationController.markAsRead);
routes.delete('/notifications', NotificationController.deleteAll);

// Gestao de perfil
routes.get('/me', UserController.show);
routes.put('/profile', multer(multerConfig).single('avatar'), UserController.update);

// Gestao de clientes
routes.get('/clientes', ClienteController.list);
routes.post('/clientes', ClienteController.create);
routes.put('/clientes/:id', ClienteController.update);

// Rotas administrativas
const { isAdmin } = require('./middlewares/auth');
routes.get('/dashboard', isAdmin, ChamadoController.getDashboard);
routes.get('/trash', isAdmin, ChamadoController.listTrash);
routes.get('/trash/tickets', isAdmin, ChamadoController.listTicketTrash);
routes.post('/trash/tickets/:id/restore', isAdmin, ChamadoController.restoreTicket);
routes.delete('/trash/tickets/:id/hard', isAdmin, ChamadoController.hardDeleteTicket);
routes.post('/trash/:id/restore', isAdmin, ChamadoController.restoreComment);
routes.delete('/chamados/:id', isAdmin, ChamadoController.delete);

module.exports = routes;
