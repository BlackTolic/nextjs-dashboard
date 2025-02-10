import { sendMail } from '../notification-tool/email';

interface SettingItem {
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

interface descriptStockItem {
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

// 发送邮件
export const postMail = async function (descriptionList: descriptStockItem[], templateSetting: SettingItem[]) {
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
