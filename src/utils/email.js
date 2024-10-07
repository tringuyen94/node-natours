const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.from = process.env.EMAIL_FROM;
    this.url = url;
    this.firstName = user.name.split(' ')[0];
  }
  newTransporter() {
    if (process.env.NODE_ENV === 'prod') {
      return 1;
    }
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 25,
      auth: {
        user: 'b7b5231f40dee3',
        pass: 'e21786c4846239',
      },
    });
  }
  async send(template, subject) {
    //1. HTML
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    //2. Mailoption
    const mailOptions = {
      //from
      from: this.from,
      //to
      to: this.to,
      //subject
      subject,
      //html
      html,
      ///text
      text: htmlToText(html),
    };
    //3.Send
    await this.newTransporter().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours');
  }
  async sendResetPassword() {
    await this.send(
      'resetPassword',
      'Recover your password  Expire in 10 minutes'
    );
  }
}

module.exports = Email;
