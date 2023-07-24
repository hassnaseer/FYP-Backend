const express = require("express");
const { checkDuplicateEmail } = require("../middlewares/verifySignUp");
const { login, register, forgotPassword, resetPassword,matchToken,forgotUsername,userList } = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.route("/login").post(login);
authRouter.route("/register").post(register);
authRouter.route('/forgot-password').post(forgotPassword);
authRouter.route("/match-token").post(matchToken);
authRouter.route('/reset-password').post((resetPassword));
authRouter.route('/forgot-username').post((forgotUsername));
authRouter.route('/usersList').get((userList));




module.exports = authRouter;
