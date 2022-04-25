require('dotenv').config();
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const isAuth = require('../middleware/isAuth');

const userSchema = require('../models/User');
const clinicSchema = require('../models/clinicSchema');
const apptSchema = require('../models/apptSchema');
const Appt = require('../models/apptSchema');

//@route GET appt/ ===================================================================
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
  // userSchema.find()
  //   .select('appointments')
  //   .populate('appointments')
  //   .then(appointments => res.json(appointments))
  //   .catch(err =>
  //     res.status(500).json({ msg: "Could not get the appointments. Please try again." })
  //   );
});

//@route POST appt/:clinic_id/:user_id ===================================================================
//@desc Add new user appointment
//@access Private
router.post('/:clinic_id/:user_id', [isAuth,
  // [
  //   check('patientname', 'Patient name is required')
  //     .not().isEmpty(),
  //   check('dateofbirth', 'Date of birth is required')
  //     .not().isEmpty(),
  //   check('gender', 'Gender is required')
  //     .not().isEmpty(),
  //   check('contact', 'Contact is required')
  //     .not().isEmpty(),
  //   check('email', 'Email is required')
  //     .not().isEmpty(),

  // ]
], async (req, res) => {
  // const errors = validationResult(req);
  console.log('ashdasb')
  console.log("body",req.body)
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  try {
    const user = await userSchema.findById(req.params.user_id).select('-password');
    const clinic = await clinicSchema.findById(req.params.clinic_id)
    // .select('-password');
    // console.log(req.body)
    // console.log(req.params)
    // console.log(req.params.clinic_id)
    // console.log(req.params.user_id)

    // Create booking id
    function appointmentGenerator() {

      this.length = 8;
      this.timestamp = +new Date;

      var _getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      this.generate = function () {
        var ts = this.timestamp.toString();
        var parts = ts.split("").reverse();
        var id = "";

        for (var i = 0; i < this.length; ++i) {
          var index = _getRandomInt(0, parts.length - 1);
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
    
    user.appointments.push(newAppointment);
    await clinic.save()

    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Show Route
router.get("/edit/:appointment_id", isAuth, async (req, res) => {
  try {
    console.log('here')
    console.log(req.params.appointment_id)
    const appt = await apptSchema.findById(req.params.appointment_id)
    res.status(200).json(appt)
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
  
});

//@route PUT appt/:user_id/:appointment_id ===================================================================
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

// @route   Delete appt/:user_id/:appointment_id ===================================================================
// @desc    Delete a appointment
// @access  Private

router.delete('/:appointment_id', isAuth, async (req, res) => {
  try {
      //* Delete Route
      console.log(req.params.appointment_id)
    await Appt.findByIdAndRemove(req.params.appointment_id);
    res.status(200).send('success')
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//EXPORT ===================================================================
module.exports = router;

//=================================================================== END ===================================================================


//ROUTES - 1ST SET 

// //* Index Route
// router.get('/', (req, res) => {
//     Appt.find()
//       .then(appts => {
//         res.json(appts)
//       })
//       .catch(err => {
//         res.json(err)
//       })
//   })
  
//   //* Create Route
//   router.post("/", async (req, res) => {
//     console.log("body", req.body)
//     try {
//       const createdAppt = await Appt.create(req.body);
//       res.status(200).send(createdAppt);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     };
//   });
  
//   //* Delete Route
//   router.delete("/:id", async (req, res) => {
//     await Appt.findByIdAndRemove(req.params.id);
//     res.json({ message: "Appt Deleted" });
//   });
  
//   //*Put route
//   router.put("/:id", async (req, res) => {
//     await Appt.findByIdAndUpdate(req.params.id, req.body);
//     res.json({ message: "Appt Updated" });
//   });



//ROUTERS - 2ND SET

// router.post("/add-appointment", isAuth, (req,res) => {
  //   const { fullname, cellphone, date, time, description } = req.body;
  //   if (!fullname || !cellphone || !date || !time || !description) {
  //     return res.status(400).json({ msg : " All fields are required" });
  //   }
    
  //   const validateDateTime = async (date,time) => {
  //     const existingAppointment = await Appointment.findOne({ date, time});
  //     if (existingAppointment) {
  //       res.status(400).json({ msg: "Please choose another date or time. Timeslot is unavailable."})
  //     } else {
  //       saveAppointment();
  //     }
  //   };
  
  //   validateDateTime(date, time);
  //   const saveAppointment = () => {
  //     //Construct appointment
  //     const newAppointment = new Appointment({
  //       fullname,
  //       cellphone,
  //       date,
  //       time,
  //       description
  //     });
  //     // add to database
  //     newAppointment
  //     .save()
  //     .then(appointment => res.json({ msg : "Appointment added successfully!"}))
  //     .catch(err =>
  //       res.status(500).json({ msg : "Something went wrong. Please try again."}))
  //     }
  // })

  // //@route Delete /appointment/:id 
  // //@desc Delete an appointment
  // //@access Private
  // router.delete("/appointment/:id", isAuth, (req,res) => {
  //   Appointment.findById(req.params.id)
  //   .then(appointment => 
  //     appointment
  //     .remove()
  //     .then(() =>
  //     res.json({ msg: "Appointment removed successfully."}))
  //     )
  //       .catch(err =>
  //       res.status(404).json({ msg: "Appointment not found"}));
  // })