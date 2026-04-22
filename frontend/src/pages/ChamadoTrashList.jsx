import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiTrash, FiRefreshCcw, FiAlertTriangle, FiUser, FiCalendar, FiArchive, FiSearch, FiFilter, FiInfo } from 'react-icons/fi';
import { useAuth } from '../AuthContext';

const ChamadoTrashList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
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

  const handleRestore = async (id) => {
    try {
      await api.post(`/trash/tickets/${id}/restore`);
      toast.success('Chamado restaurado com sucesso!');
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao restaurar chamado');
    }
  };

  const handleHardDelete = async (id) => {
    if (!window.confirm('ATENÇÃO: Esta ação é irreversível. O chamado será apagado permanentemente. Continuar?')) return;

    try {
      await api.delete(`/trash/tickets/${id}/hard`);
      toast.success('Chamado excluído permanentemente.');
      fetchTrash();
    } catch (err) {
      toast.error('Erro ao excluir permanentemente');
    }
  };

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-7xl">
        <section className="surface-card slide-up rounded-[34px] p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-400">Arquivados</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-stone-700 to-stone-900 text-white shadow-lg">
                  <FiArchive size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">Lixeira de chamados</h1>
                  <p className="mt-1 text-sm text-stone-500">Recupere atendimentos seus que foram removidos.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[26px] border border-stone-200 bg-white p-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                <FiSearch /> Pesquisar título
              </label>
              <input 
                type="text" 
                placeholder="Buscar chamado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="rounded-[26px] border border-stone-200 bg-white p-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                <FiFilter /> Status Original
              </label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              >
                <option value="">Todos os Status</option>
                <option value="aberto">Aberto</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="text-center p-20 text-gray-400 animate-pulse">Carregando itens excluídos...</div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map(item => (
              <article key={item._id} className="surface-card rounded-[30px] p-6 transition-transform hover:-translate-y-1">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-black tracking-tight text-slate-800">{item.data.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-stone-600 line-clamp-2">
                      {item.data.description || 'Sem descrição detalhada.'}
                    </p>
                  
                    <div className="mt-4 p-4 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-start gap-3">
                      <FiAlertTriangle className="text-orange-500 mt-0.5 flex-shrink-0" size={16} />
                      <p className="text-sm text-orange-900 leading-6"><span className="font-bold">Motivo:</span> {item.reason}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-4 text-[11px] text-stone-500 uppercase tracking-tighter">
                      <div className="flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2">
                        <FiCalendar /> {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="w-full xl:w-[260px] flex flex-col gap-3">
                      <button
                        onClick={() => handleRestore(item._id)}
                        className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 px-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                      >
                        <FiRefreshCcw /> Restaurar
                      </button>
                      
                      <button
                        onClick={() => handleHardDelete(item._id)}
                        className="flex items-center justify-center gap-2 bg-white text-rose-600 border border-rose-200 py-3 px-4 rounded-2xl font-bold hover:bg-rose-50 transition-all"
                      >
                        <FiTrash /> Excluir definitivo
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}

            {items.length === 0 && !loading && (
              <div className="surface-card rounded-[30px] p-20 text-center">
                <FiInfo size={48} className="mx-auto text-stone-200 mb-4" />
                <p className="text-stone-400 font-bold text-lg">A lixeira está vazia.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChamadoTrashList;