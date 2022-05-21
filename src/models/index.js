const User = require('./user.model');
const Contact = require('./contact');
const ForgotPasswordToken = require('./forgotPasswordToken.model');
const Plan = require('./plansModel')

require('./associations');

module.exports = {
    User,
    ForgotPasswordToken,
    Contact,
    Plan,
}

