import { sendMail } from '../notification-tool/email';

export interface SettingItem {
  // 股票代码
  stockCode: string;
  // 订阅是否开启
  isOpen: boolean;
  // 订阅者邮箱
  subscriberEmail: string;
  // 是否订阅日BOLL上轨
  dayBollTop?: boolean;
  // 是否订阅日BOLL中轨
  dayBollMiddle?: boolean;
  // 是否订阅日BOLL下轨
  dayBollBottom?: boolean;
  // 偏移值
  dayOffset?: number;
  weekBollTop?: boolean;
  weekBollMiddle?: boolean;
  weekBollBottom?: boolean;
  weekOffset?: number;
  monthBollTop?: boolean;
  monthBollMiddle?: boolean;
  monthBollBottom?: boolean;
  monthOffset?: number;
}

export interface DescriptStockItem {
  // 股票代码
  stockCode: string;
  // 当前日BOLL上轨值
  dayBollTopValue: number;
  // 当前日BOLL中轨值
  dayBollMiddleValue: number;
  // 当前日BOLL下轨值
  dayBollBottomValue: number;
  weekBollTopValue: number;
  weekBollBottomValue: number;
  monthBollTopValue: number;
  monthBollBottomValue: number;
  // 当前股价最高值
  high?: number;
  // 当前股价最低值
  low?: number;
}

/**
 * 计算当天BOLL指标（布林线）
 * @param data 股票K线数据，二维数组格式
 * @param column 数据列名数组
 * @param period 计算周期，默认为20
 * @returns 返回包含当天BOLL上轨、中轨、下轨的数组
 */
export const calculateBOLL = (data: number[][], column: string[], period = 20) => {
  const closeIndex = column.indexOf('close');

  // 数据不足时返回空值
  if (data.length < period) {
    return [null, null, null];
  }

  // 获取最近period天的收盘价
  const closePrices = data.slice(-period).map(item => Number(item[closeIndex]));

  // 计算中轨（MA）：周期内收盘价的平均值
  const ma = closePrices.reduce((sum, price) => sum + price, 0) / period;

  // 计算标准差
  const std = Math.sqrt(closePrices.reduce((sum, price) => sum + Math.pow(price - ma, 2), 0) / period);

  // 计算上轨和下轨
  const upper = ma + 2 * std; // 上轨 = 中轨 + 2倍标准差
  const lower = ma - 2 * std; // 下轨 = 中轨 - 2倍标准差

  return [upper, ma, lower];
};

// 发送邮件
export const postMail = async function (descriptionList: DescriptStockItem[], templateSetting: SettingItem[]) {
  try {
    // 遍历所有订阅设置
    for (const setting of templateSetting) {
      const {
        stockCode,
        isOpen,
        subscriberEmail,
        dayBollTop,
        dayBollBottom,
        dayOffset,
        weekBollTop,
        weekBollBottom,
        weekOffset,
        monthBollBottom,
        monthOffset
      } = setting;

      // 如果订阅未开启，跳过
      if (!isOpen) return;

      // 查找对应的股票信息
      const stockItem = descriptionList.find(item => item.stockCode === stockCode);
      if (!stockItem) return;

      // 检查日BOLL上轨条件
      if (dayBollTop && stockItem.high && stockItem.dayBollTopValue) {
        const triggerValue = stockItem.dayBollTopValue - (dayOffset || 0);
        if (stockItem.high >= triggerValue) {
          await sendMail({
            to: subscriberEmail.replaceAll('、', ','),
            subject: `${stockCode}-日BOLL上轨触发`,
            text: `${stockCode} 当前最高价 ${stockItem.high} 已达到日BOLL上轨值 ${stockItem.dayBollTopValue} 偏移 ${dayOffset}`
          });
        }
      }

      // 检查日BOLL下轨条件
      if (dayBollBottom && stockItem.low && stockItem.dayBollBottomValue) {
        const triggerValue = stockItem.dayBollBottomValue + (dayOffset || 0);
        if (stockItem.low <= triggerValue) {
          await sendMail({
            to: subscriberEmail.replaceAll('、', ','),
            subject: `${stockCode}-日BOLL下轨触发`,
            text: `${stockCode} 当前最低价 ${stockItem.low} 已达到日BOLL下轨值 ${stockItem.dayBollBottomValue} 偏移 ${dayOffset}`
          });
        }
      }

      // 检查周BOLL上轨条件
      if (weekBollTop && stockItem.high && stockItem.weekBollTopValue) {
        const triggerValue = stockItem.weekBollTopValue - (weekOffset || 0);
        if (stockItem.high >= triggerValue) {
          await sendMail({
            to: subscriberEmail.replaceAll('、', ','),
            subject: `${stockCode}-周BOLL上轨触发`,
            text: `${stockCode} 当前最高价 ${stockItem.high} 已达到周BOLL上轨值 ${stockItem.weekBollTopValue} 偏移 ${weekOffset}`
          });
        }
      }

      // 检查月BOLL下轨条件
      if (monthBollBottom && stockItem.low && stockItem.monthBollBottomValue) {
        const triggerValue = stockItem.monthBollBottomValue + (monthOffset || 0);
        if (stockItem.low <= triggerValue) {
          await sendMail({
            to: subscriberEmail.replaceAll('、', ','),
            subject: `${stockCode}-月BOLL下轨触发`,
            text: `${stockCode} 当前最低价 ${stockItem.low} 已达到月BOLL下轨值 ${stockItem.monthBollBottomValue} 偏移 ${monthOffset}`
          });
        }
      }
    }
  } catch (error) {
    console.error('发送邮件失败:', error);
    throw error;
  }
};
