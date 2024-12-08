const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema(

  {
    //the user that creates this 
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    //the property this installment belongs to
    property: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Property',
    },
    isCleared:{
      type:Boolean,
      default: false,
    },
    //the plan this installment belongs to
    installmentPlan: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Property',
    },
    //ammount to be paid for this installment
    amount: {
       type: Number,
       require :true,
      },
    //the due date for this installment
    dueDate:{
      type: Date,
      required:true,
     },
  },
);

const Installment = mongoose.model('Installment', installmentSchema);

module.exports = Installment;
