const { Model, DataTypes } = require('sequelize')
const sequelize = require("../config/db.config");

class Game extends Model {}

Game.init(
    {
    Amount: {
      type: DataTypes.STRING,
    },
    TotalGames: {
        type: DataTypes.STRING,
      },
    BigBlind: {
      type: DataTypes.BOOLEAN,
    },
    IsWin: {
      type: DataTypes.BOOLEAN,
    },
    Rank: {
        type: DataTypes.STRING,
      }, 
    GameType: {
        type: DataTypes.INTEGER,
      },

  },
  {
    sequelize,
    modelName: "Game",
  }
)

module.exports = Game
