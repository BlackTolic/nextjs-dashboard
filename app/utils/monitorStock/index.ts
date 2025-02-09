const axios = require('axios');
const getTableDate = require('../../stockPriceMonitoring/mysql.js');
import { sendMail } from '../notification-tool/email';

//获取股票价格
async function getStockPrice(messageInfo) {
  const stoSym = messageInfo
    .map(item => {
      return item.type.split('-')[1];
    })
    .join(',');
  const apiUrl = `https://sapi.k780.com/?app=finance.stock_realtime&stoSym=${stoSym}&appkey=${nowapiConfig.AppKey}&sign=${nowapiConfig.Sign}&format=json`;
  const result = await axios.get(apiUrl);
  return result.data.result.lists;
}

// 发送邮件
const postMail = async function (descriptionList, templateSetting) {
  for (const msg of messageInfo) {
    const code = msg.type.split('-')[1];
    // 获取股票信息
    let { minVal = -Infinity, maxVal = Infinity } = msg;
    minVal = parseFloat(minVal);
    maxVal = parseFloat(maxVal);
    // 获取股票信息
    const stockInfo = stockInfos[code] || {};
    const last_price = parseFloat(stockInfo.last_price);
    if (minVal < last_price && maxVal > last_price) {
      return;
    }
    // 发送邮件
    const mailOptions = {
      // 接收人列表,多人用','隔开
      to: msg.mail.replaceAll('、', ','),
      // 邮件主题
      subject: `${stockInfo.sname}-${last_price.toFixed(2)}`,
      // 邮件内容
      text: `${stockInfo.sname}当前股价为${last_price.toFixed(2)}`
    };
    await sendMail(mailOptions);
  }
};

const main = async () => {
  const messageInfo = await getTableDate();
  const stockInfo = await getStockPrice(messageInfo);
  await postMail(messageInfo, stockInfo);
  process.exit(0);
};

main();
