'use server';
import axios from 'axios';
import { updateStocksFromXueqiu } from '@/app/lib/db/stock/stock-list';

export interface StockData {
  symbol: string;
  name: string;
  current: number;
  percent: number;
  volume: number;
  amount: number;
  market_capital: number;
  current_year_percent: number;
}

interface XueqiuResponse {
  data: {
    list: StockData[];
  };
}

const token = process.env.XUEQIU_TOKEN || 'YOUR_TOKEN_HERE';

export async function crawlXueqiuStocksList(page: number = 1, size: number = 100): Promise<StockData[]> {
  // console.log('开始抓取雪球数据',window);
  try {
    // 加上伪装
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      Cookie: `cookiesu=711736585931987; device_id=b430e3072a48ffd67b432783b7a62861; Hm_lvt_1db88642e346389874251b5a1eded6e3=1736585856; HMACCOUNT=491F5C940196B965; xq_a_token=9d7a484a1aec338da9bff718d136672f9b95f2a3; xqat=9d7a484a1aec338da9bff718d136672f9b95f2a3; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOjcxNTI0NjY1NjMsImlzcyI6InVjIiwiZXhwIjoxNzM5MTc4MDAxLCJjdG0iOjE3MzY1ODYwMDE2MjgsImNpZCI6ImQ5ZDBuNEFadXAifQ.gcMJb1NDOi-q3V96utXIC8XbiaRWoajfVjkQA8TWOvCzoUqCuhp33FLjA15IPf2di_ICnoixD5F_G53iV5VKOhHrab3ccQud88H3ZJ36JN0742_exY8IC0ziXkEWq_VDlZtXCQFisPDL7ofl7YuPx4aQetM1j8ACT56fDzp82mC_wpk0l3uik2mE5QdHL9CGNhP3ybjWkQz-wsAHi831azEMJpognpKVHlDF2asUhb7c48_oad5sS-7eU2V-RCmZ1Swb0R_5KIYIeOsvFczai28gTnXHMnXgALSqxfrS_HxP5pyhNrR4qkoxJv9evL7bFZqsqWCdFLk6Urfm5nfXjw; xq_r_token=11551904f2aaec3a19eeabbca29a76e381333e76; xq_is_login=1; u=7152466563; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1736586092; ssxmod_itna=mqIhBKGK0IMFGHDODUDGh3hG7tmPi=DBj7=jxU6x6Q0x053eGzDAxn40iDtx1vYRRedbDOxeAHKoQe7QWb+ZrnLx+YlRb9oiDCPGnDBKx=k+DYA1Dt4DTD34DYDigQGIDieDFGkVtCDbxi7DiKDpx0kho5DWa5DEDv8DYHGDDH=sx07DQyCFDDzFYfPIoRKizyHbF7IDi5xyE4CD7yIDlPY98xCazkUFjy10f+wXA9h540OD0Fh0xibhpoPucvwTm0dbmDe4ohYimnKejhYqmGPs06eAji4kYro4109eD+e5Yu346NDi6ie3wDD=; ssxmod_itna2=mqIhBKGK0IMFGHDODUDGh3hG7tmPi=DBj7=jxU6x6QDnIMIWdDskFoFDLiAdHT75helmiqhtKo6ClGtokB2jwNolYiugG+nDETeHoMmnTW48o948dxwfDTC04rnDnRx0GF0kw1iZbYf9jTpvYRD4xWiwfudfijUzC+Dij2v=DkqKAOv=FB0ufd3W9wG/Sn4xO8vCBOx4L+NtVbv8eavtxhorZ+jLjL=1FwLSmDtXQp0Znly+sf91MhcA21opcEt0bUB1fMije=TOLw6syhcuK4M45WeLlKOyl=kL/GIT0KX00zIzmhDSC5vA+BOvxjPOYY0=vXCAA6vniQAlmzDoNgwb2YWBwo2YvGj/BQP4LAloMYxLC2CCR6BLxofWzAHPo1Bmee3x2PFETz761W0sSuz8NV2pA7pi7oXQGagqzCGOPPiYxHDG280GUhtmuA0mH0fk+4HXmYFfYD08DiQdYD==`,
      Referer: 'https://stock.xueqiu.com/screener'
    };

    const response = await axios.get<XueqiuResponse>(`https://stock.xueqiu.com/v5/stock/screener/quote/list.json`, {
      headers,
      params: {
        page,
        size,
        order: 'desc',
        order_by: 'percent',
        market: 'CN',
        type: 'sh_sz'
        //   md5__1632=eqfxyDBD9DgDuQitDsD7IqwTrFaIe2DID
      }
    });

    return response.data.data.list;
  } catch (error) {
    console.error('抓取雪球数据失败:', error);
    return [];
  }
}

/**
 * 轮询获取多页雪球股票数据
 * @param maxPages 最大页数
 * @param pageSize 每页数量
 * @param delayMs 每次请求间隔(毫秒)
 * @returns 所有页面的股票数据合并数组
 */
export async function pollXueqiuStocksList(
  // maxPages: number = 60,
  pageSize: number = 100,
  delayMs: number = 500
): Promise<StockData[]> {
  const allStocks: StockData[] = [];
  let page = 1;
  let pageStocks = [];

  do {
    try {
      // 添加延迟避免请求过于频繁（第一页不需要延迟）
      if (page > 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

      console.log(`正在获取第 ${page} 页数据...`);
      pageStocks = await crawlXueqiuStocksList(page, pageSize);

      // 如果返回的数据为空，说明已经没有更多数据，退出循环
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
  // console.log(allStocks,'allStocks')
  return allStocks;
}

// 使用示例:
// const allStocks = await pollXueqiuStocks(5, 30, 1000); // 获取5页数据，每页30条，间隔1秒
