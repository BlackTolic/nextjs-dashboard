import { startTimeLogger } from './scheduler';
import { postMail } from '../utils/monitor-stock/index';

export function initializeApp() {
  console.log('应用初始化');
  // 启动定时任务
  startTimeLogger(() => postMail([], []));
  // 其他初始化代码...
}

initializeApp();
