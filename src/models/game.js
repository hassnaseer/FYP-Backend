const { Model, DataTypes } = require('sequelize')
const sequelize = require("../config/db.config");

class Game extends Model {}

Game.init(
    {
    Amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    TotalGames: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    BigBlind: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsWin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Rank: {
        type: DataTypes.STRING,
        allowNull: true,
      }, 
    GameType: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

  },
  {
    sequelize,
    modelName: "Game",
  }
)

module.exports = Game
