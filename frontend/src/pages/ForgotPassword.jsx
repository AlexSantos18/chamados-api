import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiMail, FiRefreshCw, FiSend } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/forgot-password', { email });
      toast.success('Verifique seu e-mail para obter o token de acesso!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao processar solicitacao');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-4 pl-12 text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500/10';

  return (
    <AuthLayout
      eyebrow="Recuperacao"
      title="Recuperar senha"
      description="Informe seu e-mail cadastrado e enviaremos um token para redefinir seu acesso."
      compact
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="relative block">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="email"
            required
            placeholder="Seu e-mail"
            value={email}
            className={inputClass}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button disabled={loading} className="w-full rounded-2xl bg-blue-600 px-4 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          <span className="inline-flex items-center justify-center gap-2">
            {loading ? <FiRefreshCw className="animate-spin" /> : <FiSend />}
            {loading ? 'Enviando...' : 'Enviar token'}
          </span>
        </button>
      </form>

      <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-200">
        <FiArrowLeft /> Voltar para o login
      </Link>
    </AuthLayout>
  );
};

export default ForgotPassword;
