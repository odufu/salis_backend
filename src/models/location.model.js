const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    property: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    }],
    longitude: {
     type: Number,
     required: true,
    },
    latitude: {
     type: Number,
     required: true,
    },
  },
);

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
