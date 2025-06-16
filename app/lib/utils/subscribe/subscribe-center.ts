import { Socket } from 'dgram';
import { emailStrategy } from '../notification-tool/email';
import { Observer, Subscriber } from './subscriber';
import * as api from '@/app/api/stock';
import dayjs from 'dayjs';
import { calculateBOLL, transformData } from '../common/chart';

export type NotifyTool = typeof emailStrategy | null;
type TemplateParams = Observer['config'][number]['settings'][number];

const test = [
  {
    id: '1',
    email: '617938',
    config: [
      {
        socket: 'socket1',
        settings: [{ week: 'sss' }, { week: 'ssxxxxs' }]
      },
      {
        socket: 'socket122',
        settings: [{ week: 'ss3s' }, { week: 'ssxxhhhxxs' }]
      }
    ]
  },
  {
    id: '2',
    email: '613337938',
    config: [
      {
        socket: 'socket2',
        settings: [{ week: 's22ss' }]
      }
    ]
  }
];

export class SubscribeCenter {
  // todo 优先使用set记录订阅者，方便查找且避免重复订阅
  private subscribers: Subscriber[] = []; // 订阅者列表
  notifyTool: NotifyTool; // 通知工具
  notifyTeplate: string; // 通知模板
  public subscribedStockDayIndex: Map<string, any>; // 每日拉取的已经订阅的股票的BOLL指标
  public subscribedStocks: Map<string, any>; // 所有用户订阅的股票
  public allStocks: Map<string, any>; // 所有股票

  constructor() {
    // todo 暂时存在内存中，后续需要redis持久化
    this.notifyTool = null;
    this.notifyTeplate = '';
    this.subscribedStockDayIndex = new Map(); // 每日拉取的已经订阅的股票的BOLL指标
    this.subscribedStocks = new Map(); // 所有用户订阅的股票
    this.allStocks = new Map(); // 所有股票
  }

  register(subscriber: Subscriber, notifyTool: NotifyTool) {
    if (subscriber instanceof Subscriber) {
      this.subscribers.push(subscriber);
      this.notifyTool = notifyTool; // 注册订阅者并设置通知工具
    }
  }

  // 注销订阅者
  unregister(subscriber: Subscriber) {
    const index = this.subscribers.indexOf(subscriber);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  // 通知所有订阅者
  notifyEverybody() {
    const { subscribedStockDayIndex, subscribedStocks } = this;
    this.subscribers.forEach(subscriber => {
      // 将计算出的所有股票boll值、实时股票值、通讯工具给订阅者
      subscriber.update(subscribedStockDayIndex, subscribedStocks, this.notifyTool);
    });
  }

  // 制定通知模板
  makeNotifyTeplate(params: TemplateParams) {
    return `哈哈哈哈哈，这是一个通知模板params: ${params}`;
  }

  // 实时拉取所有用户已经订阅的股票
  async pullAllSubscribedStock() {
    // 对所有用户订阅的票进行聚合，去重
    const allSubscribedStock = this.subscribers.flatMap(subscriber => subscriber.config).map(x => x.socket);
    const repeatedStock = [...new Set(allSubscribedStock)];
    console.log(repeatedStock, 'repeatedStock');
    // const allPromises = allSubscribedStock.map(socket => {
    //   // 拉取所有已经订阅的股票，计算出他们的boll线指标
    //   return this.pullSelectStock(socket);
    // });
    // const res = await Promise.all(allPromises);
    // 获取所有股票的实时报价
    // { symbol: repeatedStock.join(',
    const res = await api.getAllStockRealTimeQuote();
    console.log(res.length, 're');
    const subscribedStocks = res.filter((x: { symbol: string }) => {
      const sym = x.symbol.substring(-2);
      // console.log(sym, 'sym');
      return repeatedStock.includes(x.symbol.substring(-2));
    });
    console.log(subscribedStocks, 'subscribedStocks');
    this.subscribedStocks = new Map([subscribedStocks.map((x: { symbol: any }) => [x.symbol, x])]);
    console.log(this.subscribedStocks, 'this.subscribedStocks');
  }

  // 计算出BOLL指标等各种指标，编制渔网，再回传到数据库
  async crawlAllStock() {
    // 1.定时爬取所有票
    // const allSubscribedStock = this.pullAllSubscribedStock();
    const allSockets = ['SZ002821', 'SZ002258'];
    // 爬取20日线计算boll值
    const periodMap = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month'
    };

    const allRes = Object.keys(periodMap).map(per => {
      // 由于 period 是 string 类型，不能直接用于索引 periodMap，需要做类型断言
      const start = dayjs().subtract(40, periodMap[per]).format('YYYYMMDD');
      const end = dayjs().format('YYYYMMDD');
      const period = per; // 这里需要做类型断言,
      // console.log('start', start, 'end', end, 'period', period);
      return api.batchGetStockHistory({
        symbolArr: allSockets,
        period,
        start_date: start,
        end_date: end
      });
    });
    const res = await Promise.all(allRes);
    const newItems = res.flat().map((x: any) => {
      const { symbol, period, column, item } = x;
      const [top, middle, bottom] = calculateBOLL(column, item, 20); // 计算BOLL
      return { symbol, period, top, middle, bottom };
    });
    const trsData = transformData(newItems);
    Object.keys(trsData).forEach(symbol => {
      this.allStocks.set(symbol, trsData[symbol]);
    });
  }

  async pullSelectStock(socket: string) {
    // return await this.crawlAllStock();
    const res = api.getStockRealTime({ symbol: socket });
    console.log(res, 'res');
    return res;
  }

  // 拉取所有已经订阅的股票的BOLL指标
  async collectSubscribedStockIndex() {
    if (!this.subscribedStockDayIndex) {
      await this.crawlAllStock();
    }
    this.subscribedStockDayIndex = new Map([['SD090866', { weekBollTop: '22', weekBollBottom: '11' }]]);
  }

  // 启动任务
  async startTask() {
    try {
      // 设置定时器，每天定时爬虫爬取所有股票，拉取crawlAllStock中已经订阅的股票的BOLL指标
      // await this.crawlAllStock();
      // console.log(this.allStocks, ' this.allStocks');

      // 开启定时任务，每隔5min拉取所有已经订阅的股票,并看当前值是否满足条件
      setTimeout(async () => {
        await this.pullAllSubscribedStock();
        this.notifyEverybody();
      }, 1000);
    } catch (error) {
      console.error('启动任务失败:', error);
    }
  }
}
