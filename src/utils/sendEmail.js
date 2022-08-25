const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const { prepareOtpTemplate } = require('./../email_templates/otp_template');
const { prepareForgotPasswordTemplate } = require('./../email_templates/forgot_password');

exports.sendEmail = (email, subject, password) => {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });
  let mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: subject,
    // html: prepareOtpTemplate(password)
  };
  console.log(mailOptions, "=================")

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}
exports.sendForgotPasswordEmail = (email, subject, code) => {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });
  
  let mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: subject,
    html: prepareForgotPasswordTemplate(code)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}