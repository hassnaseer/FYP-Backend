const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const { Op } = require("sequelize");
const { validateEmail } = require("../utils/validateEmail");
const { sendEmail, sendForgotPasswordEmail } = require("../utils/sendEmail");
const APIError = require("../utils/APIError.js");
const sequelize = require("sequelize");
const status = require("http-status");
const { User, ForgotPasswordToken } = require("../models/index");

exports.register = async (req, res) => {
  let { fullName, userName, email, password } = req.body;
  let sendMail = false;
  const Name = await User.findOne({
    attributes: ["userName", "password"],
    where: {
      userName: req.body.userName,
    },
  });

  if (Name) {
    return res.status(400).send({
      accessToken: null,
      message: "User is already Exist",
    });
  }
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
      attributes: ["userName", "password"],
      where: {
        userName: req.body.userName,
      },
    });

    if (!user) {
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
    if(req.body.password === user.password){
      var token = user.getJWTToken();
      
      res.status(200).send({
        user: user,
        accessToken: token,
        message: "Login Successfully",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const subject = "forgetpasswordemail";
  const user = await User.findOne({
    where: {
      email,
    },
    include: [ForgotPasswordToken],
  });

  if (!user)
    return next(new APIError(messages.EMAIL_NOT_FOUND, status.BAD_REQUEST));

  const token = await user.generateForgotPasswordToken(user, 32);
  const frontendUrl = `${process.env.APP_URL}resetPassword?token=${token}`;

  await sendForgotPasswordEmail(user.email, subject, frontendUrl);

  await User.update(
    {
      token: token,
    },
    { where: { email } }
  );
  res.status(status.CREATED).json({
    status: "Success",
    message:"Please check your Gmail",
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

  if (!user) return next(new APIError("Token is Expired Please Forget Password again", status.UNAUTHORIZED));

  user.password = bcrypt.hashSync(password, 8);
  await user.ForgotPasswordToken.destroy();

  await user.save();

  const accessToken = user.getJWTToken();

  res.status(status.OK).json({
    status: "Success",
    user: user,
    accessToken,
  });
};
