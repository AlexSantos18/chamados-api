import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiCheckCircle, FiKey, FiLock, FiMail, FiRefreshCw } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/reset-password', {
        email: data.email,
        token: data.token,
        password: data.password
      });

      toast.success('Senha atualizada com sucesso! Faca login agora.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) => `w-full rounded-2xl border bg-white/80 px-4 py-4 pl-12 text-slate-800 outline-none transition dark:bg-white/5 dark:text-white ${
    hasError
      ? 'border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-rose-400/40 dark:focus:ring-rose-500/10'
      : 'border-stone-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:focus:border-blue-400 dark:focus:ring-blue-500/10'
  }`;

  return (
    <AuthLayout
      eyebrow="Nova senha"
      title="Definir acesso"
      description="Insira o token recebido por e-mail e escolha uma nova senha para sua conta."
      compact
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="relative block">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="email"
              {...register('email', { required: 'E-mail e obrigatorio' })}
              placeholder="Seu e-mail"
              className={inputClass(errors.email)}
            />
          </label>
          {errors.email && <p className="mt-2 text-sm text-rose-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="relative block">
            <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              {...register('token', { required: 'Token e obrigatorio' })}
              placeholder="Token de recuperacao"
              className={inputClass(errors.token)}
            />
          </label>
          {errors.token && <p className="mt-2 text-sm text-rose-500">{errors.token.message}</p>}
        </div>

        <div>
          <label className="relative block">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="password"
              {...register('password', {
                required: 'Nova senha e obrigatoria',
                minLength: { value: 6, message: 'Minimo 6 caracteres' }
              })}
              placeholder="Nova senha"
              className={inputClass(errors.password)}
            />
          </label>
          {errors.password && <p className="mt-2 text-sm text-rose-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="relative block">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Confirmacao e obrigatoria',
                validate: (value) => value === watch('password') || 'As senhas nao coincidem'
              })}
              placeholder="Confirmar nova senha"
              className={inputClass(errors.confirmPassword)}
            />
          </label>
          {errors.confirmPassword && <p className="mt-2 text-sm text-rose-500">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <FiRefreshCw className="animate-spin" /> : <FiCheckCircle />}
          {loading ? 'Processando...' : 'Alterar senha'}
        </button>
      </form>

      <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-200">
        <FiArrowLeft /> Voltar para o login
      </Link>
    </AuthLayout>
  );
};

export default ResetPassword;
