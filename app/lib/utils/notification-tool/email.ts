'use server';
import nodemailer from 'nodemailer';

const mail = {
  host: 'smtp.qq.com', // 主机
  secureConnection: true, // 使用 SSL
  port: 465, // SMTP 端口
  auth: {
    user: '617938514@qq.com', // 自己用于发送邮件的账号
    pass: 'wubwzddzmunjbbdg' // 授权码(改成自己账号对应即可,获取方法: QQ邮箱-->设置-->账户-->POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务-->IMAP/SMTP开启 复制授权码)
  }
};

// 邮件选项
export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// 创建SMTP传输
const smtpTransport = nodemailer.createTransport(mail);

// 发送邮件
export const sendMail = async (options: MailOptions) => {
  return new Promise(resolve => {
    const mailOptions = {
      from: mail.auth.user,
      ...options
    };
    // 发送邮件
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.error('发送邮件失败：', error);
      } else {
        console.log('邮件发送成功');
      }
      smtpTransport.close(); // 发送完成关闭连接池
      resolve(true);
    });
  });
};
