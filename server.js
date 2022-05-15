require('dotenv').config()
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT ?? 3002
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/sessions"

const isAuth = require("./middleware/isAuth")

const User = require("./models/User")

const clinicController = require("./controllers/clinicController")
const apptController = require("./controllers/apptController")

// MONGOOSE CONNECTION/ERROR/DISCONNECTION ===================================================
mongoose.connection.on("error", (err) =>
  console.log(err.message + " is Mongod not running?")
);
mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
});
mongoose.connection.once("open", () => {
  console.log("connected to mongoose...");
});

//MIDDLEWARE - COOKIE-SESSION FOR LOGIN-AUTH ==================================================
// add this line
app.set("trust proxy", 1); 
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    // add the cookie stuff below
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
  );
  app.use(
    cors({
      credentials: true,
      // change your origin to match your own
      origin: ["http://localhost:3000", "https://project-3-clinic-appt-frontend.vercel.app/"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
    );
    
//MIDDLEWARE - GENERAL ===========================================================================
app.use(express.json()); //must be above the routes
app.use(express.urlencoded({extended: false}))
app.use(morgan("tiny"));

// MIDDLEWARE - BASE ROUTES
  app.use("/clinic", clinicController)
  app.use("/appt", apptController)
    
//ROUTES
//LOGIN-AUTH-REGISTER ROUTES
// Server Landing Page ============================================================================
app.get("/", (req,res) => {
  res.send("Hi 2");
});

//LogIN Landing Page ==============================================================================
app.get("/login", (req,res) =>{
  res.send("You have been directed to login");
});

//LogIN POST ======================================================================================
app.post("/login", async (req,res) => {
  const { email, password } = req.body

  const user = await User.findOne({email});

  if(!user) {
    return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });

  }

  const sessUser = { id: user.id, name: user.username, email: user.email }
  req.session.user = sessUser
  console.log(req.session.user)

  res.status(201).json({data: sessUser})

});

//Register Landing Page ============================================================================
app.get("/register", (req,res) => {
  res.send("You have been directed to register");

});

//Register POST =====================================================================================
app.post("/register", async (req,res) => {
  console.log("req.body", req.body)
  const { username, email, password } = req.body;

  let user = await User.findOne({email});

  if (user) {
    return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
  }

  const hashedPsw = await bcrypt.hash(password, 12);

  user = new User({
    username,
    email,
    password: hashedPsw,
  })

  await user.save();

  res.redirect("/login");

});

//Dashboard Landing Page =============================================================================
app.get("/", isAuth, (req,res) => {
  // res.render("dashboard");
  res.send("You have been directed to homepage");
});

//LogOUT POST ========================================================================================
app.post("/logout", (req,res) =>{
  req.session.destroy((err)=> {
    if (err) throw err;
    res.redirect("/");
  })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app;