const jwt = require('jsonwebtoken')

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
      if (token == null) return res.redirect('/decline')
  
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.redirect('/decline')
        req.user = user
      })
      return next()
    }
    res.redirect('/decline')
  }


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      const email = req.body.email
      const user = {user: email}
  
      const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
      console.log(accessToken)
  
      return res.redirect('/users')
    }
    next()
  }

module.exports = {checkAuthenticated, checkNotAuthenticated}