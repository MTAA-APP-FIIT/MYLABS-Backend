const { sequelize } = require("./db");
const { DataTypes, QueryInterface, Sequelize } = require("sequelize");
const project = require("./models/project");
const task = require("./models/task");
const user = require("./models/user");
const friends = require("./models/friends");

sequelize.drop();

sequelize.sync({ force: true }).then(() => {
    
    user.create({
        name: "Simon",
        username: "MrSkeletor",
        password: "$2b$10$ASa32Eat2D7krBz/aFRJVu.8IkSJ6J9GlgjxCgypEJVzlMbKjGggO",
        email: "simon@gmail.com",
        phone: "0900000000",
        position: "Techno King",
        birthdate: Date("1.1.2020"),
        profile_picture: "",
        created_at: Date.now(),
        updated_at: Date.now(),
        delete: false,
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNyIsImVtYWlsIjoib2xpdmVya29sZWtAb2xpdmVya29sZWsuY29tIiwiaWF0IjoxNjQ4MjM3Mzc1LCJleHAiOjE2NDgyNDQ1NzV9.iFXs5BKLDg29I96PMguzFR9gAnBNzYccd6ko0c05Peg"
       });
       
    user.create({
        name: "Kyle",
        username: "Kyle123",
        password: "$2b$10$ASa32Eat2D7krBz/aFRJVu.8IkSJ6J9GlgjxCgypEJVzlMbKjGggO",
        email: "kyle@gmail.com",
        phone: "0900000000",
        position: "Machine Learning Specialist",
        birthdate: Date("1.1.2020"),
        profile_picture: "",
        created_at: Date.now(),
        updated_at: Date.now(),
        delete: false,
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNyIsImVtYWlsIjoib2xpdmVya29sZWtAb2xpdmVya29sZWsuY29tIiwiaWF0IjoxNjQ4MjM3Mzc1LCJleHAiOjE2NDgyNDQ1NzV9.iFXs5BKLDg29I96PMguzFR9gAnBNzYccd6ko0c05Peg"
       });

      user.create({
        name: "Jim",
        username: "Jim123",
        password: "$2b$10$ASa32Eat2D7krBz/aFRJVu.8IkSJ6J9GlgjxCgypEJVzlMbKjGggO",
        email: "Jim@gmail.com",
        phone: "0900000000",
        position: "Machine Learning Specialist",
        birthdate: Date("1.1.2020"),
        profile_picture: "",
        created_at: Date.now(),
        updated_at: Date.now(),
        delete: false,
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNyIsImVtYWlsIjoib2xpdmVya29sZWtAb2xpdmVya29sZWsuY29tIiwiaWF0IjoxNjQ4MjM3Mzc1LCJleHAiOjE2NDgyNDQ1NzV9.iFXs5BKLDg29I96PMguzFR9gAnBNzYccd6ko0c05Peg"
       });

       user.belongsToMany(user, { 
        as: 'userfriends',
        foreignKey: 'user_id',
        through: friends
      });
      
      
      user.belongsToMany(user, { 
        as: 'userFriends',
        foreignKey: 'friend_id',
        through: friends
      });
      
      /* user.belongsToMany(task, { 
        as: 'userTask',
        foreignKey: 'user_id',
        through: user_task
      });
      
      task.belongsToMany(user, { 
        as: 'userTask',
        foreignKey: 'task_id',
        through: user_task
      }); */

});
