'use client';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import Title from '@/app/ui/components/title/page';
import { Button } from '@/app/ui/button';
import * as api from '@/app/api/stock/stock';
import { symbol } from 'zod';

export default function Page() {
  //   const [loading, setLoading] = useState(false);

  const handleClickTest = async () => {
    try {
      //   setLoading(true);
      console.log('开始请求...');
      const res = await api.getStockIndustryTrade(/* { date: '202502' } */);
      console.log('请求成功:', res);
    } catch (error) {
      console.error('请求出错:', error);
    } finally {
      //   setLoading(false);
    }
  };

  const handleClickTest2 = async () => {
    const res = await api.getStockDetail({ symbol: 'SZ002821' });
    console.log('请求成功:', res);
  };

  const handleClickTest3 = async () => {
    const res = await api.getStockQuote({ symbol: '002821' });
    console.log('请求成功:', res);
  };

  const handleClickTest4 = async () => {
    const res = await api.getAllStockRealTimeQuote();
    console.log('请求成功:', res);
  };

  const handleClickTest5 = async () => {
    const res = await api.getStockRealTime({ symbol: 'SZ002821' });
    console.log('请求成功:', res);
  };

  const handleClickTest6 = async () => {
    const res = await api.getStockHistory({
      symbol: '002821',
      period: 'daily',
      start_date: '20210301',
      end_date: '20210616'
    });
    console.log('请求成功:', res);
  };

  const handleClickTest7 = async () => {
    const res = await api.getStockMainBusiness({ symbol: 'SZ002821' });
    console.log('请求成功:', res);
  };

  const handleClickTest8 = async () => {
    const res = await api.getStockFinance({ symbol: '600519' });
    console.log('请求成功:', res);
  };

  const handleClickTest9 = async () => {
    const res = await api.getStockPledge();
    console.log('请求成功:', res);
  };

  const handleClickTest10 = async () => {
    const res = await api.getEastMoneyStockAccount();
    console.log('请求成功:', res);
  };

  const handleClickTest11 = async () => {
    const res = await api.getAnalystIndex();
    console.log('请求成功:', res);
  };

  const handleClickTest12 = async () => {
    const res = await api.getAnalystDetail({ analyst_id: '11000275531', indicator: '最新跟踪成分股' });
    console.log('请求成功:', res);
  };

  const handleClickTest13 = async () => {
    const res = await api.getStockComment();
    console.log('请求成功:', res);
  };

  return (
    <main>
      <Title title="行业分析" icon={<BuildingOfficeIcon className="w-6 h-6" />}>
        {/* 这里将放置行业分析的主要内容 */}
      </Title>
      <div className="mt-6">
        <Button onClick={handleClickTest}> 行业成交</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest2}> 个股详情</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest3}> 行情报价</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest4}> 实时行情</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest5}> 个股实时行情</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest6}> 个股历史行情</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest7}> 个股主营业务</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest8}> 个股财务数据</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest9}> 质押机构分布统计</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest10}> 东财股票账户统计</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest11}> 分析师指数排行</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest12}> 分析师详情</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest13}> 千股千评</Button>
      </div>
    </main>
  );
}
