import React from 'react';
import { StockPoolColumn } from '@/app/dashboard/stock-pool/constant';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';

// 定义组件的属性接口
interface StockTableProps {
  onOpenModal: (code: string, name: string) => void; // 打开详情模态框的回调函数
  stockPoolColumns: StockPoolColumn[]; // 表格列的配置数组
  tableList: any[]; // 股票数据列表
  onToggleSubscribe?: (code: string) => void; // 切换订阅状态的回调函数（可选）
  subscribedStocks?: string[]; // 已订阅的股票代码数组（可选）
  setOptimisticSubscribed?: (codes: string[]) => void;
}

export default function StockTable(props: StockTableProps) {
  const {
    stockPoolColumns,
    onOpenModal,
    tableList,
    subscribedStocks = [],
    onToggleSubscribe,
    setOptimisticSubscribed,
  } = props;

  // 添加收藏按钮点击处理函数
  const handleSubscribeClick = (code: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (onToggleSubscribe) {
      // 添加按钮缩放动画类
      const button = event.currentTarget as HTMLButtonElement;
      button.classList.add('scale-125');
      setTimeout(() => button.classList.remove('scale-125'), 200);

      // 在调用 onToggleSubscribe 之前进行乐观更新
      if (setOptimisticSubscribed) {
        const isCurrentlySubscribed = subscribedStocks.includes(code);
        const newSubscribedStocks = isCurrentlySubscribed
          ? subscribedStocks.filter((stock) => stock !== code)
          : [...subscribedStocks, code];
        setOptimisticSubscribed(newSubscribedStocks);
      }

      onToggleSubscribe(code);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* 表头部分 */}
        <thead className="bg-gray-50">
          <tr>
            {/* 渲染配置的表格列 */}
            {stockPoolColumns.map((column: StockPoolColumn) => (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                key={column.dataIndex}
              >
                {column.title}
              </th>
            ))}
            {/* 操作列 */}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              操作
            </th>
          </tr>
        </thead>
        {/* 表格主体部分 */}
        <tbody className="bg-white divide-y divide-gray-200">
          {tableList.map((item: any) => (
            <tr key={item.symbol} className="hover:bg-gray-50 transition-colors duration-200">
              {/* 渲染每行数据 */}
              {stockPoolColumns.map((column: StockPoolColumn) => (
                <td
                  key={column.dataIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {item[column.dataIndex]}
                </td>
              ))}
              {/* 操作按钮列 */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-4">
                {/* 查看详情按钮 */}
                <button
                  className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                  onClick={() => onOpenModal(item.symbol, item.name)}
                >
                  查看详情
                </button>
                {/* 订阅/取消订阅按钮 */}
                <button
                  onClick={(e) => handleSubscribeClick(item.symbol, e)}
                  className={clsx(
                    'transition-all duration-200 ease-in-out',
                    'hover:scale-110 active:scale-95',
                    'focus:outline-none'
                  )}
                  title={subscribedStocks.includes(item.symbol) ? '取消收藏' : '添加收藏'}
                >
                  {subscribedStocks.includes(item.symbol) ? (
                    <StarIconSolid className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <StarIconOutline className="w-6 h-6 text-gray-500 hover:text-yellow-500" />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
