const mongoose = require('mongoose')

const PropertySchema = new mongoose.Schema({
    // Basic Details
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: { type: String, required: true },
    details: { type: String, required: true },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
    },
    address: { type: String, required: true },
    cartegory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cartegory',
    },

    // Credibility
    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating',
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
   
    
    // Media
    images: { type: [String], default: [] },
    video: { type: String, default: '' },

    price: { type: Number, required: true },
    isTaken: { type: Boolean, default: false },

    // Features
    eletricity: { type: Boolean, default: true },
    security: { type: Boolean, default: true },
    water: { type: Boolean, default: true },
    bedrooms: { type: Number },
    bathrooms: { type: Number },

    // Amenities
    packingSpace: { type: String, default: '2' },
    garden: { type: String, default: 'Common' },
    pool: { type: String, default: 'Shared' },

    // Payments
    //will be created during creation of the property
    paymentPlanType: {
        type: String,
        enum: ["outright", "installment", "coownership"],
        default: "outright",
    },
    outrightPlan: { type: Number, default: null }, // Full Payment
    installmentPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InstallmentPlan',
        default: null,
    },
    coOwnershipPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoOwnershipPlan',
        default: null,
    },

    //will be porpulated during every purchase 
    paymentsMade: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
        }
    ],



    // Official Documents
    registeredSurvey: { type: Boolean, default: true },
    governmentAproved: { type: Boolean, default: true },
    documents: { type: [String], default: [] },

    // Property Documents
    siteMap: { type: String, default: '' },
    housePlan: { type: String, default: '' },
}, { timestamps: true }); // Includes createdAt and updatedAt fields

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;