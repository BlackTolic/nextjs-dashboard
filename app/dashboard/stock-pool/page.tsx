'use client';

import { lusitana } from '@/app/ui/fonts';
import { ChartBarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';
import StockDetailModal from '@/app/ui/stock-pool/stock-detail-modal';
import Pagination from '@/app/ui/invoices/pagination';
// import { tickerSearchByKeywords } from "@/app/api/stock";
// import { stockPoolColumns } from './constant';
import StockTable from '@/app/ui/stock-pool/stock-table';
import { StockTableSkeleton } from '@/app/ui/skeletons';
import { getStocks } from '@/app/lib/db/stock/stock-list';
import { stockPoolColumns, StockInfo } from './constant';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState({ code: '', name: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const query = searchKeyword;
  const [searchResults, setSearchResults] = useState([]);
  const [tableList, setTableList] = useState<StockInfo[]>([]);
  const prevSearchKeywordRef = useRef('');

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

  //   console.log(data,555);
  useEffect(() => {
    const fetchStocks = async () => {
      const data = await getStocks();
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
          circulatingMarketValue: item.circulating_market_value,
        })) ?? [];
      setTableList(stockList);
      const totalPages = Math.ceil(Number(data.pagination.total) / 10);
      setTotalPages(totalPages);
    };
    fetchStocks();
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
          <div className="relative">
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
          </div>
          {/* Suspense 只能在服务的组件中使用 */}
          {/* <Suspense key={query + currentPage} fallback={<StockTableSkeleton />}> */}
          <StockTable
            onOpenModal={handleOpenModal}
            stockPoolColumns={stockPoolColumns}
            tableList={tableList}
          />
          {/* </Suspense> */}

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
