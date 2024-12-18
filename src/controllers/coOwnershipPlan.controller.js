const CoOwnershipPlan = require('../models/coown/coOwnershipPlan.model')
const User = require('../models/user.model');
const Property = require('../models/property.model');
const OwnershipPool = require('../models/coown/ownershipPool.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Ping the Route `test`
 * @route `@any`
 * @access Public
 * @type POST
 */
exports.ping = catchAsync(async (req, res, next) => {
    res.status(200).json({
      success: true,
      status: 'success',
      message: 'Hello from CoOwnershipPlans',
      data: req.body || {}
    });
  });

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Get all CoOwnershipPlans Controller
 * @route `/api/coOwnershipPlan/getcoOwnershipPlans`
 * @access Private
 * @type GET
 */
exports.getAll = catchAsync(async(req, res, next)=>{
  try {
    const data = await CoOwnershipPlan.find().populate("ownershipShares")
  
    // Check if the coOwnershipPlan exists
      if(!data){
        return next(new AppError("CoOwnershipPlan not found", 404));
      }
  
      // Return data of list of all coOwnershipPlans
      res.status(200).json({
          success: true,
          len: data.length,
          data
      })
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
})

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Get a CoOwnershipPlan Controller
 * @route `/api/coOwnershipPlan/getcoOwnershipPlan/:id`
 * @access Private
 * @type GET
 */
exports.getCoOwnershipPlan = catchAsync(async (req, res, next) => {
  try {
    // Get the CoOwnershipPlan by id
    const data = await CoOwnershipPlan.findById(req.params.id).populate("ownershipShares")

    // Check if the CoOwnershipPlan exists
      if (!data) {
        return next(new AppError('CoOwnershipPlan not found', 404));
      }

      // Return data after the CoOwnershipPlan
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
 * @description Delete a CoOwnershipPlan Controller
 * @route `/api/coOwnershipPlan/deletecoOwnershipPlan/:id`
 * @access Private
 * @type DELETE
 */
exports.deleteCoOwnershipPlan =  catchAsync(async (req, res, next) =>{
  try {
    //Get the coOwnershipPlan id
    const cause = await CoOwnershipPlan.findByIdAndDelete(req.params.id)

    // Check if the coOwnershipPlan exists
    if (!cause) {
        return next(new AppError('No coOwnershipPlan found with that Id', 404));
      }
  
    // Return data after the coOwnershipPlan has been deleted
    res.status(200).json({
        success: true,
        message: "CoOwnershipPlan deleted successfully",
        data : {
          cause: null
        }
    })
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
})
  