import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { buildUploadUrl } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';
import { FiSearch, FiFilter, FiUser, FiBriefcase, FiCalendar, FiExternalLink, FiChevronLeft, FiChevronRight, FiTrash2, FiDownload, FiRefreshCw } from 'react-icons/fi';
import DeleteModal from './DeleteModal';
import ChamadoSkeleton from './ChamadoSkeleton';

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const { isAdmin } = useAuth();

  useEffect(() => {
    // Os clientes são carregados à parte para popular os filtros da listagem.
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
      // Filtros vazios são enviados como undefined para não poluir a querystring.
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
    } catch (err) {
      toast.error('Erro ao carregar listagem de chamados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChamados();
  }, [page, status, clienteId, startDate, endDate]);

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
      // A exportação reutiliza os mesmos filtros ativos da tela para manter consistência.
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
      aberto: 'bg-sky-100 text-sky-700 border-sky-200',
      em_andamento: 'bg-amber-100 text-amber-700 border-amber-200',
      concluido: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      cancelado: 'bg-rose-100 text-rose-700 border-rose-200'
    };
    return colors[ticketStatus] || 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-7xl">
        <section className="surface-card slide-up rounded-[34px] p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-400">Chamados</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_16px_32px_rgba(234,88,12,0.28)]">
                  <FiSearch size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">Consultar chamados</h1>
                  <p className="mt-1 text-sm text-stone-500">Filtre, atualize status e acompanhe cada atendimento com mais clareza.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={handleExportCSV} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
                <span className="inline-flex items-center gap-2">
                  <FiDownload />
                  Exportar CSV
                </span>
              </button>
              <button onClick={handleClearFilters} className="rounded-2xl border border-stone-200 bg-white/75 px-4 py-3 text-sm font-semibold text-stone-600 transition hover:border-orange-200 hover:text-orange-700">
                <span className="inline-flex items-center gap-2">
                  <FiRefreshCw />
                  Limpar filtros
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-[26px] border border-stone-200/80 bg-white/70 p-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-stone-400">
                <FiFilter /> Status
              </label>
              <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100">
                <option value="">Todos os Status</option>
                <option value="aberto">Abertos</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluidos</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>

            <div className="rounded-[26px] border border-stone-200/80 bg-white/70 p-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-stone-400">
                <FiBriefcase /> Cliente
              </label>
              <select value={clienteId} onChange={(e) => { setClienteId(e.target.value); setPage(1); }} className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100">
                <option value="">Todos os Clientes</option>
                {clientes.map((c) => (
                  <option key={c._id} value={c._id}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div className="rounded-[26px] border border-stone-200/80 bg-white/70 p-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-stone-400">
                <FiCalendar /> Data inicial
              </label>
              <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
            </div>

            <div className="rounded-[26px] border border-stone-200/80 bg-white/70 p-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-stone-400">
                <FiCalendar /> Data final
              </label>
              <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
            </div>

            <div className="rounded-[26px] border border-dashed border-orange-200 bg-orange-50/60 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-orange-500">Pagina atual</p>
              <p className="mt-3 text-4xl font-black tracking-tight text-slate-800">{page}</p>
              <p className="mt-2 text-sm text-stone-500">de {Math.max(totalPages, 1)} paginas</p>
            </div>
          </div>
        </section>

        <section className="mt-6 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <ChamadoSkeleton key={i} />)}
            </div>
          ) : (
            <>
              {chamados.map((chamado) => (
                <article key={chamado._id} className="surface-card rounded-[30px] p-6 transition-transform hover:-translate-y-1">
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${getStatusColor(chamado.status)}`}>
                          {chamado.status.replace('_', ' ')}
                        </span>
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase text-stone-500">
                          Prioridade {chamado.priority || 'media'}
                        </span>
                      </div>

                      <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-800">{chamado.title}</h2>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                        {chamado.description || 'Sem descricao detalhada.'}
                      </p>

                      <div className="mt-5 grid gap-3 text-sm text-stone-500 md:grid-cols-3">
                        <div className="rounded-2xl bg-white/60 px-4 py-3"><span className="inline-flex items-center gap-2"><FiBriefcase /> Cliente: {chamado.cliente?.nome || 'Nao informado'}</span></div>
                        <div className="rounded-2xl bg-white/60 px-4 py-3"><span className="inline-flex items-center gap-2"><FiUser /> Usuario: {chamado.user?.name || 'Nao informado'}</span></div>
                        <div className="rounded-2xl bg-white/60 px-4 py-3"><span className="inline-flex items-center gap-2"><FiCalendar /> {new Date(chamado.createdAt).toLocaleDateString()}</span></div>
                      </div>
                    </div>

                    <div className="w-full xl:w-[280px]">
                      <div className="rounded-[26px] border border-stone-200/80 bg-white/65 p-4">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Alterar status</label>
                        <select value={chamado.status} onChange={(e) => handleStatusChange(chamado._id, e.target.value)} className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100">
                          <option value="aberto">Aberto</option>
                          <option value="em_andamento">Em Andamento</option>
                          <option value="concluido">Concluido</option>
                          <option value="cancelado">Cancelado</option>
                        </select>

                        <div className="mt-4">
                          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Anexos</p>
                          <div className="flex flex-wrap gap-2">
                            {chamado.attachments?.length > 0 ? chamado.attachments.map((file, idx) => (
                              <a key={idx} href={buildUploadUrl(file)} target="_blank" rel="noreferrer" className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-orange-700 transition hover:border-orange-200 hover:bg-orange-50">
                                <FiExternalLink size={16} />
                              </a>
                            )) : <span className="text-sm italic text-stone-400">Nenhum anexo</span>}
                          </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-3">
                          <Link to={`/chamados/${chamado._id}`} className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800">
                            Ver detalhes
                          </Link>
                          {isAdmin && (
                            <button onClick={() => handleDelete(chamado._id)} className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-100">
                              <span className="inline-flex items-center gap-2">
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
                <div className="surface-card rounded-[30px] px-6 py-14 text-center">
                  <p className="text-lg font-semibold text-slate-700">Nenhum chamado encontrado.</p>
                  <p className="mt-2 text-sm text-stone-500">Ajuste os filtros ou cadastre um novo atendimento.</p>
                </div>
              )}

              <div className="surface-card flex items-center justify-center gap-4 rounded-[28px] px-5 py-4">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-2xl border border-stone-200 bg-white/70 p-3 text-stone-600 transition hover:border-orange-200 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-30">
                  <FiChevronLeft size={20} />
                </button>
                <span className="text-sm font-bold text-stone-600">Pagina {page} de {Math.max(totalPages, 1)}</span>
                <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)} className="rounded-2xl border border-stone-200 bg-white/70 p-3 text-stone-600 transition hover:border-orange-200 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-30">
                  <FiChevronRight size={20} />
                </button>
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
