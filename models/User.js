const mongoose = require("mongoose");

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: { 
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  appointments: [
    {
        clinic: {
            type: Schema.Types.ObjectId,
            ref: 'clinic'
        },
        clinicname: {
          type: String
        },
        bookingId: {
            type: Number
        },
        patientname: {
            type: String,
            required: true
        },
        dateofbirth: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        contact: {
            type: Number,
        },
        email: {
          type: String,
      },
        date: {
            type: Date,
        },
        description: {
            type: String,
            required: true
        },
    }
]
});

const User = mongoose.model('user', userSchema);

module.exports = User;