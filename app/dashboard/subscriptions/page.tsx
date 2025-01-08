import { lusitana } from "@/app/ui/fonts";
import { BellIcon } from "@heroicons/react/24/outline";
import DescripCard from "@/app/ui/common/descrip-card";

const Subscriptions = () => {
  // Example subscription data with additional fields
  const subscriptions = [
    {
      id: 1,
      title: "订阅1",
      description: "这是订阅1的描述。",
      maxValue: 100,
      minValue: 10,
      chartType: "line",
    },
    {
      id: 2,
      title: "订阅2",
      description: "这是订阅2的描述。",
      maxValue: 200,
      minValue: 20,
      chartType: "bar",
    },
    {
      id: 3,
      title: "订阅3",
      description: "这是订阅3的描述。",
      maxValue: 300,
      minValue: 30,
      chartType: "candlestick",
    },
  ];

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl flex items-center gap-2`}>
          <BellIcon className="w-6 h-6" />
          我的订阅
        </h1>
      </div>

      {/* Subscription cards */}
      <div className="flex flex-wrap gap-4">
        {subscriptions.map((subscription) => (
          <DescripCard
            key={subscription.id}
            title={subscription.title}
            description={subscription.description}
            maxValue={subscription.maxValue}
            minValue={subscription.minValue}
            chartType={subscription.chartType}
            className="w-[300px]"
          />
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
