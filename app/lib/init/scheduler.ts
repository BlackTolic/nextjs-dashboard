class TaskScheduler {
  private static instance: TaskScheduler | null = null;
  private messageTemplate: string = '当前系统时间';
  private timer: ReturnType<typeof setInterval> | null = null;
  private interval: number = 5000;
  private callback?: () => void;

  constructor(callback?: () => void) {
    if (callback) {
      this.callback = callback;
    }
  }

  public startTimeEvent(callback: () => void): void {
    try {
      this.callback = callback;
      this.timer = setInterval(() => {
        const now = new Date();
        callback?.();
        console.log(`${this.messageTemplate}: ${now.toLocaleString('zh-CN')}`);
      }, this.interval);
    } catch (error) {
      this.stopTimeEvent();
      console.error('定时任务执行错误:', error);
    }
  }

  public stopTimeEvent(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    console.log(this.timer, 'stopTimeLogger2');
  }

  // 更新订阅信息
  public updateTimeEvent(callback: () => void): void {
    if (this.timer) {
      this.stopTimeEvent();
    }
    // 更新后重启定时器
    this.startTimeEvent(callback);
  }
}

export const taskScheduler = new TaskScheduler();
