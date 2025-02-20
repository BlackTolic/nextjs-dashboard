'use server';
import { lusitana } from '@/app/ui/fonts';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SubscriptionCard from '@/app/ui/components/card/subscription-card';
import { Button } from '@/app/ui/button';
import { pollXueqiuStocksList, crawlXueqiuStocksList } from '@/app/crawler/stock-crawler';
import { getUserSubscriptions } from '@/app/lib/db/stock/subscription';
import { redirect } from 'next/navigation';
import Search from '@/app/ui/search';
// import { useEffect, useState } from 'react';
// import { redirect } from '@heroui/react';

const handleTestx = async function () {
  'use server';
  console.log(8888);
};

const handlePolling = async function () {
  'use server';
  try {
    console.log('开始轮询更新...');
    const stocks = await pollXueqiuStocksList();
    console.log('轮询更新结果:', stocks);
  } catch (error) {
    console.error('轮询更新失败:', error);
  }
};

// 搜索 action
async function handleSearch(formData: FormData) {
  'use server';
  const searchQuery = formData.get('query')?.toString() || '';
  const params = new URLSearchParams();
  if (searchQuery) {
    params.set('query', searchQuery);
  }
  redirect(`/dashboard/subscriptions?${params.toString()}`);
}

export default async function SubscriptionsPage({ searchParams }: { searchParams?: { query?: string } }) {
  const query = searchParams?.query || '';
  const userId = '410544b2-4001-4271-9855-fec4b6a6442a';

  // 服务端获取订阅数据
  const subscriptions = await getUserSubscriptions(userId);

  // 根据搜索关键词筛选订阅
  const filteredSubscriptions = subscriptions.filter(sub =>
    query
      ? sub.stock_symbol.toLowerCase().includes(query.toLowerCase()) ||
        (sub.stock_name && sub.stock_name.toLowerCase().includes(query.toLowerCase()))
      : true
  );

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl flex items-center gap-2`}>
          <BellIcon className="w-6 h-6" />
          我的订阅
        </h1>
        <div className="flex gap-2">
          <form action={handleTestx}>
            <Button className="flex items-center">获取K线数据</Button>
          </form>
          <form action={handlePolling}>
            <Button className="flex items-center">轮询更新</Button>
          </form>
        </div>
      </div>

      <div className="mt-4 mb-8">
        <Search placeholder="搜索我的订阅..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredSubscriptions.map(subscription => (
          <SubscriptionCard
            key={subscription.stock_symbol}
            subscription={{
              id: subscription.stock_symbol,
              title: subscription.stock_name || subscription.stock_symbol,
              description: subscription.industry || '暂无行业信息'
            }}
          />
        ))}
      </div>
    </div>
  );
}
