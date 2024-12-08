const mongoose = require('mongoose');

// rating schema
const ratingSchema = new mongoose.Schema({
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true, // Rated Property
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Who rated the property
    },
    star: {
      type: Number,
      required: true, // Star Rating out of 5
    },
  });

 const Rating = mongoose.model('Rating', ratingSchema);
 module.exports = Rating;