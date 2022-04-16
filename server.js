require('dotenv').config()
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT ?? 2000
const MONGODB_URI = process.env.MONGODB_URI

const profileController = require("./controllers/profileController")
const doctorController = require("./controllers/doctorController")
const clinicController = require("./controllers/clinicController")
const apptController = require("./controllers/apptController")
const userController = require("./controllers/users_controller.js");

//MIDDLEWARE
app.use(cors());
app.use(express.json()); //must be above the routes

app.use("/profile", profileController)
app.use("/doctor", doctorController)
app.use("/clinic", clinicController)
app.use("/appt", apptController)
app.use("/users", userController);

app.set("trust proxy", 1); // add this line
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
    origin: ["http://localhost:2000", "https://project-3-clinic-appt-frontend.vercel.app/"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);



// Error / Disconnection
mongoose.connection.on("error", (err) =>
  console.log(err.message + " is Mongod not running?")
);
mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));

//...farther down the page

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
});
mongoose.connection.once("open", () => {
  console.log("connected to mongoose...");
});

app.get("/", (req, res) => {
    res.send('Hi 2');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app;