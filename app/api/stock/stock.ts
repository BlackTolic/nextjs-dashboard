'use server';
import * as xueqiu from '../../crawler/xueqiu/xunqiu';
import * as AKShare from '../../crawler/ak-share';
import { IndustryTradePrps } from '@/app/crawler/ak-share/interface';

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

// 批量获取多个股票的K线数据

// 股票行业成交
export const getStockIndustryTrade = async (params?: IndustryTradePrps) => {
  return await proxyApi.getStockIndustryTrade(params);
};
