import { lusitana } from "@/app/ui/fonts";

interface DescripCardProps {
  title: string;
  description: string;
  maxValue?: number;
  minValue?: number;
  chartType?: string;
  icon?: React.ReactNode;
  className?: string;
}

const DescripCard = ({
  title,
  description,
  maxValue,
  minValue,
  chartType,
  icon,
  className = "",
}: DescripCardProps) => {
  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon && icon}
        <h2 className={`${lusitana.className} text-xl`}>{title}</h2>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      {maxValue && minValue && (
        <div className="text-sm text-gray-500">
          <p>最大值: {maxValue}</p>
          <p>最小值: {minValue}</p>
        </div>
      )}
      {chartType && <p className="text-sm text-gray-500">图表类型: {chartType}</p>}
    </div>
  );
};

export default DescripCard; 