// const mongoose = require ('mongoose');
// const Schema = mongoose.Schema;


// //Create Schema
// const apptSchema = new Schema({
//     fullname:{
//         type: String,
//         required: true
//     },
//     cellphone:{
//         type: String,
//         required: true
//     },
//     date:{
//         type: String,
//         required: true,
//     }, 
//     time:{
//         type: String,
//         required: true
//     }, 
//     description:{
//         type: String,
//         required: true
//     }
// });

// module.exports = Appointment = mongoose.model('appointment', apptSchema)

// const mongoose = require("mongoose");

// const apptSchema = mongoose.Schema(
//     {
//         doctor: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'doctors'
//         },
//         bookingId: {
//             type: Number
//         },
//         patientname: {
//             type: String,
//             required: true
//         },
//         dob: {
//             type: Date,
//         },
//         description: {
//             type: String,
//             required: true
//         },
//         timeslots: [
//             {
//                 starttime: {
//                     type: String,
//                     required: true
//                 },
//                 endtime: {
//                     type: String,
//                     required: true
//                 }
//             }
//         ]
//     }
// );

// module.exports = mongoose.model("Appts", apptSchema)