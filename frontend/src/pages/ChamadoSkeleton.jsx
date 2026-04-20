import React from 'react';

const ChamadoSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
            <div className="h-7 w-2/3 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-4 bg-gray-100 rounded"></div>
            <div className="h-4 bg-gray-100 rounded"></div>
            <div className="h-4 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div className="md:w-56 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 flex flex-col gap-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded mt-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default ChamadoSkeleton;