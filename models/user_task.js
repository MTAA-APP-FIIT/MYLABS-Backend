const {DataTypes} = require("sequelize");
const {sequelize} = require("../db");

const User_Task = sequelize.define('users_tasks', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        
    },
    id_user: {
        type: DataTypes.BIGINT,
    },
    id_task: {
        type: DataTypes.BIGINT,
    },
    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    },

});

module.exports = User_Task;