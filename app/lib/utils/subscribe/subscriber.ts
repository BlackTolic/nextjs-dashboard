/**
 *  当订阅者
 *  订阅的消息
 *  满足条件时，
 *  通过email发送通知给订阅者
 **/

// 订阅者
class Subscriber {
  private id: string;
  private name: string;
  private email: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  notify(eventId: string, data: any) {
    console.log(`用户[${this.name}]收到事件[${eventId}]通知: ${data.message}`);
  }
}
