const {DataTypes} = require("sequelize");
const {sequelize} = require("../db");

const Tasks = sequelize.define('tasks', {
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
    start: {
        type: DataTypes.DATE
    },
    end: {
        type: DataTypes.DATE
    },
    notes: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.SMALLINT
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

module.exports = Tasks;