import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post('/register', data);
      toast.success('Conta criada com sucesso! Faca login para continuar.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Falha ao realizar cadastro');
    }
  };

  return (
    <div className="auth-mesh flex min-h-screen items-center justify-center px-4 py-10">
      <section className="surface-card slide-up w-full max-w-2xl rounded-[32px] p-6 sm:p-8 lg:p-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-400">Cadastro</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-800">Criar conta</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-stone-500">
            Cadastre um novo usuario para acessar o sistema e acompanhar os chamados.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <input
            {...register('name')}
            placeholder="Nome completo"
            required
            className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-4 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          />
          <input
            {...register('email')}
            type="email"
            placeholder="E-mail"
            required
            className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-4 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          />
          <input
            {...register('password')}
            type="password"
            placeholder="Senha"
            required
            className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-4 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          />
          <button type="submit" className="brand-button mt-2 w-full rounded-2xl px-4 py-4 font-bold text-white transition">
            Registrar usuario
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Ja possui uma conta?{' '}
          <Link to="/" className="font-semibold text-orange-700 transition hover:text-orange-900">
            Faca login
          </Link>
        </p>
      </section>
    </div>
  );
};

export default Register;
