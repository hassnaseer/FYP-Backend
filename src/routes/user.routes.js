const express = require("express");
const { authJwt } = require('../middlewares/authJwt')
const { index, getSingle, changeStatus, update, deleteUser } = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.use(authJwt);
//Token will be check here using middleware named 'authJwt' before executing code of following route methods

userRouter.route("/").get(index);
userRouter.route("/:id").get(getSingle);
userRouter.route("/update/:id").post(update);
userRouter.route("/delete/:id").get(deleteUser);
userRouter.route("/changeStatus/:id").get(changeStatus);

module.exports = userRouter;
