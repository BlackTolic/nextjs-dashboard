'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';
import { PencilIcon } from '@heroicons/react/24/outline';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CandlestickChart from '@/app/ui/components/charts/candlestick-chart';
import { Tabs, Tab } from '@heroui/react';

export default function EditSubscriptionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const title = searchParams.get('title');

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: '我的订阅', href: '/dashboard/subscriptions' },
          {
            label: title || '',
            href: `/dashboard/subscriptions/${id}/edit`,
            active: true
          }
        ]}
      />
      <div className="mt-4">
        <Tabs destroyInactiveTabPanel={false}>
          <Tab key="info" title="基本信息">
            <div className="mt-4 rounded-lg bg-gray-50 p-6">
              <div className="flex flex-col gap-4">
                {/* 编辑表单内容 */}
                {/* <p>编辑订阅 ID: {id}</p> */}
                {/* 这里添加编辑表单的具体实现 */}
                暂无，待新增
              </div>
            </div>
          </Tab>
          <Tab key="kline" title="K线图">
            <div className="mt-4">
              <CandlestickChart symbol={id} title={title || ''} />
            </div>
          </Tab>
          <Tab key="trades" title="订阅">
            <div className="mt-4 rounded-lg bg-gray-50 p-6">1{/* 交易记录内容 */}</div>
          </Tab>
          <Tab key="bus" title="基本面">
            <div className="mt-4 rounded-lg bg-gray-50 p-6">2{/* 交易记录内容 */}</div>
          </Tab>
          <Tab key="note" title="笔记">
            <div className="mt-4 rounded-lg bg-gray-50 p-6">3{/* 交易记录内容 */}</div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
