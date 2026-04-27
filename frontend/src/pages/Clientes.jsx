import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiUsers, FiPlus, FiMail, FiFileText, FiBriefcase, FiPhone } from 'react-icons/fi';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (err) {
      toast.error('Erro ao carregar clientes');
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/clientes', data);
      toast.success('Cliente cadastrado com sucesso!');
      reset();
      // Recarrega a listagem após cadastro para manter a página sincronizada sem refresh manual.
      fetchClientes();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Erro ao cadastrar cliente';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-7xl">
        <section className="surface-card slide-up rounded-[34px] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-400">Cadastro</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-[0_16px_32px_rgba(59,130,246,0.28)]">
                  <FiUsers size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">Gestao de clientes</h1>
                  <p className="mt-1 text-sm text-stone-500">Cadastre empresas e mantenha a base de atendimento organizada.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-sky-200 bg-sky-50/70 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-sky-600">Base ativa</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-slate-800">{clientes.length}</p>
              <p className="mt-1 text-sm text-stone-500">clientes cadastrados</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.3fr]">
          <div className="surface-card rounded-[34px] p-6 md:p-8">
            <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-800">
              <FiPlus /> Novo cliente
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">Adicione dados essenciais para vincular chamados a uma empresa ou contato.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div className="rounded-[26px] border border-stone-200/80 bg-white/70 p-4">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiBriefcase size={14} /> Nome da empresa / cliente
                </label>
                <input
                  {...register('nome', { required: 'Nome e obrigatorio' })}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
                {errors.nome && <span className="mt-2 block text-sm text-rose-500">{errors.nome.message}</span>}
              </div>

              <div className="rounded-[26px] border border-stone-200/80 bg-white/70 p-4">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiFileText size={14} /> Documento
                </label>
                <input
                  {...register('documento', {
                    required: 'Documento e obrigatorio',
                    pattern: { value: /^[0-9./-]+$/, message: 'Formato invalido' }
                  })}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
                {errors.documento && <span className="mt-2 block text-sm text-rose-500">{errors.documento.message}</span>}
              </div>

              <div className="rounded-[26px] border border-stone-200/80 bg-white/70 p-4">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiMail size={14} /> E-mail de contato
                </label>
                <input
                  {...register('email', { pattern: { value: /^\S+@\S+$/i, message: 'E-mail invalido' } })}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
                {errors.email && <span className="mt-2 block text-sm text-rose-500">{errors.email.message}</span>}
              </div>

              <div className="rounded-[26px] border border-stone-200/80 bg-white/70 p-4">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiPhone size={14} /> Telefone
                </label>
                <input
                  {...register('telefone')}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <button type="submit" disabled={loading} className="brand-button w-full rounded-2xl px-5 py-4 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Salvando...' : 'Cadastrar cliente'}
              </button>
            </form>
          </div>

          <div className="surface-card rounded-[34px] p-4 md:p-6">
            <div className="flex items-center justify-between gap-4 px-2 pb-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-800">Base de clientes</h2>
                <p className="mt-1 text-sm text-stone-500">Visualize rapidamente quem ja esta cadastrado no sistema.</p>
              </div>
            </div>

            <div className="space-y-3">
              {clientes.map((cliente) => (
                <article key={cliente._id} className="rounded-[28px] border border-stone-200/80 bg-white/70 p-5 transition hover:-translate-y-0.5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{cliente.nome}</h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-stone-500">
                        <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1"><FiFileText size={14} /> {cliente.documento}</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1"><FiMail size={14} /> {cliente.email || 'Sem e-mail'}</span>
                        {cliente.telefone && <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1"><FiPhone size={14} /> {cliente.telefone}</span>}
                      </div>
                    </div>
                    <button className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-500 transition hover:border-orange-200 hover:text-orange-700">
                      Editar
                    </button>
                  </div>
                </article>
              ))}

              {clientes.length === 0 && (
                <div className="rounded-[28px] border border-dashed border-stone-300 bg-white/40 px-6 py-14 text-center text-stone-500">
                  Nenhum cliente cadastrado.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Clientes;
