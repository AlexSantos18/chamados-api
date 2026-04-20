module.exports = (schema) => (req, res, next) => {
  try {
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