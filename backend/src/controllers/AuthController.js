const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendMail } = require('../services/mail');

function generateToken(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: 86400, // Expira em 24 horas
  });
}

function generateRefreshToken(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: '7d', // Refresh token dura mais tempo
  });
}

module.exports = {
  async register(req, res){
    try {
      const { name, email, password } = req.body;

      if(await User.findOne({ email }))
        return res.status(400).json({ error: 'User already exists' });

      // Garante que o usuário sempre comece como 'user'
      const user = await User.create({ name, email, password, role: 'user' });

      user.password = undefined;

      return res.json({ 
        user, 
        token: generateToken({ id: user._id }),
        refreshToken: generateRefreshToken({ id: user._id })
      });
    } catch (err) {
      return res.status(400).json({ error: 'Registration failed' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    // .select('+password') é necessário porque o campo está com select: false no model
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    user.password = undefined;

    return res.json({ 
      user, 
      token: generateToken({ id: user._id }),
      refreshToken: generateRefreshToken({ id: user._id })
    });
  },

  async refresh(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      
      return res.json({
        token: generateToken({ id: decoded.id }),
        refreshToken: generateRefreshToken({ id: decoded.id })
      });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  },

  async forgotPassword(req, res, next) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

      const token = crypto.randomBytes(20).toString('hex');
      const now = new Date();
      now.setHours(now.getHours() + 1); // Token expira em 1 hora

      await User.findByIdAndUpdate(user.id, {
        $set: { passwordResetToken: token, passwordResetExpires: now }
      });

      await sendMail(email, 'Recuperação de Senha', `Use este token para resetar sua senha: ${token}`);

      return res.json({ message: 'E-mail de recuperação enviado' });
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req, res, next) {
    const { email, token, password } = req.body;
    try {
      const user = await User.findOne({ email })
        .select('+passwordResetToken passwordResetExpires');

      if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

      if (token !== user.passwordResetToken)
        return res.status(400).json({ error: 'Token inválido' });

      if (new Date() > user.passwordResetExpires)
        return res.status(400).json({ error: 'Token expirado' });

      user.password = password;
      await user.save();

      return res.json({ message: 'Senha atualizada com sucesso' });
    } catch (err) {
      next(err);
    }
  }
};
