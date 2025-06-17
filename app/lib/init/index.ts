'use server';
import { Observer, Subscriber } from '../utils/subscribe/subscriber';
import { SubscribeCenter } from '../utils/subscribe/subscribe-center';
import { emailStrategy } from '../utils/notification-tool/email';
import cron from 'node-cron';
import { getAllSubscriptionSettings } from '../actions/subscription';

// const user1: Observer[] = [
//   {
//     id: 'id12222222',
//     email: '1031690983@qq.com',
//     config: [
//       {
//         socket: 'SZ688167',
//         settings: [{ isSubscribed: 'Y', bollPeriod: 'daily', bollLine: 'upper', breakDirection: 'up' }]
//       },
//       {
//         socket: 'SZxxxxxxx',
//         settings: [{ isSubscribed: 'N' }]
//       }
//     ]
//   }
// ];

// const y = [
//   {
//     userId: '410544b2-4001-4271-9855-fec4b6a6442a',
//     stockSymbol: 'SZ002258',
//     settings: [{ isSubscribed: 'Y', bollPeriod: 'daily', bollLine: 'upper', breakDirection: 'up' }],
//     updatedAt: '2025-06-10T10:40:43.305Z',
//     email: '617938514@qq.com'
//   },
//   {
//     userId: '410544b2-4001-4271-9855-fec4b6a6442a',
//     stockSymbol: 'SZxxxxxxx',
//     settings: [{ isSubscribed: 'N' }],
//     updatedAt: '2025-06-10T10:40:43.305Z',
//     email: '617938514@qq.com'
//   }
// ];

const getValidUserConfigs = (config: any[]) => {
  const valid = config.filter(item => {
    const { userId, stockSymbol, settings, email } = item;
    return userId && stockSymbol && email && settings?.length;
  });
  const userMap: Record<string, Observer> = {};
  valid.forEach(item => {
    const { userId, email, stockSymbol, settings } = item;
    // 初始化或更新用户对象
    if (!userMap[userId]) {
      userMap[userId] = {
        id: userId,
        email,
        config: []
      };
    }
    // 添加当前stockSymbol和settings到config
    userMap[userId].config.push({
      socket: stockSymbol,
      settings
    });
  });
  return Object.values(userMap);
};

export const initializeApp = async () => {
  console.log('应用初始化');
  const subscribeCenter = new SubscribeCenter();
  // 获取所有的订阅用户的订阅设置
  const settings = await getAllSubscriptionSettings();
  // 按用户进行分类
  const users = getValidUserConfigs(settings);
  // console.log('users', JSON.stringify(users, null, 2));
  users.forEach(user => {
    // 注册用户
    const subscriber = new Subscriber(user);
    subscribeCenter.register(subscriber, emailStrategy);
  });
  // 每天下午3点10分 爬取所有股票，并且计算出BOLL指标等各种指标，再回传到数据库
  cron.schedule('* 10 15 *  *', async () => {
    subscribeCenter.crawlAllStock();
    console.log('开始爬取所有股票，并且计算出BOLL指标等各种指标，再回传到数据库');
  });
  // 任务开启
  subscribeCenter.startTask();
};
