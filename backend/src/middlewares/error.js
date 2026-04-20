module.exports = (err, req, res, next) => {
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Erro interno do servidor'
  };

  // Erro de ID inválido do Mongoose (CastError)
  if (err.name === 'CastError') {
    error.message = 'Recurso não encontrado (ID inválido)';
    error.statusCode = 404;
  }

  // Erro de campo duplicado (Ex: Email já cadastrado)
  if (err.code === 11000) {
    error.message = 'Valor duplicado inserido em um campo único';
    error.statusCode = 400;
  }

  // Erro de Validação do Mongoose
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
    error.statusCode = 400;
  }

  // Erros específicos do Multer
  if (err.name === 'MulterError') {
    error.message = `Erro no upload: ${err.message}`;
    error.statusCode = 400;
  }

  console.error(`[Error Log]: ${err.stack}`);

  return res.status(error.statusCode).json({ error: error.message });
};