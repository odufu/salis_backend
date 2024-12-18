const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema(
    {
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            
            ref: 'User',
        },
        contractType:{ 
            type: String,
            enum: ["outright","installment", "coownership"],
            default:"outright"
        },
        contractHeader: {
            type: String,
        },

        contractTerms: [{
            type: String,
        }],

        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);


const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
