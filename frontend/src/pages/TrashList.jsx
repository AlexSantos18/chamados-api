import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiTrash2, FiRefreshCcw, FiClock, FiUser, FiFileText } from 'react-icons/fi';

const TrashList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiTrash2 className="text-red-500" /> Lixeira de Auditoria
          </h1>
          <p className="text-gray-500 mt-2">Gerencie notas excluídas e realize a restauração de dados se necessário.</p>
        </header>

        {loading ? (
          <div className="text-center p-20 text-gray-400 animate-pulse">Consultando lixeira...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map(item => (
              <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 text-blue-600 font-semibold text-sm">
                    <FiFileText /> Chamado: {item.chamado?.title || 'Chamado excluído'}
                  </div>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg italic border-l-4 border-gray-300">
                    "{item.text}"
                  </p>
                  
                  <div className="mt-3 p-2 bg-red-50 rounded border border-red-100">
                    <span className="text-[10px] font-bold text-red-400 uppercase block">Motivo do Log:</span>
                    <p className="text-xs text-red-700 font-medium">{item.reason}</p>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-gray-400 uppercase">Autor Original</span>
                      <div className="flex items-center gap-1">
                        <FiUser /> {item.author?.name} ({item.author?.email})
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-gray-400 uppercase">Excluído Por</span>
                      <div className="flex items-center gap-1">
                        <FiUser className="text-red-400" /> {item.deletedBy?.name}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-48 flex flex-col justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                  <div className="text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1 mb-1">
                      <FiClock /> Excluído em:
                    </div>
                    <div className="font-medium text-gray-600">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRestore(item._id)}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md shadow-green-100"
                  >
                    <FiRefreshCcw /> Restaurar
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="bg-white p-16 text-center rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">A lixeira está vazia.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashList;
