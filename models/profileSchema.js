const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
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
    // date: {
    //   type: Date,
    //   default: Date.now
    // },
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
module.exports = mongoose.model("Profiles", profileSchema);