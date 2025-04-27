'use server';

import { KlineData } from './interface';
import * as xueqiu from '../../crawler/xueqiu/xunqiu';
import * as AKShare from '../../crawler/ak-share';
// import { get } from 'lodash';

// export async function tickerSearchByKeywords(keywords: string) {
//   const response = await fetch(
//     'https://sapi.k780.com/?app=finance.stock_list&category=hs&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json'
//   );
//   return await response.json();
// }

// // 批量获取多个股票的K线数据
// export const batchGetStockKline = async (params: KlineData) => {
//   const stringArrayParams = Object.values(params).map(value => String(value));
//   return await xueqiu.batchGetStockKline(stringArrayParams);
// };

const dataResource = 'xueqiu';

const hander = {
  get: (target: any, prop: string) => {
    if (dataResource === 'xueqiu') {
      return (target as any)[prop];
    }
    return { ...AKShare }[prop];
  }
};

const proxyApi = new Proxy({ ...xueqiu }, hander);

// 批量获取多个股票的K线数据

// 股票行业成交
export const getStockIndustryTrade = async (params: any) => {
  return await proxyApi.getStockIndustryTrade(params);
};
