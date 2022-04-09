const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    contact: {
      type: Number,
    },
    // appointmentsmade: {
    //   type: mongoose.Schema.Types.ObjectId, //mongoose.Schema.Types.ObjectId,
    //   ref: "Appointments",
    // },
  }
);
module.exports = mongoose.model("Users", userSchema);