'use server';

class TaskScheduler {
  private static instance: TaskScheduler | null = null;
  private messageTemplate: string = '当前系统时间';
  private timer: ReturnType<typeof setInterval> | null = null;
  private interval: number = 5000;
  private callback: () => void;

  // 私有构造函数，防止外部实例化
  private constructor(callback: () => void) {
    this.callback = callback;
  }

  // 获取单例实例
  public static getInstance(callback: () => void): TaskScheduler {
    if (!TaskScheduler.instance) {
      console.log('TaskScheduler 实例化');
      TaskScheduler.instance = new TaskScheduler(callback);
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

  // 更新订阅信息
  public updateDescriptMessage(newMessage: string): void {
    this.messageTemplate = newMessage;
    // 更新后重启定时器
    this.startTimeLogger(this.callback);
  }
}

// 导出实例方法
export async function startTimeLogger(callback: () => void) {
  const scheduler = TaskScheduler.getInstance(callback);
  scheduler.startTimeLogger(callback);
}

//更新订阅信息
export async function updateDescriptMessage(message = '', callback: () => void) {
  const scheduler = TaskScheduler.getInstance(callback);
  // 获取订阅信息
  scheduler.updateDescriptMessage(message);
}
