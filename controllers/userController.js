const express = require('express');
// const { route } = require('express/lib/application');
// const { append } = require('express/lib/response');
const router = express.Router();

const User = require('../models/userSchema');



// //SEED
// router.get("/seed", async (req, res) => {

//   const users = [
//     {
//       name: "Delan",
//       email: "hi@gmail.com",
//       password: "hellobye",
//       dob: "2022",
//       gender: "M",
//       contact: 12345678
//   }
//   ]
//   await User.deleteMany({});
//   await User.insertMany(users)
//   res.json(users)
// })


// *Index Route
router.get('/', (req, res) => {
  User.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

// *Create Route
router.post("/", async (req, res) => {
    console.log("body", req.body)
    try {
      const createdUsers = await User.create(req.body);
      res.status(200).json(createdUsers);
    } catch (error) {
      res.status(400).json({ error: error.message });
    };
  });

//*Put route
router.put("/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "User Updated" });
});
  

  
  module.exports = router;
