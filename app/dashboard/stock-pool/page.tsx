'use client';

import { lusitana } from '@/app/ui/fonts';
import { ChartBarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';
import StockDetailModal from '@/app/ui/stock-pool/stock-detail-modal';
import Pagination from '@/app/ui/components/pagination';
// import { tickerSearchByKeywords } from "@/app/api/stock";
// import { stockPoolColumns } from './constant';
import SeniorTable from '@/app/ui/components/senior-table';
import type { SeniorTableProps } from '@/app/ui/components/senior-table';
import { StockTableSkeleton } from '@/app/ui/skeletons';
import { getStocks } from '@/app/lib/db/stock/stock-list';
import { stockPoolColumns, StockInfo } from './constant';
import { useSearchParams, useRouter } from 'next/navigation';
import { toggleStockSubscription } from '@/app/lib/actions';
import { useOptimistic, startTransition } from 'react';

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState({ code: '', name: '' });
  const [totalPages, setTotalPages] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const query = searchParams.get('query') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [tableList, setTableList] = useState<StockInfo[]>([]);
  const prevSearchKeywordRef = useRef('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscribedStocks, setSubscribedStocks] = useState<string[]>([]);

  // 使用 optimistic UI 更新订阅状态
  // 当用户点击订阅按钮时，立即更新 UI，不等待服务器响应
  const [optimisticSubscribed, addOptimisticSubscribe] = useOptimistic(subscribedStocks);

  const handleOpenModal = (code: string, name: string) => {
    setSelectedStock({ code, name });
    setIsModalOpen(true);
  };

  const handleSearch = async (value: string) => {
    if (value.trim() && value !== prevSearchKeywordRef.current) {
      prevSearchKeywordRef.current = value;
      // const response = await tickerSearchByKeywords(value);
      // console.log(response, "response");
      // const results = await response.json();
      // setSearchResults(response);
    }
  };

  // 处理订阅/取消订阅的点击事件
  const handleToggleSubscribe = async (stockCode: string) => {
    try {
      startTransition(() => {
        addOptimisticSubscribe((state: string[]) =>
          state.includes(stockCode)
            ? state.filter(code => code !== stockCode)
            : [...state, stockCode]
        );
      });

      const list = await toggleStockSubscription(stockCode);
      setSubscribedStocks(list);
    } catch (error) {
      console.error('订阅切换失败:', error);
      setSubscribedStocks(subscribedStocks);
    }
  };

  // const handleToggleSubscribe = (code: string) => {
  //   console.log(code, 999);
  //   setSubscribedStocks((prev) =>
  //     prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
  //   );
  // };

  const fetchData = async (page = 1) => {
    try {
      setIsLoading(true);
      setCurrentPage(page);
      const data = await getStocks(page, 10);
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
      console.log(stockList, 'stockList');
      setTableList(stockList);
      const totalPages = Math.ceil(Number(data.pagination.total) / 10);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('获取股票数据失败:', error);
    } finally {
      setIsLoading(false);
    }
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
          {/* <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="搜索股票代码或名称..."
              onChange={(e) => setSearchKeyword(e.target.value)}
              onBlur={() => handleSearch(searchKeyword)}
            />
          </div> */}
          {/* Suspense 只能在服务的组件中使用 */}
          {/* <Suspense key={query + currentPage} fallback={<StockTableSkeleton />}> */}
          {isLoading ? (
            <StockTableSkeleton />
          ) : (
            <SeniorTable<StockInfo>
              isOpenSearchFilter
              columns={stockPoolColumns}
              dataSource={tableList}
              rowKey="symbol"
              onRow={(record: StockInfo) => ({
                onClick: () => handleOpenModal(record.symbol, record.name)
              })}
              operations={[
                {
                  key: 'subscribe',
                  label: (record: StockInfo) =>
                    optimisticSubscribed.includes(record.symbol) ? '取消订阅' : '订阅',
                  onClick: (record: StockInfo) => handleToggleSubscribe(record.symbol)
                }
              ]}
            />
          )}
          {/* </Suspense> */}

          {/* <div className="mt-5 flex w-full justify-center">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              baseUrl="/dashboard/stock-pool"
              queryParams={{
                query: searchParams.get('query') || '',
              }}
              onPageChange={(page) => {
                console.log(page, 999);
                fetchData(page);
                router.push(`/dashboard/stock-pool`);
              }}
            />
          </div> */}
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
