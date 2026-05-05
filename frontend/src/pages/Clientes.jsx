import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  FiBriefcase,
  FiEdit3,
  FiFileText,
  FiHome,
  FiMail,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiPhone,
  FiUsers,
  FiX
} from 'react-icons/fi';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingCliente, setEditingCliente] = useState(null);
  const [search, setSearch] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchClientes = async () => {
    setFetching(true);
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (err) {
      toast.error('Erro ao carregar clientes');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const filteredClientes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return clientes;

    return clientes.filter((cliente) => (
      cliente.nome?.toLowerCase().includes(normalizedSearch) ||
      cliente.documento?.toLowerCase().includes(normalizedSearch) ||
      cliente.email?.toLowerCase().includes(normalizedSearch) ||
      cliente.telefone?.toLowerCase().includes(normalizedSearch)
    ));
  }, [clientes, search]);

  const clientsWithEmail = useMemo(
    () => clientes.filter((cliente) => Boolean(cliente.email)).length,
    [clientes]
  );

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    reset({
      nome: cliente.nome || '',
      documento: cliente.documento || '',
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      endereco: cliente.endereco || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingCliente(null);
    reset({
      nome: '',
      documento: '',
      email: '',
      telefone: '',
      endereco: ''
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingCliente) {
        await api.put(`/clientes/${editingCliente._id}`, data);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await api.post('/clientes', data);
        toast.success('Cliente cadastrado com sucesso!');
      }

      handleCancelEdit();
      fetchClientes();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Erro ao salvar cliente';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const controlClass = 'w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500/10 dark:[color-scheme:dark]';

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="surface-card slide-up overflow-hidden rounded-2xl dark:bg-slate-900 dark:border dark:border-white/10">
          <div className="grid gap-4 p-5 md:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg">
                <FiUsers size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-400 dark:text-slate-400">
                  Cadastro
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
                  Gestao de clientes
                </h1>
                <p className="mt-2 max-w-2xl text-[13px] leading-5 text-stone-500 dark:text-slate-300">
                  Cadastre, encontre e atualize empresas ou contatos vinculados aos chamados.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Base</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{clientes.length}</p>
              </div>
              <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Com e-mail</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{clientsWithEmail}</p>
              </div>
              <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Exibidos</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{filteredClientes.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.3fr]">
          <div className="surface-card rounded-2xl p-5 md:p-6 dark:bg-slate-900 dark:border dark:border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  {editingCliente ? <FiEdit3 /> : <FiPlus />}
                  {editingCliente ? 'Editar cliente' : 'Novo cliente'}
                </h2>
                <p className="mt-1 text-[13px] leading-5 text-stone-500 dark:text-slate-300">
                  {editingCliente ? 'Atualize os dados sem criar duplicidade na base.' : 'Adicione dados essenciais para vincular chamados.'}
                </p>
              </div>

              {editingCliente && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl border border-stone-200 bg-white/70 p-2.5 text-stone-600 transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  <FiX />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiBriefcase size={14} /> Nome
                </label>
                <input
                  {...register('nome', { required: 'Nome e obrigatorio' })}
                  className={controlClass}
                />
                {errors.nome && <span className="mt-2 block text-sm text-rose-500">{errors.nome.message}</span>}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiFileText size={14} /> Documento
                </label>
                <input
                  {...register('documento', {
                    required: 'Documento e obrigatorio',
                    pattern: { value: /^[0-9./-]+$/, message: 'Formato invalido' }
                  })}
                  className={controlClass}
                />
                {errors.documento && <span className="mt-2 block text-sm text-rose-500">{errors.documento.message}</span>}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiMail size={14} /> E-mail
                </label>
                <input
                  {...register('email', { pattern: { value: /^\S+@\S+$/i, message: 'E-mail invalido' } })}
                  className={controlClass}
                />
                {errors.email && <span className="mt-2 block text-sm text-rose-500">{errors.email.message}</span>}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiPhone size={14} /> Telefone
                </label>
                <input {...register('telefone')} className={controlClass} />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiHome size={14} /> Endereco
                </label>
                <input {...register('endereco')} className={controlClass} />
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                <span className="inline-flex items-center justify-center gap-2">
                  {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
                  {loading ? 'Salvando...' : editingCliente ? 'Salvar alteracoes' : 'Cadastrar cliente'}
                </span>
              </button>
            </form>
          </div>

          <div className="surface-card rounded-2xl p-4 md:p-5 dark:bg-slate-900 dark:border dark:border-white/10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Base de clientes</h2>
                <p className="mt-1 text-[13px] text-stone-500 dark:text-slate-300">Visualize e edite cadastros existentes.</p>
              </div>

              <label className="relative block md:w-72">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar cliente"
                  className="w-full rounded-xl border border-stone-200 bg-white/70 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </label>
            </div>

            <div className="mt-5 space-y-3">
              {fetching ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl border border-stone-200/70 bg-white/50 dark:border-white/10 dark:bg-white/5" />
                ))
              ) : filteredClientes.map((cliente) => (
                <article key={cliente._id} className="rounded-2xl border border-stone-200/80 bg-white/70 p-4 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cliente.nome}</h3>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-stone-500 dark:text-slate-300">
                        <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 dark:bg-white/10"><FiFileText size={14} /> {cliente.documento}</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 dark:bg-white/10"><FiMail size={14} /> {cliente.email || 'Sem e-mail'}</span>
                        {cliente.telefone && <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 dark:bg-white/10"><FiPhone size={14} /> {cliente.telefone}</span>}
                        {cliente.endereco && <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 dark:bg-white/10"><FiHome size={14} /> {cliente.endereco}</span>}
                      </div>
                    </div>
                    <button onClick={() => handleEdit(cliente)} className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-600 transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                      <span className="inline-flex items-center gap-2">
                        <FiEdit3 />
                        Editar
                      </span>
                    </button>
                  </div>
                </article>
              ))}

              {!fetching && filteredClientes.length === 0 && (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-white/40 px-6 py-14 text-center text-stone-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Nenhum cliente encontrado.
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
