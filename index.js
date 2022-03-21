const express = require('express')
const app = express()

const port = 3000

const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('postgres://MyLabs:Wj8ff-hYMH@postgresql.r1.websupport.sk:5432/MyLabs')

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}


app.listen(port, () => {
  console.log(`App listening on port ${port}`)

})