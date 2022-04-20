// model
const e = require('express');
const { type } = require('express/lib/response');
const task = require('../models/task')
const user_task = require('../models/user_task')
const user_project = require('../models/user_project')

const getTasks = async (req, res) => {
    try {
        
        const tasks = await task.findAll({
            where: {
                owner: BigInt(req.params.owner)
            }
        })
        if (tasks.length < 1) {
            res.sendStatus(404)
        }
        else{
            res.send(tasks)
        }
        
    } catch (err) {
        res.sendStatus(400)
    }
};

const getTasksByProject = async (req, res) => {
    try {
        
        const tasks = await task.findAll({
            where: {
                project_id: BigInt(req.params.projectId)
            }
        })
        if (tasks.length < 1) {
            res.sendStatus(404)
        }
        else{
            res.send(tasks)
        }
        
    } catch (err) {
        res.sendStatus(400)
    }
};

const getTasksId = async (req, res) => {
    try {
        const tasks = await task.findOne({
            where: {
                id: BigInt(req.params.taskId)
            }
        })
        if (tasks == null) {
            res.sendStatus(404)
        }
        else{
            res.send(tasks)
        }
    } catch (err) {
        res.sendStatus(400)
    }
};

const postTasks = async (req, res) => {
    try {
        
        // if anything is missing, cartch error and send 400 bad request
        const nameLen = req.body.name.length
        const ownerLen =  req.body.owner.length
        const descriptionLen =  req.body.description.length
        const startLen =  req.body.start.length
        const endLen =  req.body.end.length
        const notesLen =  req.body.notes.length
        const project_idLen =  req.body.project_id.length
        
        const dateTime = new Date();
        const day = ("0" + dateTime.getDate()).slice(-2);
        const month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
        const year = dateTime.getFullYear();
        
        const date = year + "-" + month + "-" + day;
        const newTask = await task.create({
            name: req.body.name,
            owner: req.body.owner,
            description: req.body.description,
            start: new Date(req.body.start),
            end: new Date(req.body.end),
            notes: req.body.notes,
            state: 1,
            created_date: new Date(date),
            updated_date: new Date(date),
            delete: false,
            project_id: req.body.project_id

        })

        
        const newUser_Task = await user_task.create({
            id_user: req.body.owner,
            id_task: newTask.id,
            created_date: new Date(date),
            updated_date: new Date(date),
        })
        

        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(400)
    }
};

const updateTask = async (req, res) => {
    try {
        // if anything is missing, cartch error and send 400 bad request
        const nameLen = req.body.name.length
        const ownerLen =  req.body.owner.length
        const descriptionLen =  req.body.description.length
        const startLen =  req.body.start.length
        const endLen =  req.body.end.length
        const notesLen =  req.body.notes.length
        const stateLen =  req.body.state.length
        const project_idLen =  req.body.project_id.length

        
        const dateTime = new Date();
        const day = ("0" + dateTime.getDate()).slice(-2);
        const month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
        const year = dateTime.getFullYear();
        
        const date = year + "-" + month + "-" + day;
        const check = await task.findOne({
            where: {id: BigInt(req.params.taskId)},
        })

        if (check < 1) {
            res.sendStatus(404)
        }
        else {
            const tasks = await task.update(
                {
                    name: req.body.name,
                    owner: req.body.owner,
                    description: req.body.description,
                    start: new Date(req.body.start),
                    end: new Date(req.body.end),
                    notes: req.body.notes,
                    state: req.body.state,
                    updated_date: new Date(date),
                    delete: false,
                    project_id: req.body.project_id
    
                },
                {where: {id: BigInt(req.params.taskId)}
                }
            );
            
            const user_Task = await user_task.update({
                id_user: req.body.owner,
                id_task: BigInt(req.params.taskId),
                updated_date: new Date(date),
            },
            {where: {id_task: BigInt(req.params.taskId)}
                }
            )
            
            
            const user_Project = await user_project.update({
                id_user: req.body.owner,
                id_project: req.params.project_id,
                updated_date: new Date(date),
            },
            {where: {id_user: BigInt(req.params.taskId)}
                }
            )
            res.sendStatus(200)
        }

    } catch (err) {
        res.sendStatus(400)
    }

};

const deleteTask = async (req, res) => {
    try {
        const check = await task.findOne({
            where: {id: BigInt(req.params.taskId)},
        })

        if (check < 1) {
            res.sendStatus(404)
        }
        else {
            const users_tasksToDelete = await user_task.destroy({
                where:{id_task: BigInt(req.params.taskId)}
            });

            const taskToDelete = await task.findOne({
                where:{id: BigInt(req.params.taskId)}
            });
            taskToDelete.destroy()
            res.sendStatus(200)
        }
    } catch (err) {
        res.sendStatus(400)
    }
}

module.exports = {postTasks, getTasks, getTasksId, updateTask, deleteTask, getTasksByProject};
