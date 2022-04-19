const mongoose = require ('mongoose');

const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    
});

module.exports = Clinic = mongoose.model('clinic', clinicSchema);