const express = require('express')
const app = express()
const project = require('./routes/project')
const task = require('./routes/task')
const user = require("./routes/user");
const port = 3000
require('dotenv').config()
app.use(express.json())
const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('postgres://MyLabs:Wj8ff-hYMH@postgresql.r1.websupport.sk:5432/MyLabs')
const session = require('express-session')
const authentication = require('./authentication')
const passport = require('passport')
const initializePassport = require('./passport-config')
const multer = require("multer");


// Define Multer
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null,  "SomeImage" + "." + file.originalname.split(".").pop());
  },
});

const diskStorage = multer({ storage: storage });

initializePassport(
  passport
)

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  
app.route('/projects/owner/:owner').get(authentication.checkAuthenticated, project.getProjects);
app.route('/projects').post(authentication.checkAuthenticated, project.postProjects);
app.route('/projects/:projectId').get(authentication.checkAuthenticated, project.getProjectsId);

app.route('/tasks/owner/:owner').get(authentication.checkAuthenticated, task.getTasks);
app.route('/tasks/project/:projectId').get(authentication.checkAuthenticated, task.getTasksByProject);
app.route('/tasks').post(authentication.checkAuthenticated, task.postTasks);
app.route('/tasks/:taskId').get(authentication.checkAuthenticated, task.getTasksId);
app.route('/tasks/:taskId').put(authentication.checkAuthenticated, task.updateTask);
app.route('/tasks/:taskId').delete(authentication.checkAuthenticated, task.deleteTask);


app.route("/users").get(authentication.checkAuthenticated, user.getusers);
app.route("/users/:id").get(authentication.checkAuthenticated, user.getuser);
app.route("/users/:id").patch(authentication.checkAuthenticated, user.patchuser)
app.route("/users/:id/friends").get(authentication.checkAuthenticated, user.getfriends);
app.route("/users/:id/friends").patch(authentication.checkAuthenticated, user.updatefriends);
app.route("/users/:id/friends").post(authentication.checkAuthenticated, user.createfriends);
app.route("/users/:id/friends").delete(authentication.checkAuthenticated, user.declinefriends);

app.route("/register").post(user.createuser);
app.route("/login").post(authentication.checkNotAuthenticated, user.login);


app.route("/decline").get((req, res) => {
  res.sendStatus(401)
});

app.post("/img", diskStorage.single("image"), async (req, res) => {
  try {
    console.log(req.file); // File which is uploaded in /uploads folder.
    console.log(req.body); // Body
    res.send({ congrats: "data recieved" });
  } catch (error) {
    res.status(500).send("Error");
  }
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`)

})