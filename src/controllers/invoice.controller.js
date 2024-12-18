const User = require('../models/user.model');
const Property = require('../models/property.model');
const Contract = require('../models/contract.model');
const InstallmentPlan = require('../models/installment/installmentPlan.model');
const CoOwnershipPlan = require('../models/coown/coOwnershipPlan.model');
const OwnershipPool = require('../models/coown/ownershipPool.model');
const Invoice = require('../models/invoice.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Installment = require('../models/installment/installment.model');

/**
 * @description Ping the Route `test`
 * @route `@any`
 * @access Public
 * @type GET
 */
exports.ping = catchAsync(async (req, res, next) => {
    res.status(200).json({
        success: true,
        status: 'success',
        message: 'Hello from Invoices',
        data: req.body || {}
    });
});

/**
 * @description Post an Invoice
 * @route `/api/invoice/postinvoice`
 * @access Private
 * @type POST
 */
exports.postInvoice = catchAsync(async (req, res, next) => {
    try {
        const creator = req.user._id; // Assuming authenticated user
        const { propertyId, ownerId, installmentId, ownershipPoolId , dueDate} = req.body;

        // Validate property
        const property = await Property.findById(propertyId);
        if (!property) {
            return next(new AppError('Property not found', 404));
        }

        // Validate owner
        const owner = await User.findById(ownerId);
        if (!owner) {
            return next(new AppError('Owner not found', 404));
        }




        //get the properties payment type
        const paymentType = property.paymentPlanType

        //get the contracts that matches that payment plans

        const contractTerms = await Contract.find({ paymentType });


        let invoice;

        // Handle Outright Payment
        if (paymentType === 'outright') {

            invoice = new Invoice({
                creator,
                owner: ownerId,
                property: propertyId,
                paymentType,
                contractTerms,
                dueDate: dueDate,
                totalPrice: property.price,
                actualPaymentAmount: property.price,
            });
        }

        // Handle Installment Payments
        if (paymentType === 'installment') {


           //Get the installment that the invoice is being created for

            const installment = await Installment.findById(installmentId);
            if (!installment) {
                return next(new AppError('Installment not found', 404));
            }

            //Get the installment PLAN that this installment falls under
            const installmentPlan = await InstallmentPlan.findById(installment.installmentPlan);
            if (!installmentPlan) {
                return next(new AppError('InstallmentPlan not found', 404));
            }

            invoice = new Invoice({
                creator,
                owner: ownerId,
                property: propertyId,
                paymentType,
                installment: installmentId,
                contractTerms,
                totalPrice: installmentPlan.totalCost,
                actualPaymentAmount: installment.amount,
                dueDate: dueDate // Example: Using closing period as due date
            });
        }

        // Handle Co-Ownership Payments
        if (paymentType === 'coownership') {
            const ownershipPool = await OwnershipPool.findById(ownershipPoolId);
            
            const coOwnershipPlan = await CoOwnershipPlan.findById(ownershipPool.coOwnershipPlan);
            
            if (!coOwnershipPlan) {
                return next(new AppError('Co-ownership plan not found or does not match the property.', 404));
            }

            invoice = new Invoice({
                creator,
                owner: ownerId,
                property: propertyId,
                paymentType,
                ownershipPool: ownershipPoolId,
                contractTerms,
                totalPrice: coOwnershipPlan.totalValue,
                actualPaymentAmount: ownershipPool.sharePrice,
                dueDate: dueDate // Co-ownership might not have a due date
            });
        }



        // Save the invoice
        if (!invoice) {
            return next(new AppError('Invalid payment type or missing required fields.', 400));
        }

        await invoice.save();

        res.status(201).json({
            success: true,
            message: 'Invoice created successfully',
            data: invoice
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
});

/**
 * @description Edit an Invoice
 * @route `/api/invoice/softeditinvoice/:id`
 * @access Private
 * @type PUT
 */
exports.editInvoice = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    // Find and update the invoice
    const invoice = await Invoice.findByIdAndUpdate(id, updates, { new: true });
    if (!invoice) {
        return next(new AppError('Invoice not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Invoice updated successfully',
        data: invoice
    });
});

/**
 * @description Get all Invoices
 * @route `/api/invoice/getinvoices`
 * @access Private
 * @type GET
 */
exports.getAll = catchAsync(async (req, res, next) => {
    const invoices = await Invoice.find()
        .populate('creator', 'name email')
        .populate('owner', 'name email')
        .populate('property', 'title price');

    res.status(200).json({
        success: true,
        len: invoices.length,
        data: invoices
    });
});

/**
 * @description Get a Single Invoice
 * @route `/api/invoice/getinvoice/:id`
 * @access Private
 * @type GET
 */
exports.getInvoice = catchAsync(async (req, res, next) => {
    const invoice = await Invoice.findById(req.params.id)
        .populate('creator', 'name email')
        .populate('owner', 'name email')
        .populate('property', 'title price');

    if (!invoice) {
        return next(new AppError('Invoice not found', 404));
    }

    res.status(200).json({
        success: true,
        data: invoice
    });
});

/**
 * @description Delete an Invoice
 * @route `/api/invoice/deleteinvoice/:id`
 * @access Private
 * @type DELETE
 */
exports.deleteInvoice = catchAsync(async (req, res, next) => {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
        return next(new AppError('No invoice found with that ID', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Invoice deleted successfully',
        data: null
    });
});
