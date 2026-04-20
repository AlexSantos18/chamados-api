const mongoose = require('../database/connection');

const ClienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  documento: {
    type: String, // CPF ou CNPJ
    unique: true,
    required: true
  },
  email: String,
  telefone: String,
  endereco: String
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Cliente', ClienteSchema);