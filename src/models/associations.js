const User = require('./user.model');
const ForgotPasswordToken = require('./forgotPasswordToken.model');

User.hasOne(ForgotPasswordToken, {
    onDelete: 'CASCADE',
    foreignKey: 'userId',
});