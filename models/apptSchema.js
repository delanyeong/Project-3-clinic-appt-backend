const mongoose = require("mongoose");

const apptSchema = mongoose.Schema(
    {
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'doctors'
        },
        bookingId: {
            type: Number
        },
        patientname: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
        },
        description: {
            type: String,
            required: true
        },
        timeslots: [
            {
                starttime: {
                    type: String,
                    required: true
                },
                endtime: {
                    type: String,
                    required: true
                }
            }
        ]
    }
);

module.exports = mongoose.model("Appts", apptSchema)