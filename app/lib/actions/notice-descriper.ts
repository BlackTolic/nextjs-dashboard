// 发送通知邮件的服务器动作
'use server';

import { sql } from '@vercel/postgres';
import { StockData } from '@/app/crawler/stock-crawler';
import { postMail } from '@/app/lib/utils/monitor-stock'; // 假设已存在邮件发送工具
import { getAllSubscriptionSettings } from './subscription';
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

// 发送通知给所有订阅者
export async function sendNotificationsToAllSubscribers(stockSymbol: string, currentPrice: number) {
  try {
    // 1. 获取所有订阅设置
    const allSettings = await getAllSubscriptionSettings();

    // 2. 获取股票基本信息
    const stockRes = await sql`
      SELECT * FROM stocks 
      WHERE symbol = ${stockSymbol}
      LIMIT 1
    `;
    const stockData = stockRes.rows[0] as StockData;

    // 3. 遍历所有订阅者并发送邮件
    for (const setting of allSettings) {
      if (setting.stockSymbol === stockSymbol) {
        // 获取用户邮箱
        const userRes = await sql`
          SELECT email FROM users 
          WHERE id = ${setting.userId}
        `;
        const userEmail = userRes.rows[0]?.email;

        if (userEmail) {
          // 生成邮件内容
          const { subject, html } = generateEmailContent(stockData, setting.settings, currentPrice);

          // 发送邮件
          await postMail({
            to: userEmail,
            subject,
            html
          });
        }
      }
    }

    return { success: true, count: allSettings.length };
  } catch (error) {
    console.error('邮件通知发送失败:', error);
    return { success: false, error: '邮件发送失败' };
  }
}
