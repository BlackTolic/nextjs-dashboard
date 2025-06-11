/**
 *  当订阅者
 *  订阅的消息
 *  满足条件时，
 *  通过email发送通知给订阅者
 **/

interface Config {
  socket: string;
  settings: { week: string }[];
}

export interface Observer {
  id: string;
  email: string;
  config: Config;
}

// 订阅者
export class Subscriber implements Observer {
  id: string;
  email: string;
  config: Config;

  constructor(user: Observer) {
    this.id = user.id;
    this.email = user.email;
    this.config = user.config;
  }

  update(message: string): void {
    console.log(`${this.id} 收到新闻: ${message}`);
  }
}
