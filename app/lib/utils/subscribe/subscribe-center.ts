import { emailStrategy } from '../notification-tool/email';
import { Observer, Subscriber } from './subscriber';
import * as api from '@/app/api/stock';
import dayjs from 'dayjs';
import { calculateBOLL, getSocketSymbol, transformData } from '../common/chart';
import { mockAllTimeData } from '../../mock/subscribe-center';
import cron from 'node-cron';

export type NotifyTool = typeof emailStrategy | null;
type TemplateParams = Observer['config'][number]['settings'][number];

export class SubscribeCenter {
  public subscribers: Map<string, any>; // 订阅者列表
  notifyTool: NotifyTool; // 通知工具
  notifyTeplate: string; // 通知模板
  public subscribedStocks: Map<string, any>; // 所有用户订阅的股票详情
  public allStocksComputedVal: Map<string, any>; // 所有股票当日计算后的配置值

  constructor() {
    // todo 暂时存在内存中，后续需要redis持久化
    this.notifyTool = null;
    this.notifyTeplate = '';
    this.subscribedStocks = new Map(); // 所有用户订阅的股票
    this.allStocksComputedVal = new Map(); // 所有股票
    this.subscribers = new Map(); // 订阅者列表
  }

  register(subscriber: Subscriber, notifyTool: NotifyTool) {
    if (subscriber instanceof Subscriber) {
      // 添加到订阅者列表中
      this.subscribers.set(subscriber.id, subscriber);
      // 注册订阅者并设置通知工具
      this.notifyTool = notifyTool;
      // 判断当前用户订阅的股票的BOLL指标是否已经计算过，如果没有计算过，则计算BOLL指标
      // subscriber.config.forEach(config => {
      //   const { socket } = config;
      //   if (!this.allStocksComputedVal.has(socket)) {
      //     this.computedBollIndex([socket]);
      //   }
      // });
    }
  }

  // 更新订阅者
  updateSubscriber(id: string, subscriber: Subscriber) {
    this.subscribers.set(id, subscriber);
  }

  // 注销订阅者
  unregister(subscriberId: string) {
    const { subscribers, allStocksComputedVal } = this;
    subscribers.get(subscriberId).config.forEach((config: { socket: any }) => {
      const { socket } = config;
      if (allStocksComputedVal.has(socket)) {
        allStocksComputedVal.delete(socket);
      }
    });
    subscribers.delete(subscriberId);
  }

  // 通知所有订阅者
  notifyEverybody() {
    const { allStocksComputedVal, subscribedStocks } = this;
    this.subscribers.forEach(subscriber => {
      // 将实时股票值、计算出的所有股票boll值、通讯工具给订阅者
      subscriber.update(subscribedStocks, allStocksComputedVal, this.notifyTool);
    });
  }

  // 制定通知模板
  makeNotifyTeplate(params: TemplateParams) {
    return `哈哈哈哈哈，这是一个通知模板params: ${params}`;
  }

  // 获取所有用户订阅的股票代码
  getSubscribedStockSymbols() {
    const allSubscribedStock: string[] = []; // 所有用户订阅的股票
    this.subscribers.forEach((value, key) => {
      value.config.forEach((config: any) => {
        allSubscribedStock.push(getSocketSymbol(config.socket));
      });
    });
    return [...new Set(allSubscribedStock)];
  }

  // 获取所有用户订阅票的实时信息
  async getStocksRealTimeInfo() {
    // 首先使用一次获取全部的接口
    let res;
    try {
      // res = await api.getAllStockRealTimeQuote();
      res = mockAllTimeData;
    } catch (error) {
      // 如果获取全部的接口失败，使用降级接口
      res = mockAllTimeData;
    }
    // console.log('res', res);
    return res;
  }

  // 实时拉取所有用户已经订阅的股票
  async pullAllSubscribedStock() {
    // 获取所有用户订阅的股票代码
    const repeatedStock = this.getSubscribedStockSymbols();
    // 拉取所有票的实时信息
    const res = await this.getStocksRealTimeInfo();
    const subscribedStocks = res.filter((x: { symbol: string }) => {
      // 不同的接口返回的股票代码前缀有所不同，这里统一处理-截取股票代码
      const sym = getSocketSymbol(x.symbol);
      return repeatedStock.includes(sym);
    });
    this.subscribedStocks = new Map(subscribedStocks.map((x: { symbol: any }) => [x.symbol, x]));
    // console.log('subscribedStocks', this.subscribedStocks);
  }

  // 计算当前股票的BOLL指标等各种指标，编制渔网，再回传到数据库
  async computedBollIndex(socket: string[]) {
    // 爬取20日线计算boll值
    const periodMap: { [key: string]: 'day' | 'week' | 'month' } = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month'
    };

    const allRes = (Object.keys(periodMap) as ('daily' | 'weekly' | 'monthly')[]).map(per => {
      // 由于 period 是 string 类型，不能直接用于索引 periodMap，需要做类型断言
      const start = dayjs().subtract(40, periodMap[per]).format('YYYYMMDD');
      const end = dayjs().format('YYYYMMDD');
      return api.batchGetStockHistory({
        symbolArr: socket,
        period: per,
        start_date: start,
        end_date: end
      });
    });
    const res = await Promise.all(allRes);
    const newItems = res.flat().map((x: any) => {
      const { symbol, period, column, item } = x;
      const [middle, top, bottom] = calculateBOLL(column, item, 20); // 计算BOLL
      return { symbol: getSocketSymbol(symbol), period, upper: top, middle, lower: bottom };
    });
    const trsData = transformData(newItems);
    Object.keys(trsData).forEach(symbol => {
      this.allStocksComputedVal.set(symbol, trsData[symbol]);
    });
  }

  // 计算出BOLL指标等各种指标，编制渔网，再回传到数据库
  async crawlAllStock() {
    // todo 1.定时爬取所有票，这里暂时使用已经订阅的票
    // const allSubscribedStock = this.pullAllSubscribedStock();
    // const allSockets = ['SZ688167', 'SZ002258'];
    const allSockets = this.getSubscribedStockSymbols();
    this.computedBollIndex(allSockets);
  }

  async pullSelectStock(socket: string) {
    const res = api.getStockRealTime({ symbol: socket });
    // console.log(res, 'res');
    return res;
  }

  // 启动任务
  async startTask() {
    try {
      // 每天下午3点10分 爬取所有股票，并且计算出BOLL指标等各种指标，再回传到数据库
      cron.schedule('* 10 15 *  *', async () => {
        this.crawlAllStock();
        console.log('开始爬取所有股票，并且计算出BOLL指标等各种指标，再回传到数据库');
      });
      // 开启定时任务，每隔5min拉取所有已经订阅的股票,并看当前值是否满足条件
      cron.schedule('5 * * *  *', async () => {
        console.log('开启定时任务，每隔5min拉取');
        await this.pullAllSubscribedStock();
        this.notifyEverybody();
      });
    } catch (error) {
      console.error('启动任务失败:', error);
    }
  }
}
