const mongoose = require('../database/connection');

// O chamado concentra o estado operacional e também o histórico leve de notas internas.
const ChamadoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    default: 'aberto',
    enum: ['aberto', 'em_andamento', 'concluido', 'cancelado']
  },
  priority: {
    type: String,
    default: 'media',
    enum: ['baixa', 'media', 'alta']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  // Os anexos guardam apenas o nome do arquivo; a URL pública é montada no frontend.
  attachments: [String],
  comments: [
    {
      text: { type: String, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Chamado', ChamadoSchema);
