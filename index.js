const express = require('express')
const app = express()
const project = require('./routes/project')
const projectModel = require('./models/project')
const taskModel = require('./models/task')
const userModel = require('./models/user')
const user_taskModel = require('./models/user_task')
const user_projectModel = require('./models/user_project')
const friendModel = require('./models/friends')
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

const { createServer } = require("http");
const { Server } = require("socket.io");
const { callbackify } = require('util');
const { takeCoverage } = require('v8')

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
app.route("/login").post(user.login);


app.route("/decline").get((req, res) => {
  res.sendStatus(401)
});

app.post("/img", diskStorage.single("image"), async (req, res) => {
  try {
    console.log(req.file); 
    console.log(req.body); 
    res.send({ congrats: "data recieved" });
  } catch (error) {
    res.status(500).send("Error");
  }
});

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

httpServer.listen(3000, () => {
  console.log("Server running")
});

io.on("connection", (socket) => {
  console.log("User connected" + socket.id)

  socket.on('/projects/owner/:owner', async (ownerId) => {
    const projects = await projectModel.findAll({
      where: {
          owner: ownerId
      }
    })
    io.sockets.emit('RES/projects/owner/:owner', {projects})
  })

  socket.on('/projects/:projectId', async (projectId) => {
    const projects = await projectModel.findOne({
      where: {
          id: projectId
      }
    })
    io.sockets.emit('RES/projects/:projectId', {projects})
  })

  socket.on('/tasks/owner/:owner', async (ownerId) => {
    const tasks = await taskModel.findAll({
      where: {
          owner: ownerId
      }
    })
    io.sockets.emit('RES/tasks/owner/:owner', {tasks})
  })
  
  socket.on('/tasks/project/:projectId', async (projectId) => {
    const tasks = await taskModel.findAll({
      where: {
          project_id: projectId
      }
    })
    io.sockets.emit('RES/tasks/project/:projectId', {tasks})
  })

  socket.on('/tasks/:taskId', async (taskId) => {
    const tasks = await taskModel.findOne({
      where: {
          id: taskId
      }
    })
    io.sockets.emit('RES/tasks/:taskId', {tasks})
  })
  
  socket.on('loadProfile', async (userId) => {
    const profileInfo = await userModel.findOne({
      where: {
        id: userId
      }
    })
    socket.emit('loadProfile', profileInfo)
  })

  socket.on('loadFriends', async (userId) => {
    const query = '(SELECT friend_id FROM friends WHERE user_id = '
    let result = query.concat(String(userId));
    let finalResult = result.concat(' AND state = true)')
    const friends = await userModel.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: sequelize.literal(finalResult)
        }
      }
    })
    socket.emit('loadFriends', friends)
  })

  socket.on('loadFriend', async (userId) => {
    const friend = await userModel.findAll({
      where: {
        id: userId
      }
    })
    socket.emit('loadFriend', friend[0])
  })

  socket.on('loadProject', async (projectId) => {
    const project = await projectModel.findAll({
      where: {
        id: projectId
      }
    })
    socket.emit('loadProject', project[0])
  })

  socket.on('loadTask', async (taskId) => {
    const task = await taskModel.findAll({
      where: {
        id: taskId
      }
    })
    socket.emit('loadTask', task[0])
  })

  socket.on('loadTasks', async (userId) => {
    const tasks = await taskModel.findAll({
      where: {
        owner: userId
      }
    })
    socket.emit('loadTasks', tasks)
  })

  socket.on('loadProjectTasks', async (projectId) => {
    const tasks = await taskModel.findAll({
      where: {
        project_id: projectId
      }
    })
    socket.emit('loadProjectTasks', tasks)
  })

  socket.on('loadProjects', async (userId) => {
    const projects = await projectModel.findAll({
      where: {
        owner: userId
      }
    })
    socket.emit('loadProjects', projects)
  })

  socket.on('request', async (userId, friend_id) => {
    const customJson = Object.assign({user_id:userId, friend_id:friend_id, state:false, created_at: '', updated_at: ''});
    customJson.created_at = Date.now()
    customJson.updated_at = Date.now()
    await friendModel.create(customJson);
    const profile = await userModel.findAll({
      where: {
        id: friend_id
      }
    })

    const profileMyslef = await userModel.findAll({
      where: {
        id: userId,
      }
    })

    socket.broadcast.emit('request', profile[0])
    socket.broadcast.emit('receivedRequest', profileMyslef[0])
  })

  socket.on('request2', async (userId) => {
    socket.broadcast.emit('request2', "works")
  })

  socket.on('loadRequests', async (userId) => {
    const query = '(SELECT friend_id FROM friends WHERE user_id = '
    let result = query.concat(String(userId));
    let finalResult = result.concat(' AND state = false)')
    const requests = await userModel.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: sequelize.literal(finalResult)
        }
      }
    })
    socket.emit('loadRequests', requests)
    socket.emit('loadRequests2', requests.length)
  })
  
  socket.on('acceptInvite', async () => {
    socket.broadcast.emit('acceptInvite')
  })

  socket.on('profileChange', async (userId) => {

    const user = await userModel.findOne({
      where: {
        id: userId
    }
  });
  socket.broadcast.emit('profileChange', user)
  socket.broadcast.emit('profileChange2', user)
  })

  socket.on('taskChange', async (taskId) => {
    console.log(taskId)
    const task = await userModel.findOne({
      where: {
        id: taskId
    }
  });
  socket.broadcast.emit('taskChange', task)
  // socket.broadcast.emit('taskChange', user)
  })



  socket.on('acceptFriend', async (userId, friendId) => {
        const friendsreturn = await friendModel.findOne({
          where: {
            user_id: userId,
            friend_id: friendId
        }
      });
      const customJson = Object.assign({updated_at:Date.now(), state: true});
      friendsreturn.update(customJson)
      const customJson2 = Object.assign({user_id:friendId, friend_id:userId, state:true, created_at: '', updated_at: ''});
      customJson2.created_at = Date.now()
      customJson2.updated_at = Date.now()
      await friendModel.create(customJson2);
      
    const profile = await userModel.findAll({
      where: {
        id: userId
      }
    })
    socket.broadcast.emit('acceptFriend', profile[0])
    //io.sockets.emit('acceptFriend', profile[0])
  })

  socket.on('createTask', async (name, description, start, end, notes, owner, projectId) => {
    const dateTime = new Date();
    const day = ("0" + dateTime.getDate()).slice(-2);
    const month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
    const year = dateTime.getFullYear();
    
    const date = year + "-" + month + "-" + day;
    // console.log(name, description, start, end, notes, owner, projectId)
    const newTask = await taskModel.create({
        name: name,
        owner: owner,
        description: description,
        start: new Date(start),
        end: new Date(end),
        notes: notes,
        state: 1,
        created_date: new Date(date),
        updated_date: new Date(date),
        delete: false,
        project_id: projectId

    })

  
    const newUser_Task = await user_taskModel.create({
        id_user: owner,
        id_task: newTask.id,
        created_date: new Date(date),
        updated_date: new Date(date),
    })
// socket.broadcast.emit('createTask', profile[0])
//io.sockets.emit('acceptFriend', profile[0])
  })

  socket.on('createProject', async (name, description, deadline, owner) => {
    const dateTime = new Date();
    const day = ("0" + dateTime.getDate()).slice(-2);
    const month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
    const year = dateTime.getFullYear();
    
    const date = year + "-" + month + "-" + day;
    // console.log(name, description, start, end, notes, owner, projectId)
    const newProject = await projectModel.create({
      name: name,
      owner: owner,
      description: description,
      deadline: new Date(deadline),
      created_date: new Date(date),
      updated_date: new Date(date),
      delete: false,

    })

    const check_user_project = await user_projectModel.findOne({
      where: {
          id_user: BigInt(owner),
          id_project: BigInt(newProject.id)
      }
    })
    
    if (check_user_project == null) {
        const newProject_Task = await user_projectModel.create({
            id_user: BigInt(owner),
            id_project: BigInt(newProject.id),
            created_date: new Date(date),
            updated_date: new Date(date),
        })
    }

// socket.broadcast.emit('createTask', profile[0])
//io.sockets.emit('acceptFriend', profile[0])
})

  socket.on('deleteFriend', async (userId, friendId) => {
    const profile = await userModel.findOne({
      where: {
        id: userId,
        }
      });
      await friendModel.destroy({
        where: {
          user_id: userId,
          friend_id: friendId
        }
      });
  
      await friendModel.destroy({
        where: {
          user_id: friendId,
          friend_id: userId 
        }
      });
    socket.broadcast.emit('deleteFriend', profile)
//io.sockets.emit('acceptFriend', profile[0])
  })

  socket.on('deleteTask', async (taskId) => {
    const task = await taskModel.findOne({
      where: {
        id: taskId,
        }
      });
      await user_taskModel.destroy({
        where: {
          id_task: taskId
        }
      });
  
      await taskModel.destroy({
        where: {
          id: taskId
        }
      });
    // socket.broadcast.emit('deleteTask', profile)
//io.sockets.emit('acceptFriend', profile[0])
  })


  

});


/* app.listen(port, () => {
  console.log(`App listening on port ${port}`)

}) */
