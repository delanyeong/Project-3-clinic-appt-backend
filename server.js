require('dotenv').config()
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT ?? 2000
const MONGODB_URI = process.env.MONGODB_URI

const userController = require("./controllers/userController")
const doctorController = require("./controllers/doctorController")
const clinicController = require("./controllers/clinicController")
const apptController = require("./controllers/apptController")

//MIDDLEWARE
app.use(cors());
app.use(express.json()); //must be above the routes

app.use("/user", userController)
app.use("/doctor", doctorController)
app.use("/clinic", clinicController)
app.use("/appt", apptController)



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