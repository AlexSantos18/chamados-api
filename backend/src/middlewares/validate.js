module.exports = (schema) => (req, res, next) => {
  try {
    // A validação acontece antes do controller para manter regras de entrada fora da lógica de negócio.
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ 
      error: "Erro de validação", 
      details: err.errors.map(e => ({
        path: e.path[0],
        message: e.message
      }))
    });
  }
};
