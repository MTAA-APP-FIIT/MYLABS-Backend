const express = require('express')
const app = express()
const project = require('./routes/project')
const task = require('./routes/task')

const port = 3000

const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('postgres://MyLabs:Wj8ff-hYMH@postgresql.r1.websupport.sk:5432/MyLabs')

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  
app.route('/projects').get(project.getProjects);
app.route('/projects').post(project.postProjects);
app.route('/projects/:projectId').get(project.getProjectsId);

app.route('/tasks').get(task.getTasks);
app.route('/tasks').post(task.postTasks);
app.route('/tasks/:taskId').get(task.getTasksId);
app.route('/tasks/:taskId').put(task.updateTask);
app.route('/tasks/:taskId').delete(task.deleteTask);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)

})