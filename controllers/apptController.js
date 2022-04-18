require('dotenv').config();
const express = require('express');
const router = express.Router();
const isAuth = require("../middleware/isAuth")

const Appointment = require('../models/apptSchema');

//MIDDLEWARE


//ROUTES

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

//@route GET /appointments
//@desc Get all appointments
//@access Private
router.get("/appointments", isAuth, (req,res)=> {
  Appointment.find()
  .sort({ date:1 })
  .then( appointments => res.json(appointments))
  .catch(err =>
    res.status(500).json({ msg: "Could not get the appointments. Please try again."})
    );
});

//@route POST /
//@desc Add new appointment
//@access Private
router.post("/add-appointment", isAuth, (req,res) => {
  const { fullname, cellphone, date, time, description } = req.body;
  if (!fullname || !cellphone || !date || !time || !description) {
    return res.status(400).json({ msg : " All fields are required" });
  }

  const validateDateTime = async (date,time) => {
    const existingAppointment = await Appointment.findOne({ date, time});
    if (existingAppointment) {
      res.status(400).json({ msg: "Please choose another date or time. Timeslot is unavailable."})
    } else {
      saveAppointment();
    }
  };

  validateDateTime(date, time);
  const saveAppointment = () => {
    //Construct appointment
    const newAppointment = new Appointment({
      fullname,
      cellphone,
      date,
      time,
      description
    });
    // add to database
    newAppointment
    .save()
    .then(appointment => res.json({ msg : "Appointment added successfully!"}))
    .catch(err =>
      res.status(500).json({ msg : "Something went wrong. Please try again."}))
  }
})

//@route PUT /appointment/:id
//@desc Edit an appointment
//@access Private
router.put("/appointment/:id", isAuth, (req,res) => {
  Appointment.findById(req.params.id)
  .then(appointment => {
    //New values
    const { date, time } = req.body;
    (appointment.date = date),
    (appointment.time = time),
    appointment
    .save()
    .then(appointment => 
      res.json({ msg: "Appointment edited successfully!"})
    )
    .catch(err =>
      res.status(500).json({msg : "Something went wrong. Please try again."})
    );
  })
  .catch(err =>
    res.status(404).json({ msg: "Appointment not found."}));
});

//@route Delete /appointment/:id
//@desc Delete an appointment
//@access Private
router.delete("/appointment/:id", isAuth, (req,res) => {
  Appointment.findById(req.params.id)
  .then(appointment => 
    appointment
    .remove()
    .then(() =>
    res.json({ msg: "Appointment removed successfully."}))
    )
    .catch(err =>
      res.status(404).json({ msg: "Appointment not found"}));
})






  //EXPORT 
  module.exports = router;