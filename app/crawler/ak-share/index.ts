import request from '@/app/api/request';
import axios from 'axios';

const base = `http://127.0.0.1:8080/api/public`;
import { IndustryTradePrps } from './interface';

const getParams = (params: Record<string, string>) => {
  if (!params) return '';
  return `?${Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&')}`;
};

/**
 * 获取所有股票列表数据
 */
/**
 * 批量获取多个股票的K线数据
 */
export const batchGetStockKline = () => {};

/**
 * 轮询获取所有股票数据
 */
export const pollStocksList = () => {};

/**
 * 获取单个股票的K线数据
 */
export const getKlineData = () => {};

/**
 * 股票行业成交
 */
export const getStockIndustryTrade = async (params?: IndustryTradePrps) => {
  console.log(params, 'params');
  return await request.get(`${base}/stock_szse_sector_summary${getParams(params as Record<string, string>)}`);
};
