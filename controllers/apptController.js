require('dotenv').config();
const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth');

const userSchema = require('../models/User');
const clinicSchema = require('../models/clinicSchema');
const apptSchema = require('../models/apptSchema');
const Appt = require('../models/apptSchema');

//@route GET appt/ ======================================================================================
//@desc Get all appointments
//@access Private
router.get("/:user_id", async (req, res) => {
  await apptSchema.find({userid: req.params.user_id})
      .then(appt => {
        res.json(appt)
      })
      .catch(err => {
        res.status(400).json(err)
      })
});

//@route POST appt/:clinic_id/:user_id ===================================================================
//@desc Add new appointment
//@access Private
router.post('/:clinic_id/:user_id', [isAuth,
], async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.user_id).select('-password');
    const clinic = await clinicSchema.findById(req.params.clinic_id)

    // Create booking id
    function appointmentGenerator() {

      this.length = 8;
      this.timestamp = +new Date;

      let _getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      this.generate = function () {
        let ts = this.timestamp.toString();
        let parts = ts.split("").reverse();
        let id = "";

        for (let i = 0; i < this.length; ++i) {
          let index = _getRandomInt(0, parts.length - 1);
          id += parts[index];
        }

        return id;
      }
    }

    const create_id = new appointmentGenerator();
    const appointmentId = create_id.generate();

    const newAppointment = new apptSchema({
      bookingId: appointmentId,
      patientname: req.body.patientname,
      dateofbirth: req.body.dateofbirth,
      gender: req.body.gender,
      contact: req.body.contact,
      email: req.body.email,
      date: req.body.date,
      description: req.body.description,
      clinic: clinic.id,
      clinicname: clinic.name,
      userid: user.id

    })

    newAppointment.save()
    
    await clinic.save()

    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route GET appt/edit/:appointment_id ===================================================================
//@desc GET one appointment to EDIT
//@access Private
router.get("/edit/:appointment_id", isAuth, async (req, res) => {
  try {
    const appt = await apptSchema.findById(req.params.appointment_id)
    res.status(200).json(appt)
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
  
});

//@route PUT appt/:appointment_id ===================================================================
//@desc Edit an appointment
//@access Private
router.put("/:appointment_id", isAuth, async (req, res) => {
  try{
    const { appointment_id: apptID } = req.params
    const updAppt = await Appt.findByIdAndUpdate(
      { _id: apptID }, 
      req.body,
      {new:true,})

      if (!updAppt) {
        return res.status(400)
      }
      res.status(200)
  } catch {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   Delete appt/:appointment_id ===================================================================
// @desc    Delete an appointment
// @access  Private
router.delete('/:appointment_id', isAuth, async (req, res) => {
  try {
      console.log(req.params.appointment_id)
    await Appt.findByIdAndRemove(req.params.appointment_id);
    res.status(200).send('success')
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//EXPORT ===================================================================================================
module.exports = router;

//=================================================================== END ===========================================================