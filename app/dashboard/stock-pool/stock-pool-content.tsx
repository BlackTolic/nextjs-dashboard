'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import StockDetailModal from '@/app/ui/stock-pool/stock-detail-modal';
import SeniorTable from '@/app/ui/components/senior-table';
import { getAllStocks } from '@/app/lib/db/stock/stock-list';
import { stockPoolColumns, StockInfo } from './constant';
import { addSubscription, removeSubscription, getUserSubscriptions } from '@/app/lib/db/stock/subscription';

export default function StockPoolContent() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState({ code: '', name: '' });
  const [tableList, setTableList] = useState<StockInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subscribedStocks, setSubscribedStocks] = useState<string[]>([]);
  const [pageConfig, setPageConfig] = useState({
    total: 0,
    current: 1,
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
  };

  const handleSubscribe = async (record: StockInfo) => {
    try {
      const userId = '410544b2-4001-4271-9855-fec4b6a6442a';
      const isSubscribed = subscribedStocks.includes(record.symbol);
      const result = isSubscribed
        ? await removeSubscription(userId, record.symbol)
        : await addSubscription(userId, record.symbol);
      if (result.success) {
        const newSubscribed = isSubscribed
          ? subscribedStocks.filter(code => code !== record.symbol)
          : [...subscribedStocks, record.symbol];
        setSubscribedStocks(newSubscribed);
      }
    } catch (error) {
      console.error('订阅操作失败:', error);
    }
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const userId = '410544b2-4001-4271-9855-fec4b6a6442a';
        const subscriptions = await getUserSubscriptions(userId);
        setSubscribedStocks(subscriptions.map(sub => sub.stock_symbol));
      } catch (error) {
        console.error('获取订阅列表失败:', error);
      }
    };

    fetchSubscriptions();
    fetchData(currentPage);
  }, [currentPage]);

  return (
    <div className="mt-4 rounded-lg bg-gray-50 p-6">
      <div className="flex flex-col gap-4">
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
          subscribed={subscribedStocks}
          onSubscribe={handleSubscribe}
        />
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
