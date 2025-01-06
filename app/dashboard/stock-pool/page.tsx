'use client';

import { lusitana } from "@/app/ui/fonts";
import { ChartBarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import StockDetailModal from '@/app/ui/stock-pool/stock-detail-modal';
import Pagination from '@/app/ui/invoices/pagination';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState({ code: '', name: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10);

  const handleOpenModal = (code: string, name: string) => {
    setSelectedStock({ code, name });
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl flex items-center gap-2`}>
          <ChartBarIcon className="w-6 h-6" />
          股票池
        </h1>
      </div>
      
      <div className="mt-4 rounded-lg bg-gray-50 p-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="搜索股票代码或名称..."
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    股票代码
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    股票名称
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最新价
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    涨跌幅
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    600000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    浦发银行
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ¥7.23
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      +2.45%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => handleOpenModal('600000', '浦发银行')}
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    000001
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    平安银行
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ¥12.56
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      -1.25%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900">
                      查看详情
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
      
      <StockDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stockCode={selectedStock.code}
        stockName={selectedStock.name}
      />
    </div>
  );
}