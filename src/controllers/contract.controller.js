const User = require('../models/user.model');
const OwnershipPool = require('../models/coown/ownershipPool.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Contract = require('../models/contract.model');

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
        message: 'Hello from Contracts',
        data: req.body || {}
    });
});





/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Edit Contract Controller
 * @route `/api/case/softeditcontract/:id`
 * @access Private
 * @type PUT
 */
exports.editContract = catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;
    
      // Find the contract by ID
      const contract = await Contract.findByIdAndUpdate(id, updates, { new: true });
    
      // Check if the contract exists
      if (!contract) {
        return next(new AppError('Contract not found', 404));
      }
    
      res.status(200).json({
        success: true,
        message: 'Contract updated successfully',
        data: contract,
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  });



/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Post a Contract Controller
 * @route `/api/contract/postcontract`
 * @access Private
 * @type POST
 */
exports.postContract = catchAsync(async (req, res, next) => {
 try {
    const {
        contractHeader,
        contractTerms,
        contractType
    } = req.body;

    const user = req.user; // Retrieve user ID from req.user

    // Create a new contract Object
    const contract = new Contract({
        contractHeader,
        contractTerms,
        contractType
    });

    if (!contract) {
        return next(new AppError('Please provide the required fields', 401));
    }

    // Save the contract object to the database
    await contract.save();

    

    res.status(200).json({
        success: true,
        message: 'Contract created successfully',
        data: contract,
    });
 } catch (error) {
    AppError(error.message, 500)
 }
});





/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Get all Contract Controller
 * @route `/api/contract/getcontracts`
 * @access Private
 * @type GET
 */
exports.getAll = catchAsync(async (req, res, next) => {
    try {
        const data = await Contract.find().populate("creator")

        // Check if the contract exists
        if (!data) {
            return next(new AppError("Contract not found", 404));
        }

        // Return data of list of all contracts
        res.status(200).json({
            success: true,
            len: data.length,
            data
        })
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
})



/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Get a Contract Controller
 * @route `/api/contract/getcontract/:id`
 * @access Private
 * @type GET
 */
exports.getContract = catchAsync(async (req, res, next) => {
    try {
        // Get the Contract by id
        const data = await Contract.findById(req.params.id).populate("creator")

        // Check if the Contract exists
        if (!data) {
            return next(new AppError('Contract not found', 404));
        }

        // Return data after the Contract
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        return next(new AppError("An error occured, please try again", 500));
    }
});






/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Delete a Contract Controller
 * @route `/api/contract/deletecontract/:id`
 * @access Private
 * @type DELETE
 */

exports.deleteContract = catchAsync(async (req, res, next) => {
    try {
        //Get the contract id
        const cause = await Contract.findByIdAndDelete(req.params.id)

        // Check if the contract exists
        if (!cause) {
            return next(new AppError('No contract found with that Id', 404));
        }

        // Return data after the contract has been deleted
        res.status(200).json({
            success: true,
            message: "Contract deleted successfully",
            data: {
                cause: null
            }
        })
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
})
