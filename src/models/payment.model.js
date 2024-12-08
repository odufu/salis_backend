const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  //WHO MADE THE PAYMENT
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // WHAT PROPERTY DID THEY PAY FOR?
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },

  //WHAT OWNERSHIP POOL DID THEY PAY FOR, IF NOT NULL
  ownershipPool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OwnershipPool',
    default: null,
  },

  // WHAT INSTALLMENT DID THEY PAY FOR? IF NOT NULL
  installment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Installment',
    default: null,
  },

  //HOW MUCH DID THEY PAY?
  amount: {
    type: Number,
    required: true,
  },

  //WHAT TYPE OF PAYMENT DID THEY MAKE?
  paymentType: {
    type: String,
    enum: ['ownershipPool', 'installment', 'outright'],
  },

  //Message for payment
  paymentNote: {
    type: String,
    default: "Payment Initiated"
  },

  //PAYMENT SUCCESS STATUS
  isSuccess: {
    type: Boolean,
    default: false, // Set to false by default for new payments
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
