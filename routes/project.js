// model
const { type } = require('express/lib/response');
const project = require('../models/project')
const user_project = require('../models/user_project')

const getProjects = async (req, res) => {
    try {
        const projects = await project.findAll({
            where: {
                owner: 2
            }
        })
        if (projects.length < 1) {
            return null
        }
        else{
            return projects
        }
    } catch (err) {
        return null
    }
};

const getProjectsId = async (req, res) => {
    try {
        const projects = await project.findOne({
            where: {
                id: BigInt(req.params.projectId)
            }
        })
        if (projects == null) {
            res.sendStatus(404)
        }
        else{
            res.send(projects)
        }
        
    } catch (err) {
        res.sendStatus(400)
    }
};

const postProjects = async (req, res) => {
    try {
         // if anything is missing, cartch error and send 400 bad request
         const nameLen = req.body.name.length
         const ownerLen =  req.body.owner.length
         const descriptionLen =  req.body.description.length
         const deadline =  req.body.deadline.length

        const dateTime = new Date();
        const day = ("0" + dateTime.getDate()).slice(-2);
        const month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
        const year = dateTime.getFullYear();
        
        const date = year + "-" + month + "-" + day;
        const newProject = await project.create({
            name: req.body.name,
            owner: req.body.owner,
            description: req.body.description,
            deadline: new Date(req.body.deadline),
            created_date: new Date(date),
            updated_date: new Date(date),
            delete: false,

        })

        const check_user_project = await user_project.findOne({
            where: {
                id_user: BigInt(req.body.owner),
                id_project: BigInt(newProject.id)
            }
        })
        
        if (check_user_project == null) {
            const newProject_Task = await user_project.create({
                id_user: BigInt(req.body.owner),
                id_project: BigInt(newProject.id),
                created_date: new Date(date),
                updated_date: new Date(date),
            })
        }

        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(400)
    }
};



module.exports = {getProjects, postProjects, getProjectsId};
