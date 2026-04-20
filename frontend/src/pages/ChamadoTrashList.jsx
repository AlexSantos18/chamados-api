import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiTrash, FiRefreshCcw, FiAlertTriangle, FiUser, FiCalendar, FiArchive, FiSearch, FiFilter } from 'react-icons/fi';

const ChamadoTrashList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FiArchive className="text-orange-500" /> Lixeira de Chamados
              </h1>
              <p className="text-gray-500 mt-2">Visualize e gerencie chamados removidos. Você pode restaurá-los ou aplicar a exclusão definitiva.</p>
            </div>

            <div className="flex flex-wrap gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md border focus-within:ring-2 focus-within:ring-blue-200">
                <FiSearch className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por título..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-sm outline-none w-40"
                />
              </div>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md border">
                <FiFilter className="text-gray-400" />
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent text-sm outline-none cursor-pointer text-gray-700"
                >
                  <option value="">Todos os Status</option>
                  <option value="aberto">Originalmente Aberto</option>
                  <option value="em_andamento">Originalmente Em Andamento</option>
                  <option value="concluido">Originalmente Concluído</option>
                  <option value="cancelado">Originalmente Cancelado</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="text-center p-20 text-gray-400 animate-pulse">Carregando itens excluídos...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {items.map(item => (
              <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between gap-6 border-l-8 border-l-orange-200">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{item.data.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.data.description || 'Sem descrição.'}</p>
                  
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100 flex items-start gap-2">
                    <FiAlertTriangle className="text-orange-400 mt-1 flex-shrink-0" size={14} />
                    <p className="text-xs text-orange-800 font-medium"><span className="font-bold">Motivo da Exclusão:</span> {item.reason}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-orange-400" /> 
                      <span><strong>Excluído por:</strong> {item.deletedBy?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar /> 
                      <span><strong>Data da Exclusão:</strong> {new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="md:w-64 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                  <button
                    onClick={() => handleRestore(item._id)}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-700 transition-colors"
                  >
                    <FiRefreshCcw /> Restaurar Chamado
                  </button>
                  
                  <button
                    onClick={() => handleHardDelete(item._id)}
                    className="flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 py-2 px-4 rounded-lg font-bold hover:bg-red-50 transition-colors"
                  >
                    <FiAlertTriangle /> Excluir Definitivo
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="bg-white p-20 text-center rounded-xl border-2 border-dashed border-gray-200">
                <FiArchive size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium text-lg">A lixeira de chamados está limpa.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChamadoTrashList;