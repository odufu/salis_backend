const mongoose = require ("mongoose")


// OwnershipPool schema
const OwnershipPoolSchema = new mongoose.Schema({
    dateCreated: {
      type: String,
      required: true,
      default: () => new Date().toISOString(), // Automatically generate ISO date
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Default to null when not occupied
    },
    isOccupied: {
      type: Boolean,
      default: false, // Default to not occupied
    },
    sharePrice: {
      type: Number,
      required: true, // Required field
    },
    equityShare: {
      type: Number,
      required: true, // Required field
    },
  });


  const OwnershipPool = mongoose.model('OwnershipPool', OwnershipPoolSchema);

  module.exports = OwnershipPool;