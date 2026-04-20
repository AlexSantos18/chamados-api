const Chamado = require('../models/Chamado');
const Log = require('../models/Log');
const Trash = require('../models/Trash');
const ChamadoTrash = require('../models/ChamadoTrash');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendMail } = require('../services/mail');

module.exports = {

  async create(req, res, next) {
    try {
      const { title, description, clienteId, priority } = req.body;
      const attachments = req.files ? req.files.map(file => file.filename) : [];

      const chamado = await Chamado.create({
        title,
        description,
        priority: priority || 'media',
        user: req.userId,
        cliente: clienteId,
        attachments: attachments,
      });

      await Log.create({
        action: 'Criou chamado',
        user: req.userId,
        chamado: chamado._id
      });

      // Notifica o usuário por e-mail (Opcional, dependendo da configuração do SMTP)
      const user = await User.findById(req.userId);
      if (user) {
        sendMail(user.email, 'Chamado Aberto com Sucesso', `Olá ${user.name}, seu chamado "${title}" foi registrado.`);
      }

      return res.json(chamado);

    } catch (err) {
      next(err);
    }
  },

  async show(req, res, next) {
    try {
      const { id } = req.params;
      const chamado = await Chamado.findById(id)
        .populate('user', 'name email avatar')
        .populate('cliente', 'nome documento email telefone endereco')
        .populate('comments.user', 'name');

      if (!chamado) {
        return res.status(404).json({ error: 'Chamado não encontrado' });
      }

      const logs = await Log.find({ chamado: id })
        .populate('user', 'name')
        .sort('-createdAt');

      return res.json({ chamado, logs });
    } catch (err) {
      next(err);
    }
  },

  async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const { text } = req.body;

      const chamado = await Chamado.findById(id);
      if (!chamado) return res.status(404).json({ error: 'Chamado não encontrado' });

      chamado.comments.push({ text, user: req.userId });
      await chamado.save();

      const updatedChamado = await chamado.populate('comments.user', 'name');
      return res.json(updatedChamado.comments);
    } catch (err) {
      next(err);
    }
  },

  async deleteComment(req, res, next) {
    try {
      const { id, commentId } = req.params;

      const chamado = await Chamado.findById(id);
      if (!chamado) return res.status(404).json({ error: 'Chamado não encontrado' });

      const comment = chamado.comments.id(commentId);
      if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });

      // Regra de Permissão: Apenas o Autor ou Admin
      if (comment.user.toString() !== req.userId.toString() && req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Você não tem permissão para excluir esta nota' });
      }

      // Salva na lixeira antes de remover
      const reason = req.body.reason || 'Removido via interface de detalhes';
      await Trash.create({
        text: comment.text,
        author: comment.user,
        deletedBy: req.userId,
        chamado: id,
        originalCreatedAt: comment.createdAt,
        reason
      });

      chamado.comments.pull(commentId);
      await chamado.save();

      return res.json({ message: 'Comentário removido' });
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const { status, title, priority, page = 1, limit = 10, startDate, endDate, clienteId, userId } = req.query;
      const filters = {};

      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (clienteId) filters.cliente = clienteId;
      if (userId) filters.user = userId;
      
      // Filtro por período
      if (startDate || endDate) {
        filters.createdAt = {};
        if (startDate) filters.createdAt.$gte = new Date(startDate);
        if (endDate) filters.createdAt.$lte = new Date(endDate);
      }
      
      if (title) {
        const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filters.title = new RegExp(escapedTitle, 'i');
      }

      const chamados = await Chamado.find(filters)
        .populate('user', 'name email avatar')
        .populate('cliente', 'nome documento')
        .sort({ 
          priority: -1, // Note: Isso requer um mapeamento numérico se quiser lógica complexa, 
          createdAt: -1  // ou apenas por data de criação.
        })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Chamado.countDocuments(filters);

      return res.json({
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
        data: chamados
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      
      // Impede que o usuário altere o dono do chamado via update
      const updateData = { ...req.body };
      delete updateData.user;

      const chamado = await Chamado.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!chamado) {
        return res.status(404).json({ error: 'Chamado não encontrado' });
      }

      // Emite notificação em tempo real se o status foi alterado
      if (req.body.status) {
        // Persiste a notificação para todos os outros usuários
        const message = `O chamado "${chamado.title}" foi alterado para ${chamado.status.toUpperCase()}`;
        const otherUsers = await User.find({ _id: { $ne: req.userId } });
        
        const notificationData = otherUsers.map(u => ({
          user: u._id,
          title: 'Alteração de Status',
          message
        }));

        if (notificationData.length > 0) {
          await Notification.insertMany(notificationData);
        }

        req.io.emit('statusChanged', {
          id: chamado._id,
          title: chamado.title,
          status: chamado.status,
          updatedBy: req.userId
        });
      }

      await Log.create({
        action: 'Atualizou chamado',
        user: req.userId,
        chamado: chamado._id
      });

      return res.json(chamado);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const chamado = await Chamado.findByIdAndDelete(id);

      if (!chamado) {
        return res.status(404).json({ error: 'Chamado não encontrado' });
      }

      await Log.create({
        action: 'Deletou chamado',
        user: req.userId,
        chamado: id // Mantemos o ID aqui pois o documento original foi removido
      });

      return res.json({ message: 'Chamado deletado com sucesso' });
    } catch (err) {
      next(err);
    }
  },

  async getDashboard(req, res, next) {
    try {
      const { days = 7 } = req.query;
      const daysInt = parseInt(days) || 7;

      const stats = {
        total: await Chamado.countDocuments(),
        abertos: await Chamado.countDocuments({ status: 'aberto' }),
        em_andamento: await Chamado.countDocuments({ status: 'em_andamento' }),
        concluidos: await Chamado.countDocuments({ status: 'concluido' }),
        cancelados: await Chamado.countDocuments({ status: 'cancelado' }),
      };

      // Busca evolução dos últimos N dias
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysInt);

      const evolution = await Chamado.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
            quantidade: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      stats.chartData = evolution.map(item => ({
        name: item._id,
        chamados: item.quantidade
      }));

      return res.json(stats);
    } catch (err) {
      next(err);
    }
  },

  async listTrash(req, res, next) {
    try {
      const items = await Trash.find()
        .populate('author', 'name email')
        .populate('deletedBy', 'name email')
        .populate('chamado', 'title')
        .sort('-createdAt');

      return res.json(items);
    } catch (err) {
      next(err);
    }
  },

  async restoreComment(req, res, next) {
    try {
      const { id } = req.params;

      const trashItem = await Trash.findById(id);
      if (!trashItem) return res.status(404).json({ error: 'Item não encontrado na lixeira' });

      const chamado = await Chamado.findById(trashItem.chamado);
      if (!chamado) {
        return res.status(404).json({ error: 'Chamado original não encontrado. Não é possível restaurar.' });
      }

      // Retorna o comentário para o chamado original
      chamado.comments.push({
        text: trashItem.text,
        user: trashItem.author,
        createdAt: trashItem.originalCreatedAt
      });

      await chamado.save();
      await Trash.findByIdAndDelete(id);

      return res.json({ message: 'Comentário restaurado com sucesso' });
    } catch (err) {
      next(err);
    }
  },

  async listTicketTrash(req, res, next) {
    try {
      const { title, status } = req.query;
      const filters = {};

      if (status) filters['data.status'] = status;
      if (title) {
        const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filters['data.title'] = new RegExp(escapedTitle, 'i');
      }

      const items = await ChamadoTrash.find(filters)
        .populate('deletedBy', 'name email')
        .sort('-createdAt');

      return res.json(items);
    } catch (err) {
      next(err);
    }
  },

  async restoreTicket(req, res, next) {
    try {
      const { id } = req.params;
      const trashItem = await ChamadoTrash.findById(id);

      if (!trashItem) return res.status(404).json({ error: 'Item não encontrado na lixeira' });

      // Recria o chamado com os dados originais
      await Chamado.create(trashItem.data);
      await ChamadoTrash.findByIdAndDelete(id);

      await Log.create({
        action: 'Restaurou chamado da lixeira',
        user: req.userId,
        chamado: trashItem.originalId
      });

      return res.json({ message: 'Chamado restaurado com sucesso' });
    } catch (err) {
      next(err);
    }
  },

  async hardDeleteTicket(req, res, next) {
    try {
      const { id } = req.params;
      await ChamadoTrash.findByIdAndDelete(id);
      return res.json({ message: 'Chamado excluído permanentemente' });
    } catch (err) {
      next(err);
    }
  },

  async exportCSV(req, res, next) {
    try {
      const { status, title, startDate, endDate, clienteId, userId } = req.query;
      const filters = {};

      if (status) filters.status = status;
      if (clienteId) filters.cliente = clienteId;
      if (userId) filters.user = userId;
      
      if (startDate || endDate) {
        filters.createdAt = {};
        if (startDate) filters.createdAt.$gte = new Date(startDate);
        if (endDate) filters.createdAt.$lte = new Date(endDate);
      }
      
      if (title) {
        const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filters.title = new RegExp(escapedTitle, 'i');
      }

      const chamados = await Chamado.find(filters)
        .populate('user', 'name')
        .populate('cliente', 'nome');

      let csv = 'ID;Titulo;Status;Cliente;Tecnico;Criado em\n';
      chamados.forEach(c => {
        csv += `${c._id};${c.title};${c.status};${c.cliente?.nome || ''};${c.user?.name || ''};${c.createdAt.toISOString()}\n`;
      });

      res.header('Content-Type', 'text/csv');
      res.attachment('chamados.csv');
      return res.send(csv);
    } catch (err) {
      next(err);
    }
  }
};