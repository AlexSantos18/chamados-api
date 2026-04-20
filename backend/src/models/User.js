const mongoose = require('../database/connection');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false // Não retorna a senha em consultas por padrão
  },
  avatar: String,
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  }
}, {
  versionKey: false
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

module.exports = mongoose.model('User', UserSchema);