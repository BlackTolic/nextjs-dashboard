class EventManager {
  private events: { [key: string]: Function[] } = {};

  constructor() {}

  subscribe(eventName: string, callback: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
  }

  unsubscribe(eventName: string, callback: Function) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(fn => fn !== callback);
    }
  }

  notify(eventName: string, ...args: any[]) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(fn => fn(...args));
    }
  }
}

class NotifyProcessor extends EventManager {
  processOrder(order) {
    console.log(`处理订单: ${order.id}`);

    // 订单处理完成后通知观察者
    setTimeout(() => {
      this.notify({
        orderId: order.id,
        status: '已完成',
        timestamp: new Date().toISOString()
      });
    }, 1000);
  }
}
