// 'use server';
import { Subscriber } from '../utils/subscribe/subscriber';
import { SubscribeCenter } from '../utils/subscribe/subscribe-center';
import { emailStrategy } from '../utils/notification-tool/email';
import { getAllSubscriptionSettings } from '../actions/subscription';
import { getValidUserConfigs } from '../utils/common/chart';
export const subscribeCenter = new SubscribeCenter();

export const initializeApp = async () => {
  console.log('应用初始化');
  // 获取所有的订阅用户的订阅设置
  const settings = await getAllSubscriptionSettings();
  // 按用户进行分类
  const users = getValidUserConfigs(settings);
  users.forEach(user => {
    // 注册用户
    const subscriber = new Subscriber(user);
    subscribeCenter.register(subscriber, emailStrategy);
  });
  console.log('订阅者列表111');
  // 任务开启
  subscribeCenter.startTask();
};
