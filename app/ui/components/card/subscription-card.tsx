'use client';
import { Subscription } from './constant';

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
const SubscriptionCard = ({
  subscription,
  onOptionsChange,
  onValueChange,
}: SubscriptionCardProps) => {
  // 处理选项变更的函数
  const handleOptionChange = (optionKey: keyof Subscription['selectedOptions']) => {
    if (onOptionsChange) {
      // 更新选项状态，保持其他选项不变，仅切换当前选项的值
      onOptionsChange({
        ...subscription.selectedOptions,
        [optionKey]: !subscription.selectedOptions[optionKey],
      });
    }
  };

  // 处理数值变更的函数
  const handleValueChange = (
    type: 'maxValue' | 'minValue',
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    // 确保输入值为有效数字后才触发回调
    if (!isNaN(value) && onValueChange) {
      onValueChange(type, value);
    }
  };

  return (
    // 卡片容器，使用米色背景和圆角边框
    <div className="bg-[#f5f5dc] border border-gray-300 rounded-lg p-6 w-72 shadow-sm hover:shadow-md transition-shadow">
      {/* 卡片标题和描述 */}
      <h3 className="text-xl font-semibold mb-2">{subscription.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{subscription.description}</p>

      <div className="space-y-3">
        {/* 最大值设置区域 */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={subscription.selectedOptions.showMaxValue}
            onChange={() => handleOptionChange('showMaxValue')}
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700 flex items-center">
            最大值:
            <input
              type="number"
              value={subscription.maxValue}
              onChange={(e) => handleValueChange('maxValue', e)}
              className="ml-2 w-20 px-2 py-1 border border-gray-300 rounded"
              disabled={!subscription.selectedOptions.showMaxValue}
            />
          </span>
        </div>

        {/* 最小值设置区域 */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={subscription.selectedOptions.showMinValue}
            onChange={() => handleOptionChange('showMinValue')}
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700 flex items-center">
            最小值:
            <input
              type="number"
              value={subscription.minValue}
              onChange={(e) => handleValueChange('minValue', e)}
              className="ml-2 w-20 px-2 py-1 border border-gray-300 rounded"
              disabled={!subscription.selectedOptions.showMinValue}
            />
          </span>
        </div>

        {/* 图表显示选项 */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={subscription.selectedOptions.showChart}
            onChange={() => handleOptionChange('showChart')}
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">显示图表</span>
        </label>

        {/* 图表区域 - 仅在选中显示图表且有图表数据时显示 */}
        {subscription.selectedOptions.showChart && subscription.chartData && (
          <div className="h-32 mt-4 border border-gray-200 rounded-md">
            <div className="text-sm text-gray-400 text-center h-full flex items-center justify-center">
              图表区域
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;
