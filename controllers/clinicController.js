const express = require('express');
const router = express.Router();

const Clinic = require('../models/clinicSchema');

//SEED
router.get("/seed", async (req, res) => {
  try {
      await Clinic.deleteMany({})
      await Clinic.insertMany([
        {
          name: "O2 Medical Clinic",
          address: "527D Pasir Ris Street 51, #01-05, Singapore 514527",
          doctorname: "Dr Law Kung How",
          education: "MBBS (Singapore)",
          specialisation: "Dip Dermatology (Singapore)"
        },
        {
          name: "Fire Medical Clinic",
          address: "732 Tampines Street 71, #01-13, Singapore 520732",
          doctorname: "Dr Sam Toh",
          education: "MBBChBAO (Ireland)",
          specialisation: "Dip Dermatology (Singapore)"
        },
        {
          name: "Choong's Clinic",
          address: "123 Simei Street 45, #01-67, Singapore 528902",
          doctorname: "Dr Choong Chee",
          education: "MBBS (Singapore)",
          specialisation: "MMed FAm Med (Singapore)"
        }
      ]);
      res.send("Seed")
    } catch (error) {
        console.log(error);
    }
})


// *Index Route
//@route GET appt/ 
//@desc Get all clinics ===================================================================
router.get('/', (req, res) => {
    Clinic.find()
      .then(clinic => {
        res.json(clinic)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  })

//* Show Route
//@route GET appt/:clinic_id
//@desc Get one clinic ===================================================================
router.get("/:clinic_id", (req, res) => {
  Clinic.findById(req.params.clinic_id, (err, clinic) => {
    res.json(clinic);
  });
});


  module.exports = router;