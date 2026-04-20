const mongoose = require('../database/connection');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

// Regra de exclusão automática:
// Deleta documentos 7 dias (604800 segundos) após a última atualização,
// mas APENAS se o campo 'read' for verdadeiro.
NotificationSchema.index({ updatedAt: 1 }, { 
  expireAfterSeconds: 604800, 
  partialFilterExpression: { read: true } 
});

module.exports = mongoose.model('Notification', NotificationSchema);