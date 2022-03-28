const {DataTypes} = require("sequelize");
const {sequelize} = require("../db");

const User_Project = sequelize.define('users_projects', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        
    },
    id_user: {
        type: DataTypes.BIGINT,
    },
    id_project: {
        type: DataTypes.BIGINT,
    },
    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    },

});

module.exports = User_Project;