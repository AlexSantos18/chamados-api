const mongoose = require('../database/connection');

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