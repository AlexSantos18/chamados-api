const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = {
  async show(req, res, next) {
    try {
      const user = await User.findById(req.userId);
      return res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { name, email, oldPassword, password } = req.body;
      const user = await User.findById(req.userId).select('+password');

      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      if (password) {
        if (!oldPassword) return res.status(400).json({ error: 'Senha atual obrigatória para alteração' });
        
        const checkPassword = await bcrypt.compare(oldPassword, user.password);
        if (!checkPassword) return res.status(400).json({ error: 'Senha atual incorreta' });
        
        user.password = password;
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (req.file) user.avatar = req.file.filename;

      await user.save();
      user.password = undefined;

      return res.json(user);
    } catch (err) {
      next(err);
    }
  }
};