import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

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
      toast.error(err.response?.data?.error || 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Recuperar Senha</h2>
        <p className="text-gray-500 mb-6 text-sm">Informe seu e-mail cadastrado e enviaremos um token de recuperação.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiMail className="absolute top-3.5 left-3 text-gray-400" />
            <input 
              type="email" 
              required 
              placeholder="Seu e-mail"
              className="w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
            {loading ? 'Enviando...' : 'Enviar Token'}
          </button>
        </form>

        <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-blue-600 font-medium">
          <FiArrowLeft /> Voltar para o Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;