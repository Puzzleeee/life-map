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
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  })
}

dotenv.config({ path: "./config/config.env" });

// Helmet
app.use(helmet());

// CSP with helmet
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"]
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

app.get("/", (req, res) => {
  const { name, id } = req.user;
  res.status(200).json({
    success: true,
    message: "Log in successful!",
    user: { name: name, id: id },
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/failure",
    failureFlash: true,
  })
);

// Testing create entry route with new photo upload
// const busboyMiddleware = require("./middleware/file-upload/busboy.js");
// const aws = require("./service/aws-upload/aws.js");
// const { createEntry } = require("./controllers/homepage.js");
// app.post("/test-upload", busboyMiddleware, (req, res) => {
//   console.log(req.body.images[0]);
// });

// // Testing file url retrival route
// app.get('/test-retrieve', async (req, res) => {
//   const awsResponse = await aws.retrieve('Capture3.JPG');
//   if (awsResponse.success) {
//     res.status(200).json(awsResponse);
//   } else {
//     res.status(400).json(awsResponse);
//   }
// })

// Routes
app.use("/", require("./routes/auth.js"));
app.use("/homepage", require("./routes/homepage.js"));
app.use("/social", require("./routes/social.js"));
app.use("/profile", require("./routes/profile.js"));

app.listen(PORT, console.log(`Server running on port ${PORT}`));
