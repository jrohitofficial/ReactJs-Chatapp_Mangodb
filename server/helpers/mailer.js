const nodemailer = require('nodemailer');
const config = require('../config');

module.exports = async ({ to, fullname, subject, html, otp }) => {
  let options = {};

  if (config.isDev) {
    options = {
      host: process.env.TEST_EMAIL_HOST,
      port: process.env.TEST_EMAIL_PORT,
      auth: {
        user: process.env.TEST_EMAIL_USER,
        pass: process.env.TEST_EMAIL_PASS,
      },
    };
  } else {
    options = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
  }

  const transporter = nodemailer.createTransport(options);
  const body = html.replace('#otp#', otp).replace('#fullname#', fullname);

  const send = await transporter.sendMail({
    from: config.isDev ? 'test@spillgram.com' : process.env.EMAIL_USER,
    to,
    subject,
    html: body,
  });

  return send;
};
