import { Observer, Subscriber } from './subscriber';

class SubscribeCenter {
  private subscribers: Subscriber[] = [];
  private notifyTool: any;

  constructor() {}

  register(subscriber: Subscriber, notifyTool: any) {
    if (subscriber instanceof Subscriber) {
      this.subscribers.push(subscriber);
    }
  }

  // 注销订阅者
  unregister(subscriber: Subscriber) {
    const index = this.subscribers.indexOf(subscriber);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  // 通知所有订阅者
  notify(...args: any) {
    this.subscribers.forEach(subscriber => {
      subscriber.update(...args);
    });
  }
}

const user1: Observer = {
  id: '1',
  email: '617938',
  config: {
    socket: 'socket1',
    settings: [{ week: 'sss' }]
  }
};

const user = new Subscriber(user1);

const subscribeCenter = new SubscribeCenter();

subscribeCenter.register(user, tool);
