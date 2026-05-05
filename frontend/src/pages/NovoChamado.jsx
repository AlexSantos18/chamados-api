import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiFileText,
  FiFlag,
  FiLayers,
  FiPlusCircle,
  FiRefreshCw,
  FiUpload,
  FiUser
} from 'react-icons/fi';

const priorities = [
  { value: 'baixa', label: 'Baixa', hint: 'Pode aguardar', tone: 'peer-checked:border-emerald-500 peer-checked:bg-emerald-500' },
  { value: 'media', label: 'Media', hint: 'Acompanhar hoje', tone: 'peer-checked:border-blue-500 peer-checked:bg-blue-500' },
  { value: 'alta', label: 'Alta', hint: 'Atencao imediata', tone: 'peer-checked:border-rose-500 peer-checked:bg-rose-500' }
];

const NovoChamado = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formKey, setFormKey] = useState(0); // Force re-render do form
  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: { priority: 'media' }
  });
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // Fallback: limpa elementos DOM caso o reset do RHF não atualize a UI
  const clearDomFields = () => {
    try {
      const sel = document.querySelector('select[name="clienteId"]');
      if (sel) sel.value = '';

      const title = document.querySelector('input[name="title"]');
      if (title) title.value = '';

      const desc = document.querySelector('textarea[name="description"]');
      if (desc) desc.value = '';

      const radios = document.querySelectorAll('input[name="priority"]');
      if (radios && radios.length) radios.forEach(r => { r.checked = false; r.removeAttribute('checked'); });
    } catch (e) {
      // não bloquear execução por erro no DOM
      // eslint-disable-next-line no-console
      console.warn('clearDomFields failed', e);
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (err) {
        toast.error('Erro ao carregar a lista de clientes');
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('clienteId', data.clienteId);
    formData.append('priority', data.priority || 'media');

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
      // Reset via RHF
      reset();
      setValue('clienteId', '');
      setValue('title', '');
      setValue('description', '');
      setValue('priority', 'media');
      setValue('attachments', null);
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      // fallback DOM clear
      clearDomFields();
      // Use HTML5 form reset nativa para garantir
      if (formRef.current) formRef.current.reset();
      // Force re-render do form
      setTimeout(() => setFormKey(k => k + 1), 100);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Erro ao criar chamado';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const controlClass = (hasError) => `w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition dark:bg-slate-800 dark:text-white dark:[color-scheme:dark] ${
    hasError
      ? 'border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-rose-400/40 dark:focus:ring-rose-500/10'
      : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:focus:border-blue-400 dark:focus:ring-blue-500/10'
  }`;

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-5xl space-y-4">
        <Link to="/chamados" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
          <FiArrowLeft /> Voltar para chamados
        </Link>

        <section className="surface-card slide-up overflow-hidden rounded-2xl">
          <div className="grid gap-4 p-5 md:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center dark:bg-slate-900 dark:border dark:border-white/10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                <FiPlusCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-400">Abertura</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Novo chamado</h1>
                <p className="mt-2 max-w-2xl text-[13px] leading-5 text-slate-500 dark:text-slate-300">
                  Registre um novo atendimento com cliente, prioridade, contexto e anexos.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Clientes</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{clientes.length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Anexos</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{selectedFiles.length}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-400/20 dark:bg-emerald-500/10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-200">Status</p>
                <p className="mt-1 text-xs font-bold text-emerald-900 dark:text-emerald-100">Nasce aberto</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <form key={formKey} ref={formRef} onSubmit={handleSubmit(onSubmit)} className="surface-card rounded-2xl p-5 md:p-6 dark:bg-slate-900 dark:border dark:border-white/10">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-400">
                  <FiUser size={14} /> Cliente / empresa
                </label>
                <select
                  {...register('clienteId', { required: 'Selecione um cliente' })}
                  className={controlClass(errors.clienteId)}
                  disabled={loadingClientes}
                >
                  <option value="" className="dark:bg-slate-800">{loadingClientes ? 'Carregando clientes...' : 'Selecione o cliente atendido...'}</option>
                  {clientes.map((cliente) => (
                    <option key={cliente._id} value={cliente._id} className="dark:bg-slate-800">
                      {cliente.nome} ({cliente.documento})
                    </option>
                  ))}
                </select>
                {errors.clienteId && <p className="mt-2 text-sm text-rose-500">{errors.clienteId.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-400">
                  <FiFileText size={14} /> Titulo do problema
                </label>
                <input
                  type="text"
                  placeholder="Ex: Erro ao acessar o banco de dados"
                  {...register('title', { required: 'O titulo e obrigatorio', minLength: { value: 5, message: 'Use um titulo mais descritivo' } })}
                  className={controlClass(errors.title)}
                />
                {errors.title && <p className="mt-2 text-sm text-rose-500">{errors.title.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-stone-400 dark:text-slate-400">Descricao detalhada</label>
                <textarea
                  rows="7"
                  placeholder="Descreva o problema, impacto, mensagens de erro e qualquer contexto util..."
                  {...register('description')}
                  className={controlClass(false)}
                />
              </div>

              <div className="rounded-3xl border border-stone-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5 md:col-span-2 dark:bg-slate-900 dark:border dark:border-white/10">
                <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiFlag size={14} /> Prioridade do atendimento
                </label>
                <div className="grid gap-3 md:grid-cols-3">
                  {priorities.map((priority) => (
                    <label key={priority.value} className="cursor-pointer">
                      <input type="radio" value={priority.value} {...register('priority')} className="hidden peer" />
                      <div className={`rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 transition dark:border-white/10 dark:bg-white/5 ${priority.tone} peer-checked:text-white`}>
                        <p className="text-sm font-black">{priority.label}</p>
                        <p className="mt-1 text-xs opacity-80">{priority.hint}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-stone-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5 md:col-span-2 dark:bg-slate-900 dark:border dark:border-white/10">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  <FiLayers size={14} /> Anexos
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  {...register('attachments', {
                    onChange: (e) => setSelectedFiles(Array.from(e.target.files || []))
                  })}
                  className="block w-full text-sm text-stone-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-slate-300"
                />
                <p className="mt-3 text-sm text-stone-500 dark:text-slate-300">Imagens, PDF e Word ajudam a acelerar a analise.</p>
                {selectedFiles.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedFiles.map((file) => (
                      <span key={`${file.name}-${file.size}`} className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600 dark:bg-white/10 dark:text-slate-200">
                        <FiUpload size={12} /> {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {loading ? <FiRefreshCw className="animate-spin" /> : <FiCheckCircle />}
                {loading ? 'Processando...' : 'Abrir chamado'}
              </span>
            </button>
          </form>

          <aside className="space-y-4">
            <div className="surface-card rounded-3xl p-5 dark:bg-slate-900 dark:border dark:border-white/10">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                <FiAlertCircle /> Checklist
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">Escolha o cliente correto antes de abrir.</p>
                <p className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">Use titulo claro para facilitar a busca depois.</p>
                <p className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">Inclua anexos quando houver evidencia visual.</p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default NovoChamado;
