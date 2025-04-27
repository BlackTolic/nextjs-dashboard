import request from '@/app/api/request';
import axios from 'axios';

const base = `http://127.0.0.1:8080/api/public`;
type transform = Record<string, string>;

import { IndustryTradePrps, StockDetailPrps } from './interface';

const getParams = (params: any) => {
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
  return await request.get(`${base}/stock_szse_sector_summary${getParams(params as Record<string, string>)}`);
};

/**
 * 个股详情
 */
export const getStockDetail = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_individual_basic_info_xq${getParams(params)}`);
};

/**
 * 个股行情报价
 */
export const getStockQuote = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_bid_ask_em${getParams(params)}`);
};

/**
 * 所有股票实时行情
 */
export const getAllStockRealTimeQuote = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_zh_a_spot_em${getParams(params)}`);
};

/**
 * 个股实时行情
 */
export const getStockRealTime = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_individual_spot_xq${getParams(params)}`);
};

/**
 * 个股历史行情
 */
export const getStockHistory = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_zh_a_hist${getParams(params)}`);
};

/**
 * 字典
 */
export const getDict = async (params: any) => {
  return await request.get(`${base}/stock_zh_ah_name${getParams(params)}`);
};

/**
 * 个股主营业务
 */
export const getStockMainBusiness = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_zygc_em${getParams(params)}`);
};

/**
 * 个股财务数据
 */
export const getStockFinance = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_zygc_ym${getParams(params)}`);
};

/**
 * 质押机构分布统计
 */
export const getStockPledge = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_gpzy_distribute_statistics_company_em${getParams(params)}`);
};

/**
 * 东财股票账户统计
 */
export const getEastMoneyStockAccount = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_account_statistics_em${getParams(params)}`);
};

/**
 * 分析师指数排行
 */
export const getAnalystIndex = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_analyst_rank_em${getParams(params)}`);
};

/**
 * 分析师详情
 */
export const getAnalystDetail = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_analyst_detail_em${getParams(params)}`);
};

/**
 * 千股千评
 */
export const getStockComment = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_comment_em${getParams(params)}`);
};
