const { Model, DataTypes } = require("sequelize");
var crypto = require("crypto");
const ForgotPasswordToken = require("../models/forgotPasswordToken.model");
const sequelize = require("../config/db.config");
const jwt = require("jsonwebtoken");

class User extends Model {
  getJWTToken() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY);
  }
  static createHashFromString(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  async generateForgotPasswordToken(user, len) {
    const resetToken = crypto.randomBytes(len).toString("hex");

    const hashedToken = User.createHashFromString(resetToken);

    const expiresIn =
      Date.now() + parseInt(process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN);

    if (this.ForgotPasswordToken) {
      this.ForgotPasswordToken.token = hashedToken;
      this.ForgotPasswordToken.expiresIn = expiresIn;
      this.ForgotPasswordToken.userId = user.id;
      this.ForgotPasswordToken.save();
    } else {
      await ForgotPasswordToken.create({
        token: hashedToken,
        expiresIn,
        userId: user.id,
      });
    }

    return resetToken;
  }
}

User.init(
  {
    fullName: {
      type: DataTypes.TEXT,
    },
    userName: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    admin: {
      type: DataTypes.STRING,
    },
    stripeId: {
      type: DataTypes.STRING,
    },
    googleId: {
      type: DataTypes.STRING,
    },
    facebookId: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

module.exports = User;
