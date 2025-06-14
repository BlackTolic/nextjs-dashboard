// import { taskScheduler } from './scheduler';
// import { postMail } from '../utils/monitor-stock/index';
'use server';
import { Observer, Subscriber } from '../utils/subscribe/subscriber';
import { SubscribeCenter } from '../utils/subscribe/subscribe-center';
import { emailStrategy } from '../utils/notification-tool/email';

const user1: Observer = {
  id: '1',
  email: '617938',
  config: [
    {
      socket: 'socket1',
      settings: [{ isSubscribed: 'Y' }]
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
  const subscribeCenter = new SubscribeCenter();
  subscribeCenter.register(user, emailStrategy);
  // 每天定时爬取所有股票，并且计算出BOLL指标等各种指标，再回传到数据库
  subscribeCenter.crawlAllStock();
  subscribeCenter.startTask();
};
