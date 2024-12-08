const Installment = require('../models/installment/installment.model')
const InstallmentPlan = require('../models/installment/installmentPlan.model')
const User = require('../models/user.model');
const Property = require('../models/property.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Ping the Route `test`
 * @route `@any`
 * @access Public
 * @type GET
 */
exports.ping = catchAsync(async (req, res, next) => {
    res.status(200).json({
        success: true,
        status: 'success',
        message: 'Hello from Installment',
        data: req.body || {}
    });
});

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Get all Installment
 * @route `/api/installment/getinstallments`
 * @access Private
 * @type GET
 */

exports.getAll = catchAsync(async (req, res, next) => {
    try {
        const data = await Installment.find().populate('user')

        // Check if the installment exists
        if (!data) {
            return next(new AppError("Installment not found", 404));
        }

        // Return data of list of all installments
        res.status(200).json({
            success: true,
            len: data.length,
            data
        })
    } catch (error) {
        return next(new AppError(error, 500));
    }
})

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Get a Installment Controller
 * @route `/api/installment/getinstallment/:id`
 * @access Private
 * @type GET
 */
exports.getInstallment = catchAsync(async (req, res, next) => {
    try {
        // Get the Installment by id
        const data = await Installment.findById(req.params.id).populate("user")

        // Check if the Installment exists
        if (!data) {
            return next(new AppError('Installment not found', 404));
        }

        // Return data after the Installment
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        return next(new AppError(error, 500));
    }
});


/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Post a installment Controller
 * @route `/api/installment/postinstallment`
 * @access Private
 * @type POST
 */
exports.postInstallment = catchAsync(async (req, res, next) => {
    try {
        const { propertyId, amount, dueDate } = req.body;

        const user =req.user;
        const property = await Property.findById(propertyId);
        
        
        // Create a new installment Object
        const installment = new Installment({
            user: user,
            property,
            installmentPlan: property.installmentPlan,
            amount,
            dueDate
        })

        if (!installment) {
            return next(new AppError('Please provide the required fields', 401));
        }
        
        // Save the installment object to the database
        await installment.save()
        
        //add it to the user's pending payments
        user.installments.push(installment._id)
        await user.save()


        //get the specific installment plan
        const installmentPlan = await InstallmentPlan.findById(property.installmentPlan);
        console.log(installmentPlan);
        
        if (!installmentPlan) {
            return next(new AppError('No Such Installment Plan with the Id', 401));
        }

        //add the install ment to that plan

        installmentPlan.installments.push(installment)

        //save the plan

        await installmentPlan.save()

        //Save the property instance
        // await property.save()

        res.status(200).json({
            success: true,
            message: 'Installment created successfully',
            data: installment
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
})

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Edit installment Controller
 * @route `/api/installment/editinstallment/:id`
 * @access Private
 * @type PUT
 */
exports.editInstallment = catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find the user by ID
        const installment = await Installment.findByIdAndUpdate(id, updates, { new: true });

        // Check if the installment exists
        if (!installment) {
            return next(new AppError('Installment not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Installment updated successfully',
            data: installment,
        });
    } catch (error) {
        return next(new AppError("An error occured, please try again", 500));
    }
});

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Delete a Installment Controller
 * @route `/api/installment/deleteinstallment/:id`
 * @access Private
 * @type DELETE
 */
exports.deleteInstallment = catchAsync(async (req, res, next) => {
    try {
        //Get the installment id
        const installment = await Installment.findByIdAndDelete(req.params.id)

        // Check if the installment exists
        if (!installment) {
            return next(new AppError('No installment found with that Id', 404));
        }

        // Return data after the installment has been deleted
        res.status(200).json({
            success: true,
            message: "Installment deleted successfully",
            data: {
                installment: null
            }
        })
    } catch (error) {
        return next(new AppError("An error occured, please try again", 500));
    }
})
