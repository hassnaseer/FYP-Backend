const User = require('./user.model');
const ForgotPasswordToken = require('./forgotPasswordToken.model');
const Form = require('./form.model');
const Questions = require('./questions.model');

User.hasOne(ForgotPasswordToken, {
  onDelete: 'CASCADE',
  foreignKey: 'userId', // Corrected foreign key field name
});

User.hasMany(Form, {
    foreignKey: {
        name: 'userId',
        allowNull: false
      } // Corrected foreign key field name
});

Form.hasMany(Questions, {
    foreignKey: {
        name: 'formId',
        allowNull: false
      } // Corrected foreign key field name
});
