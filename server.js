require('dotenv').config()
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoDBSession = require('connect-mongodb-session')(session)

const app = express();
const PORT = process.env.PORT ?? 3000
const MONGODB_URI = process.env.MONGODB_URI

const User = require("./models/User")

const profileController = require("./controllers/profileController")
const doctorController = require("./controllers/doctorController")
const clinicController = require("./controllers/clinicController")
const apptController = require("./controllers/apptController")
// const userController = require("./controllers/users_controller.js");

// MONGOOSE CONNECTION/ERROR/DISCONNECTION
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

const store = new MongoDBSession({
  uri: MONGODB_URI,
  collection: 'mySessions'
})

//MIDDLEWARE
app.use(cors());
app.use(express.json()); //must be above the routes
app.use(express.urlencoded({extended: true}))

// MIDDLEWARE - BASE ROUTES
app.use("/profile", profileController)
app.use("/doctor", doctorController)
app.use("/clinic", clinicController)
app.use("/appt", apptController)
// app.use("/users", userController);

//MIDDLEWARE - LOGIN AND AUTHENTICATION 
app.set("trust proxy", 1); // add this line

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
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
    origin: ["http://localhost:2000", "https://project-3-clinic-appt-frontend.vercel.app/"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next()
  } else {
    res.redirect("/login")
  }
}



//ROUTES

//REGISTER ROUTES
// Landing Page ==============================================================
app.get("/", (req,res) => {
  req.session.isAuth = true;
  res.send("Hi 2");
});

//Login Page ==============================================================
app.get("/login", (req,res) =>{
  // res.render("login");
  res.send("You have been directed to login");
});
//Login Page 2 ==============================================================
app.post("/login", async (req,res) => {
  const { email, password } = req.body

  const user = await User.findOne({email});

  if(!user) {
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.redirect("/login");

  }

  req.session.isAuth = true

  res.redirect("/dashboard");

});

//Register Page ==============================================================
app.get("/register", (req,res) => {
  // res.render("register");
  res.send("You have been directed to register");

});

//Register Page 2 ==============================================================
app.post("/register", async (req,res) => {
  console.log("req.body", req.body)
  const { username, email, password } = req.body;

  let user = await User.findOne({email});

  if (user) {
    return res.redirect ("/register");
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
//Dashboard ==============================================================
app.get("/dashboard", isAuth, (req,res) => {
  // res.render("dashboard");
  res.send("You have been directed to dashboard");
});
//Logout ==============================================================
app.post("/logout", (req,res) =>{
  req.session.destroy((err)=> {
    if (err) throw err;
    res.redirect("/");
  })
})


//ROUTES - ORIGINAL
// app.get("/", (req, res) => {
//     res.send('Hi 2');
// })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app;