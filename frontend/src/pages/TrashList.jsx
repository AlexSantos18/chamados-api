import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  FiAlertCircle,
  FiClock,
  FiFileText,
  FiRefreshCcw,
  FiRefreshCw,
  FiShield,
  FiTrash2,
  FiUser
} from 'react-icons/fi';
import { useAuth } from '../AuthContext';

const TrashList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);
  const { isAdmin } = useAuth();

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const response = await api.get('/trash');
      setItems(response.data);
    } catch (err) {
      toast.error('Erro ao carregar itens da lixeira');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const stats = useMemo(() => {
    const withReason = items.filter((item) => Boolean(item.reason)).length;
    const recoverable = items.filter((item) => Boolean(item.chamado)).length;

    return { withReason, recoverable };
  }, [items]);

  const handleRestore = async (id) => {
    setRestoringId(id);
    try {
      await api.post(`/trash/${id}/restore`);
      toast.success('Comentario restaurado com sucesso!');
      fetchTrash();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Erro ao restaurar item';
      toast.error(errorMsg);
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="surface-card slide-up overflow-hidden rounded-2xl dark:bg-slate-900 dark:border dark:border-white/10">
          <div className="grid gap-4 p-5 md:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-lg">
                <FiTrash2 size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-400 dark:text-slate-400">Auditoria</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">Lixeira de notas</h1>
                <p className="mt-2 max-w-2xl text-[13px] leading-5 text-stone-500 dark:text-slate-300">
                  Notas internas removidas dos atendimentos, com motivo e contexto para restauracao.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Itens</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{items.length}</p>
              </div>
              <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Motivos</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{stats.withReason}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-400/20 dark:bg-emerald-500/10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-200">Restauraveis</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{stats.recoverable}</p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="surface-card h-40 animate-pulse rounded-2xl dark:bg-slate-900 dark:border dark:border-white/10" />
            ))}
          </div>
        ) : (
          <section className="space-y-4">
            {items.map((item) => (
              <article key={item._id} className="surface-card rounded-2xl p-4 transition-transform hover:-translate-y-1 md:p-5 dark:bg-slate-900 dark:border dark:border-white/10">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">
                        <FiFileText /> {item.chamado?.title || 'Chamado excluido'}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-500 dark:bg-white/10 dark:text-slate-300">
                        <FiClock /> {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <blockquote className="rounded-2xl border-l-4 border-blue-400 bg-stone-50 p-4 text-[13px] italic leading-6 text-slate-700 dark:bg-white/5 dark:text-slate-200">
                      {item.text}
                    </blockquote>

                    <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-3 dark:border-rose-400/20 dark:bg-rose-500/10">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-rose-500 dark:text-rose-200">
                        <FiAlertCircle /> Motivo do descarte
                      </p>
                      <p className="mt-1 text-[13px] font-medium leading-5 text-rose-800 dark:text-rose-100">{item.reason || 'Sem motivo informado.'}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-500 dark:text-slate-300">
                      <span className="inline-flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2 dark:bg-white/5">
                        <FiUser className="text-blue-500" /> Autor: {item.author?.name || 'Nao informado'}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2 dark:bg-white/5">
                        <FiShield /> Removido por: {item.deletedBy?.name || 'Nao informado'}
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="w-full xl:w-[180px]">
                      <button
                        onClick={() => handleRestore(item._id)}
                        disabled={restoringId === item._id}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none"
                      >
                        {restoringId === item._id ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCcw />}
                        {restoringId === item._id ? 'Restaurando...' : 'Restaurar'}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}

            {items.length === 0 && (
              <div className="surface-card rounded-3xl px-6 py-16 text-center dark:bg-slate-900 dark:border dark:border-white/10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-white/10 dark:text-slate-300">
                  <FiAlertCircle size={26} />
                </div>
                <p className="mt-5 text-lg font-bold text-slate-800 dark:text-white">A lixeira de notas esta vazia.</p>
                <p className="mt-2 text-sm text-stone-500 dark:text-slate-300">Quando uma nota for removida, ela aparecera aqui.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default TrashList;
