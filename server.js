const express = require("express");
const path = require("path");
const session = require('express-session');
const mongoose = require("mongoose");
const ExpressError = require('./utilities/ExpressError');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const festiRoutes = require('./routes/festiRoutes');
const reviewRoutes = require('./routes/reviewRoutes');



const app = express();



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
const sesConfig = {
  secret: 'icantwaittobeemployed',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sesConfig));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/festivals', festiRoutes);
app.use('/festivals/:id/reviews', reviewRoutes);

// HOME ROUTE (under construction)
app.get("/", (req, res) => {
  res.render("home");
});


// ERROR ROUTES
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statCode = 500} = err;
  if (!err.message) err.message = "OH no, Error!";
  res.status(statCode).render('error', { err })
});


// PORT
const PORT = 5252 || process.env.PORT;
app.listen(PORT, () => {
  console.log("LISTENING ON PORT 5252");
});
