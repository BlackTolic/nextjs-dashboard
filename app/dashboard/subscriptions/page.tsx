import { lusitana } from "@/app/ui/fonts";
import { BellIcon } from "@heroicons/react/24/outline";
import SubscriptionCard from "@/app/ui/common/subscription-card";
import { subscriptions } from "@/app/ui/common/constant";

const Subscriptions = () => {
  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl flex items-center gap-2`}>
          <BellIcon className="w-6 h-6" />
          我的订阅
        </h1>
      </div>
      <div className="mt-4 mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索订阅..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Subscription cards */}
      <div className="flex flex-wrap gap-4">
        {subscriptions.map((sub) => (
          <SubscriptionCard
            key={sub.id}
            subscription={{
              id: sub.id,
              title: sub.title,
              description: sub.description,
              maxValue: sub.maxValue,
              minValue: sub.minValue,
              selectedOptions: {
                showMaxValue: true,
                showMinValue: true,
                showChart: false
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
