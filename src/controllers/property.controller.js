
const Property = require('../models/property.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Comment = require("../models/comment.model");
const Rating = require("../models/rating.model");
const Request = require('../models/request.model')
const InstallmentPlan = require('../models/installment/installmentPlan.model')
const CoOwnershipPlan = require('../models/payments/coOwnershipPlan.model')
const OwnershipPool = require('../models/payments/ownershipPool.model')
const sendEmail = require('../utils/sendEmail');


/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Ping the Route `test`
 * @route `@any`
 * @access Public
 * @type POST
 */
exports.ping = catchAsync(async (req, res, next) => {
    res.status(200).json({
        success: true,
        status: 'success',
        message: 'Hello from Property',
        data: req.body || {}
    });
});

//   /**
//  * @author Odufu Joel <joel.odufu@gmail.com>
//  * @description Get all request
//  * @route `/api/property/allrequest`
//  * @access Private
//  * @type GET
//  */
// exports.getAllReuqest = catchAsync(async (req, res, next) => {
//     try {
//       // Find all request records
//       const request = await Request.find()

//       res.status(200).json({
//         success: true,
//         length: request.length,
//         data: request,
//       });
//     } catch (error) {
//       next(new AppError('An error occurred. Please try again.', 500));
//     }
// });

// /**
//  * @author Odufu Joel <joel.odufu@gmail.com>
//  * @description update withdrawal request
//  * @route `/api/property/approve/:requestId`
//  * @access Private
//  * @type PATCH
//  */
// exports.updateWithdrawalRequestStatus = catchAsync(async (req, res, next) => {
//   try {
//     const requestId = req.params.requestId;
//     const { status } = req.body;

//     // Find the request by its ID
//     const request = await Request.findById(requestId);

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: 'Request not found',
//       });
//     }

//     // Update the request status based on the provided status
//     if (status === 'approved' || status === 'rejected') {
//       request.status = status;
//       await request.save();

//       res.status(200).json({
//         success: true,
//         message: `Request ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
//         data: request,
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status provided',
//       });
//     }
//   } catch (error) {
//     console.error('Error in updateWithdrawalRequestStatus:', error);
//     next(new AppError('An error occurred. Please try again.', 500));
//   }
// });

// /**
//  * @author Odufu Joel <joel.odufu@gmail.com>
//  * @description make a request for withdrawal
//  * @route `/api/property/request`
//  * @access Public
//  * @type GET
//  */
// exports.createWithdrawalRequest = catchAsync(async (req, res, next) => {
//   try {
//     const userId = req.user._id;
//     const propertyId = req.params.propertyId; 
//     const { amount, bankName, accountName, accountNumber} = req.body;

//     // Check if the property exists
//     const property = await Property.findById(propertyId);
//     if (!property) {
//       return next(new AppError('Property not found.', 404));
//     }

//     // Create a new withdrawal request with default status "pending" and associated property
//     const request = await Request.create({
//       _user: userId,
//       _property: propertyId,
//       amount,
//       bankName,
//       accountName,
//       accountNumber,
//     });

//     const message = `
//       Hi ${req.user.name}, 

//       Your withdrawal request for property "${property.title}" has been received and is pending approval.

//       Amount: ${amount}
//       Bank Name: ${bankName}
//       Account Name: ${accountName}
//       Account Number: ${accountNumber}

//       Thank you for using 'Salis Mobile App' 🚀`;

//     await sendEmail({
//       to: process.env.ADMIN_EMAIL,
//       subject: 'Request for withdrawal 🚀',
//       message,
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Withdrawal request created successfully',
//       data: request,
//     });
//   } catch (error) {
//     next(new AppError('An error occurred. Please try again.', 500));
//   }
// });

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Get all Property Controller
 * @route `/api/property/getpropertys`
 * @access Private
 * @type GET
 */
exports.getAll = catchAsync(async (req, res, next) => {
    try {
        const data = await Property.find()

        // Check if the Property exists
        if (!data) {
            return next(new AppError("Property not found", 404));
        }

        // Return data of list of all Property
        res.status(200).json({
            success: true,
            len: data.length,
            data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Get a property Controller
 * @route `/api/property/getproperty/:id`
 * @access Private
 * @type GET
 */
exports.getProperty = catchAsync(async (req, res, next) => {
    try {
        // Get the property by id
        const data = await Property.findById(req.params.id)

        // Check if the property exists
        if (!data) {
            res.status(404).json({
                success: true,
                message: "no propert found",
            });
            return next(new AppError('property not found', 404));
        }

        // Return data after the property
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
        next(new AppError("An error occurred. Please try again"))
    }
});


/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Post a Get all comments Controller
 * @route `/api/property/getallcomments`
 * @access Private
 * @type GET
 */


exports.GetComments = catchAsync(async (req, res, next) => {
    try {
        
        //get the property
        //get the comments in it's comments 
        //getCommentById for each of them
        // Return list of comments

        const data = await Comment.find()
        console.log("Datat" + data);

        // Check if the Comments exists
        if (!data) {
            res.status(404).json({
                success: true,
                message: "No Comment Found",
            });
            return next(new AppError("Comment not found", 404));
        }

        // Return data of list of all Property
        res.status(200).json({
            success: true,
            len: data.length,
            data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description  Get Property Comments Controller by property id
 * @route `/api/property/getallPropertyComments/:id`
 * @access Private
 * @type GET
 */


exports.GetPropertyComments = catchAsync(async (req, res, next) => {
    try {
        let comments = []

        //get the property
        const property = await Property.findById(req.params.id)

        if (!property) {
            return next(new AppError('Property not found', 404));
        }
        //get the comments in it's comments 
        property.comments.forEach(async commentId => {
          let comment =  await Comment.findById(commentId)
          comments.push(comment)
        });
        //getCommentById for each of them
        // Return list of comments


        const data = await Comment.find()
        console.log("Datat" + data);

        // Check if the Comments exists
        if (!data) {
            res.status(404).json({
                success: true,
                message: "No Comment Found",
            });
            return next(new AppError("Comment not found", 404));
        }

        // Return data of list of property comments
        res.status(200).json({
            success: true,
            len: data.length,
            data:comments
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Get a comment Controller
 * @route `/api/property/getcomment`
 * @access Private
 * @type GET
 */


exports.GetCommentById = catchAsync(async (commentId) => {
    try {

        const data = await Comment.findById(commentId);
        console.log("Datat" + data);

        // Check if the property exists
        if (!data) {
            return next(new AppError('Comment not found', 404));
        }

        // Return data after the property
       return data
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
});


/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Get all rattings Controller
 * @route `/api/property/getallrattings`
 * @access Private
 * @type GET
 */


exports.GetRatings = catchAsync(async (req, res, next) => {
    try {
        const data = await Rating.find().populate('user')
        // Check if the Property exists
        if (!data) {
            res.status(404).json({
                success: true,
                message: "No Rating Found",
            });
            return next(new AppError("Rating not found", 404));
        }

        // Return data of list of all Ratings
        res.status(200).json({
            success: true,
            len: data.length,
            data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Post a Property Controller
 * @route `/api/property/postproperty`
 * @access Private
 * @type POST
 */
exports.postProperty = catchAsync(async (req, res, next) => {
    const {
        //Basic Details
        title,
        details,
        location, //uses google map location to set it
        address,
        cartegory,

        //media
        images,
        video, //suplied to any blob from front end, then link suplied


        // Features
        eletricity,
        security,
        water,
        bedrooms,
        bathrooms,
        price,

        //PAYMENT PLANS
        paymentPlanType,
        outrightPlan,
        installmentPlan,
        coOwnershipPlan,


        //Amenities
        packingSpace,
        garden,
        pool,

        // official documents
        registeredSurvey,
        governmentAproved,
        documents,

        //PROPERTY DOCUMENT
        siteMap,
        housePlan,
    } = req.body;

    const user = await User.findById(req.user.id); // Retrieve user ID from req.user

    // Create a new property Object
    const property = new Property({
        //Basic Details
        title,
        details,
        location, //uses google map location to set it
        address,
        cartegory,
        price,


        //PAYMENT PLANS
        paymentPlanType,
        //media
        images,
        video, //suplied to any blob from front end, then link suplied


        // Features
        eletricity,
        security,
        water,
        bedrooms,
        bathrooms,

        //Amenities
        packingSpace,
        garden,
        pool,

        // official documents
        registeredSurvey,
        governmentAproved,
        documents,

        siteMap,
        housePlan,
        documents,
        status: user.userType === 'Individual' || user.userType === 'Admin' ? 'Pending' : 'Approved',
    });

    if (!property) {
        return next(new AppError('Please provide the required fields', 401));
    }

    // IF OUTRIGHT IS NOT NULL, CREATE OUTRIGHT PAYMENT 

    try {
        //Add the creator's refference to the property
        property.creator = user;

        //CREATE AND APPEND PAYMENT PLAN BASE ON THE ONE SUPPLIED FROM THE FRONT

        if (property.paymentPlanType == "outright") {
            property.outrightPlan = property.price;
        } else if (property.paymentPlanType == "installment") {
            //GET THE INPUTS FROM THE USER FOR INSTALLMENT PAYMENT plan
            const { minimumInitialPayment, closingPeriod } = req.body
            //create an instance of the plan
            const installmentPlan = new InstallmentPlan({
                property, minimumInitialPayment, closingPeriod,
            })
            //save that instance 
            await installmentPlan.save()

            //add the saved instance to the property
            property.installmentPlan = installmentPlan._id;
            await property.save()
        } else {

            //GET THE INPUTS FROM THE USER FOR INSTALLMENT PAYMENT plan
            const { maximumPool } = req.body
            //create an instance of the plan
            const newCoOwnershipPlan = new CoOwnershipPlan({
                property, totalValue: property.price, maximumPool,
            })
            //save that instance 
            await newCoOwnershipPlan.save()

            //create all the pools
            for (let index = 0; index < newCoOwnershipPlan.maximumPool; index++) {
                //create instance of the pool
                const newPool = new OwnershipPool({
                    sharePrice: (property.price / newCoOwnershipPlan.maximumPool),
                    equityShare: ((property.price / newCoOwnershipPlan.maximumPool) * 100 / property.price)
                })
                //save the pool
                await newPool.save()
                //add the pool to the plan
                newCoOwnershipPlan.ownershipShares.push(newPool.id);
                //save the plan
                await newCoOwnershipPlan.save()
            }

            //append the plan to the property
            property.coOwnershipPlan = newCoOwnershipPlan.id;

            //save the property
            await property.save()
        }

        // Save the property object to the database
        await property.save();

        res.status(200).json({
            success: true,
            message: 'Property created successfully',
            data: property,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

});

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Post a Comment Controller
 * @route `/api/property/postcomment`
 * @access Private
 * @type POST
 */
exports.createComment = catchAsync(async (req, res, next) => {
    const { propertyId, userId, content } = req.body;

    try {
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found',
            });
        }

        const comment = new Comment({
            property: propertyId,
            user: userId,
            content,
        });

        await comment.save();

        property.comments.push(comment._id);

        await property.save();

        res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            data: comment,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Post a draft Controller
 * @route `/api/property/postdraft/:id`
 * @access Private
 * @type GET
 */
exports.postSavedDraftProperty = catchAsync(async (req, res, next) => {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);

    if (!property) {
        return next(new AppError('Property not found', 404));
    }

    if (property.status !== 'Draft') {
        return next(new AppError('Property is not a draft', 400));
    }

    property.status = 'Pending';
    await property.save();

    res.status(200).json({
        success: true,
        message: 'Property posted successfully',
        data: property,
    });
});



/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description  Query Property based on time controller
 * @route `/api/property/propertys`
 * @access Private
 * @type GET
 */
exports.getBasedOnTime = catchAsync(async (req, res, next) => {
    const { interval } = req.query;

    let startDate, endDate;

    // Calculate the start and end dates based on the interval
    if (interval === 'weekly') {
        startDate = startOfWeek(new Date());
        endDate = endOfWeek(new Date());
    } else if (interval === 'monthly') {
        startDate = startOfMonth(new Date());
        endDate = endOfMonth(new Date());
    }

    try {
        // Create the query object with the date range
        const query = startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {};

        // Get the Property that match the query
        const property = await Property.find(query).populate('user');

        // Check if any Property match the query
        if (!property || property.length === 0) {
            const errorMessage = startDate && endDate
                ? `No Propertys found within the ${interval} interval`
                : 'Propertys not found';
            return next(new AppError(errorMessage, 404));
        }

        // Return the list of Property
        res.status(200).json({
            success: true,
            len: property.length,
            property,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/**
 * @author Odufu Joel <joel.odufu@gmail.com>
 * @description Delete a property Controller
 * @route `/api/property/deleteproperty/:id`
 * @access Private
 * @type DELETE
 */
exports.deleteProperty = catchAsync(async (req, res, next) => {
    try {
        //Get the user id
        const property = await Property.findByIdAndDelete(req.params.id)

        // Check if the Property exists
        if (!property) {
            return next(new AppError('No Property found with that Id', 404));
        }

        // Return data after the property has been deleted
        res.status(200).json({
            success: true,
            message: "Property deleted successfully",
            data: {
                property: null
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        })
    }
})
