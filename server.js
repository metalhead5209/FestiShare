const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const asyncWrap = require('./utilities/AsyncWrap');
const ExpressError = require('./utilities/ExpressError');
const { festiSchema } = require('./schemas.js');
const ejsMate = require('ejs-mate');
const Festival = require("./models/festival");
const methodOverride = require("method-override");

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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const validateFest = (req, res, next) => {
  const { error } = festiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}



// ROUTES
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/festivals", asyncWrap(async (req, res) => {
  const festivals = await Festival.find({});
  res.render("festivals/index", { festivals });
}));

app.get("/festivals/new", (req, res) => {
  res.render("festivals/new");
});

app.post("/festivals", validateFest, asyncWrap(async (req, res) => {
  // if (!req.body.festivals) throw new ExpressError('Invalid Campground Data', 400);
  const festival = new Festival(req.body.festival);
  await festival.save();
  res.redirect(`/festivals/${festival._id}`);
}));

app.get("/festivals/:id", asyncWrap(async (req, res) => {
  const festival = await Festival.findById(req.params.id);
  res.render("festivals/show", { festival });
}));

app.get("/festivals/:id/edit", asyncWrap(async (req, res) => {
  const festival = await Festival.findById(req.params.id);
  res.render("festivals/edit", { festival });
}));

app.put('/festivals/:id', validateFest, asyncWrap(async (req, res) => {
  const { id } = req.params;
  const festival = await Festival.findByIdAndUpdate(id, { ...req.body.festival });
  res.redirect(`/festivals/${festival._id}`);
}));

app.delete("/festivals/:id", asyncWrap(async (req, res) => {
  const { id } = req.params;
  await Festival.findByIdAndDelete(id);
  res.redirect('/festivals');
}));

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
