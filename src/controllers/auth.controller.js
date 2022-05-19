const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const { Op } = require("sequelize");
const { validateEmail } = require('../utils/validateEmail')
const ForgotPasswordToken = require('../models/forgotPasswordToken.model')
const { sendEmail,sendForgotPasswordEmail} = require("../utils/sendEmail");
const APIError = require("../utils/APIError.js");
const sequelize = require("sequelize");
const status = require('http-status')

exports.register = async (req, res) => {
  let { fullName, userName, email,password } =
    req.body;

    console.log(req.body);
  let sendMail = false;
  if (password == undefined) {
    password = generator.generate({
      length: 10,
      numbers: true,
    });
    sendMail = true;
  }
  try {
    const user = await User.create({
      fullName,
      userName,
      email,
      password: bcrypt.hashSync(password, 8),
    });
    if (sendMail == true) {
      user.isPasswordAuto = true;
      user.save();
      sendEmail(email, "One Time Password", password);
    }
    // var token = user.getJWTToken();
    res.status(200).send({
      status: "success",
      data: user,
      message: "User Registered Successfully.",
      // accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: [
        'userName',
        'password',
      ],
      where: {
        userName: req.body.userName
      }
    });

    if(!user){
      return res.status(400).send({
        accessToken: null,
        message: "User is not Exist",
      });
    }
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Incorrect Email Or Password!",
        });
      }
    var token = user.getJWTToken();

    res.status(200).send({
      user: user,
      accessToken: token,
      message: "Login Successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    where: {
      email,
    },
    include: [ForgotPasswordToken],
  });

  if (!user)
    return next(new APIError(messages.EMAIL_NOT_FOUND, status.BAD_REQUEST));

  const token = await user.generateForgotPasswordToken(user, 32);
  const frontendUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

  // sendForgotPasswordEmail(user.email, subject, frontendUrl);

  await new Email(user, frontendUrl).sendForgotPasswordLink();

  res.status(status.CREATED).json({
    status: messages.SUCCESS,
    reset_token: token,
  });
};

exports.matchToken = async (req, res, next) => {
  const { token } = req.body;
  const hashedToken = User.createHashFromString(token);

  const user = await User.findOne({
    include: [
      {
        model: ForgotPasswordToken,
        where: {
          token: hashedToken,
          expiresIn: {
            [Op.gte]: Date.now(),
          },
        },
      },
    ],
  });

  if (!user)
    return next(new APIError(messages.INVALID_TOKEN, status.UNAUTHORIZED));

  res.status(status.OK).json({
    status: messages.SUCCESS,
    message: messages.TOKEN_MATCHED,
  });
};

exports.resetPassword = async (req, res, next) => {
  const { password, token } = req.body;

  const hashedToken = User.createHashFromString(token);

  const user = await User.findOne({
    include: [
      {
        model: ForgotPasswordToken,
        where: {
          token: hashedToken,
          expiresIn: {
            [Op.gte]: Date.now(),
          },
        },
      },
    ],
  });

  if (!user)
    return next(new APIError(messages.INVALID_TOKEN, status.UNAUTHORIZED));

  user.password = bcrypt.hashSync(password, 8);
  await user.ForgotPasswordToken.destroy();

  await user.save();

  const accessToken = user.getJWTToken();

  res.status(status.OK).json({
    status: messages.SUCCESS,
    user: user,
    accessToken,
  });
};