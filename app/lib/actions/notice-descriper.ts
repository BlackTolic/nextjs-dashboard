// 发送通知邮件的服务器动作
'use server';

import { sql } from '@vercel/postgres';
import { StockData } from '@/app/crawler/stock-crawler';
import { postMail } from '@/app/lib/utils/monitor-stock'; // 假设已存在邮件发送工具
import { getAllSubscriptionSettings } from './subscription';
import { SettingItem, DescriptStockItem, calculateBOLL } from '@/app/lib/utils/monitor-stock';
import { batchGetStockKline } from '@/app/crawler/stock-crawler'; // 批量获取股票K线数据

// 生成邮件内容模板
function generateEmailContent(
  stockData: StockData,
  settings: any,
  currentPrice: number
): { subject: string; html: string } {
  // 计算关键价格指标
  const { buyPrice, ratio } = settings.profitLossRatio;
  const stopLoss = buyPrice - buyPrice * 0.1;
  const targetPrice = buyPrice + buyPrice * 0.1 * ratio;

  // 生成邮件主题
  const subject = `【股票提醒] ${stockData.name}(${stockData.symbol}) 最新价格 ${currentPrice}`;

  // 生成邮件HTML内容
  const html = `
    <h2>${stockData.name}(${stockData.symbol}) 最新行情</h2>
    <p>当前价格：${currentPrice}</p>
    ${
      buyPrice > 0
        ? `
    <div style="border:1px solid #eee; padding:15px; margin:10px 0;">
      <h3>您的盈亏设置：</h3>
      <p>买入价格：${buyPrice}</p>
      <p>止损价格：${stopLoss.toFixed(2)}</p>
      <p>目标价格：${targetPrice.toFixed(2)}</p>
    </div>
    `
        : ''
    }
    <div style="margin-top:20px;">
      <h3>BOLL线设置状态：</h3>
      ${Object.entries(settings.bollSettings)
        .map(
          ([period, config]: [string, any]) => `
        <div style="margin-bottom:15px;">
          <h4>${period === 'daily' ? '日线' : period === 'weekly' ? '周线' : '月线'}设置：</h4>
          <ul>
            ${Object.entries(config)
              .map(
                ([line, setting]: [string, any]) => `
              <li>${line === 'upper' ? '上轨' : line === 'middle' ? '中轨' : '下轨'}：
                ${setting.enabled ? `启用（偏移：${setting.offset}%）` : '未启用'}
              </li>
            `
              )
              .join('')}
          </ul>
        </div>
      `
        )
        .join('')}
    </div>
  `;

  return { subject, html };
}

interface StockQry {
  target: 'day' | 'week' | 'month';
  stockSymbol: string;
}

// 发送通知给所有订阅者
export async function sendNotificationsToAllSubscribers() {
  try {
    // 1. 获取所有订阅设置
    const descriptionInfoList = await getAllSubscriptionSettings();
    console.log('descriptionInfoList', descriptionInfoList);
    //所有订阅的股票
    // const subscripters: DescriptStockItem[] = []; 
    //订阅者们的订阅设置
    const templateSetting: SettingItem[] = []; 
    // 订阅的股票代码
    const stockKlineList:StockQry[] = [];
    descriptionInfoList.forEach(item => {
      const { userId = '', stockSymbol = '', settings, email = '617938514@qq.com' } = item;
      const { bollSettings = {} } = settings || {};
      const { daily = {}, weekly = {}, monthly = {} } = bollSettings;
      if (daily.dayBollTop) { 
        stockKlineList.push({ target: 'day', stockSymbol });
      }
      if (weekly.weekBollTop) {
        stockKlineList.push({ target: 'week', stockSymbol });
      }
      if (monthly.monthBollTop) {
        stockKlineList.push({ target: 'month', stockSymbol });
      }
    });
    // 获取20条K线数据
    const stockDayKlineData = await batchGetStockKline(stockKlineList.map(x => x.stockSymbol), 'day', -21);
    const stockWeekKlineData = await batchGetStockKline(stockKlineList.map(x => x.stockSymbol), 'week', -21);
    const stockMonthKlineData = await batchGetStockKline(stockKlineList.map(x => x.stockSymbol), 'month', -21);

    console.log('stockDayKlineData', stockDayKlineData);

    // stockKlineData {
    //   SH600000: { item: [], column: [] },
    //   SH600010: { item: [], column: [] },
    //   SH600021: { item: [], column: [] },
    //   SH600023: { item: [], column: [] },
    // }
    // 日布林线值
    const stockKlineDataList = Object.keys(stockDayKlineData).map(x => {
      // 计算20个交易日的boll值
      const [dayBollTopValue, dayBollMiddleValue, dayBollBottomValue] = calculateBOLL(
        stockDayKlineData[x].item,
        stockDayKlineData[x].column
      );
      // 计算当日最高价和最低价
      const dayHigh = stockDayKlineData[x].item[0].high;
      const dayLow = stockDayKlineData[x].item[0].low;
      return {
        stockCode: x,
        dayBollTopValue,
        dayBollMiddleValue,
        dayBollBottomValue,
        dayHigh,
        dayLow
        // weekBollTopValue: x.upper,
        // weekBollBottomValue: x.lower,
        // monthBollTopValue: x.upper,
        // monthBollBottomValue: x.lower,
        // high: x.high,
        // low: x.low
      };
    });
    const 
    // postMail([], []);
    return { success: true, count: 0 };
  } catch (error) {
    console.error('邮件通知发送失败:', error);
    return { success: false, error: '邮件发送失败' };
  }
}
