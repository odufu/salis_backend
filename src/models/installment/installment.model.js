const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    property: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Property',
    }
    ammount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
        required:true,
      }
    dueDate:{
      type: Date,
      required:true,
     },
  },
);

const Installment = mongoose.model('Installment', installmentSchema);

module.exports = Installment;
