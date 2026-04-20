const mongoose = require('../database/connection');

const ChamadoTrashSchema = new mongoose.Schema({
  data: { type: Object, required: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, default: 'Movido para lixeira' }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('ChamadoTrash', ChamadoTrashSchema);