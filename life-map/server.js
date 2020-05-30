const express = require('express');
const dotenv = require('dotenv')
var cors = require('cors');
const bcrypt = require('bcrypt')
const db = require('./db/db.js')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./passport-config.js')

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config({ path: './config/config.env' });

// Node passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

initializePassport(passport, db.get_user_by_email.execute, db.get_user_by_id.execute)


app.use(express.json());
app.use(flash());


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Log in successful!',
    user: req.user
  })
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/failure',
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
    return res.redirect('/homepage')
  }
  next()
}


// Routes
app.use('/', require('./route_includes/auth_routes.js'));
app.use('/', require('./route_includes/homepage_routes.js'));

app.listen(PORT, console.log(`Server running on port ${PORT}`));


