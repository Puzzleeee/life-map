const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = (await getUserByEmail(email))[0]
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (err) {
      return done(err)
    }

  }
  passport.use(new LocalStrategy({ usernameField: 'email' },
  authenticateUser))

  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser(async (id, done) => {
    let currUser = (await getUserById(id))[0];
    return done(null, {id: currUser.id, name: currUser.name, email: currUser.email})
  })
}

module.exports = initialize