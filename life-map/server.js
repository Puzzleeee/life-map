const express = require('express');
const dotenv = require('dotenv')
var cors = require('cors');
const bcrypt = require('bcrypt')
const db = require('./db/db.js')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config.js')
initializePassport(passport, db.get_user_by_email.execute, db.get_user_by_id.execute)

dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(flash());

// Node passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Log in successful!',
    user: req.user
  })
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))



function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}


// Routes
app.use('/', require('./route_includes/auth_routes.js'));

app.listen(PORT, console.log(`Server running on port ${PORT}`));


