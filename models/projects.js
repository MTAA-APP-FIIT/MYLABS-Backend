const Sequelize = require("sequelize");
const sequelize = require("../db");

const Projects = sequelize.define("projects", {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        
    },
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    owner: {
        type: Sequelize.BIGINT
    },
    deadline: {
        type: Sequelize.DATE
    },
    created_date: {
        type: Sequelize.DATE
    },
    updated_date: {
        type: Sequelize.DATE
    },
    delete: {
        type: Sequelize.BOOLEAN
    },

});

module.exports = Projects;