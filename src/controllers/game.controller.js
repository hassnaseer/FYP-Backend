const Game = require("../models/game");
const Sequelize = require("sequelize");
var moment = require("moment");
const { Op, sequelize } = require('sequelize');

const APIError = require("../utils/APIError");

exports.gameData = async (req, res) => {
    const userid = req.userId;
    let {
        Amount,
        TotalGames,
        BigBlind,
        IsWin,
    } = req.body;

    try {
        const game = await Game.create({
            Amount,
            TotalGames,
            BigBlind,
            IsWin,
            userId: userid,
        }

        );

        res.status(200).send({
            status: "success",
            data: game,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
        });
    }
};

exports.getgameData = async (req, res) => {
    try {
        const Data = await Game.findAll({

        });

        res.status(200).send({
            status: "successfully got the gamedata",
            data: Data,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
        });
    }
};

exports.wingamesData = async (req, res) => {
    try {
        const Data = await Game.findAll({

            where: {
                IsWin: true,
            }

        });

        res.status(200).send({
            status: "data of games won",
            data: Data,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
        });
    }
};


exports.BigBlindsData = async (req, res) => {
    try {
        const Data = await Game.findAll({

            where: {
                BigBlind: true,
                IsWin: true
            }
            
        });

        res.status(200).send({
            status: "data of games where big blind is true ",
            data: Data,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
        });
    }
};


exports.oneDayData = async (req, res) => {
    try {
      const Data = await Game.findAndCountAll({
    
        

          where: {
            [Op.and]: [
                {  BigBlind: true },
                { IsWin: true }
              ],
              
            createdAt: {
              [Op.gte]: moment().subtract(24, 'hours').toDate(),
            },
          }
        });
        const sum = Data.rows.reduce((accumulator, object) => {
            return accumulator + object.Amount;
          }, 0)
          console.log(sum)

        res.status(200).send({
          status: "data  ",
          data:Data, sum
        });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  };

  exports.weeklyData = async (req, res) => {
    try {
      const Data = await Game.findAndCountAll({
    
        

          where: {
            [Op.and]: [
                {  BigBlind: true },
                { IsWin: true }
              ],
              
            createdAt: {
              [Op.gte]: moment().subtract(7, 'days').toDate(),
            },
          }
        });
        const sum = Data.rows.reduce((accumulator, object) => {
            return accumulator + object.Amount;
          }, 0)
          console.log(sum)

        res.status(200).send({
          status: "data  ",
          data:Data, sum
        });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  };

  exports.monthlyData = async (req, res) => {
    try {
      const Data = await Game.findAndCountAll({
    
        

          where: {
            [Op.and]: [
                {  BigBlind: true },
                { IsWin: true }
              ],
              
            createdAt: {
              [Op.gte]: moment().subtract(30, 'days').toDate(),
            },
          }
        });
        const sum = Data.rows.reduce((accumulator, object) => {
            return accumulator + object.Amount;
          }, 0)
          console.log(sum)

        res.status(200).send({
          status: "data  ",
          data:Data, sum
        });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  };

  exports.getAll = async (req, res) => {
    try {
      const Data = await Game.findAndCountAll({
    
        });
        const sum = Data.rows.reduce((accumulator, object) => {
            return accumulator + object.Amount;
          }, 0)
          console.log(sum)

        res.status(200).send({
          status: "data  ",
          data:Data, sum
        });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  };

