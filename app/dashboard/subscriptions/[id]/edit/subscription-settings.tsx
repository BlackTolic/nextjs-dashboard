'use client';

import { useState, useEffect } from 'react';
import { Switch, Checkbox, Input, Button, Radio, RadioGroup } from '@heroui/react'; // 确保导入 RadioGroup 组件
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  saveSubscriptionSettings,
  getSubscriptionSettings,
  SubscriptionItemProp
} from '@/app/lib/actions/subscription';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { taskScheduler } from '@/app/lib/init/scheduler';
import { sendNotificationsToAllSubscribers } from '@/app/lib/actions/notice-descriper';
import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

interface BollLine {
  enabled: boolean;
  offset: number;
}

interface BollPeriod {
  upper: BollLine;
  middle: BollLine;
  lower: BollLine;
}

const PERIODS = ['daily', 'weekly', 'monthly'] as const;
type Period = (typeof PERIODS)[number];

const LINES = ['upper', 'middle', 'lower'] as const;
type Line = (typeof LINES)[number];

interface SubscriptionSettingsProps {
  stockSymbol: string;
}

export default function SubscriptionSettings({ stockSymbol }: SubscriptionSettingsProps) {
  const params = useParams();
  const symbol = stockSymbol || (params.id as string) || '';
  const [loading, setLoading] = useState(true);
  // 编辑表单信息
  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionItemProp['settings'][number]>({});
  const [expandedPeriods, setExpandedPeriods] = useState<Period[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  // 新增状态来存储所有订阅信息
  const [subscriptions, setSubscriptions] = useState<SubscriptionItemProp['settings']>([]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSubscriptionSettings(symbol);
      if (settings) {
        // 确保数据结构匹配
        setSubscriptions(settings);
      }
    } catch (error) {
      console.error('获取订阅设置失败:', error);
      toast.error('获取订阅设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取订阅设置
  useEffect(() => {
    if (symbol) {
      fetchSettings();
    }
  }, [symbol]);

  // 展开或折叠某个周期
  const togglePeriod = (period: Period) => {
    setExpandedPeriods(prev => (prev.includes(period) ? prev.filter(p => p !== period) : [...prev, period]));
  };

  const switchSubmit = async (checked: boolean, uniId = '') => {
    try {
      const index = subscriptions?.findIndex?.(item => item.uniId === uniId);
      subscriptions[index].isSubscribed = checked ? 'Y' : 'N';
      setSubscriptions([...subscriptions]);
      const result = await saveSubscriptionSettings({ stockSymbol: symbol, settings: [...subscriptions] });
      if (!result.success) {
        subscriptions[index].isSubscribed = checked ? 'N' : 'Y';
        setSubscriptions([...subscriptions]);
        toast.error(result.error || '修改失败');
      }
    } catch (error) {
      console.error('保存订阅设置失败:', error);
      toast.error('保存失败，请重试');
    }
  };

  // 保存
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e, 'handleSubmit');
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const subscriptionSettings = {
        isSubscribed: editingIndex === null ? 'Y' : subscriptionForm.isSubscribed, // 确保传递了订阅状态
        bollLine: data.bollLine as string, // 确保传递了布林线类型,
        bollPeriod: data.bollPeriod as string, // 确保传递了布林线周期,
        breakDirection: data.breakDirection as string, // 确保传递了突破方向,
        offset: data.offset as string // 确保传递了偏移值,
      };
      const index = subscriptions?.findIndex?.(item => item.uniId === editingIndex);
      let settings = [];
      if (index > -1) {
        // 编辑操作
        const newSubscriptions = [...subscriptions]; // 复制数组
        newSubscriptions[index] = subscriptionSettings; // 更新对应项
        settings = newSubscriptions; // 更新数组
      } else {
        // 新建操作
        settings = Array.isArray(subscriptions)
          ? [...subscriptions, { ...subscriptionSettings, uniId: Date.now().toString() }]
          : [{ ...subscriptionSettings, uniId: Date.now().toString() }];
      }
      const result = await saveSubscriptionSettings({ stockSymbol: symbol, settings });
      if (result.success) {
        // 更新定时器任务
        taskScheduler.updateTimeEvent(() => console.log('第二个模板更新lele'));
        toast.success('设置保存成功');
        // if (editingIndex !== null) {
        //   // 编辑操作
        //   setSubscriptions(prev => {
        //     const newSubscriptions = [...prev];
        //     newSubscriptions[editingIndex] = subscriptionForm;
        //     return newSubscriptions;
        //   });
        //   setEditingIndex(null);
        // } else {
        //   console.log(subscriptionForm, 'subscriptionForm');
        //   // 新建操作
        //   setSubscriptions(prev => [...prev, subscriptionForm]);
        // }
        // 关闭弹框
        closeModal();
        // 刷新列表
        await fetchSettings();
      } else {
        toast.error(result.error || '保存失败');
      }
      //   // todo 测试
      //   await sendNotificationsToAllSubscribers();
    } catch (error) {
      console.error('保存订阅设置失败:', error);
      toast.error('保存失败，请重试');
    }
  };

  // 创建订阅
  const openModal = () => {
    setIsModalOpen(true);
    setEditingIndex(null);
    // setSubscriptionForm({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    // 保存成功后重置表单
    setSubscriptionForm({});
  };

  const handleEdit = (uniId: string) => {
    setEditingIndex(uniId);
    setSubscriptionForm(subscriptions.find(sub => sub.uniId === uniId)!);
    console.log(
      subscriptions.find(sub => sub.uniId === uniId),
      'subscriptions.find(sub => sub.uniId === uniId)'
    );
    setIsModalOpen(true);
  };

  const handleDelete = async (uniId: string) => {
    const settings = subscriptions.filter(item => item.uniId !== uniId);
    const result = await saveSubscriptionSettings({ stockSymbol: symbol, settings });
    if (result.success) {
      toast.success('删除成功');
      setSubscriptions(settings);
    } else {
      toast.error(result.error || '删除失败');
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
    <div>
      {/* 将按钮容器使用 flex 布局并靠右对齐 */}
      <div className="flex justify-end mb-4">
        <Button onClick={openModal}>
          <PlusIcon className="h-5 w-5 mr-2" />
          创建订阅
        </Button>
      </div>

      {/* 订阅卡片展示，根据 subscriptions 状态渲染卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions?.map?.((subscription, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow relative group"
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
          >
            {/* 编辑和删除图标 */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <button
                onClick={() => handleEdit(subscription?.uniId ?? '')}
                className="text-gray-500 hover:text-gray-700"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(subscription?.uniId ?? '')}
                className="text-gray-500 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>

            <h3 className="text-lg font-medium">订阅卡片 {index + 1}</h3>
            {JSON.stringify(subscription)}
            {/* 新增卡片是否开启的按钮 */}
            <Switch
              className="mt-2 float-right"
              value={subscription.isSubscribed}
              name="isSubscribed"
              isSelected={subscription.isSubscribed === 'Y'}
              onChange={e => switchSubmit(e.target.checked, subscription.uniId)}
            />
            {/* 可以添加更多订阅信息展示 */}
          </div>
        ))}
      </div>

      {/* 创建订阅弹框 */}
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute right-0 top-0 pr-4 pt-4">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={closeModal}
                    >
                      <span className="sr-only">关闭</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  {/* 用 form 表单包裹弹框内容 */}
                  <form onSubmit={handleSubmit}>
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                          {editingIndex !== null ? '编辑订阅' : '创建订阅'}
                        </Dialog.Title>
                        {/* 新增布林线设置标题 */}
                        <h4 className="text-md font-semibold leading-5 text-gray-900 mt-2">布林线设置</h4>
                        <div className="mt-4">
                          {/* 选择向下突破、向上突破（改为 RadioGroup 和 Radio） */}
                          <div className="space-y-2">
                            <p className="text-sm font-medium">突破方向</p>
                            <RadioGroup
                              name="breakDirection"
                              // value={subscriptionForm.breakDirection}
                              // onChange={value => {
                              //   setSubscriptionForm(prev => ({ ...prev, breakDirection: value as 'up' | 'down' }));
                              // }}
                            >
                              <div className="flex gap-4">
                                <label className="flex items-center">
                                  <Radio value="down" />
                                  <span className="ml-2">向下突破</span>
                                </label>
                                <label className="flex items-center">
                                  <Radio value="up" />
                                  <span className="ml-2">向上突破</span>
                                </label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* 选择日、周、月布林线（改为 RadioGroup 和 Radio） */}
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium">布林线周期</p>
                            <RadioGroup
                              name="bollPeriod"
                              // value={PERIODS.find(period => subscriptionForm.bollSettings[period].upper.enabled)}
                              // onChange={value => {
                              //   const newBollSettings = { ...subscriptionForm.bollSettings };
                              //   PERIODS.forEach(p => {
                              //     LINES.forEach(line => {
                              //       newBollSettings[p][line].enabled = false;
                              //     });
                              //   });
                              //   if (value) {
                              //     newBollSettings[value].upper.enabled = true;
                              //   }
                              //   setSubscriptionForm(prev => ({ ...prev, bollSettings: newBollSettings }));
                              // }}
                            >
                              <div className="flex gap-4">
                                {PERIODS.map(period => (
                                  <label key={period} className="flex items-center">
                                    <Radio value={period} />
                                    <span className="ml-2">
                                      {period === 'daily' ? '日线' : period === 'weekly' ? '周线' : '月线'}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>

                          {/* 选择上、中、下轨线（改为 RadioGroup 和 Radio） */}
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium">布林线轨线</p>
                            <RadioGroup
                              name="bollLine"
                              // value={LINES.find(line => {
                              //   const selectedPeriod = PERIODS.find(period =>
                              //     LINES.some(l => subscriptionForm.bollSettings[period][l].enabled)
                              //   );
                              //   return selectedPeriod && subscriptionForm.bollSettings[selectedPeriod][line].enabled;
                              // })}
                              // onChange={value => {
                              //   const newBollSettings = { ...subscriptionForm.bollSettings };
                              //   const selectedPeriod = PERIODS.find(period =>
                              //     LINES.some(l => newBollSettings[period][l].enabled)
                              //   );
                              //   if (selectedPeriod && value) {
                              //     LINES.forEach(l => {
                              //       newBollSettings[selectedPeriod][l].enabled = false;
                              //     });
                              //     newBollSettings[selectedPeriod][value].enabled = true;
                              //   }
                              //   setSubscriptionForm(prev => ({ ...prev, bollSettings: newBollSettings }));
                              // }}
                            >
                              <div className="flex gap-4">
                                {LINES.map(line => (
                                  <label key={line} className="flex items-center">
                                    <Radio value={line} />
                                    <span className="ml-2">
                                      {line === 'upper' ? '上轨线' : line === 'middle' ? '中轨线' : '下轨线'}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>

                          {/* // 新增偏移值输入框 */}
                          <div className="mt-4">
                            <p className="text-sm font-medium">偏移值</p>
                            <Input
                              type="number"
                              name="offset"
                              // value={String(subscriptionForm.offset)}
                              // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              //   setSubscriptionForm(prev => ({ ...prev, offset: Number(e.target.value) }))
                              // }
                              className="w-full h-min"
                            />
                          </div>

                          <div className="mt-4 flex justify-end">
                            <Button
                              type="submit"
                              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                            >
                              {editingIndex !== null ? '保存编辑' : '保存订阅'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
