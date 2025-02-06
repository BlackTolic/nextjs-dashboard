'use client';

import { lusitana } from '@/app/ui/fonts';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';
import StockDetailModal from '@/app/ui/stock-pool/stock-detail-modal';
import SeniorTable from '@/app/ui/components/senior-table';
import { getStocks, getAllStocks } from '@/app/lib/db/stock/stock-list';
import { stockPoolColumns, StockInfo } from './constant';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState({ code: '', name: '' });
  const [tableList, setTableList] = useState<StockInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // 分页配置
  const [pageConfig, setPageConfig] = useState({
    total: 0, // 添加总数
    current: 1, // 将 page 改为 current
    pageSize: 50,
    pageSizes: [50, 100, 200],
    service: false
  });

  const handleOpenModal = (code: string, name: string) => {
    setSelectedStock({ code, name });
    setIsModalOpen(true);
  };

  const fetchData = async (page = 1) => {
    try {
      setIsLoading(true);
      setCurrentPage(page);
      const data = await getAllStocks();
      const stockList =
        data?.data?.map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          market: item.market,
          industry: item.industry,
          listingDate: item.listing_date,
          totalShare: item.total_share,
          circulatingShare: item.circulating_share,
          totalMarketValue: item.total_market_value,
          circulatingMarketValue: item.circulating_market_value
        })) ?? [];
      setTableList(stockList);
      console.log(stockList, 'stockList');
      // setPageConfig(prev => ({
      //   ...prev,
      //   total: Number(data.pagination.total),
      //   current: page
      // }));
    } catch (error) {
      console.error('获取股票数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changePage = (page: number, pageSize: number) => {
    setPageConfig(prev => ({
      ...prev,
      pageSize
    }));
    console.log(pageConfig, 'pageConfig');
  };

  useEffect(() => {
    fetchData(currentPage);
  }, []);

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
          {/* Suspense 只能在服务的组件中使用 */}
          {/* <Suspense key={query + currentPage} fallback={<StockTableSkeleton />}> */}
          <SeniorTable<StockInfo>
            isOpenSearchFilter
            columns={stockPoolColumns}
            dataSource={tableList}
            rowKey="symbol"
            onPageChange={changePage}
            pageConfig={pageConfig}
            loading={isLoading}
            onRow={(record: StockInfo) => ({
              onClick: () => handleOpenModal(record.symbol, record.name)
            })}
          />
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
