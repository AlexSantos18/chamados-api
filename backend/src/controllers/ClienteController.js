const Cliente = require('../models/Cliente');

module.exports = {
  async create(req, res, next) {
    try {
      const { documento } = req.body;

      const clienteExists = await Cliente.findOne({ documento });
      if (clienteExists) {
        return res.status(400).json({ error: 'Cliente com este documento já cadastrado' });
      }

      const cliente = await Cliente.create(req.body);
      return res.json(cliente);
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const clientes = await Cliente.find().sort('nome');
      return res.json(clientes);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findByIdAndUpdate(id, req.body, { new: true });

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      return res.json(cliente);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await Cliente.findByIdAndDelete(id);
      return res.json({ message: 'Cliente removido' });
    } catch (err) {
      next(err);
    }
  }
};