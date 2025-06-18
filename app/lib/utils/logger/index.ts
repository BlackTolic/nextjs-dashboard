import { InternalAxiosRequestConfig } from 'axios';
import chalk from 'chalk'; // 新增导入
import dayjs from 'dayjs';

export default class Logger {
  constructor() {}

  static info(data: string) {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss'); // 使用dayjs格式化时间
    const info = data.length <= 1000 ? data : data.slice(0, 1000) + '...';
    console.log(
      chalk.yellow(`【info】【time:${now}】
        ${info}
        `)
    );
  }
}

export const xx = 'xxxx';
