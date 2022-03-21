const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// Database
const sequelize = new Sequelize(process.env.DB_URL, {
    define: {
        timestamps: false,
        freezeTableName: true,
    },
});

module.exports = { sequelize };