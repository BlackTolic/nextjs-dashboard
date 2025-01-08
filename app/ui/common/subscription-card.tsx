interface Subscription {
  title: string;
  description: string;
  maxValue?: number;
  minValue?: number;
  chartData?: {
    labels: string[];
    values: number[];
  };
}

const SubscriptionCard = ({ subscription }: { subscription: Subscription }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 w-72 shadow-sm">
      <h3 className="text-lg font-semibold">{subscription.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{subscription.description}</p>

      <div className="flex justify-between text-sm mb-3">
        {subscription.maxValue && (
          <div>
            <span className="text-gray-500">最大值:</span>
            <span className="ml-1 font-medium">{subscription.maxValue}</span>
          </div>
        )}
        {subscription.minValue && (
          <div>
            <span className="text-gray-500">最小值:</span>
            <span className="ml-1 font-medium">{subscription.minValue}</span>
          </div>
        )}
      </div>

      {subscription.chartData && (
        <div className="h-32 mt-2">
          {/* 这里可以添加你想用的图表组件，比如 recharts 等 */}
          {/* 示例: <LineChart data={subscription.chartData} /> */}
          <div className="text-sm text-gray-400 text-center">图表区域</div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;
