const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const { prepareOtpTemplate } = require('./../email_templates/otp_template');
const { prepareForgotPasswordTemplate } = require('./../email_templates/forgot_password');

exports.sendEmail = async (email, subject, password) => {
  let transporter = nodemailer.createTransport({
    name: process.env.MAIL_HOST,
    host: process.env.MAIL_HOST,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  let mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: subject,
    html: prepareOtpTemplate(password)
  };
  const response = await transporter.sendMail(mailOptions)
  if (response.rejected.length > 0) {
    return new APIError(MESSAGES.EMAIL_UNSUCCESSFUL, status.BAD_REQUEST)
  }

}
exports.sendForgotPasswordEmail = async (email, subject, code) => {
  let transporter = nodemailer.createTransport({
    name: process.env.MAIL_HOST,
    host: process.env.MAIL_HOST,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  let mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: subject,
    html: prepareForgotPasswordTemplate(code)
  };
  const response = await transporter.sendMail(mailOptions)
  if (response.rejected.length > 0) {
    return new APIError(MESSAGES.EMAIL_UNSUCCESSFUL, status.BAD_REQUEST)
  }

}