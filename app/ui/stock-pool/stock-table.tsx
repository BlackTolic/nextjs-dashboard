'use client';
import React, { useEffect } from 'react';
import { StockPoolColumn } from '@/app/dashboard/stock-pool/constant';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/ui/table';

interface StockTableProps {
  onOpenModal: (code: string, name: string) => void;
  stockPoolColumns: StockPoolColumn[];
  tableList: any[];
}

// 服务的渲染才能使用async
export default function StockTable(props: StockTableProps) {
  const { stockPoolColumns, onOpenModal, tableList } = props;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {stockPoolColumns.map((column: StockPoolColumn) => (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                key={column.dataIndex}
              >
                {column.title}
              </th>
            ))}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableList.map((item: any) => (
            <tr key={item.symbol}>
              {stockPoolColumns.map((column: StockPoolColumn) => (
                <td
                  key={column.dataIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {item[column.dataIndex]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  className="text-blue-600 hover:text-blue-900"
                  onClick={() => onOpenModal('000001', '平安银行')}
                >
                  查看详情
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
