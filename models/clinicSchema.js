const mongoose = require ('mongoose');

const Schema = mongoose.Schema

const clinicSchema = new Schema({
  name: {
        type: String,
    },
    address: {
        type: String,
    },
    doctorname: {
      type: String,
    },
    education: {
      type: String,
    },
    specialisation: {
      type: String,
    }
    
});

const Clinic = mongoose.model('clinic', clinicSchema);

module.exports = Clinic 