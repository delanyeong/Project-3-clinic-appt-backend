const mongoose = require ('mongoose');

const Schema = mongoose.Schema

const apptSchema = new Schema({
    clinic: {
        type: Schema.Types.ObjectId,
        ref: 'clinic'
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
    
});

const Appt = mongoose.model('appt', apptSchema);

module.exports = Appt 