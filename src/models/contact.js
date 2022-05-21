const { Model, DataTypes } = require('sequelize')
const sequelize = require("../config/db.config");

class Contact extends Model {}

Contact.init(
    {
    subject: {
      type: DataTypes.TEXT,
    },
    message: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Contact",
  }
)

module.exports = Contact
