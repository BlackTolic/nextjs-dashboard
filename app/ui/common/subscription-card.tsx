// File: F:/Code/Project/03STOCK_CUBE/nextjs-dashboard/app/ui/common/SubscriptionCard.tsx

const SubscriptionCard = ({ subscription }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 w-48 shadow-sm">
      <h3 className="text-lg font-semibold">{subscription.title}</h3>
      <p className="text-sm text-gray-600">{subscription.description}</p>
    </div>
  );
};

export default SubscriptionCard;
