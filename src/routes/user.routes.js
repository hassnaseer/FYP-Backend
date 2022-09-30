const express = require("express");
const { authJwt } = require('../middlewares/authJwt')
// const { index, getSingle, changeStatus, update, deleteUser,stripeCreatePlan, contactRequest,findPlans,stripePayment } = require("../controllers/user.controller");
const Model = require('../controllers/user.controller')
const userRouter = express.Router();

// userRouter.use(authJwt);
//Token will be check here using middleware named 'authJwt' before executing code of following route methods

//get Requests here
//stripe get plans
userRouter.route("/plansGet").get(Model.findPlans);
userRouter.route("/").get(Model.index);
userRouter.route("/delete/:id").get(Model.deleteUser);
userRouter.route("/changeStatus/:id").get(Model.changeStatus);
userRouter.route("/:id").get(Model.getSingle);


//posts request here
userRouter.route("/update/:id").put(Model.update);
//stripe
userRouter.route("/charges").post(Model.stripePayment); 
userRouter.route("/upgradeStripe").post(Model.stripeUpdate);

//contact
userRouter.route("/contact-form").post(Model.contactRequest);

// userRouter.get('/build',function(req,res){
//     console.log("here")
//     res.render('/build/index.html');
//   });





module.exports = userRouter;
