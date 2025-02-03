'use client';
import { Subscription } from './constant';
import { Card, CardBody, CardHeader, CardFooter, Input, Checkbox, Divider } from '@heroui/react';

// 定义组件的属性接口
interface SubscriptionCardProps {
  // 订阅信息对象
  subscription: Subscription;
  // 选项变更回调函数
  onOptionsChange?: (newOptions: Subscription['selectedOptions']) => void;
  // 最大值/最小值变更回调函数
  onValueChange?: (type: 'maxValue' | 'minValue', value: number) => void;
}

// 订阅卡片组件
const SubscriptionCard = ({ subscription, onOptionsChange, onValueChange }: SubscriptionCardProps) => {
  // 处理选项变更的函数
  const handleOptionChange = (optionKey: keyof Subscription['selectedOptions']) => {
    if (onOptionsChange) {
      // 更新选项状态，保持其他选项不变，仅切换当前选项的值
      onOptionsChange({
        ...subscription.selectedOptions,
        [optionKey]: !subscription.selectedOptions[optionKey]
      });
    }
  };

  // 处理数值变更的函数
  const handleValueChange = (type: 'maxValue' | 'minValue', event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    // 确保输入值为有效数字后才触发回调
    if (!isNaN(value) && onValueChange) {
      onValueChange(type, value);
    }
  };

  return (
    <Card className="w-72">
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <h3 className="text-xl font-semibold">{subscription.title}</h3>
        <p className="text-small text-default-500">{subscription.description}</p>
      </CardHeader>
      <Divider />
      <CardBody className="py-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              isSelected={subscription.selectedOptions.showMaxValue}
              onValueChange={() => handleOptionChange('showMaxValue')}
            />
            <span className="text-sm text-default-600 flex items-center gap-2">
              最大值:
              <Input
                type="number"
                value={String(subscription.maxValue)}
                onChange={e => handleValueChange('maxValue', e)}
                className="w-24"
                size="sm"
                isDisabled={!subscription.selectedOptions.showMaxValue}
              />
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              isSelected={subscription.selectedOptions.showMinValue}
              onValueChange={() => handleOptionChange('showMinValue')}
            />
            <span className="text-sm text-default-600 flex items-center gap-2">
              最小值:
              <Input
                type="number"
                value={String(subscription.minValue)}
                onChange={e => handleValueChange('minValue', e)}
                className="w-24"
                size="sm"
                isDisabled={!subscription.selectedOptions.showMinValue}
              />
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              isSelected={subscription.selectedOptions.showChart}
              onValueChange={() => handleOptionChange('showChart')}
            />
            <span className="text-sm text-default-600">显示图表</span>
          </div>

          {subscription.selectedOptions.showChart && subscription.chartData && (
            <div className="h-32 mt-4 bg-default-100 rounded-md">
              <div className="text-sm text-default-400 text-center h-full flex items-center justify-center">
                图表区域
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default SubscriptionCard;
