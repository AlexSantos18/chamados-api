const mongoose = require('../database/connection');

const TrashSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chamado: { type: mongoose.Schema.Types.ObjectId, ref: 'Chamado', required: true },
  originalCreatedAt: { type: Date },
  reason: { type: String, default: 'Motivo não informado' }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Trash', TrashSchema);