/**
 *  当订阅者
 *  订阅的消息
 *  满足条件时，
 *  通过email发送通知给订阅者
 **/

import { SubscriptionItemProp } from '../../actions/subscription';
import { NotifyTool } from './subscribe-center';
import { getSocketSymbol } from '../common/chart';

interface Config {
  socket: string;
  settings: SubscriptionItemProp['settings'];
}

export interface Observer {
  id: string;
  email: string;
  config: Config[];
}

// 订阅者
export class Subscriber implements Observer {
  public id;
  public email;
  public config;

  constructor(user: Observer) {
    this.id = user.id;
    this.email = user.email;
    this.config = user.config;
  }

  flattenSubscriber() {
    return this.config.flatMap(config => {
      return config.settings.map(setting => {
        return {
          id: this.id,
          email: this.email,
          socket: getSocketSymbol(config.socket),
          ...setting
        };
      });
    });
  }

  update(dayDataMap: Map<string, any>, computedDataMap: Map<string, any>, tool: NotifyTool): void {
    console.log('dayDataMap', dayDataMap);
    console.log('computedDataMap', computedDataMap);
    console.log('this.config', JSON.stringify(this.config));

    const configs = this.flattenSubscriber();
    configs.forEach(config => {
      const { socket } = config;
      if (dayDataMap.has(socket) && this.checkCondition(dayDataMap, computedDataMap, config as any)) {
        const data = dayDataMap.get(socket);
        // tool?.sendMessage({ to: this.email, subject: '股票数据', text: JSON.stringify(data) }); // 发送通知给订阅者;
        console.log(`${this.email} 收到新闻:'${socket}'，内容:${JSON.stringify(data)}`);
      } else {
        console.log(`${this.email} 未收到新闻:'${socket}'`);
      }
    });
  }

  checkCondition(dataMap: Map<string, any>, computedDataMap: Map<string, any>, config: any): boolean {
    const { socket, isSubscribed, bollLine, bollPeriod, breakDirection, offset } = config;

    if (isSubscribed !== 'Y') {
      return false; // 未订阅
    }
    if (!dataMap.has(socket)) {
      return false; // 没有数据
    }
    if (!computedDataMap.has(socket)) {
      return false; // 没有计算出的BOLL值
    }
    const computedData = Number(computedDataMap.get(socket)[bollPeriod!][bollLine!]) + (Number(offset) || 0); // 计算出的BOLL值加上偏移量;
    console.log('computedData', computedData);
    const diff = Number(dataMap.get(socket)['latestPrice'] || 0) - computedData;
    console.log('diff', diff); // 判断是否满足条件，这里需要根据具体的条件进行判断，这里只是一个示例，具体的条件需要根据业务需求进行修改
    return breakDirection === 'up' ? diff > 0 : diff < 0;
  }
}
