const User = require('./user.model');
const Contact = require('./contact');
const ForgotPasswordToken = require('./forgotPasswordToken.model');
const Questions = require('./questions.model');
const Form = require('./form.model')

require('./associations');

module.exports = {
    User,
    ForgotPasswordToken,
    Contact,
    Questions,
    Form
}

