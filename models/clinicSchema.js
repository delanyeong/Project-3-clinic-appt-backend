const mongoose = require ('mongoose');

const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    docID: {
        type: Number
    },
    Specialisation: {
      type: String,
    },
    experience : [
      {
          position: {
              type: String,
              required: true
          },
          medical: {
              type: String,
              required: true
          },
          location: {
              type: String
          },
          from: {
              type: Date,
              required: true
          },
          to: {
              type: Date
          },
          current: {
              type: Boolean,
              default: false
          },
          description: {
              type: String
          }
      }
  ],
  education: [
      {
        school: {
          type: String,
          required: true
        },
        degree: {
          type: String,
          required: true
        },
        fieldofstudy: {
          type: String,
          required: true
        },
        from: {
          type: Date,
          required: true
        },
        to: {
          type: Date
        },
        current: {
          type: Boolean,
          default: false
        },
        description: {
          type: String
        }
      }
    ]
});

module.exports = Doctor = mongoose.model('Clinics', clinicSchema);