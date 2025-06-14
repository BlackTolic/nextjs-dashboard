import nodemailer from 'nodemailer';

// 邮件选项
export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface EmailConfig {
  host: string; // 主机
  secureConnection: boolean; // 使用 SSL
  port: number; // SMTP 端口
  auth: { user: string; pass: string }; // 授权码(改成自己账号对应即可,获取方法: QQ邮箱-->设置-->账户-->POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务-->IMAP/SMTP开启 复制授权码)
}

class EmailStrategy {
  public smtpTransport: nodemailer.Transporter;
  public emailConfig: EmailConfig;

  constructor(emailConfig: EmailConfig) {
    this.emailConfig = emailConfig;
    this.smtpTransport = nodemailer.createTransport(emailConfig);
  }

  // 发送邮件
  async sendMessage(options: MailOptions) {
    const { smtpTransport } = this;
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
  }
}

const mail = {
  host: 'smtp.qq.com', // 主机
  secureConnection: true, // 使用 SSL
  port: 465, // SMTP 端口
  auth: {
    user: '617938514@qq.com', // 自己用于发送邮件的账号
    pass: 'wubwzddzmunjbbdg' // 授权码(改成自己账号对应即可,获取方法: QQ邮箱-->设置-->账户-->POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务-->IMAP/SMTP开启 复制授权码)
  }
};

export const emailStrategy = new EmailStrategy(mail);
