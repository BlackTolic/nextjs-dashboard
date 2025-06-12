import { setInterval } from 'timers/promises';
import { emailStrategy } from '../notification-tool/email';
import { Observer, Subscriber } from './subscriber';

type NotifyTool = typeof emailStrategy | null;
type TemplateParams = Observer['config'][number]['settings'][number];

class SubscribeCenter {
  // todo 优先使用set记录订阅者，方便查找且避免重复订阅
  private subscribers: Subscriber[] = []; // 订阅者列表
  notifyTool: NotifyTool; // 通知工具
  notifyTeplate: string; // 通知模板
  subscribedStockDayIndex: number[] = []; // 每日拉取的已经订阅的股票的BOLL指标
  subscribedStock: any[] = []; // 所有用户订阅的股票

  constructor() {
    // todo 暂时存在内存中，后续需要redis持久化
    this.notifyTool = null;
    this.notifyTeplate = '';
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
  notify(...args: any) {
    this.subscribers.forEach(subscriber => {
      subscriber.update(...args);
    });
  }

  // 制定通知模板
  makeNotifyTeplate(params: TemplateParams) {
    return `哈哈哈哈哈，这是一个通知模板params: ${params.week}`;
  }

  // 拉取所有已经订阅的股票
  pullAllSubscribedStock() {
    this.subscribedStock = this.subscribers.map(subscriber => subscriber.config.settings);
  }

  // 设置定时器，每天定时爬虫爬取所有股票，并且计算出BOLL指标等各种指标，再回传到数据库
  async crawlAllStock() {
    // 拉取所有已经订阅的股票，计算出他们的boll线指标
    const allSubscribedStock = this.pullAllSubscribedStock();
    //
  }

  async collectSubscribedStockIndex() {
    if (!this.subscribedStockDayIndex.length) {
      await this.crawlAllStock();
    }
    this.subscribedStockDayIndex = [11];
  }

  // 启动任务
  startTask() {
    // 拉取crawlAllStock中已经订阅的股票的BOLL指标
    this.collectSubscribedStockIndex();
    // 开启定时任务，每隔5min拉取所有已经订阅的股票,并看当前值是否满足条件
    setInterval(() => {
      this.pullAllSubscribedStock();
      this.subscribers.forEach(subscriber => {
        subscriber.config.settings.forEach(setting => {
          // 满足条件时，通过email发送通知给订阅者
          if (this.notifyTool) {
            this.notifyTool.sendMail({ to: subscriber.email, subject: '通知', text: this.makeNotifyTeplate(setting) });
          }
        });
      });
    });

    // 计算出他们的boll线指标
  }
}

const user1: Observer = {
  id: '1',
  email: '617938',
  config: {
    socket: 'socket1',
    settings: [{ week: 'sss' }]
  }
};

const user = new Subscriber(user1);

const subscribeCenter = new SubscribeCenter();

subscribeCenter.register(user, emailStrategy);
