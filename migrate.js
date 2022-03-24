const { sequelize } = require("./db");
const { DataTypes, QueryInterface, Sequelize } = require("sequelize");
const project = require("./models/project");
const task = require("./models/task");

"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('projects',{
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

    }, 

    down: (queryInterface, Sequelize) => {

    }
}