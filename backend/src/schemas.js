const { z } = require('zod');

// Schemas compartilhados pelas rotas para centralizar as regras básicas de entrada da API.
const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const chamadoSchema = z.object({
  // clienteId chega como string no payload HTTP e é validado antes da camada Mongoose.
  title: z.string().min(5, "O título deve ser mais descritivo"),
  description: z.string().optional(),
  clienteId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de cliente inválido"),
  priority: z.enum(['baixa', 'media', 'alta']).default('media'),
});

const commentSchema = z.object({
  text: z.string().min(1, "O comentário não pode estar vazio"),
});

module.exports = {
  registerSchema,
  loginSchema,
  chamadoSchema,
  commentSchema,
};
