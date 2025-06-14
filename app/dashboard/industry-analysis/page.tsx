'use client';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import Title from '@/app/ui/components/title/page';
import { Button } from '@/app/ui/button';
import * as api from '@/app/api/stock';
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

  const handleClickTest14 = async () => {
    const res = await api.getStockCommentScore({ symbol: '002821' });
    console.log('请求成功:', res);
  };

  const handleClickTest15 = async () => {
    const res = await api.getUserFollowIndex({ symbol: '002821' });
    console.log('请求成功:', res);
  };

  const handleClickTest16 = async () => {
    const res = await api.getMarketParticipation({ symbol: '002821' });
    console.log('请求成功:', res);
  };

  const handleClickTest17 = async () => {
    const res = await api.getStockMoneyFlow();
    console.log('请求成功:', res);
  };

  const handleClickTest18 = async () => {
    const res = await api.getStockPlateRank({ symbol: '北向资金增持行业板块排行', indicator: '1季' });
    console.log('请求成功:', res);
  };

  const handleClickTest19 = async () => {
    const res = await api.getStockNews({ symbol: '002821' });
    console.log('请求成功:', res);
  };

  const handleClickTest22 = async () => {
    const res = await api.getStockShareholders({ symbol: '全部' });
    console.log('请求成功:', res);
  };

  const handleClickTest23 = async () => {
    const res = await api.getStockDividend({ date: '20231231' });
    console.log('请求成功:', res);
  };

  const handleClickTest24 = async () => {
    const res = await api.getStockDividend({ date: '20231231' });
    console.log('请求成功:', res);
  };

  const handleClickTest25 = async () => {
    const res = await api.getStockConceptFundFlow({ symbol: '即时' });
    console.log('请求成功:', res);
  };

  const handleClickTest26 = async () => {
    const res = await api.getStockIndustryMoneyFlow({ symbol: '5日排行' });
    console.log('请求成功:', res);
  };

  const handleClickTest27 = async () => {
    const res = await api.getStockFundFlowRank({ symbol: '今日' });
    console.log('请求成功:', res);
  };

  const handleClickTest28 = async () => {
    const res = await api.getStockBalanceSheet({ symbol: '603777', indicator: '按单季度' });
    console.log('请求成功:', res);
  };

  const handleClickTest29 = async () => {
    const res = await api.getStockProfitSheet({ symbol: '603777', indicator: '按单季度' });
    console.log('请求成功:', res);
  };

  const handleClickTest30 = async () => {
    const res = await api.getStockCashFlowSheet({ symbol: '603777', indicator: '按单季度' });
    console.log('请求成功:', res);
  };

  const handleClickTest31 = async () => {
    const res = await api.getStockRecommendPool({ symbol: '上调评级股票' });
    console.log('请求成功:', res);
  };

  const handleClickTest32 = async () => {
    const res = await api.getStockBondDebtRatio();
    console.log('请求成功:', res);
  };

  const handleClickTest33 = async () => {
    const res = await api.getStockValuation({ symbol: '603777', indicator: '市净率', period: '近一年' });
    console.log('请求成功:', res);
  };

  const handleClickTest34 = async () => {
    const res = await api.getStockHighLow({ symbol: 'all' });
    console.log('请求成功:', res);
  };

  const handleClickTest35 = async () => {
    const res = await api.getStockActiveBrokers({ start_date: '20250311', end_date: '20250411' });
    console.log('请求成功:', res);
  };

  const handleClickTest36 = async () => {
    const res = await api.getStockHot({ symbol: '本周新增' });
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
      {/* <div className="mt-6">
        <Button onClick={handleClickTest2}> 个股详情</Button>
      </div> */}
      <div className="mt-6">
        <Button onClick={handleClickTest3}> 行情报价</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest4}> 实时行情</Button>
      </div>
      {/* <div className="mt-6">
        <Button onClick={handleClickTest5}> 个股实时行情</Button>
      </div> */}
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
      <div className="mt-6">
        <Button onClick={handleClickTest14}> 个股历史评分</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest15}> 用户关注指数</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest16}> 市场参与意愿</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest17}> 沪深港通资金流向</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest18}> 板块排行</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest19}> 个股新闻</Button>
      </div>

      <div className="mt-6">
        <Button onClick={handleClickTest22}> 股东增减持</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest23}> 分红配送</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest24}> 个股分红情况</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest25}> 概念资金流</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest26}> 行业资金流</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest27}> 个股资金流排名</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest28}> 资产负债表</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest29}> 利润表</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest30}> 现金流量表</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest31}> 机构推荐池</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest32}> 股债利差</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest33}> A股估值指标</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest34}> 创新高和新低的股票数量</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest35}> 每日活跃营业部</Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleClickTest36}> 雪球股票热度</Button>
      </div>
    </main>
  );
}
