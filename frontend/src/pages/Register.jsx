import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiLock, FiMail, FiRefreshCw, FiUserPlus } from 'react-icons/fi';
import AuthLayout from './AuthLayout';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/register', data);
      toast.success('Conta criada com sucesso! Faca login para continuar.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Falha ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500/10';

  return (
    <AuthLayout
      eyebrow="Cadastro"
      title="Criar conta"
      description="Cadastre um novo usuario para acessar o sistema e acompanhar os chamados."
      compact
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="relative block">
            <FiUserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              {...register('name', { required: 'Nome e obrigatorio', minLength: { value: 3, message: 'Minimo 3 caracteres' } })}
              placeholder="Nome completo"
              className={inputClass}
            />
          </label>
          {errors.name && <span className="mt-2 block text-sm text-rose-500">{errors.name.message}</span>}
        </div>

        <div>
          <label className="relative block">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              {...register('email', { required: 'E-mail e obrigatorio' })}
              type="email"
              placeholder="E-mail"
              className={inputClass}
            />
          </label>
          {errors.email && <span className="mt-2 block text-sm text-rose-500">{errors.email.message}</span>}
        </div>

        <div>
          <label className="relative block">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              {...register('password', { required: 'Senha e obrigatoria', minLength: { value: 6, message: 'Minimo 6 caracteres' } })}
              type="password"
              placeholder="Senha"
              className={inputClass}
            />
          </label>
          {errors.password && <span className="mt-2 block text-sm text-rose-500">{errors.password.message}</span>}
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          <span className="inline-flex items-center justify-center gap-2">
            {loading ? <FiRefreshCw className="animate-spin" /> : <FiUserPlus />}
            {loading ? 'Registrando...' : 'Registrar usuario'}
          </span>
        </button>
      </form>

      <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-200">
        <FiArrowLeft /> Ja possui uma conta? Faca login
      </Link>
    </AuthLayout>
  );
};

export default Register;
