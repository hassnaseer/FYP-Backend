const User = require('./user.model');
const Game = require('./game');
const ForgotPasswordToken = require('./forgotPasswordToken.model');

User.hasOne(ForgotPasswordToken, {
    onDelete: 'CASCADE',
    foreignKey: 'userId',
});

User.hasMany(Game, {
    onDelete: 'CASCADE',
    foreignKey: 'userId',
});

Game.belongsTo(User, {
    onDelete: 'CASCADE',
    foreignKey: 'userId',
});