'use server';
import * as xueqiu from '../../crawler/xueqiu/xunqiu';
import * as AKShare from '../../crawler/ak-share';
import {
  AnalystDetailPrps,
  IndustryTradePrps,
  StockDetailPrps,
  StockHistoryQuotePrps
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
};

// 个股实时行情
export const getStockRealTime = async (params: StockDetailPrps) => {
  return await proxyApi.getStockRealTime(params);
};

// 个股历史行情
export const getStockHistory = async (params: StockHistoryQuotePrps) => {
  return await proxyApi.getStockHistory(params);
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
