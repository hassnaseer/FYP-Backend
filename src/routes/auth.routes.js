const express = require("express");
const { checkDuplicateEmail } = require("../middlewares/verifySignUp");
const { login, register, forgotPassword, resetPassword,matchToken } = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.route("/login").post(login);
authRouter.route("/register").post(checkDuplicateEmail, register);
authRouter.route('/forgot-password').post(forgotPassword);
authRouter.route("/match-token").post(matchToken);
authRouter.route('/reset-password').post((resetPassword));

module.exports = authRouter;
