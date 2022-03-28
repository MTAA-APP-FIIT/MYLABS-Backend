const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const friend = sequelize.define("friends", {
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
    friend_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: 'actions_unique',
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
            fields: ['user_id', 'friend_id']
        }
    }


});

module.exports = friend;