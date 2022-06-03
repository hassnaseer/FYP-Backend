const { Model, DataTypes } = require('sequelize')
const sequelize = require("../config/db.config");

class Plan extends Model {}

Plan.init(
    {
        stripePlanId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trialDays: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        interval: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        perMonth: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'Plan',
    }
)

module.exports = Plan
