const Sequelize = require('sequelize');
require('dotenv').config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME,APP_URL:DATABASE_URL } = process.env;

// local server connections

// const sequelize = new Sequelize(DB_NAME,DB_USER,DB_PASSWORD,{
//     dialect: 'postgres',
//     host:DB_HOST,
//     port:DB_PORT
// }
// );

// live server connections

const sequelize = new Sequelize(DATABASE_URL,{
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
}
);

module.exports = sequelize;





// add mentioned data in env for live server

// PORT= 5432
// DB_HOST= ec2-3-231-82-226.compute-1.amazonaws.com
// DB_USER= hqkvlpozgjeyed
// DB_PASSWORD= b351ed8c2abc099910987b17840b267a40fe00d7ae805cb192a719f1cd586a06
// DB_PORT= 5432
// DB_NAME= d8vq4eob79puon
// DIALECT= postgres
// APP_URL=postgres://hqkvlpozgjeyed:b351ed8c2abc099910987b17840b267a40fe00d7ae805cb192a719f1cd586a06@ec2-3-231-82-226.compute-1.amazonaws.com:5432/d8vq4eob79puon
