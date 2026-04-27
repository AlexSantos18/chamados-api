const mongoose = require('../database/connection');

// Log simples de auditoria para ações relevantes no ciclo de vida do chamado.
const LogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chamado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chamado'
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Log', LogSchema);
