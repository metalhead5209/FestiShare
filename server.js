const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ROUTES
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/festivals", async (req, res) => {
  const festivals = await Festival.find({});
  res.render("festivals/index", { festivals });
});

app.get("/festivals/new", (req, res) => {
  res.render("festivals/new");
});

app.post("/festivals", async (req, res) => {
  const festival = new Festival(req.body.festival);
  await festival.save();
  res.redirect(`/festivals/${festival._id}`);
});

app.get("/festivals/:id", async (req, res) => {
  const festival = await Festival.findById(req.params.id);
  res.render("festivals/show", { festival });
});

app.get("/festivals/:id/edit", async (req, res) => {
  const festival = await Festival.findById(req.params.id);
  res.render("festivals/edit", { festival });
});

app.put('/festivals/:id', async (req, res) => {
  const { id } = req.params;
  const festival = await Festival.findByIdAndUpdate(id, { ...req.body.festival });
  res.redirect(`/festivals/${festival._id}`);
});

app.delete("/festivals/:id", async (req, res) => {
  const { id } = req.params;
  await Festival.findByIdAndDelete(id);
  res.redirect('/festivals');
});

const PORT = 5252 || process.env.PORT;
app.listen(PORT, () => {
  console.log("LISTENING ON PORT 5252");
});
