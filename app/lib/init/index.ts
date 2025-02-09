import { startTimeLogger } from './scheduler';

export function initializeApp() {
  console.log('应用初始化');
  // 启动定时任务
  startTimeLogger();
  // 其他初始化代码...
}

initializeApp();
