// import { taskScheduler } from './scheduler';
// import { postMail } from '../utils/monitor-stock/index';
'use server';
import { Observer, Subscriber } from '../utils/subscribe/subscriber';
import { SubscribeCenter } from '../utils/subscribe/subscribe-center';
import { emailStrategy } from '../utils/notification-tool/email';

// daily: { top: 70.73, middle: 77.04, bottom: 64.43 },

const user1: Observer = {
  id: 'id12222222',
  email: '1031690983@qq.com',
  config: [
    {
      socket: 'SZ688167',
      settings: [{ isSubscribed: 'Y', bollPeriod: 'daily', bollLine: 'upper', breakDirection: 'up' }]
    },
    {
      socket: 'SZxxxxxxx',
      settings: [{ isSubscribed: 'N' }]
    }
  ]
};

export const initializeApp = async () => {
  console.log('应用初始化');
  // 启动定时任务
  /* postMail([], []) */
  // taskScheduler.startTimeEvent(() => console.log('第一个定时器开始执行了'));
  // 其他初始化代码...
  const user = new Subscriber(user1);
  const userx = new Subscriber(user1);
  const subscribeCenter = new SubscribeCenter();
  subscribeCenter.register(user, emailStrategy);
  subscribeCenter.register(userx, emailStrategy);

  // 每天定时爬取所有股票，并且计算出BOLL指标等各种指标，再回传到数据库
  subscribeCenter.crawlAllStock();
  subscribeCenter.startTask();
};
