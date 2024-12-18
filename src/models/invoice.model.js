const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
    {
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
        },

        dueDate: {
            type: Date,
            required:true
        },
        pymentType: {
            type: String,
            enum: ["outright", "installment", "coownership"],
            default: "outright",
        },

        installment:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Installment',
            default:null
        },

        ownershipPool:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OwnershipPool',
            default:null
        },
        actualPaymentAmount:{
            type: Number,
            required: true
        },

        contractTerms: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contract',
        }],

        totalPrice: {
            type: Number,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);


const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
