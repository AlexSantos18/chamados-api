import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  FiAlertTriangle,
  FiArchive,
  FiCalendar,
  FiFilter,
  FiInfo,
  FiRefreshCcw,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrash
} from 'react-icons/fi';
import { useAuth } from '../AuthContext';

const statusLabels = {
  aberto: 'Aberto',
  em_andamento: 'Em andamento',
  concluido: 'Concluido',
  cancelado: 'Cancelado'
};

const statusStyles = {
  aberto: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200',
  em_andamento: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200',
  concluido: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
  cancelado: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200'
};

const ChamadoTrashList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [restoringId, setRestoringId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { isAdmin } = useAuth();

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const params = {
        title: searchTerm || undefined,
        status: filterStatus || undefined
      };

      const response = await api.get('/trash/tickets', { params });
      setItems(response.data);
    } catch (err) {
      toast.error('Erro ao carregar lixeira de chamados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTrash();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const withReason = items.filter((item) => Boolean(item.reason)).length;
    const activeFilters = [searchTerm, filterStatus].filter(Boolean).length;

    return { withReason, activeFilters };
  }, [items, searchTerm, filterStatus]);

  const handleRestore = async (id) => {
    setRestoringId(id);
    try {
      await api.post(`/trash/tickets/${id}/restore`);
      toast.success('Chamado restaurado com sucesso!');
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao restaurar chamado');
    } finally {
      setRestoringId(null);
    }
  };

  const handleHardDelete = async (id) => {
    if (!window.confirm('ATENCAO: Esta acao e irreversivel. O chamado sera apagado permanentemente. Continuar?')) return;

    setDeletingId(id);
    try {
      await api.delete(`/trash/tickets/${id}/hard`);
      toast.success('Chamado excluido permanentemente.');
      fetchTrash();
    } catch (err) {
      toast.error('Erro ao excluir permanentemente');
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
  };

  const controlClass = 'w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500/10 dark:[color-scheme:dark]';

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="surface-card slide-up overflow-hidden rounded-2xl dark:bg-slate-900 dark:border dark:border-white/10">
          <div className="grid gap-4 p-5 md:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-950 text-white shadow-lg">
                <FiArchive size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-400 dark:text-slate-400">Arquivados</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">Lixeira de chamados</h1>
                <p className="mt-2 max-w-2xl text-[13px] leading-5 text-stone-500 dark:text-slate-300">
                  Recupere atendimentos removidos ou conclua a exclusao permanente quando necessario.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Itens</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{items.length}</p>
              </div>
              <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Filtros</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{stats.activeFilters}</p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-400/20 dark:bg-blue-500/10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-200">Motivos</p>
                <p className="mt-1 text-xl font-black text-blue-900 dark:text-white">{stats.withReason}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-card rounded-2xl p-4 md:p-5 dark:bg-slate-900 dark:border dark:border-white/10">
          <div className="grid gap-4 md:grid-cols-[1fr_280px_auto] md:items-end">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                <FiSearch /> Pesquisar titulo
              </label>
              <input
                type="text"
                placeholder="Buscar chamado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={controlClass}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                <FiFilter /> Status original
              </label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={controlClass}>
                <option value="" className="dark:bg-slate-800">Todos os status</option>
                <option value="aberto" className="dark:bg-slate-800">Aberto</option>
                <option value="em_andamento" className="dark:bg-slate-800">Em andamento</option>
                <option value="concluido" className="dark:bg-slate-800">Concluido</option>
                <option value="cancelado" className="dark:bg-slate-800">Cancelado</option>
              </select>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-stone-200 bg-white/75 px-3 py-2 text-xs font-bold text-stone-600 transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              Limpar
            </button>
          </div>
        </section>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="surface-card h-44 animate-pulse rounded-2xl dark:bg-slate-900 dark:border dark:border-white/10" />
            ))}
          </div>
        ) : (
          <section className="space-y-4">
            {items.map((item) => {
              const data = item.data || {};
              const status = data.status || 'aberto';
              
              return (
                <article key={item._id} className="surface-card rounded-2xl p-4 transition-transform hover:-translate-y-1 md:p-5 dark:bg-slate-900 dark:border dark:border-white/10">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusStyles[status] || statusStyles.aberto}`}>
                          {statusLabels[status] || status}
                        </span>
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase text-stone-500 dark:bg-white/10 dark:text-slate-300">
                          Prioridade {data.priority || 'media'}
                        </span>
                      </div>

                      <h2 className="mt-3 text-xl font-black tracking-tight text-slate-900 dark:text-white">{data.title || 'Chamado sem titulo'}</h2>
                      <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-stone-600 dark:text-slate-300">
                        {data.description || 'Sem descricao detalhada.'}
                      </p>

                      <div className="mt-3 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-400/20 dark:bg-blue-500/10">
                        <FiAlertTriangle className="mt-0.5 shrink-0 text-blue-500" size={16} />
                        <p className="text-[13px] leading-5 text-blue-900 dark:text-blue-100"><span className="font-bold">Motivo:</span> {item.reason || 'Sem motivo informado.'}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-500 dark:text-slate-300">
                        <span className="inline-flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2 dark:bg-white/5">
                          <FiCalendar /> {new Date(item.createdAt).toLocaleString()}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2 dark:bg-white/5">
                          <FiShield /> Removido por: {item.deletedBy?.name || 'Nao informado'}
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex w-full flex-col gap-3 xl:w-[220px]">
                        <button
                          onClick={() => handleRestore(item._id)}
                          disabled={restoringId === item._id}
                          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none"
                        >
                          {restoringId === item._id ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCcw />}
                          {restoringId === item._id ? 'Restaurando...' : 'Restaurar'}
                        </button>

                        <button
                          onClick={() => handleHardDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200"
                        >
                          {deletingId === item._id ? <FiRefreshCw className="animate-spin" /> : <FiTrash />}
                          {deletingId === item._id ? 'Excluindo...' : 'Excluir definitivo'}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

            {items.length === 0 && (
              <div className="surface-card rounded-3xl px-6 py-16 text-center dark:bg-slate-900 dark:border dark:border-white/10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-white/10 dark:text-slate-300">
                  <FiInfo size={26} />
                </div>
                <p className="mt-5 text-lg font-bold text-slate-800 dark:text-white">A lixeira de chamados esta vazia.</p>
                <p className="mt-2 text-sm text-stone-500 dark:text-slate-300">Nenhum chamado removido corresponde aos filtros atuais.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ChamadoTrashList;
