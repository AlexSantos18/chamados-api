import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api, { buildUploadUrl } from '../services/api';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';
import {
  FiCamera,
  FiCheckCircle,
  FiLock,
  FiMail,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiUser
} from 'react-icons/fi';

const Perfil = () => {
  const { user, updateUser, isAdmin } = useAuth();
  const { register, handleSubmit, setValue, watch, resetField, formState: { errors } } = useForm();
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

  const controlClass = (hasError) => `w-full rounded-xl border bg-stone-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition dark:bg-white/5 dark:text-white ${
    hasError
      ? 'border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-rose-400/40 dark:focus:ring-rose-500/10'
      : 'border-stone-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:focus:border-blue-400 dark:focus:ring-blue-500/10'
  }`;

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="surface-card slide-up overflow-hidden rounded-2xl dark:bg-slate-900 dark:border dark:border-white/10">
          <div className="grid gap-4 p-5 md:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg">
                <FiUser size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-400 dark:text-slate-400">Conta</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">Meu perfil</h1>
                <p className="mt-2 max-w-2xl text-[13px] leading-5 text-stone-500 dark:text-slate-300">
                  Atualize dados pessoais, avatar e credenciais de acesso.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Papel</p>
                <p className="mt-1 text-xs font-black text-slate-900 dark:text-white">{isAdmin ? 'Admin' : 'Usuario'}</p>
              </div>
              <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Avatar</p>
                <p className="mt-1 text-xs font-black text-slate-900 dark:text-white">{avatarPreview ? 'Configurado' : 'Pendente'}</p>
              </div>
              <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-3 dark:border-violet-400/20 dark:bg-violet-500/10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-200">Seguranca</p>
                <p className="mt-1 text-xs font-black text-slate-900 dark:text-white">Ativa</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <div className="surface-card rounded-2xl p-5 md:p-6 dark:bg-slate-900 dark:border dark:border-white/10">
            <div className="flex flex-col items-center">
              <div
                className={`relative transition-all duration-200 ${isDragging ? 'scale-105' : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className={`flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 ${isDragging ? 'border-blue-300 bg-blue-50 dark:bg-blue-500/10' : 'border-white bg-stone-100 dark:border-white/10 dark:bg-white/5'} text-stone-400 shadow-lg`}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <FiUser size={48} />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 cursor-pointer rounded-xl bg-slate-900 p-2.5 text-white shadow-lg transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500">
                  <FiCamera size={16} />
                  <input type="file" accept="image/*" className="hidden" {...register('avatar')} onChange={handleAvatarChange} />
                </label>
              </div>

              <p className={`mt-3 text-center text-xs transition-colors ${isDragging ? 'font-semibold text-blue-600' : 'text-stone-500 dark:text-slate-300'}`}>
                {isDragging ? 'Solte a imagem aqui.' : 'Clique ou arraste uma foto para alterar.'}
              </p>

              <div className="mt-5 w-full rounded-2xl border border-stone-200/80 bg-white/70 p-4 text-[13px] text-stone-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Conta ativa</p>
                <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="mt-1 break-all">{user?.email}</p>
              </div>

              <div className="mt-4 w-full rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-[13px] text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100">
                <p className="flex items-center gap-2 font-bold"><FiCheckCircle /> Sessao sincronizada</p>
                <p className="mt-1 leading-5">Ao salvar, o avatar e o nome atualizam tambem na navegacao.</p>
              </div>
            </div>
          </div>

          <div className="surface-card rounded-2xl p-5 md:p-6 dark:bg-slate-900 dark:border dark:border-white/10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiUser size={14} /> Nome completo
                </label>
                <input type="text" {...register('name', { required: 'Nome e obrigatorio' })} className={controlClass(errors.name)} />
                {errors.name && <p className="mt-2 text-sm text-rose-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiMail size={14} /> E-mail
                </label>
                <input type="email" {...register('email', { required: 'E-mail e obrigatorio' })} className={controlClass(errors.email)} />
                {errors.email && <p className="mt-2 text-sm text-rose-500">{errors.email.message}</p>}
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  <FiShield className="text-blue-600" /> Seguranca
                </h3>
                <p className="mt-1 text-[13px] text-stone-500 dark:text-slate-300">Preencha a senha atual apenas se quiser trocar a credencial.</p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                      <span className="inline-flex items-center gap-2"><FiLock size={14} /> Senha atual</span>
                    </label>
                    <input type="password" {...register('oldPassword')} placeholder="Digite sua senha atual para alterar" className={controlClass(false)} />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Nova senha</label>
                    <input type="password" {...register('password', { minLength: { value: 6, message: 'Minimo 6 caracteres' } })} className={controlClass(errors.password)} />
                    {errors.password && <p className="mt-2 text-sm text-rose-500">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Confirmar nova senha</label>
                    <input
                      type="password"
                      {...register('confirmPassword', {
                        validate: (value) => value === watch('password') || 'As senhas nao coincidem'
                      })}
                      className={controlClass(errors.confirmPassword)}
                    />
                    {errors.confirmPassword && <p className="mt-2 text-sm text-rose-500">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                <span className="inline-flex items-center justify-center gap-2">
                  {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
                  {loading ? 'Salvando...' : 'Salvar alteracoes'}
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
