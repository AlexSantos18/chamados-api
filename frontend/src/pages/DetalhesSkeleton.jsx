import React from 'react';

const DetalhesSkeleton = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen animate-pulse">
      <div className="max-w-5xl mx-auto">
        {/* Botão Voltar */}
        <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de Informações do Chamado */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div className="h-9 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-3 mb-8">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="pt-6 border-t border-gray-100">
                <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-3">
                  <div className="h-12 w-32 bg-gray-100 rounded-lg"></div>
                  <div className="h-12 w-32 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Card de Notas Internas */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="h-7 w-48 bg-gray-200 rounded mb-6"></div>
              <div className="h-28 bg-gray-50 rounded-lg mb-4"></div>
              <div className="space-y-4">
                <div className="h-20 bg-gray-100 rounded-lg"></div>
                <div className="h-20 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="h-4 w-40 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="h-4 w-40 bg-gray-200 rounded mb-4"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesSkeleton;