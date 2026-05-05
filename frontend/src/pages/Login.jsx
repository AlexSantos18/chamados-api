import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../AuthContext';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowRight, FiLock, FiMail, FiRefreshCw } from 'react-icons/fi';
import AuthLayout from './AuthLayout';

const Login = () => {
  const { login, signed } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  if (signed) return <Navigate to="/dashboard" />;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Bem-vindo ao sistema!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'E-mail ou senha invalidos');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500/10';

  return (
    <AuthLayout
      eyebrow="Acesso"
      title="Entrar"
      description="Use seu e-mail e senha para acessar o painel e acompanhar os chamados."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="relative block">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            {...register('email')}
            type="email"
            placeholder="E-mail"
            required
            className={inputClass}
          />
        </label>

        <label className="relative block">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            {...register('password')}
            type="password"
            placeholder="Senha"
            required
            className={inputClass}
          />
        </label>

        <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          <span className="inline-flex items-center justify-center gap-2">
            {loading ? <FiRefreshCw className="animate-spin" /> : <FiArrowRight />}
            {loading ? 'Entrando...' : 'Entrar no painel'}
          </span>
        </button>
      </form>

      <div className="mt-6 space-y-3 text-center">
        <Link to="/register" className="block text-sm font-semibold text-blue-700 transition hover:text-blue-900 dark:text-blue-200">
          Nao tem uma conta? Cadastre-se
        </Link>
        <Link to="/forgot-password" className="block text-sm text-slate-500 transition hover:text-slate-700 dark:text-slate-300 dark:hover:text-white">
          Esqueci minha senha
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
