const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const userdb = require("./models/user");

async function findInDb(email) {
  const result = await userdb.findOne({
    where:{
      email: email
    }
  })
  return result
}

async function getUserById(id) {
  const result = await userdb.findOne({
    where:{
     id: id
    }
  })
  return result
}

async function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await findInDb(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}



module.exports = initialize