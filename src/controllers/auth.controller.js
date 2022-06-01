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
  try {
    const user = await User.create({
      fullName,
      userName,
      email,
      password: bcrypt.hashSync(password, 8),
    });
      sendEmail(email, "SuccessFully Registered", password);
   
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
      attributes: ["userName", "password", "email", "admin", "id", "stripeId"],
      where: {
        userName: req.body.userName,
      },
    });

    if (!user) {
      return res.status(400).send({
        accessToken: null,
        message: "User doesn't exists",
      });
    }
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Incorrect Username Or Password!",
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
  const subject = "forgetpasswordemail";
  const user = await User.findOne({
    where: {
      email,
    },
    include: [ForgotPasswordToken],
  });

  if (!user)
    return next(new APIError("Email not found", 400));

  const token = await user.generateForgotPasswordToken(user, 32);
  const frontendUrl = `${process.env.WEB_URL}resetPassword?token=${token}`;

  await sendForgotPasswordEmail(user.email, subject, frontendUrl);

  await User.update(
    {
      token: token,
    },
    { where: { email } }
  );
  res.status(status.CREATED).json({
    status: "Success",
    message:"Reset Password Link has been sent.",
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

  if (!user) return next(new APIError("Link is expired, Please forgot password again.", status.UNAUTHORIZED));

  user.password = bcrypt.hashSync(password, 8);
  await user.ForgotPasswordToken.destroy();

  await user.save();

  const accessToken = user.getJWTToken();

  res.status(status.OK).json({
    status: "Success",
    user: user,
    message:"Your Password has been reset Successfully.",
    accessToken,
  });
};

exports.forgotUsername = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      attributes: ["userName"],
      where: {
        email: email,
      },
    });

    await sendForgotPasswordEmail(email, "Your Username", JSON.stringify(user));

    if (!user) {
      return res.status(400).send({
        accessToken: null,
        message: "User doesn't exists",
      });
    }
    res.status(status.OK).json({
      status: "Success",
      user: user,
      message:"Username has been sent to your email address. Please check spam as well.",
    });
  } catch(err){
    res.status(500).send({ message: err.message });
  }
};


exports.userList = async (req, res, next) => {
  try {
    const user = await User.findAll();
    if (!user) {
      return res.status(400).send({
        accessToken: null,
        message: "User doesn't exists",
      });
    }
    res.status(status.OK).json({
      status: "Success",
      user: user,
    });
  } catch(err){
    res.status(500).send({ message: err.message });
  }
};