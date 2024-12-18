
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // WHO MADE THE PAYMENT?
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

  isVerified: {
    type: Boolean,
    default: false, // Set to false by default for new donations
  },

  // WHAT OWNERSHIP POOL DID THEY PAY FOR, IF NOT NULL?
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

  // HOW MUCH DID THEY PAY?
  amount: {
    type: Number,
    required: true,
  },

  // WHAT TYPE OF PAYMENT DID THEY MAKE?
  paymentType: {
    type: String,
    enum: ["outright", "installment", "coownership"],
    required: true
  },

  // WHAT INVOICE DOES THIS PAYMENT FULFILL?
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
  },

  // MESSAGE FOR PAYMENT
  paymentNote: {
    type: String,
    default: 'Payment Initiated',
  },

  // PAYMENT SUCCESS STATUS
  isSuccess: {
    type: Boolean,
    default: false,
  },

  // PAYMENT METHOD (e.g., Paystack, Bank Transfer, etc.)
  paymentMethod: {
    type: String,
    enum: ['paystack', 'bank-transfer', 'other'],
  },

  // PAYMENT DATE
  paymentDate: {
    type: Date,
    default: Date.now,
  },

  // TRANSACTION REFERENCE (e.g., Paystack transaction reference)
  transactionReference: {
    type: String,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;


