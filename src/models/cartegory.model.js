const mongoose = require('mongoose');

const cartegorySchema = new mongoose.Schema(
  {
    _user: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    Name: {
      type: String,
    },
    Description: {
      type: String,
    },
  },
);

const Cartegory = mongoose.model('Cartegory', cartegorySchema);

module.exports = Cartegory;
