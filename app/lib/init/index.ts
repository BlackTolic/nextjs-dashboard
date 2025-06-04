import { taskScheduler } from './scheduler';
import { postMail } from '../utils/monitor-stock/index';

export const initializeApp = async () => {
  console.log('应用初始化');
  // 启动定时任务
  /* postMail([], []) */
  taskScheduler.startTimeEvent(() => console.log('第一个定时器开始执行了'));
  // 其他初始化代码...
};
