const User = require('./user.model');
const ForgotPasswordToken = require('./forgotPasswordToken.model');
require('./associations');

module.exports = {
    User,
    ForgotPasswordToken
}

