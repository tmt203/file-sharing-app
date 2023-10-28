const path = require('path');
const nodemailer = require('nodemailer');
const { htmlToText } = require('html-to-text');
const ejs = require('ejs');

class Email {
  constructor(sender, receiver) {
    this.from = sender;
    this.to = receiver;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Send Gmail      
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }

    // Send mailtrap
    return nodemailer.createTransport({
      host: process.env.DEV_EMAIL_HOST,
      port: process.env.DEV_EMAIL_PORT,
      auth: {
        user: process.env.DEV_EMAIL_USERNAME,
        pass: process.env.DEV_EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject, htmlData) {
    // Render HTML based on a EJS template
    const file = path.join(__dirname, `../views/email/${template}.ejs`);
    const html = await ejs.renderFile(file, htmlData);
    
    // Define mail options
    const mailOptions = {
      from: this.from, 
      to: this.to,
      subject,
      html,
      text: htmlToText(html)
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendEmailDownloadFile(htmlData) {
    await this.send('emailDownloadFile', 'inShare file sharing', htmlData);
  }
}

module.exports = Email;