const mongoose = require('mongoose');

const installmentPlanSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly' , 'quarterly', 'yearly'],
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    closingPeriod: {
      type: Number, //1 year
      default: 0,
    },
    amoutPaid: {
      type: Number,
      default: 0,
    },
    minimumInitialPayment: {
      type: Number,
      default: 0,
    },
    installments:[{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Property',
     required:true,
    }]
  },
);

const InstallmentPlan = mongoose.model('InstallmentPlan', installmentPlanSchema);

module.exports = InstallmentPlan;
