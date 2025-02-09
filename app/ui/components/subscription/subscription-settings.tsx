'use client';

import { useState } from 'react';
import { Switch, Checkbox, Input } from '@heroui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { saveSubscriptionSettings } from '@/app/lib/actions/subscription';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface BollLine {
  enabled: boolean;
  offset: number;
}

interface BollPeriod {
  enabled: boolean;
  lines: {
    upper: BollLine;
    middle: BollLine;
    lower: BollLine;
  };
}

interface SubscriptionForm {
  isSubscribed: boolean;
  bollSettings: {
    daily: BollPeriod;
    weekly: BollPeriod;
    monthly: BollPeriod;
  };
  profitLossRatio: {
    buyPrice: number;
    ratio: number;
  };
}

const PERIODS = ['daily', 'weekly', 'monthly'] as const;
type Period = (typeof PERIODS)[number];

const LINES = ['upper', 'middle', 'lower'] as const;
type Line = (typeof LINES)[number];

export default function SubscriptionSettings() {
  const params = useParams();
  const stockSymbol = params.id as string;

  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionForm>({
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
    },
    profitLossRatio: {
      buyPrice: 0,
      ratio: 2.0 // 默认盈亏比 2:1
    }
  });

  const [expandedPeriods, setExpandedPeriods] = useState<Period[]>([]);

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

  // 展开或折叠某个周期
  const togglePeriod = (period: Period) => {
    setExpandedPeriods(prev => (prev.includes(period) ? prev.filter(p => p !== period) : [...prev, period]));
  };

  // 处理盈亏比设置变化
  const handleProfitLossChange = (field: 'buyPrice' | 'ratio', value: number) => {
    setSubscriptionForm(prev => ({
      ...prev,
      profitLossRatio: {
        ...prev.profitLossRatio,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subscriptionSettings = {
        stockSymbol,
        isSubscribed: subscriptionForm.isSubscribed,
        bollSettings: subscriptionForm.bollSettings,
        profitLossRatio: subscriptionForm.profitLossRatio
      };
      console.log(subscriptionSettings, 'subscriptionSettings');
      const result = await saveSubscriptionSettings(subscriptionSettings);
      if (result.success) {
        toast.success('设置保存成功');
      } else {
        toast.error(result.error || '保存失败');
      }
    } catch (error) {
      toast.error('保存失败，请重试');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 订阅开关 */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">开启订阅</label>
        <Switch
          checked={subscriptionForm.isSubscribed}
          onChange={checked => setSubscriptionForm(prev => ({ ...prev, isSubscribed: checked }))}
        />
      </div>

      {/* BOLL 线设置标题 */}
      <div className="border-b pb-2">
        <h3 className="text-lg font-medium text-gray-900">BOLL线设置</h3>
      </div>

      {/* BOLL 线设置部分 */}
      {PERIODS.map(period => (
        <div key={period} className="space-y-4 border-b pb-4 last:border-b-0">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => togglePeriod(period as Period)}
          >
            <div className="flex items-center gap-2">
              {expandedPeriods.includes(period) ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">
                {period === 'daily' ? '日线' : period === 'weekly' ? '周线' : '月线'} BOLL
              </span>
            </div>
          </div>

          {expandedPeriods.includes(period) && (
            <div className="ml-6 space-y-3">
              {LINES.map(line => (
                <div key={line} className="flex items-center gap-4">
                  <Checkbox
                    checked={subscriptionForm.bollSettings[period as Period].lines[line as Line].enabled}
                    onChange={checked => handleBollSettingChange(period as Period, 'enabled', checked, line as Line)}
                  >
                    {line === 'upper' ? '上轨线' : line === 'middle' ? '中轨线' : '下轨线'}
                  </Checkbox>
                  {subscriptionForm.bollSettings[period as Period].lines[line as Line].enabled && (
                    <div className="flex items-center gap-2">
                      <span>偏移:</span>
                      <Input
                        type="number"
                        value={subscriptionForm.bollSettings[period as Period].lines[line as Line].offset}
                        onChange={e =>
                          handleBollSettingChange(period as Period, 'offset', Number(e.target.value), line as Line)
                        }
                        className="w-20"
                        min={-10}
                        max={10}
                        step={0.1}
                      />
                      <span>σ</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* 盈亏比设置 */}
      <div className="border-t pt-6">
        <div className="border-b pb-2">
          <h3 className="text-lg font-medium text-gray-900">盈亏比设置</h3>
        </div>

        <div className="mt-4 space-y-4">
          {/* 买入价格设置 */}
          <div className="flex items-center gap-4">
            <label className="w-24 text-sm font-medium">买入价格</label>
            <Input
              type="number"
              value={subscriptionForm.profitLossRatio.buyPrice}
              onChange={e => handleProfitLossChange('buyPrice', Number(e.target.value))}
              className="w-32"
              min={0}
              step={0.01}
              placeholder="输入买入价格"
            />
          </div>

          {/* 盈亏比设置 */}
          <div className="flex items-center gap-4">
            <label className="w-24 text-sm font-medium">盈亏比</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={subscriptionForm.profitLossRatio.ratio}
                onChange={e => handleProfitLossChange('ratio', Number(e.target.value))}
                className="w-20"
                min={0.1}
                max={10}
                step={0.1}
              />
              <span className="text-sm text-gray-500">: 1</span>
            </div>
          </div>

          {/* 计算结果展示 */}
          {subscriptionForm.profitLossRatio.buyPrice > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2 text-sm">
                <p>
                  止损价格:{' '}
                  {(
                    subscriptionForm.profitLossRatio.buyPrice -
                    subscriptionForm.profitLossRatio.buyPrice * 0.1
                  ).toFixed(2)}
                </p>
                <p>
                  目标价格:{' '}
                  {(
                    subscriptionForm.profitLossRatio.buyPrice +
                    subscriptionForm.profitLossRatio.buyPrice * 0.1 * subscriptionForm.profitLossRatio.ratio
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          保存设置
        </button>
      </div>
    </form>
  );
}
