// models/Question.js
const { Model,DataTypes } = require('sequelize');
const sequelize = require("../config/db.config"); // Make sure to set up your database connection correctly

class Form extends Model { }

Form.init(
    {
        
    },
    {
        sequelize,
        modelName: "Form",
    }
)

module.exports = Form
