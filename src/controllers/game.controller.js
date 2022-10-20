const Game = require("../models/game");
const Sequelize = require("sequelize");
var moment = require("moment");
// const { Op, sequelize } = require('sequelize');
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const APIError = require("../utils/APIError");

exports.gameData = async (req, res) => {
  const {id} = req.query;
  let userId = id;
 console.log(req.body)
    let {
        Amount,
        BigBlind,
        IsWin,
        GameType,
    } = req.body;
    try {
      let user =await User.findOne({
        where:{id, id}
      })
      if (!user) {
        return res.status(400).send({
          accessToken: null,
          message: "User doesn't exists",
        });
      }else{
        const game = await Game.create({
            Amount,
            BigBlind,
            IsWin,
            GameType,
            userId
        }
        )
        res.status(200).send({
            status: "success",
            data: game,
        });
      };
    } catch (error) {
        res.status(500).send({
            message: error.message,
        });
    }
};

exports.getgameData = async (req, res) => {
  const {userId} = req.query;
    try {
        const Data = await Game.findAll({
          where: {
            userId: userId,
          },

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
  const {userId} = req.query;
    try {
        const Data = await Game.findAll({

            where: {
                IsWin: false,
                GameType: 3,
                userId: userId,
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
  const {userId} = req.query;
  try {
    const Data = await Game.findAll({
      where: {
        [Op.and]: [{ IsWin: true }, { BigBlind: true }, {userId:req.user.id}],
      },
    });
    const sum = Data.rows.reduce((accumulator, object) => {
      return accumulator + object.Amount;
    }, 0)
   
   

    const Data1 = await Game.findAll({
      where: {
        [Op.and]: [{ IsWin: true }, { BigBlind: false },
          {userId:userId}],
      },
    });
    const sum1 = Data1.rows.reduce((accumulator, object) => {
      return accumulator + object.Amount;
    }, 0)
    
    console.log(sum1)
    res.status(200).send({
      status: "data of games where big blind is true and false ",
      data: Data,sum ,
      data1: Data1,sum1
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.oneDayData = async (req, res) => {
  const {userId} = req.query;
  try {
    const Data = await Game.findAndCountAll({
        where: {
          userId: userId,

          [Op.and]: [
              {BigBlind:true},
              { IsWin: true },
              
            ],
            
          createdAt: {
            [Op.gte]: moment().subtract(24, 'hours').toDate(),
          },
        }
      });
      const sum = Data.rows.reduce((accumulator, object) => {
          return accumulator + object.Amount;
        }, 0)
  

        const Data1 = await Game.findAndCountAll({
          where: {
            userId: userId,
            [Op.and]: [
              {BigBlind:false},
              { IsWin: true },
              ],
              
            createdAt: {
              [Op.gte]: moment().subtract(24, 'hours').toDate(),
            },
          }
        });
        const sum1 = Data1.rows.reduce((accumulator, object) => {
            return accumulator + object.Amount;
          }, 0)
        


      res.status(200).send({
        status: "data  ",
        data:Data, sum,
        data1:Data1, sum1,
        total:sum+sum1
      });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.weeklyData = async (req, res) => {
    const {userId} = req.query;
    try {
      const Data = await Game.findAndCountAll({
          where: {
            userId: userId,
            [Op.and]: [
                {BigBlind:true},
                { IsWin: true },
                
              ],
              
              createdAt: {
                [Op.gte]: moment().subtract(7, 'days').toDate(),
              },
          }
        });
        const sum = Data.rows.reduce((accumulator, object) => {
            return accumulator + object.Amount;
          }, 0)
        

          const Data1 = await Game.findAndCountAll({
            where: {
              userId:userId,
              [Op.and]: [
                {BigBlind:false},
                  { IsWin: true },
                ],
                
                createdAt: {
                  [Op.gte]: moment().subtract(7, 'days').toDate(),
                },
            }
          });
          const sum1 = Data1.rows.reduce((accumulator, object) => {
              return accumulator + object.Amount;
            }, 0)
          
  

        res.status(200).send({
          status: "data  ",
          data:Data, sum,
          data1:Data1, sum1,
          total:sum+sum1
        });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  };

exports.monthlyData = async (req, res) => {
    const {userId} = req.query;
    try {
      const Data = await Game.findAndCountAll({
          where: {
            userId: userId,
            [Op.and]: [
                {BigBlind:true},
                { IsWin: true },
              ],
              
              createdAt: {
                [Op.gte]: moment().subtract(30, 'days').toDate(),
              },
          }
        });
        const sum = Data.rows.reduce((accumulator, object) => {
            return accumulator + object.Amount;
          }, 0)
          const Data1 = await Game.findAndCountAll({
            where: {
              userId:userId,
              [Op.and]: [
                {BigBlind:false},
                { IsWin: true },
                ],
                createdAt: {
                  [Op.gte]: moment().subtract(30, 'days').toDate(),
                },
            }
          });
          const sum1 = Data1.rows.reduce((accumulator, object) => {
              return accumulator + object.Amount;
            }, 0)
        res.status(200).send({
          status: "data  ",
          data:Data, sum,
          data1:Data1, sum1,
          total:sum+sum1
        });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  };
  exports.getGameByTypeThree = async (req, res) => {
    try {
      // const Data = await Game.findAll({
      //   include: [
      //     {
      //       model: User,
      //       attributes: ["userName"],
      //     },
      //   ],
  
      //   where: {
      //     GameType: 3,
      //   },
      //   order: [["Amount", "DESC"]],
      //   limit: 5,
      // });
      const totalAmount = await Game.findAll({
           include: [
          {
            model: User,
            attributes: ["userName"],
          },
        ],
        attributes: [
          'GameType','userId',
          [Sequelize.fn('sum', Sequelize.col('Amount')), 'total_amount'],
        ],
        group: ['GameType', 'userId','userName'],
        order: [[Sequelize.col('total_amount'), 'DESC']],
        raw: true,
        where: {
              GameType: 3,
            },
        limit:5
      });
      res.status(200).send({
        status: "data of game type 3 ",
        data: totalAmount,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  };
  exports.getGameByTypeSix = async (req, res) => {
    try {
      const totalAmount = await Game.findAll({
        include: [
       {
         model: User,
         attributes: ["userName"],
       },
     ],
     attributes: [
       'GameType','userId',
       [Sequelize.fn('sum', Sequelize.col('Amount')), 'total_amount'],
     ],
     group: ['GameType', 'userId','userName'],
     order: [[Sequelize.col('total_amount'), 'DESC']],
     raw: true,
     where: {
           GameType: 6,
         },
     limit:5
   });
      // const Data = await Game.findAll({
      //   include: [
      //     {
      //       model: User,
      //       attributes: ["userName"],
      //     },
      //   ],
      //   where: {
      //     GameType: 6,
      //   },
      //   order: [["Amount", "DESC"]],
      //   limit: 5,
      // });
  
      res.status(200).send({
        status: "data of game type 6",
        data: totalAmount,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  };
  exports.getGameByTypeNine = async (req, res) => {
    try {
      
      // const Data = await Game.findAll({
      //   include: [
      //     {
      //       model: User,
      //       attributes: ["userName"],
      //     },
      //   ],
      //   where: {
      //     GameType: 9,
      //   },
      //   order: [["Amount", "DESC"]],
      //   limit: 5,
      // });
      const totalAmount = await Game.findAll({
        include: [
       {
         model: User,
         attributes: ["userName"],
       },
     ],
     attributes: [
       'GameType','userId',
       [Sequelize.fn('sum', Sequelize.col('Amount')), 'total_amount'],
     ],
     group: ['GameType', 'userId','userName'],
     order: [[Sequelize.col('total_amount'), 'DESC']],
     raw: true,
     where: {
           GameType: 9,
         },
     limit:5
   });
      res.status(200).send({
        status: "data of game type 9 ",
        data: totalAmount,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  };

  exports.getAll = async (req, res) => {
    const {userId} = req.query;
    try {
      const Data = await Game.findAndCountAll({
        where: {
          userId: userId
        }  
      });
        
        const allsum = Data.rows.reduce((accumulator, object) => {
            return accumulator + object.Amount;
          }, 0)
          const Data1 = await Game.findAndCountAll({
            where: {
              userId:userId,
              [Op.and]: [
                  {BigBlind:true},
                  { IsWin: true }
                ],
                
            }
          });
          const sumBWT = Data1.rows.reduce((accumulator, object) => {
              return accumulator + object.Amount;
            }, 0)

        res.status(200).send({
          status: "data  ",
          data:Data, allsum,
          data1:Data1,sumBWT,
          sumall: allsum+sumBWT
        });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  };
