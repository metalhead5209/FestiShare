if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require("mongoose");
const ExpressError = require('./utilities/ExpressError');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport');
const localStrat = require('passport-local');
const User = require('./models/user');

// IMPORT ROUTERS
const userRoutes = require('./routes/userRoutes');
const festiRoutes = require('./routes/festiRoutes');
const experienceRoutes = require('./routes/experienceRoutes');

// DB CONNECTION
const DB = "mongodb://127.0.0.1:27017/festiShare";
mongoose.connect(
  DB,
  () => {
    console.log("CONNECTED TO DB");
  },
  (e) => console.error(e, "NO CONNECTION")
);


// VIEW ENGINE
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(mongoSanitize());

const sesConfig = {
  secret: 'icantwaittobeemployed',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sesConfig));
app.use(flash());

// always make sure to use after session config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrat(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // res.locals is very important
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', userRoutes);
app.use('/festivals', festiRoutes);
app.use('/festivals/:id/experiences', experienceRoutes);

// HOME ROUTE (under construction)
app.get("/", (req, res) => {
  res.render("home");
});


// ERROR ROUTES
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
  const { statCode = 500} = err;
  if (!err.message) err.message = "Error!";
  res.status(statCode).render('error', { err })
});


// PORT
const PORT = 5252;
app.listen(PORT, () => {
  console.log("LISTENING ON PORT 5252");
});
