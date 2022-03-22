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

sequelize
  .sync()
  .then((result) => {
    console.log(result);

  })
  .catch((err) => {
    console.log(err)
  });
  
// projects endpoint
app.route('/projects')
  .get((req, res) => {
    res.send('Get a random book')
  })
  .post((req, res) => {
    res.send('Add a book')
  })

app.get('/projects/:projectId', (req, res) => {
  res.json(req.params)
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)

})