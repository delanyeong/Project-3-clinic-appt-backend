const express = require('express');
const { route } = require('express/lib/application');
const { append } = require('express/lib/response');
const router = express.Router();

const Clinic = require('../models/clinicSchema');

//MIDDLEWARE

// *Index Route
router.get('/', (req, res) => {
    Clinic.find()
      .then(clinics => {
        res.json(clinics)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  })

  module.exports = router;