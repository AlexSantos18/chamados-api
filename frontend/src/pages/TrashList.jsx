import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiTrash2, FiRefreshCcw, FiClock, FiUser, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../AuthContext';

const TrashList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleRestore = async (id) => {
    try {
      await api.post(`/trash/${id}/restore`);
      toast.success('Comentário restaurado com sucesso!');
      fetchTrash();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Erro ao restaurar item';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-7xl">
        <section className="surface-card slide-up rounded-[34px] p-6 md:p-8 mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-400">Auditoria</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg">
              <FiTrash2 size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">Lixeira de notas</h1>
              <p className="mt-1 text-sm text-stone-500">Notas e observações removidas dos seus atendimentos.</p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="text-center p-20 text-stone-400 animate-pulse font-bold">Consultando lixeira...</div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <article key={item._id} className="surface-card rounded-[30px] p-6 transition-transform hover:-translate-y-1">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4 text-sky-600 font-bold text-sm uppercase">
                    <FiFileText /> Chamado: {item.chamado?.title || 'Chamado excluído'}
                  </div>
                  <blockquote className="text-slate-700 bg-stone-50 p-5 rounded-2xl italic border-l-4 border-orange-400 text-sm leading-7">
                    "{item.text}"
                  </blockquote>
                  
                  <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <span className="text-[10px] font-bold text-rose-500 uppercase block mb-1">Motivo do descarte:</span>
                    <p className="text-xs text-rose-800 font-medium">{item.reason}</p>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-6 text-[11px] text-stone-500">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-orange-500" />
                      <span><strong>Autor:</strong> {item.author?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock />
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="w-full xl:w-[200px] flex items-center">
                    <button
                      onClick={() => handleRestore(item._id)}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 px-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg"
                    >
                      <FiRefreshCcw /> Restaurar
                    </button>
                  </div>
                )}
                </div>
              </article>
            ))}

            {items.length === 0 && !loading && (
              <div className="surface-card rounded-[30px] p-20 text-center">
                <FiAlertCircle size={48} className="mx-auto text-stone-200 mb-4" />
                <p className="text-stone-400 font-bold text-lg">Sua lixeira de notas está vazia.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashList;
