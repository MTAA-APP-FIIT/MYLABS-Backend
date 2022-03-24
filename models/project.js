const {DataTypes} = require("sequelize");
const {sequelize} = require("../db");

const Projects = sequelize.define('projects', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    owner: {
        type: DataTypes.BIGINT
    },
    deadline: {
        type: DataTypes.DATE
    },
    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    },
    delete: {
        type: DataTypes.BOOLEAN
    },

});

module.exports = Projects;