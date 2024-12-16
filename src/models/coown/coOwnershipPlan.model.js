const mongoose = require("mongoose");

// CoOwnershipPlan schema
const CoOwnershipPlanSchema = new mongoose.Schema({
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true, // Must be linked to a property
    },
    totalValue: {
      type: Number,
      required: true, // Total value of the property
    },
    maximumPool: {
      type: Number,
      required: true, // Total value of the property
    },
    ownershipShares:[ {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OwnershipPool',
    }],
  });

 const CoOwnershipPlan = mongoose.model('CoOwnershipPlan', CoOwnershipPlanSchema);
 module.exports = CoOwnershipPlan;