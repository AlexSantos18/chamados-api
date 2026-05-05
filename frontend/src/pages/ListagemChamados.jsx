import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api, { buildUploadUrl } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';
import {
  FiArchive,
  FiBriefcase,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiExternalLink,
  FiFilter,
  FiInbox,
  FiPlusSquare,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUser
} from 'react-icons/fi';
import DeleteModal from './DeleteModal';
import ChamadoSkeleton from './ChamadoSkeleton';

const statusLabels = {
  aberto: 'Aberto',
  em_andamento: 'Em andamento',
  concluido: 'Concluido',
  cancelado: 'Cancelado'
};

const ListagemChamados = () => {
  const [chamados, setChamados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (err) {
        toast.error('Erro ao carregar filtros de clientes');
      }
    };

    fetchClientes();
  }, []);

  const fetchChamados = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 5,
        status: status || undefined,
        clienteId: clienteId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };

      const response = await api.get('/chamados', { params });
      setChamados(response.data.data);
      setTotalPages(response.data.pages);
      setTotalItems(response.data.total || 0);
    } catch (err) {
      toast.error('Erro ao carregar listagem de chamados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChamados();
  }, [page, status, clienteId, startDate, endDate]);

  const listStats = useMemo(() => {
    const activeFilters = [status, clienteId, startDate, endDate].filter(Boolean).length;
    const withAttachments = chamados.filter((chamado) => chamado.attachments?.length > 0).length;

    return {
      activeFilters,
      currentCount: chamados.length,
      withAttachments
    };
  }, [chamados, status, clienteId, startDate, endDate]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/chamados/${id}`, { status: newStatus });
      toast.success('Status atualizado com sucesso!');
      fetchChamados();
    } catch (err) {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleDelete = async (id) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleClearFilters = () => {
    setStatus('');
    setClienteId('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const handleExportCSV = async () => {
    try {
      const queryParams = new URLSearchParams({
        status: status || '',
        clienteId: clienteId || '',
        startDate: startDate || '',
        endDate: endDate || ''
      }).toString();

      const response = await api.get(`/chamados/export/csv?${queryParams}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `chamados_export_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Erro ao exportar arquivo CSV');
    }
  };

  const confirmTicketDelete = async (reason) => {
    try {
      await api.delete(`/chamados/${idToDelete}`, { data: { reason } });
      toast.success('Chamado movido para a lixeira!');
      fetchChamados();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao excluir chamado');
    }
  };

  const getStatusColor = (ticketStatus) => {
    const colors = {
      aberto: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-400/20',
      em_andamento: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-200 dark:border-indigo-400/20',
      concluido: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-400/20',
      cancelado: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-400/20'
    };
    return colors[ticketStatus] || 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/10 dark:text-slate-200 dark:border-white/10';
  };

  const controlClass = 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500/10 dark:[color-scheme:dark]';

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="surface-card slide-up overflow-hidden rounded-2xl dark:bg-slate-900 dark:border dark:border-white/10">
          <div className="grid gap-4 p-5 md:p-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
                <FiSearch size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-400">
                  Chamados
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
                  Consultar chamados
                </h1>
                <p className="mt-2 max-w-2xl text-[13px] leading-5 text-slate-500 dark:text-slate-300">
                  Filtre, atualize status e acompanhe cada atendimento sem sair da lista.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Total</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{totalItems}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Na tela</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{listStats.currentCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Filtros</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{listStats.activeFilters}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-card rounded-2xl p-4 md:p-5 dark:bg-slate-900 dark:border dark:border-white/10">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                  <FiFilter /> Status
                </label>
                <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={controlClass}>
                  <option value="" className="dark:bg-slate-800">Todos os status</option>
                  <option value="aberto" className="dark:bg-slate-800">Abertos</option>
                  <option value="em_andamento" className="dark:bg-slate-800">Em andamento</option>
                  <option value="concluido" className="dark:bg-slate-800">Concluidos</option>
                  <option value="cancelado" className="dark:bg-slate-800">Cancelados</option>
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                  <FiBriefcase /> Cliente
                </label>
                <select value={clienteId} onChange={(e) => { setClienteId(e.target.value); setPage(1); }} className={controlClass}>
                  <option value="" className="dark:bg-slate-800">Todos os clientes</option>
                  {clientes.map((c) => (
                    <option key={c._id} value={c._id} className="dark:bg-slate-800">{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                  <FiCalendar /> Data inicial
                </label>
                <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} className={controlClass} />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                  <FiCalendar /> Data final
                </label>
                <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} className={controlClass} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={handleExportCSV} className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                <span className="inline-flex items-center gap-2">
                  <FiDownload />
                  CSV
                </span>
              </button>
                <button onClick={handleClearFilters} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <span className="inline-flex items-center gap-2">
                  <FiRefreshCw />
                  Limpar
                </span>
              </button>
                <Link to="/chamados/novo" className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500">
                <span className="inline-flex items-center gap-2">
                  <FiPlusSquare />
                  Novo
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <ChamadoSkeleton key={i} className="dark:bg-slate-900 dark:border dark:border-white/10" />)}
            </div>
          ) : (
            <>
              {chamados.map((chamado) => ( // Adicionado dark mode para o artigo do chamado
                <article key={chamado._id} className="surface-card rounded-2xl p-4 transition-transform hover:-translate-y-1 md:p-5">
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${getStatusColor(chamado.status)}`}>
                          {statusLabels[chamado.status] || chamado.status}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-500 dark:bg-white/10 dark:text-slate-300">
                          Prioridade {chamado.priority || 'media'}
                        </span>
                        {chamado.attachments?.length > 0 && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">
                            {chamado.attachments.length} anexo(s)
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{chamado.title}</h2>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {chamado.description || 'Sem descricao detalhada.'}
                      </p>

                      <div className="mt-5 grid gap-3 text-sm text-slate-500 dark:text-slate-300 md:grid-cols-3">
                        <div className="rounded-2xl bg-white/60 px-4 py-3 dark:bg-white/5"><span className="inline-flex items-center gap-2"><FiBriefcase /> Cliente: {chamado.cliente?.nome || 'Nao informado'}</span></div>
                        <div className="rounded-2xl bg-white/60 px-4 py-3 dark:bg-white/5"><span className="inline-flex items-center gap-2"><FiUser /> Usuario: {chamado.user?.name || 'Nao informado'}</span></div>
                        <div className="rounded-2xl bg-white/60 px-4 py-3 dark:bg-white/5"><span className="inline-flex items-center gap-2"><FiCalendar /> {new Date(chamado.createdAt).toLocaleDateString()}</span></div>
                      </div>
                    </div>

                    <div className="w-full xl:w-[280px]">
                      <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 dark:bg-slate-900 dark:border dark:border-white/10">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Alterar status</label>
                        <select value={chamado.status} onChange={(e) => handleStatusChange(chamado._id, e.target.value)} className={controlClass}>
                          <option value="aberto" className="dark:bg-slate-800">Aberto</option>
                          <option value="em_andamento" className="dark:bg-slate-800">Em andamento</option>
                          <option value="concluido" className="dark:bg-slate-800">Concluido</option>
                          <option value="cancelado" className="dark:bg-slate-800">Cancelado</option>
                        </select>

                        <div className="mt-4">
                          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Anexos</p>
                          <div className="flex flex-wrap gap-2">
                            {chamado.attachments?.length > 0 ? chamado.attachments.map((file, idx) => (
                              <a key={idx} href={buildUploadUrl(file)} target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-blue-700 transition hover:border-blue-200 hover:bg-blue-50 dark:border-white/10 dark:bg-white/5 dark:text-blue-200">
                                <FiExternalLink size={16} />
                              </a>
                            )) : <span className="text-sm italic text-slate-400">Nenhum anexo</span>}
                          </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-3">
                          <Link to={`/chamados/${chamado._id}`} className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500">
                            Ver detalhes
                          </Link>
                          {isAdmin && (
                            <button onClick={() => handleDelete(chamado._id)} className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
                              <span className="inline-flex items-center justify-center gap-2">
                                <FiTrash2 size={14} /> Excluir chamado
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {chamados.length === 0 && (
                <div className="surface-card rounded-3xl px-6 py-14 text-center dark:bg-slate-900 dark:border dark:border-white/10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">
                    <FiInbox size={24} />
                  </div>
                  <p className="mt-5 text-lg font-bold text-slate-800 dark:text-white">Nenhum chamado encontrado.</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Ajuste os filtros ou cadastre um novo atendimento.</p>
                </div>
              )}

              <div className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-3xl px-5 py-4 dark:bg-slate-900 dark:border dark:border-white/10">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <FiArchive />
                  Pagina {page} de {Math.max(totalPages, 1)} · {listStats.withAttachments} com anexos
                </div>
                <div className="flex items-center gap-3">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                    <FiChevronLeft size={20} />
                  </button>
                  <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)} className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmTicketDelete}
          title="Excluir Chamado"
          message="Este chamado sera movido para a lixeira. Por favor, justifique a exclusao:"
        />
      </div>
    </div>
  );
};

export default ListagemChamados;
