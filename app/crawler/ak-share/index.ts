import request from '@/app/api/request';
import axios from 'axios';

const base = `http://127.0.0.1:8080/api/public`;
type transform = Record<string, string>;

import {
  BlockFundRankPrps,
  IndustryTradePrps,
  StockConceptFundFlowPrps,
  StockDetailPrps,
  StockFinancePrps,
  StockHeatPrps,
  StockHighLowPrps,
  StockShareHolderPrps
} from './interface';

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
export const getStockComment = async (params?: StockDetailPrps) => {
  return await request.get(`${base}/stock_comment_em${getParams(params)}`);
};

/**
 * 个股历史评分
 */
export const getStockCommentScore = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_comment_detail_zhpj_lspf_em${getParams(params)}`);
};

// 市场热度

/**
 * 用户关注指数
 */
export const getUserFollowIndex = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_comment_detail_scrd_focus_em${getParams(params)}`);
};

/**
 * 市场参与意愿（个股）
 */
export const getMarketParticipation = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_comment_detail_scrd_desire_em${getParams(params)}`);
};

/**
 * 沪深港通资金流向
 */
export const getStockMoneyFlow = async () => {
  return await request.get(`${base}/stock_hsgt_fund_flow_summary_em`);
};

/**
 * 板块排行
 */
export const getStockPlateRank = async (params: BlockFundRankPrps) => {
  return await request.get(`${base}/stock_hsgt_board_rank_em${getParams(params)}`);
};

/**
 * 个股新闻
 */
export const getStockNews = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_news_em${getParams(params)}`);
};

/**
 * 股东增减持
 */
export const getStockShareholders = async (params: StockShareHolderPrps) => {
  return await request.get(`${base}/stock_ggcg_em${getParams(params)}`);
};

/**
 * 分红配送
 */
export const getStockDividend = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_fhps_em${getParams(params)}`);
};

/**
 * 个股分红情况
 */
export const getStockDividendDetail = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_fhps_detail_ths${getParams(params)}`);
};

/**
 * 概念资金流
 */
export const getStockConceptFundFlow = async (params: StockConceptFundFlowPrps) => {
  return await request.get(`${base}/stock_fund_flow_concept${getParams(params)}`);
};

/**
 * 行业资金流
 */
export const getStockIndustryMoneyFlow = async (params: StockConceptFundFlowPrps) => {
  return await request.get(`${base}/stock_fund_flow_industry${getParams(params)}`);
};

/**
 * 个股资金流排名
 */
export const getStockMoneyFlowRank = async (params: StockConceptFundFlowPrps) => {
  return await request.get(`${base}/stock_individual_fund_flow_rank${getParams(params)}`);
};

/**
 * 资产负债表
 */
export const getStockBalanceSheet = async (params: StockFinancePrps) => {
  return await request.get(`${base}/stock_financial_debt_ths${getParams(params)}`);
};

/**
 * 利润表
 */
export const getStockProfitSheet = async (params: StockFinancePrps) => {
  return await request.get(`${base}/stock_financial_benefit_ths${getParams(params)}`);
};

/**
 * 现金流量表
 */
export const getStockCashFlowSheet = async (params: StockFinancePrps) => {
  return await request.get(`${base}/stock_financial_cash_ths${getParams(params)}`);
};

/**
 * 机构推荐池
 */
export const getStockOrganizationRecommend = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_institute_recommend${getParams(params)}`);
};

/**
 * 股债利差
 */
export const getStockBondDebtRatio = async () => {
  return await request.get(`${base}/stock_ebs_lg`);
};

/**
 * A股估值指标
 */
export const getStockValuation = async (params: StockDetailPrps) => {
  return await request.get(`${base}/stock_zh_valuation_baidu${getParams(params)}`);
};

/**
 * 创新高和新低的股票数量
 */
export const getStockNewHighAndLow = async (params: StockHighLowPrps) => {
  return await request.get(`${base}/stock_a_high_low_statistics`);
};

/**
 * 每日活跃营业部
 */
export const getStockActiveDealers = async (params: StockHighLowPrps) => {
  return await request.get(`${base}/stock_lhb_hyyyb_em`);
};

/**
 * 雪球股票热度
 */
export const getStockHot = async (params: StockHeatPrps) => {
  return await request.get(`${base}/stock_hot_follow_xq${getParams(params)}`);
};
