// const express = require('express');
// const { route } = require('express/lib/application');
// const { append } = require('express/lib/response');
// const router = express.Router();

// const Doctor = require('../models/doctorSchema');

// //SEED
// router.get("/seed", async (req, res) => {

//   const doctors = [
//     {
//       name: "New Year's Day",
//     }
//   ]
//   await Doctor.deleteMany({});
//   await Doctor.insertMany(doctors)
//   res.json(doctors)
// })

// //MIDDLEWARE

// // *Index Route
// router.get('/', (req, res) => {
//     Doctor.find()
//       .then(doctors => {
//         res.json(doctors)
//       })
//       .catch(err => {
//         res.status(400).json(err)
//       })
//   })

//   module.exports = router;