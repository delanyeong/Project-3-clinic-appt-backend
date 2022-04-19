require('dotenv').config();
const express = require('express');
const router = express.Router();


const isAuth = require('../middleware/isAuth');

const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const clinicSchema = require('../models/clinicSchema');


//@route GET /appointments ===================================================================
//@desc Get all appointments
//@access Private

router.get("/appointments", isAuth, (req,res)=> {
  async function listGames() {
    const users = await User
        .find()
        .select('appointments');
    res.json(users);
}
listGames();
  
  // console.log(req.body);
  // console.log(User.findById())
  // User.findById()
  // // .sort({ date:1 })
  // .then( users => res.json(users))
  // .catch(err =>
  //   res.status(500).json({ msg: "Could not get the appointments. Please try again."})
  //   );
});


//@route POST /appointment/:clinic_id ===================================================================
//@desc Add new user appointment
//@access Private

router.post('/:clinic_id', 
  [ 
    check('patientname', 'Patient name is required')
        .not().isEmpty(),
    check('dateofbirth', 'Date of birth is required')
        .not().isEmpty(),
    check('gender', 'Gender is required')
        .not().isEmpty(),
    check('contact', 'Contact is required')
        .not().isEmpty(),
    check('email', 'Email is required')
        .not().isEmpty(),
], async (req,res)=> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array() });
  }
  try {
    const user = await User.findById(req.user.id).select('-password');
    const clinic = await clinicSchema.findById(req.params.clinic_id).select('-password');

    // Create booking id
    function appointmentGenerator() {
	 
      this.length = 8;
      this.timestamp = +new Date;
      
      var _getRandomInt = function( min, max ) {
         return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
      }
      
      this.generate = function() {
          var ts = this.timestamp.toString();
          var parts = ts.split( "" ).reverse();
          var id = "";
          
          for( var i = 0; i < this.length; ++i ) {
             var index = _getRandomInt( 0, parts.length - 1 );
             id += parts[index];	 
          }
          
          return id;
      }
  }

  const create_id = new appointmentGenerator();
  const appointmentId = create_id.generate();

  const newAppointment = {
    bookingId: appointmentId,
    patientname: req.body.patientname,
    dateofbirth: req.body.dateofbirth,
    gender: req.body.gender,
    contact: req.body.contact,
    email: req.body.email,
    date: req.body.date,
    description: req.body.description,
    name: clinic.name,
    clinic: clinic.id
  }

  user.appointments.unshift(newAppointment);
  await user.save()

  res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


//@route PUT /appointment/:id ===================================================================
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


// @route   Delete api/appointment/:appointment_id ===================================================================
// @desc    Delete a appointment
// @access  Private

router.delete('/:appointment_id', isAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        // Get the remove index for user
        const removeIndexUser = user.appointments
            .map(item => item.id)
            .indexOf(req.params.appointment_id);
          
        user.appointments.splice(removeIndexUser, 1);
        await user.save();

        // Return user
        res.json(user);
    } catch (err) {
        
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