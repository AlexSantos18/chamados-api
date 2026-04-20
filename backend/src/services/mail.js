const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true para porta 465, false para outras
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

module.exports = {
  async sendMail(to, subject, text) {
    try {
      await transporter.sendMail({
        from: '"Suporte CHAMADOS.io" <noreply@chamados.io>',
        to,
        subject,
        text,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
    }
  },
};