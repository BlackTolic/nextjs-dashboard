'use client';

import { useState, useEffect } from 'react';
import { Switch, Checkbox, Input } from '@heroui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { saveSubscriptionSettings, getSubscriptionSettings } from '@/app/lib/actions/subscription';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { updateDescriptMessage } from '@/app/lib/init/scheduler';
import { sendNotificationsToAllSubscribers } from '@/app/lib/actions/notice-descriper';

interface BollLine {
  enabled: boolean;
  offset: number;
}

interface BollPeriod {
  upper: BollLine;
  middle: BollLine;
  lower: BollLine;
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

interface SubscriptionSettingsProps {
  stockSymbol?: string;
}

export default function SubscriptionSettings({ stockSymbol }: SubscriptionSettingsProps) {
  const params = useParams();
  const symbol = stockSymbol || (params.id as string);
  const [loading, setLoading] = useState(true);

  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionForm>({
    isSubscribed: false,
    bollSettings: {
      daily: {
        upper: { enabled: false, offset: 0 },
        middle: { enabled: false, offset: 0 },
        lower: { enabled: false, offset: 0 }
      },
      weekly: {
        upper: { enabled: false, offset: 0 },
        middle: { enabled: false, offset: 0 },
        lower: { enabled: false, offset: 0 }
      },
      monthly: {
        upper: { enabled: false, offset: 0 },
        middle: { enabled: false, offset: 0 },
        lower: { enabled: false, offset: 0 }
      }
    },
    profitLossRatio: {
      buyPrice: 0,
      ratio: 2.0
    }
  });

  const [expandedPeriods, setExpandedPeriods] = useState<Period[]>([]);

  // 获取订阅设置
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const settings = await getSubscriptionSettings(symbol);
        console.log('Fetched settings:', settings);

        if (settings) {
          // 确保数据结构匹配
          setSubscriptionForm({
            isSubscribed: settings.isSubscribed ?? false,
            bollSettings: {
              daily: settings.bollSettings?.daily ?? {
                upper: { enabled: false, offset: 0 },
                middle: { enabled: false, offset: 0 },
                lower: { enabled: false, offset: 0 }
              },
              weekly: settings.bollSettings?.weekly ?? {
                upper: { enabled: false, offset: 0 },
                middle: { enabled: false, offset: 0 },
                lower: { enabled: false, offset: 0 }
              },
              monthly: settings.bollSettings?.monthly ?? {
                upper: { enabled: false, offset: 0 },
                middle: { enabled: false, offset: 0 },
                lower: { enabled: false, offset: 0 }
              }
            },
            profitLossRatio: {
              buyPrice: settings.profitLossRatio?.buyPrice ?? 0,
              ratio: settings.profitLossRatio?.ratio ?? 2.0
            }
          });

          // 检查每个周期是否有勾选项，如果有则展开
          const periodsToExpand = PERIODS.filter(period =>
            LINES.some(line => settings.bollSettings?.[period]?.[line]?.enabled)
          );
          setExpandedPeriods(periodsToExpand);
        }
      } catch (error) {
        console.error('获取订阅设置失败:', error);
        toast.error('获取订阅设置失败');
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchSettings();
    }
  }, [symbol]);

  const handleBollSettingChange = (period: Period, field: string, value: boolean | number, lineType?: Line) => {
    console.log(period, field, value, lineType, 'handleBollSettingChange');
    setSubscriptionForm(prev => {
      if (lineType) {
        return {
          ...prev,
          bollSettings: {
            ...prev.bollSettings,
            [period]: {
              ...prev.bollSettings[period],
              [lineType]: {
                ...prev.bollSettings[period][lineType],
                [field]: value
              }
            }
          }
        };
      }
      return prev;
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

  const switchSubmit = (checked: boolean) => {
    setSubscriptionForm(prev => ({ ...prev, isSubscribed: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subscriptionSettings = {
        stockSymbol: symbol,
        isSubscribed: subscriptionForm.isSubscribed,
        bollSettings: subscriptionForm.bollSettings,
        profitLossRatio: subscriptionForm.profitLossRatio
      };
      console.log(subscriptionSettings, 'subscriptionSettings');
      const result = await saveSubscriptionSettings(subscriptionSettings);

      if (result.success) {
        // await updateDescriptMessage('模板已经更新');
        toast.success('设置保存成功');
      } else {
        toast.error(result.error || '保存失败');
      }
      await sendNotificationsToAllSubscribers();
    } catch (error) {
      toast.error('保存失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 订阅开关 */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">开启订阅</label>
        <Switch color="success" isSelected={subscriptionForm.isSubscribed} onValueChange={switchSubmit} />
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
                    color="success"
                    isSelected={subscriptionForm.bollSettings[period as Period][line as Line].enabled}
                    onChange={event =>
                      handleBollSettingChange(period as Period, 'enabled', event.target.checked, line as Line)
                    }
                  >
                    {line === 'upper' ? '上轨线' : line === 'middle' ? '中轨线' : '下轨线'}
                  </Checkbox>
                  {subscriptionForm.bollSettings[period as Period][line as Line].enabled && (
                    <div className="flex items-center gap-2">
                      <span>偏移:</span>
                      <Input
                        type="number"
                        onChange={e =>
                          handleBollSettingChange(period as Period, 'offset', Number(e.target.value), line as Line)
                        }
                        className="w-20"
                      />
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
