'use server';
import axios from 'axios';
import { updateStocksFromXueqiu } from '@/app/lib/db/stock/stock-list';
import { Cookie } from 'next/font/google';

/**
 * 雪球股票数据接口
 * @interface StockData
 */
export interface StockData {
  symbol: string; // 股票代码
  name: string; // 股票名称
  current: number; // 当前价格
  percent: number; // 涨跌幅
  chg: number; // 涨跌额
  volume: number; // 成交量
  amount: number; // 成交额
  market_capital: number; // 总市值
  current_year_percent: number; // 年初至今涨跌幅
  float_market_capital: number; // 流通市值
  turnover_rate: number; // 换手率
  amplitude: number; // 振幅
  open: number; // 开盘价
  last_close: number; // 昨收价
  high: number; // 最高价
  low: number; // 最低价
  pe_ttm: number; // 市盈率(TTM)
  pe_forecast: number; // 预测市盈率
  pe_lyr: number; // 市盈率(LYR)
  pb: number; // 市净率
  ps: number; // 市销率
  pcf: number; // 市现率
  total_shares: number; // 总股本
  float_shares: number; // 流通股本
  dividend_yield: number; // 股息率
  lot_size: number; // 每手股数
  industry_name: string; // 所属行业
  industry_code: string; // 行业代码
  pledge_ratio: number; // 质押率
  goodwill_in_net_assets: number; // 商誉占净资产比例
  timestamp: number; // 时间戳
  exchange: string; // 交易所
  status: string; // 状态
  type: number; // 类型
  flag: number; // 标记
  tick_size: number; // 最小变动单位
  currency: string; // 货币类型
}

/**
 * 雪球API响应接口
 */
interface XueqiuResponse {
  data: {
    list: StockData[];
  };
}

/**
 * K线数据接口
 * @interface KlineData
 */
export interface KlineData {
  timestamp: number; // 时间戳
  volume: number; // 成交量
  open: number; // 开盘价
  high: number; // 最高价
  low: number; // 最低价
  close: number; // 收盘价
  chg: number; // 涨跌额
  percent: number; // 涨跌幅
  turnoverrate: number; // 换手率
  amount: number; // 成交额
  volume_post: number; // 盘后成交量
  amount_post: number; // 盘后成交额
  pe: number; // 市盈率
  pb: number; // 市净率
  ps: number; // 市销率
  pcf: number; // 市现率
  market_capital: number; // 总市值
  balance: number; // 资金余额
  hold_volume_cn: number; // 陆股通持股量
  hold_ratio_cn: number; // 陆股通持股比例
  net_volume_cn: number; // 陆股通净买入
}

export type KlineDataTuple = Array<Array<number>>;

/**
 * K线数据API响应接口
 */
interface KlineResponse {
  data: {
    item: KlineDataTuple;
    // symbol: string;
    column: string[];
  };
}

/**
 * 股票数据爬虫类
 * @class StockCrawler
 */
class StockCrawler {
  // private token: string;
  private headers: Record<string, string>;

  constructor() {
    // 初始化配置
    // this.token = process.env.XUEQIU_TOKEN || 'YOUR_TOKEN_HERE';
    this.headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      // Cookie: `cookiesu=301738677203513; xq_a_token=b1d767edc014ddf478005982ba9e053910dad8dc; xqat=b1d767edc014ddf478005982ba9e053910dad8dc; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTc0MDg3NzAzNywiY3RtIjoxNzM4Njc3MjAzNTE4LCJjaWQiOiJkOWQwbjRBWnVwIn0.cS4kqbA1TboTv3zg5YJZsoyeQ7rnJexvchCOXFULnBLbLjwZdOH_1NSYEuhl3kl6Nhhm3Jgqmw6mOcyQdydwkFT1PZkOIt3qGwa6m7kA8dlE-R_kZ2c9LBzITb9NtzBPk2nCpCdg-ScvbuzHKbubXB6DvENMd79K7u0LyjHvTtvAGwMmDxJ8q1NKs6-i8GkvWeqJtsKTksXVAdJfridYQ-8eNlEmTJSJL9tbr4TbNn4RTml9oYevk8pqUydrThBOQOZCRNMvW5rDFl7wrbL9O3_hMgmdmbpyJh5eXF4f2f7Dvk_oVeMCjqAS5KCgtC2OSB7xAfaVaJq_Ye4EKtMlhw; xq_r_token=4ac6dcb5a1bd823260eef986e5e529b07195748d; u=301738677203513; ssxmod_itna=Yq0xcQit0QiQF4Cq0Lx0PDQ92jPHeD9eP=GoIe9cx0yueGzDAxn40iDt=rqiqxFPQqQG2GxFeHenvL5qCgDqLeeF0b3ipDU4i8DCkx5TTDeetD5xGoDPxDeDAGqGaDb4DrnoqGp9uXvX6uDAQDQ4GyDitDKT09Di3DA4Dj8kxQ+DqB0DDl00ThlhDDbE=MB4rxaeDSF0UK8A=DjqGgDBdqf=TDGuFC2GNM8ZarOgQq=eGuDG6KEudP6DtV0wQrLG5FKGvoDfGotfx5YYxz07hi9zGPbAYz4kxp8Yx6o3h5AAxUHxqDG4YG8GDD==; ssxmod_itna2=Yq0xcQit0QiQF4Cq0Lx0PDQ92jPHeD9eP=GoIe9xn93KDsLDwxqjKG774D==; Hm_lvt_1db88642e346389874251b5a1eded6e3=1738669153; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1738677209; HMACCOUNT=9257A19C5F4B5828; device_id=c536d399cfd28af8db0958494300e2f1`
      Cookie: `cookiesu=711736585931987; device_id=b430e3072a48ffd67b432783b7a62861; s=aq1233ysd3; Hm_lvt_1db88642e346389874251b5a1eded6e3=1739804548; HMACCOUNT=491F5C940196B965; xq_a_token=3fd584b1737cd2ac2950be7a8b0785c56a7bb0ea; xqat=3fd584b1737cd2ac2950be7a8b0785c56a7bb0ea; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOjcxNTI0NjY1NjMsImlzcyI6InVjIiwiZXhwIjoxNzQxMjY2MDcxLCJjdG0iOjE3Mzk4MDQ2NDE3MDgsImNpZCI6ImQ5ZDBuNEFadXAifQ.oGdFOEY10NnPeD6_f4lDPnrk8-aOn0wBOjAXLrjWW5UjQbn2D3-g7QRoo_ZTZoevLIBiG1xLkWiamUXv2l3ZFJtcoL466ytwBvhTA9Q8WyojY6wJ6vioiBFf7PuSvjhu9NTVI8VD5Y8l-iDEaC4rcE3O-5ecRZJxj6YedUW4LDHxELnZUH7WOp0vQKXUHc8wkPwYpT5xYNa3Jo-G8a72GkJwpyBY12S9LkmkfzRvj5MPIWR9FzjPeEFsKg9mpN_teA7S6XTN_kKer46v_BjfI_pMvNe7fXYh7merehzKJEeM9SwCnu3XnjoK4LD67nHS6r3AqI_q_ZkH1ekXDBrOsg; xq_r_token=780c639f2006caf823cc2a191ffb9614f02e5337; xq_is_login=1; u=7152466563; is_overseas=0; ssxmod_itna=7qGOGIwDCDODX8DHYbYYK0=GODgjYtKUtlFz9zUDBM4AI5DZDiqAPGhDCSE/DQ+iqHeCg8c0W=46AcLK68nO0fNkFrB8m5DU4i8DCkqIxNDeWtD5xGoDPxDeDAWKiTDY4DdUEHy=DEDeKDmxiODl9H0xDauxi3UhKDRZ5D0=THDQKDuP5xDG5xGb0Pqj0PtFHHitBpDiyKc12PUxG1O40HU7dxU=g6gbizcZ8jQU48PFYDvxDkqSKDoZcpbeyzQK2xLn0xNiiev7nPkC241A0KYe2dYCrqPB1KkXhd=m2dfn=/eDDWiBZP4D; ssxmod_itna2=7qGOGIwDCDODX8DHYbYYK0=GODgjYtKUtlFz9D8d6OxGXLdqGa85fsXFU59IX8moPG2YB408DewGD===; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1739804615`
    };
  }

  /**
   * 获取单页股票列表数据
   * @param page 页码
   * @param size 每页数量
   * @returns Promise<StockData[]>
   */
  async crawlStocksList(page: number = 1, size: number = 100): Promise<StockData[]> {
    try {
      const response = await axios.get<XueqiuResponse>(`https://stock.xueqiu.com/v5/stock/screener/quote/list.json`, {
        headers: this.headers,
        params: {
          page,
          size,
          order: 'desc',
          order_by: 'percent',
          market: 'CN',
          type: 'sh_sz'
        }
      });
      console.log(response?.data?.data?.list, 'response.data.data.list');
      return response.data.data.list;
    } catch (error) {
      console.error('抓取雪球数据失败:', JSON.stringify(error, null, 2));
      return [];
    }
  }

  /**
   * 轮询获取所有股票数据
   * @param pageSize 每页数量
   * @param delayMs 请求间隔时间(毫秒)
   * @returns Promise<StockData[]>
   */
  async pollStocksList(pageSize: number = 100, delayMs: number = 500): Promise<StockData[]> {
    const allStocks: StockData[] = [];
    let page = 1;
    let pageStocks = [];

    do {
      try {
        if (page > 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }

        console.log(`正在获取第 ${page} 页数据...`);
        pageStocks = await this.crawlStocksList(page, pageSize);

        if (pageStocks.length === 0) {
          console.log(`没有更多数据，在第 ${page} 页停止`);
          break;
        }

        allStocks.push(...pageStocks);
        pageStocks.length && (await updateStocksFromXueqiu(pageStocks));
        console.log(`成功获取第 ${page} 页数据，当前总共 ${allStocks.length} 条记录`);

        page++;
      } catch (error) {
        console.error(`获取第 ${page} 页数据时出错:`, error);
        break;
      }
    } while (pageStocks.length > 0);

    return allStocks;
  }

  /**
   * 获取单个股票的K线数据
   * @param symbol 股票代码（如：SZ000333）
   * @param period 周期（day/week/month/quarter/year）
   * @param count 获取数据条数
   * @param type 查询方向（before/after）
   * @returns Promise<KlineData[]>
   */
  async getKlineData(
    symbol: string,
    period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day',
    count: number = -284,
    type: 'before' | 'after' = 'before'
  ): Promise<KlineResponse['data']> {
    try {
      const begin = Date.now();
      const response = await axios.get<KlineResponse>('https://stock.xueqiu.com/v5/stock/chart/kline.json', {
        headers: this.headers,
        params: {
          symbol,
          begin,
          period,
          type,
          count,
          indicator: 'kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance'
          // md5__1632: 'eqjxuDBDgD0GBDiqGN9CDUor0DOl1r7Fq4D'
        }
      });

      console.log(symbol, begin, period, type, count);
      if (response.data?.data) {
        return response.data.data;
      }

      return { item: [], column: [] };
    } catch (error) {
      console.error(`获取${symbol}的K线数据失败:`, error);
      return { item: [], column: [] };
    }
  }

  /**
   * 批量获取多个股票的K线数据
   * @param symbols 股票代码数组
   * @param period 周期
   * @param count 每个股票获取的数据条数
   * @returns Promise<Record<string, KlineData[]>> 以股票代码为key的K线数据映射
   */
  async batchGetKlineData(
    symbols: string[],
    period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day',
    count: number = -100
  ): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    for (const symbol of symbols) {
      try {
        // 添加延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`正在获取 ${symbol} 的K线数据...`);

        const klineData = await this.getKlineData(symbol, period, count);
        // console.log(klineData, 'klineData');
        result[symbol] = klineData;

        console.log(`成功获取 ${symbol} 的K线数据，共 ${klineData.item.length} 条记录`);
      } catch (error) {
        console.error(`获取 ${symbol} 的K线数据失败:`, error);
        result[symbol] = {};
      }
    }

    return result;
  }
}

/**
 * 获取爬虫实例
 */
const getStockCrawler = () => {
  return new StockCrawler();
};

// 修改所有导出方法为异步函数
/**
 * 获取单页股票列表
 * @param page 页码
 * @param size 每页数量
 */
export async function crawlXueqiuStocksList(page = 1, size = 100) {
  const crawler = getStockCrawler();
  console.log(crawler, 'crawler');
  return crawler.crawlStocksList(page, size);
}

/**
 * 轮询获取所有股票数据
 * @param pageSize 每页数量
 * @param delayMs 请求间隔(毫秒)
 */
export async function pollXueqiuStocksList(pageSize = 100, delayMs = 500) {
  const crawler = getStockCrawler();
  return crawler.pollStocksList(pageSize, delayMs);
}

/**
 * 获取单个股票K线数据
 * @param symbol 股票代码
 * @param period 周期
 * @param count 数据条数
 */
export async function getStockKline(
  symbol: string,
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year',
  count?: number
) {
  const crawler = getStockCrawler();
  return crawler.getKlineData(symbol, period, count);
}

/**
 * 批量获取多个股票的K线数据
 * @param symbols 股票代码数组
 * @param period 周期
 * @param count 数据条数
 */
export async function batchGetStockKline(
  symbols: string[],
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year',
  count?: number
) {
  const crawler = getStockCrawler();
  return crawler.batchGetKlineData(symbols, period, count);
}
