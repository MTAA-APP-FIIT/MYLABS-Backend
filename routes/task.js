// model
const e = require('express');
const { type } = require('express/lib/response');
const task = require('../models/task')

const getTasks = async (req, res) => {
    try {
        const tasks = await task.findAll({
            where: {
                owner: req.body.id
            }
        })
        if (tasks.length < 1) {
            res.status(404)
            res.send()
        }
        else{
            res.send(tasks)
        }
        
    } catch (err) {
        res.status(400)
        res.send()
    }
};

const getTasksId = async (req, res) => {
    try {
        const tasks = await task.findOne({
            where: {
                id: BigInt(req.params.taskId)
            }
        })
        if (tasks.length < 1) {
            res.status(404)
            res.send()
        }
        else{
            res.send(tasks)
        }
    } catch (err) {
        res.status(400)
        res.send()
    }
};

const postTasks = async (req, res) => {
    try {
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

        })
        res.status(200)
        res.send()
    } catch (err) {
        res.status(400)
        res.send()
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


        const dateTime = new Date();
        const day = ("0" + dateTime.getDate()).slice(-2);
        const month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
        const year = dateTime.getFullYear();
        
        const date = year + "-" + month + "-" + day;
        const check = await task.findOne({
            where: {id: BigInt(req.params.taskId)},
        })

        if (check < 1) {
            res.status(404)
            res.send()
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
    
                },
                {where: {id: BigInt(req.params.taskId)}
                }
            );
            res.send()
        }

    } catch (err) {
        res.status(400)
        res.send()
    }

};

const deleteTask = async (req, res) => {
    try {
        const check = await task.findOne({
            where: {id: BigInt(req.params.taskId)},
        })

        if (check < 1) {
            res.status(404)
            res.send()
        }
        else {

            const taskToDelete = await task.findOne({
                where:{id: BigInt(req.params.taskId)}
            });
            taskToDelete.destroy()
            res.send()
        }
    } catch (err) {
        console.log(err)
        res.status(400)
        res.send()
    }
}

module.exports = {postTasks, getTasks, getTasksId, updateTask, deleteTask};
