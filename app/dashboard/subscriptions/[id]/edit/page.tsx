'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';
import { PencilIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CandlestickChart from '@/app/ui/components/charts/candlestick-chart';
import { Tabs, Tab, Switch, Checkbox, Input } from '@heroui/react';
import { useState } from 'react';
import SubscriptionSettings from '@/app/ui/components/subscription/subscription-settings';

export default function EditSubscriptionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const title = searchParams.get('title');

  // 添加状态管理
  const [subscriptionForm, setSubscriptionForm] = useState({
    isSubscribed: false,
    bollSettings: {
      daily: {
        enabled: false,
        lines: {
          upper: { enabled: true, offset: 2 },
          middle: { enabled: true, offset: 0 },
          lower: { enabled: true, offset: -2 }
        }
      },
      weekly: {
        enabled: false,
        lines: {
          upper: { enabled: true, offset: 2 },
          middle: { enabled: true, offset: 0 },
          lower: { enabled: true, offset: -2 }
        }
      },
      monthly: {
        enabled: false,
        lines: {
          upper: { enabled: true, offset: 2 },
          middle: { enabled: true, offset: 0 },
          lower: { enabled: true, offset: -2 }
        }
      }
    }
  });

  const [expandedPeriods, setExpandedPeriods] = useState<string[]>([]);

  // 处理表单变化
  const handleBollSettingChange = (
    period: 'daily' | 'weekly' | 'monthly',
    field: string,
    value: any,
    lineType?: 'upper' | 'middle' | 'lower'
  ) => {
    setSubscriptionForm(prev => {
      if (lineType) {
        return {
          ...prev,
          bollSettings: {
            ...prev.bollSettings,
            [period]: {
              ...prev.bollSettings[period],
              lines: {
                ...prev.bollSettings[period].lines,
                [lineType]: {
                  ...prev.bollSettings[period].lines[lineType],
                  [field]: value
                }
              }
            }
          }
        };
      }
      return {
        ...prev,
        bollSettings: {
          ...prev.bollSettings,
          [period]: {
            ...prev.bollSettings[period],
            [field]: value
          }
        }
      };
    });
  };

  const togglePeriod = (period: string) => {
    setExpandedPeriods(prev => (prev.includes(period) ? prev.filter(p => p !== period) : [...prev, period]));
  };

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
        <Tabs className="flex flex-col gap-4">
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
            <div className="mt-4 rounded-lg bg-gray-50 p-6">
              <SubscriptionSettings />
            </div>
          </Tab>
          <Tab key="bus" title="基本面">
            <div className="mt-4 rounded-lg bg-gray-50 p-6">暂无，待新增</div>
          </Tab>
          <Tab key="financial" title="财报分析">
            <div className="mt-4 rounded-lg bg-gray-50 p-6">暂无，待新增</div>
          </Tab>
          <Tab key="note" title="笔记">
            <div className="mt-4 rounded-lg bg-gray-50 p-6">暂无，待新增</div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
