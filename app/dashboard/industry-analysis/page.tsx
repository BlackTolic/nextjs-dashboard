'use client';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import Title from '@/app/ui/components/title/page';
import { Button } from '@/app/ui/button';
import { getStockIndustryTrade } from '@/app/api/stock/stock';

export default function Page() {
  //   const [loading, setLoading] = useState(false);

  const handleClickTest = async () => {
    try {
      //   setLoading(true);
      console.log('开始请求...');
      const res = await getStockIndustryTrade({ date: '202502' });
      console.log('请求成功:', res);
    } catch (error) {
      console.error('请求出错:', error);
    } finally {
      //   setLoading(false);
    }
  };
  return (
    <main>
      <Title title="行业分析" icon={<BuildingOfficeIcon className="w-6 h-6" />}>
        {/* 这里将放置行业分析的主要内容 */}
      </Title>
      <div className="mt-6">
        <Button onClick={handleClickTest}> 行业成交</Button>
      </div>
    </main>
  );
}
