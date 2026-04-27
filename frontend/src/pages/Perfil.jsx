import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api, { buildUploadUrl } from '../services/api';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiCamera, FiSave, FiLock, FiShield } from 'react-icons/fi';

const Perfil = () => {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, setValue, watch, resetField } = useForm();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      if (user.avatar) {
        setAvatarPreview(buildUploadUrl(user.avatar));
      }
    }
  }, [user, setValue]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setValue('avatar', [file]);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      toast.error('Por favor, solte apenas arquivos de imagem.');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);

    if (data.password) formData.append('password', data.password);
    if (data.oldPassword) formData.append('oldPassword', data.oldPassword);

    if (data.avatar && data.avatar[0]) {
      formData.append('avatar', data.avatar[0]);
    }

    try {
      const response = await api.put('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      updateUser(response.data);
      toast.success('Perfil atualizado com sucesso!');
      resetField('password');
      resetField('oldPassword');
      resetField('confirmPassword');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-5xl">
        <section className="surface-card slide-up rounded-[34px] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-400">Conta</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-[0_16px_32px_rgba(168,85,247,0.28)]">
                  <FiUser size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">Meu perfil</h1>
                  <p className="mt-1 text-sm text-stone-500">Atualize dados pessoais, avatar e credenciais de acesso.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-violet-200 bg-violet-50/70 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-violet-600">Seguranca</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">Mantenha suas informacoes e senha sempre atualizadas.</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <div className="surface-card rounded-[34px] p-6 md:p-8">
            <div className="flex flex-col items-center">
              <div
                className={`relative transition-all duration-200 ${isDragging ? 'scale-105' : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className={`flex h-36 w-36 items-center justify-center overflow-hidden rounded-[36px] border-4 ${isDragging ? 'border-orange-300 bg-orange-50' : 'border-white bg-stone-100'} text-stone-400 shadow-[0_18px_40px_rgba(76,52,32,0.12)]`}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <FiUser size={52} />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 rounded-2xl bg-slate-900 p-3 text-white shadow-lg transition hover:bg-slate-800">
                  <FiCamera size={18} />
                  <input type="file" className="hidden" {...register('avatar')} onChange={handleAvatarChange} />
                </label>
              </div>
              <p className={`mt-4 text-sm transition-colors ${isDragging ? 'font-semibold text-orange-600' : 'text-stone-500'}`}>
                {isDragging ? 'Solte a imagem aqui.' : 'Clique ou arraste uma foto para alterar.'}
              </p>
              <div className="mt-6 w-full rounded-[26px] border border-stone-200/80 bg-white/70 p-4 text-sm text-stone-500">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Conta ativa</p>
                <p className="mt-2 font-semibold text-slate-800">{user?.name}</p>
                <p className="mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="surface-card rounded-[34px] p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="rounded-[28px] border border-stone-200/80 bg-white/70 p-5">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiUser size={14} /> Nome completo
                </label>
                <input type="text" {...register('name', { required: true })} className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
              </div>

              <div className="rounded-[28px] border border-stone-200/80 bg-white/70 p-5">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiMail size={14} /> E-mail
                </label>
                <input type="email" {...register('email', { required: true })} className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
              </div>

              <div className="rounded-[28px] border border-stone-200/80 bg-white/70 p-5">
                <h3 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-800">
                  <FiShield className="text-orange-600" /> Seguranca
                </h3>
                <p className="mt-2 text-sm text-stone-500">Preencha a senha atual apenas se quiser trocar a credencial.</p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                      <span className="inline-flex items-center gap-2"><FiLock size={14} /> Senha atual</span>
                    </label>
                    <input type="password" {...register('oldPassword')} placeholder="Digite sua senha atual para alterar" className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Nova senha</label>
                    <input type="password" {...register('password', { minLength: { value: 6, message: 'Minimo 6 caracteres' } })} className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Confirmar nova senha</label>
                    <input
                      type="password"
                      {...register('confirmPassword', {
                        validate: (value) => value === watch('password') || 'As senhas nao coincidem'
                      })}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="brand-button w-full rounded-2xl px-5 py-4 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60">
                <span className="inline-flex items-center gap-2">
                  {loading ? 'Salvando...' : <><FiSave /> Salvar alteracoes</>}
                </span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Perfil;
