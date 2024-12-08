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
      message: 'Hello from InstallmentPlan',
      data: req.body || {}
    });
  });

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Get all InstallmentPlan
 * @route `/api/installment/getinstallmentPlans`
 * @access Private
 * @type GET
 */

exports.getAll = catchAsync(async(req, res, next)=>{
  try {
    const data = await InstallmentPlan.find().populate('user')
  
    // Check if the installmentPlan exists
      if(!data){
        return next(new AppError(error, 404));
      }
  
    // Return data of list of all installmentPlans
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
 * @description Get a InstallmentPlan Controller
 * @route `/api/installment/getinstallmentPlan/:id`
 * @access Private
 * @type GET
 */
exports.getInstallmentPlan = catchAsync(async (req, res, next) => {
  try {
    // Get the InstallmentPlan by id
    const data = await InstallmentPlan.findById(req.params.id).populate("user")

    // Check if the InstallmentPlan exists
      if (!data) {
        return next(new AppError('InstallmentPlan not found', 404));
      }

      // Return data after the InstallmentPlan
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
 * @description Post a installmentPlan Controller
 * @route `/api/installment/postinstallmentPlan`
 * @access Private
 * @type POST
 */
exports.postInstallmentPlan = catchAsync(async(req, res, next)=>{
  try {
    const {propertyId, totalCost, closingPeriod, minimumInitialPayment} = req.body;

    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);

     // Create a new installmentPlan Object
    const installmentPlan = new InstallmentPlan({
      property:propertyId, 
      user:req.user.id,
      totalCost:property.price,
      minimumInitialPayment,
      closingPeriod,
    })

    if (!installmentPlan) {
        return next(new AppError('Please provide the required fields', 401));
    }

    // Save the installmentPlan object to the database
    await installmentPlan.save()

    user._installmentPlan.push(installmentPlan._id)

    await user.save()

    // const installmentPlanLink = `http://localhost:30000/installmentPlan/${installmentPlan._id}`;

    res.status(200).json({
        success: true,
        message: 'InstallmentPlan created successfully',
        data: installmentPlan
    });
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
})

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Edit installmentPlan Controller
 * @route `/api/installment/editinstallmentPlan/:id`
 * @access Private
 * @type PUT
 */
exports.editInstallmentPlan = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
  
    // Find the user by ID
    const installmentPlan = await InstallmentPlan.findByIdAndUpdate(id, updates, { new: true });
  
    // Check if the installmentPlan exists
    if (!installmentPlan) {
      return next(new AppError('InstallmentPlan not found', 404));
    }
  
    res.status(200).json({
      success: true,
      message: 'InstallmentPlan updated successfully',
      data: installmentPlan,
    });
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
});

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Delete a InstallmentPlan Controller
 * @route `/api/installment/deleteinstallmentPlan/:id`
 * @access Private
 * @type DELETE
 */
exports.deleteInstallmentPlan =  catchAsync(async (req, res, next) =>{
  try {
    //Get the installmentPlan id
    const installmentPlan = await InstallmentPlan.findByIdAndDelete(req.params.id)

    // Check if the installmentPlan exists
    if (!installmentPlan) {
        return next(new AppError('No installmentPlan found with that Id', 404));
      }
  
    // Return data after the installmentPlan has been deleted
    res.status(200).json({
        success: true,
        message: "InstallmentPlan deleted successfully",
        data : {
          installmentPlan: null
        }
    })
  } catch (error) {
    return next(new AppError("An error occured, please try again", 500));
  }
})
  