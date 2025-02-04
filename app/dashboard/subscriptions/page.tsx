'use client';

import { lusitana } from '@/app/ui/fonts';
import { BellIcon } from '@heroicons/react/24/outline';
import SubscriptionCard from '@/app/ui/components/card/subscription-card';
import { subscriptions } from '@/app/ui/components/card/constant';
import { Button } from '@/app/ui/button';
import { updateStocksFromXueqiu } from '@/app/lib/db/stock/stock-list';
import SeniorTable from '@/app/ui/components/senior-table';
import dynamic from 'next/dynamic';
import { pollXueqiuStocksList, crawlXueqiuStocksList, batchGetStockKline } from '@/app/crawler/stock-crawler';
import { useEffect, useState } from 'react';
import { getUserSubscriptions } from '@/app/lib/db/stock/subscription';

const Subscriptions = () => {
  const [subscribedStocks, setSubscribedStocks] = useState<string[]>([]);

  const handleTest = async () => {
    try {
      const stocks = await crawlXueqiuStocksList();
      console.log('抓取到的股票数据:', stocks);
    } catch (error) {
      console.error('测试抓取失败:', error);
    }
  };

  const handlePolling = async () => {
    try {
      console.log('开始轮询更新...');
      const stocks = await pollXueqiuStocksList();
      console.log('轮询更新结果:', stocks);
    } catch (error) {
      console.error('轮询更新失败:', error);
    }
  };

  const handleTestx = async () => {
    try {
      const stocks = await batchGetStockKline(['SZ000333', 'SH600000'], 'week', -199);
      console.log('抓取到的股票数据:', stocks);
    } catch (error) {
      console.error('测试抓取失败:', error);
    }
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        // todo
        const userId = '410544b2-4001-4271-9855-fec4b6a6442a';
        const subscriptions = await getUserSubscriptions(userId);
        setSubscribedStocks(subscriptions.map(sub => sub.stock_symbol));
        console.log(subscriptions, 'subscriptions');
      } catch (error) {
        console.error('获取订阅列表失败:', error);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl flex items-center gap-2`}>
          <BellIcon className="w-6 h-6" />
          我的订阅
        </h1>
        <div className="flex gap-2">
          <Button className="flex items-center" onClick={handleTest}>
            获取单页股票列表
          </Button>
          <Button className="flex items-center" onClick={handleTestx}>
            批量获取多个股票的K线数据
          </Button>
          <Button className="flex items-center" onClick={handlePolling}>
            轮询更新
          </Button>
        </div>
      </div>
      <div className="mt-4 mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索订阅..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Subscription cards */}
      <div className="flex flex-wrap gap-4">
        {subscriptions.map(sub => (
          <SubscriptionCard
            key={sub.id}
            subscription={{
              id: sub.id,
              title: sub.title,
              description: sub.description,
              maxValue: sub.maxValue,
              minValue: sub.minValue,
              selectedOptions: {
                showMaxValue: true,
                showMinValue: true,
                showChart: false
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
