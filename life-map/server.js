const express = require("express");
const dotenv = require("dotenv");
const db = require("./db/db.js");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("./passport-config.js");
const busboy = require("connect-busboy");
const busboyBodyParser = require("busboy-body-parser");
const helmet = require("helmet");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Helmet
app.use(helmet());

// CSP with helmet
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 
      "'unsafe-inline'", 
      "https://maps.googleapis.com"
    ],
    styleSrc: ["'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ]
  }
}))

// Node passport middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
initializePassport(
  passport,
  db.get_user_by_email.execute,
  db.get_user_by_id.execute
);

// busboy library for file upload
app.use(busboy());

app.use(express.json());
app.use(busboyBodyParser());

app.use(flash());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});


app.post('/login', (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      return next(err); 
    } 
    
    if (!user) { 
      return res.status(200).json({
        success: false,
        user: {}
      })
    }

    req.logIn(user, (err) => {
      if (err) { 
        return next(err); 
      }
      const { name, id } = req.user;
      return res.status(200).json({
        success: true,
        message: "Log in successful!",
        user: { name: name, id: id },
      });
    });
  })(req, res, next);
});

// Routes
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/homepage", require("./routes/homepage.js"));
app.use("/api/social", require("./routes/social.js"));
app.use("/api/profile", require("./routes/profile.js"));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  })
} else {
  dotenv.config({ path: "./config/config.env" });
}



app.listen(PORT, console.log(`Server running on port ${PORT}`));
