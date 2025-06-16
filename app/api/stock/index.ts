'use server';
import * as xueqiu from '../../crawler/xueqiu/xunqiu';
import * as AKShare from '../../crawler/ak-share';
import {
  AnalystDetailPrps,
  BlockFundRankPrps,
  IndustryTradePrps,
  StockActiveBrokerPrps,
  StockConceptFundFlowPrps,
  StockDetailPrps,
  StockDividendPrps,
  StockFinancePrps,
  StockFundFlowRankPrps,
  StockHeatPrps,
  StockHighLowPrps,
  StockHistoryQuotePrps,
  StockRecommendPoolPrps,
  StockShareHolderPrps,
  StockValuationPrps
} from '@/app/crawler/ak-share/interface';

type DataResource = 'xueqiu' | 'akshare' | '';
const dataResource: DataResource = '';

interface StockFunTraget {
  getStockIndustryTrade: (params: IndustryTradePrps) => void;
}

const hander = {
  get: (target: any, prop: string) => {
    if (dataResource) {
      return (target as any)[prop];
    }
    return { ...AKShare }[prop];
  }
};

const proxyApi = new Proxy({ ...xueqiu }, hander);

// 字典
export const getDict = async () => {
  return await proxyApi.getDict();
};

// 股票行业成交
export const getStockIndustryTrade = async (params?: IndustryTradePrps) => {
  return await proxyApi.getStockIndustryTrade(params);
};

// 个股详情
export const getStockDetail = async (params: StockDetailPrps) => {
  return await proxyApi.getStockDetail(params);
};

// 个股行情报价
export const getStockQuote = async (params: StockDetailPrps) => {
  return await proxyApi.getStockQuote(params);
};

// 所有股票实时行情
export const getAllStockRealTimeQuote = async (params?: StockDetailPrps) => {
  return await proxyApi.getAllStockRealTimeQuote(params);
  // return await proxyApi.getAllStockRealTimeQuoteV2(params);
};

// 个股实时行情
export const getStockRealTime = async (params: StockDetailPrps) => {
  return await proxyApi.getStockRealTime(params);
};

// 个股历史行情
export const getStockHistory = async (params: StockHistoryQuotePrps) => {
  return proxyApi.getStockHistory(params);
};

// 批量获取个股历史行情
export const batchGetStockHistory = async (params: Omit<StockHistoryQuotePrps, 'symbol'> & { symbolArr: string[] }) => {
  const { symbolArr, ...restParams } = params;
  const res = await Promise.all(
    symbolArr.map(symbol => {
      return proxyApi.getStockHistory({ symbol, ...restParams });
    })
  );
  return res;
};

// 个股主营业务
export const getStockMainBusiness = async (params: StockDetailPrps) => {
  return await proxyApi.getStockMainBusiness(params);
};

// 个股财务数据
export const getStockFinance = async (params: StockDetailPrps) => {
  return await proxyApi.getStockFinance(params);
};

// 质押机构分布统计
export const getStockPledge = async (params?: StockDetailPrps) => {
  return await proxyApi.getStockPledge(params);
};

// 东财股票账户统计(月度)
export const getEastMoneyStockAccount = async (params?: StockDetailPrps) => {
  return await proxyApi.getEastMoneyStockAccount(params);
};

// 分析师指数排行
export const getAnalystIndex = async (params?: StockDetailPrps) => {
  return await proxyApi.getAnalystIndex(params);
};

// 分析师详情
export const getAnalystDetail = async (params: AnalystDetailPrps) => {
  return await proxyApi.getAnalystDetail(params);
};

// 千股千评
export const getStockComment = async (params?: string) => {
  return await proxyApi.getStockComment(params);
};

// 个股相关概念

// 个股分红情况
export const getStockDividendDetail = async (params: StockDetailPrps) => {
  return await proxyApi.getStockDividendDetail(params);
};

// 行业资金流
export const getStockIndustryMoneyFlow = async (params: StockConceptFundFlowPrps) => {
  return await proxyApi.getStockIndustryMoneyFlow(params);
};

// 资产负债表
export const getStockBalanceSheet = async (params: StockFinancePrps) => {
  return await proxyApi.getStockBalanceSheet(params);
};

// 利润表
export const getStockProfitSheet = async (params: StockFinancePrps) => {
  return await proxyApi.getStockProfitSheet(params);
};

// 现金流量表
export const getStockCashFlowSheet = async (params: StockFinancePrps) => {
  return await proxyApi.getStockCashFlowSheet(params);
};

// 股债利差
export const getStockBondDebtRatio = async () => {
  return await proxyApi.getStockBondDebtRatio();
};

// 个股历史评分
export const getStockCommentScore = async (params: StockDetailPrps) => {
  return await proxyApi.getStockCommentScore(params);
};

// 用户关注指数
export const getUserFollowIndex = async (params: StockDetailPrps) => {
  return await proxyApi.getUserFollowIndex(params);
};

// 市场参与意愿（个股）
export const getMarketParticipation = async (params: StockDetailPrps) => {
  return await proxyApi.getMarketParticipation(params);
};

// 沪深港通资金流向
export const getStockMoneyFlow = async () => {
  return await proxyApi.getStockMoneyFlow();
};

// 板块排行
export const getStockPlateRank = async (params: BlockFundRankPrps) => {
  return await proxyApi.getStockPlateRank(params);
};

// 个股新闻
export const getStockNews = async (params: StockDetailPrps) => {
  return await proxyApi.getStockNews(params);
};

// 股东增减持
export const getStockShareholders = async (params: StockShareHolderPrps) => {
  return await proxyApi.getStockShareholders(params);
};

// 分红配送
export const getStockDividend = async (params: StockDividendPrps) => {
  return await proxyApi.getStockDividend(params);
};

// 概念资金流
export const getStockConceptFundFlow = async (params: StockConceptFundFlowPrps) => {
  return await proxyApi.getStockConceptFundFlow(params);
};

// 个股资金流排名
export const getStockFundFlowRank = async (params: StockFundFlowRankPrps) => {
  return await proxyApi.getStockFundFlowRank(params);
};

// 机构推荐池
export const getStockRecommendPool = async (params: StockRecommendPoolPrps) => {
  return await proxyApi.getStockRecommendPool(params);
};

// A股估值指标
export const getStockValuation = async (params: StockValuationPrps) => {
  return await proxyApi.getStockValuation(params);
};

// 创新高和新低的股票数量
export const getStockHighLow = async (params: StockHighLowPrps) => {
  return await proxyApi.getStockHighLow(params);
};

// 每日活跃营业部
export const getStockActiveBrokers = async (params: StockActiveBrokerPrps) => {
  return await proxyApi.getStockActiveBrokers(params);
};

// 雪球股票热度
export const getStockHot = async (params: StockHeatPrps) => {
  return await proxyApi.getStockHot(params);
};
