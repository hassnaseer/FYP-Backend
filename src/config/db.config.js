const Sequelize = require("sequelize");
require("dotenv").config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME,APP_URL:DATABASE_URL } = process.env;
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
