const express = require('express');
const routes = express.Router();
const multer = require('multer');
const path = require('path');

const AuthController = require('./controllers/AuthController');
const ChamadoController = require('./controllers/ChamadoController');
const ClienteController = require('./controllers/ClienteController');
const NotificationController = require('./controllers/NotificationController');
const UserController = require('./controllers/UserController');
const multerConfig = require('./config/multer');
const authMiddleware = require('./middlewares/auth');
const validate = require('./middlewares/validate');
const { registerSchema, loginSchema, chamadoSchema, commentSchema } = require('./schemas');

// Mantém os uploads acessíveis pela própria API, útil para ambiente local e sem Nginx.
routes.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// Rotas públicas cobrem autenticação básica e recuperação de conta.
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

// A partir daqui todas as rotas exigem token válido.
routes.use(authMiddleware);

// Domínio principal da aplicação: consulta, criação, atualização e histórico de chamados.
routes.get('/chamados', ChamadoController.list);
routes.get('/dashboard', ChamadoController.getDashboard);
routes.get('/chamados/export/csv', ChamadoController.exportCSV);
routes.get('/chamados/:id', ChamadoController.show);
routes.post('/chamados', multerConfig.array('attachments', 5), validate(chamadoSchema), ChamadoController.create);
routes.put('/chamados/:id', ChamadoController.update);
routes.post('/chamados/:id/comments', validate(commentSchema), ChamadoController.addComment);
routes.delete('/chamados/:id/comments/:commentId', ChamadoController.deleteComment);

// Notificações persistidas do usuário autenticado.
routes.get('/notifications', NotificationController.list);
routes.patch('/notifications/read', NotificationController.markAsRead);
routes.delete('/notifications', NotificationController.deleteAll);

// Perfil do usuário logado.
routes.get('/me', UserController.show);
routes.put('/profile', multerConfig.single('avatar'), UserController.update);

// Cadastro e manutenção da base de clientes.
routes.get('/clientes', ClienteController.list);
routes.post('/clientes', ClienteController.create);
routes.put('/clientes/:id', ClienteController.update);

// Funcionalidades de lixeira e exclusão permanente ficam restritas ao papel de admin.
const { isAdmin } = require('./middlewares/auth');
routes.get('/trash', ChamadoController.listTrash);
routes.get('/trash/tickets', ChamadoController.listTicketTrash);
routes.post('/trash/tickets/:id/restore', isAdmin, ChamadoController.restoreTicket);
routes.delete('/trash/tickets/:id/hard', isAdmin, ChamadoController.hardDeleteTicket);
routes.post('/trash/:id/restore', isAdmin, ChamadoController.restoreComment);
routes.delete('/chamados/:id', isAdmin, ChamadoController.delete);

module.exports = routes;
