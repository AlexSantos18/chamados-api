import React, { useState } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason.trim() || "Motivo não informado");
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiAlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{title || 'Confirmar Exclusão'}</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiX size={24} />
            </button>
          </div>

          <p className="text-gray-600 mb-6">{message || 'Por favor, informe o motivo desta exclusão para fins de auditoria.'}</p>

          <textarea
            autoFocus
            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-red-200 transition-all resize-none text-gray-700"
            rows="3"
            placeholder="Digite o motivo aqui..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 text-white font-bold bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;