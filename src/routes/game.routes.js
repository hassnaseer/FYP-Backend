const express = require("express");
const { authJwt } = require('../middlewares/authJwt')
const Model = require('../controllers/game.controller')
const userRouter = express.Router();


userRouter.route("/gamedata").post(authJwt, Model.gameData);
userRouter.route("/getgamedata").get(Model.getgameData);
userRouter.route("/win-games").get(Model.wingamesData);
userRouter.route("/big-blind").get(Model.BigBlindsData);
userRouter.route("/oneday").get(Model.oneDayData);
userRouter.route("/weekly").get(Model.weeklyData);
userRouter.route("/monthly").get(Model.monthlyData);
userRouter.route("/getall").get(Model.getAll);
userRouter.route("/getbygametypeThree").get(Model.getGameByTypeThree);
userRouter.route("/getbygametypeSix").get(Model.getGameByTypeSix);
userRouter.route("/getbygametypeNine").get(Model.getGameByTypeNine);





module.exports = userRouter;