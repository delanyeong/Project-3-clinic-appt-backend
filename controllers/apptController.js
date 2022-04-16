const express = require('express');
const { route } = require('express/lib/application');
const { append } = require('express/lib/response');
const router = express.Router();

const Appt = require('../models/apptSchema');

//MIDDLEWARE



//* Index Route
router.get('/', (req, res) => {
    Appt.find()
      .then(appts => {
        res.json(appts)
      })
      .catch(err => {
        res.json(err)
      })
  })
  
  //* Create Route
  router.post("/", async (req, res) => {
    console.log("body", req.body)
    try {
      const createdAppt = await Appt.create(req.body);
      res.status(200).send(createdAppt);
    } catch (error) {
      res.status(400).json({ error: error.message });
    };
  });
  
  //* Delete Route
  router.delete("/:id", async (req, res) => {
    await Appt.findByIdAndRemove(req.params.id);
    res.json({ message: "Appt Deleted" });
  });
  
  //*Put route
  router.put("/:id", async (req, res) => {
    await Appt.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Appt Updated" });
  });
   
  module.exports = router;