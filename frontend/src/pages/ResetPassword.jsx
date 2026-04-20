import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiKey, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

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

      toast.success('Senha atualizada com sucesso! Faça login agora.');
      navigate('/'); // Redireciona para a tela de login
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Definir Nova Senha</h2>
          <p className="text-gray-500 text-sm">Insira o token recebido no seu e-mail e sua nova senha.</p>
        </header>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo de E-mail */}
          <div className="relative">
            <FiMail className="absolute top-3.5 left-3 text-gray-400" />
            <input 
              type="email" 
              {...register('email', { required: 'E-mail é obrigatório' })}
              placeholder="Seu e-mail"
              className={`w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Campo de Token */}
          <div className="relative">
            <FiKey className="absolute top-3.5 left-3 text-gray-400" />
            <input 
              type="text" 
              {...register('token', { required: 'Token é obrigatório' })}
              placeholder="Token de recuperação"
              className={`w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 transition-all ${errors.token ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'}`}
            />
            {errors.token && <p className="text-red-500 text-xs mt-1">{errors.token.message}</p>}
          </div>

          {/* Nova Senha */}
          <div className="relative">
            <FiLock className="absolute top-3.5 left-3 text-gray-400" />
            <input 
              type="password" 
              {...register('password', { 
                required: 'Nova senha é obrigatória',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
              })}
              placeholder="Nova senha"
              className={`w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirmar Nova Senha */}
          <div className="relative">
            <FiLock className="absolute top-3.5 left-3 text-gray-400" />
            <input 
              type="password" 
              {...register('confirmPassword', { 
                required: 'Confirmação é obrigatória',
                validate: (value) => value === watch('password') || 'As senhas não coincidem'
              })}
              placeholder="Confirmar nova senha"
              className={`w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 transition-all ${errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
          >
            {loading ? 'Processando...' : <><FiCheckCircle /> Alterar Senha</>}
          </button>
        </form>

        <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-blue-600 font-medium">
          <FiArrowLeft /> Voltar para o Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;