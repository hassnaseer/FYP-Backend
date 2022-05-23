const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const { prepareOtpTemplate } = require('./../email_templates/otp_template');
const { prepareForgotPasswordTemplate } = require('./../email_templates/forgot_password');

exports.sendEmail = (email, subject, password) => {

  let transporter = nodemailer.createTransport(smtpTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  }));

  let mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: subject,
    html: prepareOtpTemplate(password)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}
exports.sendForgotPasswordEmail = (email, subject, code) => {

  let transporter = nodemailer.createTransport(smtpTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  }));
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