const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(emailData) {
    try {
      const { to, subject, html, text } = emailData;
      const mailOptions = { from: process.env.SMTP_USER, to, subject, html, text };
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  async sendBankAccountCredentials(accountData) {
    const { to, companyName, accountNumber, routingNumber, bankName, loginUrl } = accountData;
    const subject = `Your ${bankName} Bank Account is Ready - ${companyName}`;
    
    const html = `
      <div>
        <h2>🎉 Your Bank Account is Ready!</h2>
        <p>Company: ${companyName}</p>
        <p>Account: ${accountNumber}</p>
        <p>Routing: ${routingNumber}</p>
        <p>Login: <a href="${loginUrl}">${loginUrl}</a></p>
      </div>
    `;

    return await this.sendEmail({ to, subject, html });
  }
}

module.exports = EmailService; 