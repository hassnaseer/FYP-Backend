// models/Question.js
const { Model,DataTypes } = require('sequelize');
const sequelize = require("../config/db.config"); // Make sure to set up your database connection correctly

class Questions extends Model { }

Questions.init(
    {
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // formId: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        // },
        options: {
            type: DataTypes.ARRAY(DataTypes.STRING), // Assuming options are stored as an array of strings
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Questions",
    }
)

module.exports = Questions
