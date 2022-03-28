const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const user_task = sequelize.define("user_task", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: 'actions_unique',
    },
    task_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: 'actions_unique',
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
    }
},{
    uniqueKeys: {
        actions_unique: {
            fields: ['user_id', 'task_id']
        }
    }


});

module.exports = user_task;