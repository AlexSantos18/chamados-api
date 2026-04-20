import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiPlusCircle, FiFileText, FiUser, FiUpload, FiCheckCircle, FiFlag, FiLayers } from 'react-icons/fi';

const NovoChamado = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (err) {
        toast.error('Erro ao carregar a lista de clientes');
      }
    };

    fetchClientes();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('clienteId', data.clienteId);
    formData.append('priority', data.priority);

    if (data.attachments && data.attachments.length > 0) {
      Array.from(data.attachments).forEach((file) => {
        formData.append('attachments', file);
      });
    }

    try {
      await api.post('/chamados', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Chamado aberto com sucesso!');
      reset();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Erro ao criar chamado';
      toast.error(errorMsg);
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
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-400">Abertura</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_16px_32px_rgba(16,185,129,0.28)]">
                  <FiPlusCircle size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">Novo chamado</h1>
                  <p className="mt-1 text-sm text-stone-500">Registre um novo atendimento com contexto, prioridade e anexos.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-emerald-200 bg-emerald-50/70 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-emerald-600">Fluxo</p>
              <p className="mt-2 text-sm leading-6 text-emerald-900">Preencha o basico, envie evidencias e abra o ticket sem atrito.</p>
            </div>
          </div>
        </section>

        <section className="mt-6 surface-card rounded-[34px] p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[28px] border border-stone-200/80 bg-white/70 p-5 md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-stone-400">
                  <FiUser size={14} /> Cliente / Empresa
                </label>
                <select
                  {...register('clienteId', { required: 'Selecione um cliente' })}
                  className={`w-full rounded-2xl border bg-stone-50 px-4 py-3.5 outline-none transition ${errors.clienteId ? 'border-rose-400 focus:ring-4 focus:ring-rose-100' : 'border-stone-200 focus:border-orange-300 focus:ring-4 focus:ring-orange-100'}`}
                >
                  <option value="">Selecione o cliente atendido...</option>
                  {clientes.map((cliente) => (
                    <option key={cliente._id} value={cliente._id}>
                      {cliente.nome} ({cliente.documento})
                    </option>
                  ))}
                </select>
                {errors.clienteId && <p className="mt-2 text-sm text-rose-500">{errors.clienteId.message}</p>}
              </div>

              <div className="rounded-[28px] border border-stone-200/80 bg-white/70 p-5">
                <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-stone-400">
                  <FiFlag size={14} /> Prioridade do atendimento
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['baixa', 'media', 'alta'].map((p) => (
                    <label key={p} className="cursor-pointer">
                      <input type="radio" value={p} {...register('priority')} className="hidden peer" defaultChecked={p === 'media'} />
                      <div className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3 text-center text-sm font-bold capitalize text-stone-600 transition peer-checked:border-orange-500 peer-checked:bg-orange-500 peer-checked:text-white">
                        {p}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-stone-200/80 bg-white/70 p-5">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-stone-400">
                  <FiLayers size={14} /> Anexos
                </label>
                <input
                  type="file"
                  multiple
                  {...register('attachments')}
                  className="block w-full text-sm text-stone-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:font-semibold file:text-orange-700 hover:file:bg-orange-100"
                />
                <p className="mt-2 text-sm text-stone-500">Imagens, PDF e Word ajudam a acelerar a analise.</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-stone-200/80 bg-white/70 p-5">
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-stone-400">
                <FiFileText size={14} /> Titulo do problema
              </label>
              <input
                type="text"
                placeholder="Ex: Erro ao acessar o banco de dados"
                {...register('title', { required: 'O titulo e obrigatorio' })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
              {errors.title && <p className="mt-2 text-sm text-rose-500">{errors.title.message}</p>}
            </div>

            <div className="rounded-[28px] border border-stone-200/80 bg-white/70 p-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.26em] text-stone-400">Descricao detalhada</label>
              <textarea
                rows="6"
                placeholder="Descreva o problema com detalhes..."
                {...register('description')}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="brand-button w-full rounded-2xl px-5 py-4 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="inline-flex items-center gap-2">
                {loading ? 'Processando...' : <><FiCheckCircle /> Abrir chamado</>}
              </span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default NovoChamado;
