'use server';

class TaskScheduler {
  private static instance: TaskScheduler | null = null;
  private messageTemplate: string = '当前系统时间';
  private timer: ReturnType<typeof setInterval> | null = null;
  private interval: number = 5000;

  // 私有构造函数，防止外部实例化
  private constructor() {}

  // 获取单例实例
  public static getInstance(): TaskScheduler {
    if (!TaskScheduler.instance) {
      console.log('TaskScheduler 实例化');
      TaskScheduler.instance = new TaskScheduler();
    }
    return TaskScheduler.instance;
  }

  public startTimeLogger(callback: () => void): void {
    this.stopTimeLogger();
    this.timer = setInterval(() => {
      const now = new Date();
      callback?.();
      console.log(`${this.messageTemplate}: ${now.toLocaleString('zh-CN')}`);
    }, this.interval);
  }

  public stopTimeLogger(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    console.log(this.timer, 'stopTimeLogger2');
  }

  public updateMessage(newMessage: string): void {
    this.messageTemplate = newMessage;
  }
}

// 导出实例方法
export async function startTimeLogger() {
  const scheduler = TaskScheduler.getInstance();
  scheduler.startTimeLogger();
}

export async function updateLoggerMessage(newMessage: string) {
  const scheduler = TaskScheduler.getInstance();
  scheduler.updateMessage(newMessage);
  scheduler.startTimeLogger();
}
