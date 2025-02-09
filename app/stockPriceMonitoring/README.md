掘金文章：[https://juejin.cn/spost/7447771974313672715](https://juejin.cn/spost/7447771974313672715)

## 说在前面

> 今年国庆假期前，A 股市场的表现可谓“牛气冲天”。自 9 月 24 日“金融新政”出台后，A 股迎来了连续五个交易日的强劲上涨势头。9 月 30 日，沪深两市成交额仅在早盘开盘 35 分钟内便突破 1 万亿元，刷新了历史最快万亿成交纪录。身边也有挺多朋友趁着这个机会入市了，于是乎原本很多学习交流群都变成了股市交流群 🤣🤣🤣，既然这么关注股价变化，为什么不写一个脚本来监控呢？

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/72adfcec431b4084b0c0334d7439d1de~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=kmih8%2Bs2Zj%2FK90Zm42dKw42T5y4%3D)

## 一、股票价格获取方案

股票实时信息有两种方案可以获取到：

### 1、网页信息爬取

我们可以先找到一些官方的股票信息网站，然后直接利用爬虫直接爬取，比如：
[https://quote.eastmoney.com/sh601933.html](https://quote.eastmoney.com/sh601933.html)

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/d6e42df822194a0d85f84f0dd2cec1cf~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167445&x-orig-sign=e8IOrsFHhz00j88i96HPHTAJNRU%3D)

### 2、通过接口获取

例如 nowapi 中就有股票数据信息接口，我们可以直接通过接口来获取：

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/77510852322c441eb3bc19064d18ddf3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=pfKWD1sKzYn%2Fc4mFYIpEMTN%2BJDA%3D)

## 二、提醒阈值设置

### 1、创建数据库

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/da2100b7c7b2478e98e3c947d0c56f19~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=v%2FSAlV9%2B5Gsq4376P9Om4Y%2Fy7v8%3D)

### 2、监控页面编写

简单编写一个页面用于添加和调整提醒内容。

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/b0e3a8104dfc4435b90fc94e56da9277~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=y%2BVqYcJAmuMpvXxrmskka0KOkP0%3D)

## 三、修改配置信息

### 1、邮箱配置

这里我使用的 qq 邮箱作为发件账号，需要开启邮箱授权，获取授权码。

```javascript
{
  host: "smtp.qq.com", // 主机
  secureConnection: true, // 使用 SSL
  port: 465, // SMTP 端口
  auth: {
    user: "jyeontu@qq.com", // 自己用于发送邮件的账号
    pass: "jyeontu", // 授权码(这个是假的,改成自己账号对应即可,获取方法: QQ邮箱-->设置-->账户-->POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务-->IMAP/SMTP开启 复制授权码)
  }
}
```

- （1）打开 pc 端 qq 邮箱，点击设置，再点击帐户

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/678b0d06300849ba9bd27bd04b27786f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=Or1ruTJybFJx59BPXf7XpV%2FWgy8%3D)

- （2）往下拉 可开启 POP3/SMTP 服务 根据提示即可获取 qq 邮箱授权码

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/e40b65264aa34717b6f6cadb73de5c73~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=f9DR2UmhEB5hCFHBNbpczaUbcgk%3D)

- （3）将获取到的授权码复制到配置信息里即可

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/2c70676b42644901afc673630ce829ad~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=TIg%2FrPTuIzqVrJSpNXj4qojmXtU%3D)

### 2、数据库配置

填写数据库对应的配置信息。

```javascript
{
  host: "localhost",
  user: "root", //数据库账号
  password: "jyeontu", //数据库密码
  database: "test", //数据库名称
}
```

### 3、nowapi 配置

免费开通后将 AppKey 和 Sign 替换成自己的就可以了。

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/3ec8bd79bd6243718c8e2f978f1eedd3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=mQo2drehmQKIwi%2BHDPJJNO7s6Aw%3D)

```javascript
{
  AppKey: AppKey,
  Sign: "Sign",
}
```

## 四、脚本功能编写

### 1、获取股票信息

这里我直接使用 **nowapi** 的免费试用套餐，配额是 **50 次配额/每小时**。

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/674dff9b219245289eea3e471fde9f81~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167269&x-orig-sign=hqiufydl6k2zKHrJc8twUiHUVD8%3D)

```javascript
const { nowapiConfig } = require("./config.js");
//获取股票价格
async function getStockPrice(messageInfo) {
  const stoSym = messageInfo
    .map((item) => {
      return item.type.split("-")[1];
    })
    .join(",");
  const apiUrl = `https://sapi.k780.com/?app=finance.stock_realtime&stoSym=${stoSym}&appkey=${nowapiConfig.AppKey}&sign=${nowapiConfig.Sign}&format=json`;
  const result = await axios.get(apiUrl);
  return result.data.result.lists;
}
```

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/46b0bf7a48aa4a299999e8d206391c42~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=05hF9BVlzbfMNCCnzKUc9sVx7fw%3D)

### 2、获取消息提醒阈值

#### （1）连接数据库

使用填写好的数据库配置信息连接数据库

```javascript
const mysql = require("mysql");
const { dbConfig } = require("./config.js");

const connection = mysql.createConnection(dbConfig);

function connectDatabase() {
  return new Promise((resolve) => {
    connection.connect((error) => {
      if (error) throw error;
      console.log("成功连接数据库！");
      resolve("成功连接数据库！");
    });
  });
}
```

#### （2）查询数据

```javascript
function mysqlQuery(sqlStr) {
  return new Promise((resolve) => {
    connection.query(sqlStr, (error, results) => {
      if (error) throw error;
      resolve(results);
    });
  });
}

async function getMessage() {
  const sqlStr =
    "select * from t_message where isShow = 1 and isActive = 1 and type like '股票-%';";
  const res = await mysqlQuery(sqlStr);
  return [...res];
}
```

获取到的数据如下：

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/049bdb5aad3140c2b588a0ee06e4ba03~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=9IY9jarh8%2FHV64vw7jGgY8L0xaM%3D)

### 3、发送提醒邮件

#### （1）创建邮件传输对象

使用填写好的邮箱配置信息，创建邮件传输对象

```javascript
const nodemailer = require("nodemailer");
const { mail } = require("./config.js");

const smtpTransport = nodemailer.createTransport(mail);
const sendMail = (options) => {
  return new Promise((resolve) => {
    const mailOptions = {
      from: mail.auth.user,
      ...options,
    };
    // 发送邮件
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.error("发送邮件失败：", error);
      } else {
        console.log("邮件发送成功");
      }
      smtpTransport.close(); // 发送完成关闭连接池
      resolve(true);
    });
  });
};
module.exports = sendMail;
```

#### （2）阈值判断

判断获取到的股票价格是否超出阈值范围来决定是否发送邮件提醒

```javascript
async function mail(messageInfo, stockInfos) {
  for (const msg of messageInfo) {
    const code = msg.type.split("-")[1];
    let { minVal = -Infinity, maxVal = Infinity } = msg;
    minVal = parseFloat(minVal);
    maxVal = parseFloat(maxVal);
    const stockInfo = stockInfos[code] || {};
    const last_price = parseFloat(stockInfo.last_price);
    if (minVal < last_price && maxVal > last_price) {
      return;
    }
    const mailOptions = {
      to: msg.mail.replaceAll("、", ","), // 接收人列表,多人用','隔开
      subject: `${stockInfo.sname}-${last_price.toFixed(2)}`,
      text: `${stockInfo.sname}当前股价为${last_price.toFixed(2)}`,
    };
    await sendMail(mailOptions);
  }
}
```

## 五、定时脚本

可以使用 **corn** 编写一个定时任务来定时执行脚本即可。

- `* * * * * *` 分别对应：秒、分钟、小时、日、月、星期。
- 每个字段可以是具体的值、范围、通配符（\*表示每一个）或一些特殊的表达式。
  例如：

```shell
0 0 * * *：每天午夜 0 点执行。
0 30 9 * * 1-5：周一到周五上午 9:30 执行。
```

可以根据自己的需求设置合适的 cron 表达式来定时执行特定的任务。

## 六、效果展示

如果股价不在我们设置的阈值内时，我们就会收到邮件告知当前股价：

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/783e3d31507a481ab8a050caa6ab8e33~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=zf85GWTLjSpVB5POARnYVPKR4fU%3D)

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/94e6fe0246c74522829a20531aaa77b3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=ZBtPs79WPj%2BmOws0%2FKeZCVojRNs%3D)

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/9e9b0dc2302e40afb1ecabf4ba07a088~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=woIC%2Fw4RH19GviIoP217TBJR9Yw%3D)

## 七、脚本使用

### 1、源码下载

```javascript
git clone https://gitee.com/zheng_yongtao/node-scripting-tool.git
```

- 源码已经上传到 gitee 仓库
  [https://gitee.com/zheng_yongtao/node-scripting-tool](https://gitee.com/zheng_yongtao/node-scripting-tool)
- 具体目录如下

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/041b9e7c57b947d6b92b8851096a6e80~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=zHurhncOcFF6q4F0NHytolvkPSo%3D)

### 2、依赖下载

```shell
npm install
```

### 3、配置数据填写

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/619c46368e9b4ee7892a8eca49b48d95~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSlllb250dQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDQwMjQ0MjkwNzI3Mjk0In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734167268&x-orig-sign=QX%2FZe3IipwIpbejAp9b%2BSg3zigA%3D)

**config.js** 中的配置信息需要修改为你自己的信息，包括：数据库、gitee 仓库、nowapi 配置。

### 4、脚本运行

```shell
node index.js
```

> **最后在自己的服务器里设置个定时脚本，每几分钟跑一下脚本就可以啦\~\~**

## 更多脚本

该脚本仓库里还有很多有趣的脚本工具，有兴趣的也可以看看其他的

[https://gitee.com/zheng_yongtao/node-scripting-tool](https://gitee.com/zheng_yongtao/node-scripting-tool)

---

**🌟 觉得有帮助的可以点个 star\~**

**🖊 有什么问题或错误可以指出，欢迎 pr\~**

**📬 有什么想要实现的工具或想法可以联系我\~**

---

## 公众号

关注公众号『`前端也能这么有趣`』，获取更多有趣内容。

## 说在后面

> 🎉 这里是 JYeontu，现在是一名前端工程师，有空会刷刷算法题，平时喜欢打羽毛球 🏸 ，平时也喜欢写些东西，既为自己记录 📋，也希望可以对大家有那么一丢丢的帮助，写的不好望多多谅解 🙇，写错的地方望指出，定会认真改进 😊，偶尔也会在自己的公众号『`前端也能这么有趣`』发一些比较有趣的文章，有兴趣的也可以关注下。在此谢谢大家的支持，我们下文再见 🙌。
