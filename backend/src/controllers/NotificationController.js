const Notification = require('../models/Notification');

module.exports = {
  async list(req, res, next) {
    try {
      const notifications = await Notification.find({ user: req.userId })
        .sort('-createdAt')
        .limit(20);
      
      return res.json(notifications);
    } catch (err) {
      next(err);
    }
  },

  async markAsRead(req, res, next) {
    try {
      await Notification.updateMany(
        { user: req.userId, read: false },
        { read: true }
      );
      
      return res.json({ message: 'Notificações lidas' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await Notification.findOneAndDelete({ _id: id, user: req.userId });
      return res.json({ message: 'Notificação removida' });
    } catch (err) {
      next(err);
    }
  },

  async deleteAll(req, res, next) {
    try {
      await Notification.deleteMany({ user: req.userId });
      return res.json({ message: 'Todas as notificações foram removidas' });
    } catch (err) {
      next(err);
    }
  }
};