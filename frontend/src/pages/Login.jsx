import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../AuthContext';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const { login, signed } = useAuth();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  if (signed) return <Navigate to="/dashboard" />;

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Bem-vindo ao sistema!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'E-mail ou senha invalidos');
    }
  };

  return (
    <div className="auth-mesh flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_520px]">
        <section className="slide-up hidden rounded-[36px] border border-white/70 bg-white/55 p-10 shadow-[0_24px_70px_rgba(90,63,42,0.12)] backdrop-blur-xl lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">CHAMADOS</p>
            <h1 className="mt-5 max-w-xl text-5xl font-black leading-[1.05] tracking-tight text-slate-800">
              Atendimento mais claro, rapido e confiavel.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-stone-600">
              Organize tickets, clientes e historico de auditoria em um painel unico com foco no que precisa ser resolvido agora.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              ['Fluxo', 'Chamados e comentarios em uma rotina mais simples.'],
              ['Controle', 'Auditoria e historico para acompanhar.'],
              ['Visao', 'Dashboard com leitura rapida do que esta em aberto.']
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-stone-200/70 bg-white/70 p-4">
                <p className="text-sm font-bold text-slate-800">{title}</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card slide-up rounded-[32px] p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-400">Acesso</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-800">Entrar</h2>
            <p className="mt-3 text-sm leading-6 text-stone-500">
              Use seu e-mail e senha para acessar o painel e acompanhar os chamados.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <button type="submit" className="brand-button w-full rounded-2xl px-4 py-4 font-bold text-white transition">
              Entrar no painel
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <Link to="/register" className="block text-sm font-semibold text-orange-700 transition hover:text-orange-900">
              Nao tem uma conta? Cadastre-se
            </Link>
            <Link to="/forgot-password" title="ForgotPassword" className="block text-sm text-stone-500 transition hover:text-slate-700">
              Esqueci minha senha
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
