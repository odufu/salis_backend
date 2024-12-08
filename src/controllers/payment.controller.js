const Payment = require('../models/payment.model');
const Property = require('../models/property.model');
const Campaign = require('../models/campaign.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { initializePayment, verifyPayment, createSubscription } = require('./paystack.controller');
const Case = require('../models/cases.model')
const mongoose = require('mongoose');
const { startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');

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
        message: 'Hello from payment',
        data: req.body || {}
    });
});


/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Get all payment Controller
 * @route `/api/payment/getpayments`
 * @access Private
 * @type GET
 */
exports.getAll = catchAsync(async (req, res, next) => {
    try {
        // Get all payments
        const payments = await Payment.find().populate('user')

        // Check if the users exists
        if (!payments) {
            return next(new AppError("payments not found", 404));
        }

        // Return payments of list of all payments
        res.status(200).json({
            success: true,
            len: payments.length,
            payments
        })
    } catch (error) {
        return next(new AppError("An error occured, please try again", 500));
    }
})


/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Query payment based on time controller
 * @route `/api/payment/postpayment/payments`
 * @access Private
 * @type GET
 */
exports.getBasedOnTime = catchAsync(async (req, res, next) => {
    try {
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

        // Create the query object with the date range
        const query = startDate && endDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {};

        // Get the payments that match the query
        const payments = await Payment.find(query).populate('user');

        // Check if any payments match the query
        if (!payments || payments.length === 0) {
            const errorMessage = startDate && endDate
                ? `No payments found within the ${interval} interval`
                : 'Payments not found';
            return next(new AppError(errorMessage, 404));
        }

        // Return the list of payments
        res.status(200).json({
            success: true,
            len: payments.length,
            payments,
        });
    } catch (error) {
        return next(new AppError("An error occured, please try again", 500));
    }
});

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Make a payment Controller
 * @route `/api/payment/postpayment/:campaignId`
 * @access Private
 * @type POST
 */
exports.makePayment = catchAsync(async (req, res, next) => {
    const { propertyId, userId, content, email, amount, ownershipPoolId, installmentId, paymentType, paymentNote, } = req.body;

    //GET THE PROPERTY
    const property = await Property.findById(propertyId); // Retrieve user ID from req.user
    const user = req.user

    if (!property) {
        return next(new AppError('Property not found', 404));
    }

    // CHECK THE TYPE OF PAYMENT
    if (property.payment.paymentPlanType == "outright") {

        try {
            //FOR OUTRIGHT (Make full payent)

            //decline payment for property that is fully paid for or taken
            if (property.isTaken) {
                return res.status(404).json({
                    status: false,
                    message: 'This Property is off the market',
                });
            }

            //Create new instance of the payment
            const payment = new Payment({
                user: req.user.id,
                property: property,
                amount: property.price,
                paymentType: "outright",
                paymentNote: paymentNote
            });

            //If some important fields are missing
            if (!payment) {
                return next(new AppError("Provide Required Parameters", 500));
            }
            await payment.save();
            //add the payment instance to the property
            property.paymentsMade.push(payment.id)
            //make propery to be off the market
            property.isTaken=true

            //Save the new instance of the property
            await property.save()

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    } else if (property.payment.paymentPlanType == "installment") {
        //FOR INSTALLMENT (Purchase installment slot)

        //get the installment plan
        // get the installment slot id
        //add the Id to the Installment of the payment
        
        try {
            //decline payment for property that is fully paid for or taken
            if (property.isTaken) {
                return res.status(404).json({
                    status: false,
                    message: 'This Property is off the market',
                });
            }

            //Create new instance of the payment
            const payment = new Payment({
                user: req.user.id,
                property: property,
                amount: property.installmentPlan,
                paymentType: "installment",
                paymentNote: paymentNote,
                
            });

            //If some important fields are missing
            if (!payment) {
                return next(new AppError("Provide Required Parameters", 500));
            }
            await payment.save();
            //add the payment instance to the property
            property.paymentsMade.push(payment.id)
            //make propery to be off the market
            property.isTaken=true

            //Save the new instance of the property
            await property.save()

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        

    } else {
        //FOR OUTRIGHT (purchase co-ownership slot)

    }





    const { campaignId } = req.params;
    const { amount, email } = req.body;

    try {
        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        if (campaign.status === 'Closed') {
            return res.status(404).json({
                status: false,
                message: 'Cannot make a payment to a closed campaign',
            });
        }

        const payment = new Payment({ campaign: campaignId, amount });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        await payment.save();

        const reference = payment._id;
        const authorizationUrl = await initializePayment(amount, email, reference);

        const responseData = {
            payment,
            authorizationUrl,
            amountRaised: campaign.amountGotten,
            amountRemaining: campaign.raise - campaign.amountGotten,
            reference: reference, // Include the reference in the response
        };

        res.status(200).json({
            success: true,
            data: responseData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while making the payment',
        });
    }
});


/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Veirfy payment to a campaign Controller
 * @route `/api/payment/verify`
 * @access Private
 * @type POST
 */
exports.verifyVis = catchAsync(async (req, res, next) => {
    const { reference } = req.body;

    try {
        const paymentData = await verifyPayment(reference);

        // Check if the payment is successful
        if (paymentData.status !== 'success') {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }

        // Update campaign amountGotten
        // Update the isVerified field of the payment to true
        const payment = await Payment.findByIdAndUpdate(reference, { isVerified: true });

        if (!payment) {
            console.log('Payment not found with reference:', reference);
            return res.status(404).json({ error: 'Payment not found' });
        }

        const amount = payment.amount;
        const campaignId = payment.campaign;
        const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { $inc: { amountGotten: amount } },
            { new: true }
        );

        if (!campaign) {
            console.log('Campaign not found with ID:', campaignId);
            return res.status(404).json({ error: 'Campaign not found' });
        }
        console.log('Updated campaign:', campaign);
        // Return a success response if everything is completed
        return res.status(200).json({
            success: true,
            message: 'Payment verification successful',
            paymentData,
        });
    } catch (error) {
        console.error('Error during payment verification:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while verifying the payment',
        });
    }
});


/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Make a payment Controller
 * @route `/api/payment/postpayment/:campaignId`
 * @access Private
 * @type POST
 */
exports.makePayment = catchAsync(async (req, res, next) => {
    const { campaignId } = req.params;
    const { userId, amount, email } = req.body;

    try {
        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        if (campaign.status === 'Closed') {
            return res.status(404).json({
                status: false,
                message: 'Cannot make a payment to a closed campaign',
            });
        }

        const payment = new Payment({ user: userId, campaign: campaignId, amount });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        await payment.save();

        const reference = payment._id;
        const authorizationUrl = await initializePayment(amount, email, reference);

        const responseData = {
            payment,
            authorizationUrl,
            amountRaised: campaign.amountGotten,
            amountRemaining: campaign.raise - campaign.amountGotten,
            reference: reference, // Include the reference in the response
        };

        res.status(200).json({
            success: true,
            data: responseData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while making the payment',
        });
    }
});

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Veirfy payment to a campaign Controller
 * @route `/api/payment/verify`
 * @access Private
 * @type POST
 */
exports.verify = catchAsync(async (req, res, next) => {
    const { reference } = req.body;

    try {
        const paymentData = await verifyPayment(reference);

        // Check if the payment is successful
        if (paymentData.status !== 'success') {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }

        // Update campaign amountGotten
        // Update the isVerified field of the payment to true
        const payment = await Payment.findByIdAndUpdate(reference, { isVerified: true });

        if (!payment) {
            console.log('Payment not found with reference:', reference);
            return res.status(404).json({ error: 'Payment not found' });
        }

        const amount = payment.amount;
        const campaignId = payment.campaign;
        const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { $inc: { amountGotten: amount } },
            { new: true }
        );

        if (!campaign) {
            console.log('Campaign not found with ID:', campaignId);
            return res.status(404).json({ error: 'Campaign not found' });
        }

        console.log('Updated campaign:', campaign);

        // Return a success response if everything is completed
        return res.status(200).json({
            success: true,
            message: 'Payment verification successful',
            paymentData,
        });
    } catch (error) {
        console.error('Error during payment verification:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while verifying the payment',
        });
    }
});


/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Make a payment for a Case Controller
 * @route `/api/payment/postpaymentcase/:caseId`
 * @access Private
 * @type POST
 */
exports.makePaymentCase = catchAsync(async (req, res, next) => {
    try {
        const { caseId } = req.params;
        const { userId, amount, email } = req.body;

        try {
            const cas = await Case.findById(caseId);

            if (!cas) {
                return res.status(404).json({ error: 'Case not found' });
            }

            const payment = new Payment({ user: userId, case: caseId, amount });

            if (!payment) {
                return res.status(404).json({ error: 'Payment not found' });
            }

            await payment.save();

            const reference = payment._id;
            const authorizationUrl = await initializePayment(amount, email, reference);


            res.status(200).json({
                success: true,
                data: {
                    payment,
                    authorizationUrl,
                    amountDonated: cas.amountDonated,
                    reference: reference,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while making the payment',
            });
        }
    } catch (error) {
        return next(new AppError("An error occured, please try again", 500));
    }
});




exports.verifyCase = catchAsync(async (req, res, next) => {
    const { reference } = req.body;

    try {
        const paymentData = await verifyPayment(reference);

        // Check if the payment is successful
        if (paymentData.status !== 'success') {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }

        // Update campaign amountGotten or case amountDonated based on payment type
        const payment = await Payment.findByIdAndUpdate(reference, { isVerified: true });
        if (!payment) {
            console.log('Payment not found with reference:', reference);
            return res.status(404).json({ error: 'Payment not found' });
        }

        const amount = payment.amount;
        const caseId = payment.case;
        const cas = await Case.findByIdAndUpdate(
            caseId,
            { $inc: { amountDonated: amount } },
            { new: true }
        );

        if (!cas) {
            console.log('Case not found with ID:', caseId);
            return res.status(404).json({ error: 'Case not found' });
        }

        console.log('Updated case:', cas);

        // Return a success response if everything is completed
        return res.status(200).json({
            success: true,
            message: 'Payment verification successful',
            paymentData,
        });
    } catch (error) {
        console.error('Error during payment verification:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while verifying the payment',
        });
    }
});


/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Make a recurring Controller
 * @route `/api/payment/postpayment`
 * @access Private
 * @type POST
 */
exports.makeRecurringPayment = catchAsync(async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const { userId, amount, email, subscriptionPlan } = req.body;

        try {
            const campaign = await Campaign.findById(campaignId);

            if (!campaign) {
                return res.status(404).json({ error: 'Campaign not found' });
            }

            campaign.amountDonated += amount;
            campaign.amountGotten = campaign.amountDonated; // Update the amountGotten to match the amountDonated
            await campaign.save();

            const payment = new Payment({ user: userId, campaign: campaignId, amount, subscriptionPlan });

            if (!payment) {
                return res.status(404).json({ error: 'Payment not found' });
            }

            await payment.save();

            const reference = payment._id;
            const authorizationUrl = await initializePayment(amount, email, reference);

            // Create recurring payment subscription
            const subscription = await createSubscription(amount, email, reference, subscriptionPlan);

            // Save the subscription details to the payment or user
            payment.subscriptionId = subscription.id;
            await payment.save();

            res.status(200).json({
                success: true,
                data: {
                    payment,
                    authorizationUrl,
                    amountRaised: campaign.amountGotten,
                    amountRemaining: campaign.raise - campaign.amountGotten,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while making the payment',
                error: error.message, // Add this line to include the error message in the response
            })
        }
    } catch (error) {
        return next(new AppError("An error occured, please try again", 500));
    }
});



/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Get Payment Controller
 * @route `/api/payment/getpayment/:id`
 * @access Private
 * @type GET
 */
exports.getPayment = catchAsync(async (req, res, next) => {
    try {
        // Get the payment by id
        const data = await Payment.findById(req.params.id).populate("user")

        // Check if the payment exists
        if (!data) {
            return next(new AppError('Payment not found', 404));
        }

        // Return data after the Payment
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
 * @description Get the total amount donated by a particular user
 * @route `/api/payment/total/:userId`
 * @access Private
 * @type GET
 */
exports.getTotalPaymentsByUser = catchAsync(async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return next(new AppError('User not found', 404));
        }

        // Calculate the total amount of verified payments made by the user
        const totalAmountDonated = await Payment.aggregate([
            {
                $match: { user: new mongoose.Types.ObjectId(userId), isVerified: true } // Add the isVerified: true condition
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
        ]);

        const totalPayments = totalAmountDonated.length > 0 ? totalAmountDonated[0].totalAmount : 0;

        res.status(200).json({
            success: true,
            totalPayments,
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return next(new AppError('An error occurred, please try again', 500));
    }
});


/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Get the total amount donated by a particular user to a case
 * @route `/api/users/:userId/cases/:caseId/payments/total`
 * @access Private
 * @type GET
 */
exports.getTotalPaymentsByUserAndCase = catchAsync(async (req, res, next) => {
    try {
        const { userId, caseId } = req.params;

        if (!userId || !caseId) {
            return next(new AppError('User or Case not found', 404));
        }

        // Calculate the total amount donated by the user to the case
        const totalAmountDonated = await Payment.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    case: new mongoose.Types.ObjectId(caseId)
                }
            },
            { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
        ]);

        const totalPayments = totalAmountDonated.length > 0 ? totalAmountDonated[0].totalAmount : 0;

        res.status(200).json({
            success: true,
            totalPayments
        });
    } catch (error) {
        return next(new AppError("An error occured, please try again", 500));
    }
});


/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description // Get total payments by a user for a campagin
 * @route `/api/users/:userId/campaign/:campaignId/payments/total
 * @access Private
 * @type GET
 */
exports.getTotalPaymentsByUserAndCampagin = catchAsync(async (req, res, next) => {
    try {
        const { userId, campaignId } = req.params;

        if (!userId || !campaignId) {
            return next(new AppError('User or Case not found', 404));
        }

        // Calculate the total amount donated by the user to the case
        const totalAmountDonated = await Payment.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    campaign: new mongoose.Types.ObjectId(campaignId)
                }
            },
            { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
        ]);

        const totalPayments = totalAmountDonated.length > 0 ? totalAmountDonated[0].totalAmount : 0;

        res.status(200).json({
            success: true,
            totalPayments
        });
    } catch (error) {
        return next(new AppError("An error occured, please try again", 500));
    }
});

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description // Get the last payment and its amount by a particular donor
 * @route `/api/payment/last/:userId`
 * @access Private
 * @type GET
 */
exports.getLastPaymentByUser = catchAsync(async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return next(new AppError('User not found', 404));
        }


        // Get the last payment by the user
        const lastPayment = await Payment.findOne({ user: userId })
            .sort({ createdAt: -1 })
            .select('amount');

        if (!lastPayment) {
            return res.status(200).json({
                success: true,
                message: 'No payments found for the user',
            });
        }

        res.status(200).json({
            success: true,
            lastPayment,
        });
    } catch (error) {
        return next(new AppError("An error occured, please try again", 500));
    }
});

/**
 * @author Joel Odufu <joel.odufu@ust.edu.ng>
 * @description Delete a Payment Controller
 * @route `/api/payment/deletepayment/:id`
 * @access Private
 * @type DELETE
 */
exports.deletePayment = catchAsync(async (req, res, next) => {
    try {
        //Get the user id
        const payment = await Payment.findByIdAndDelete(req.params.id)

        // Check if the user exists
        if (!payment) {
            return next(new AppError('No Payment found with that Id', 404));
        }

        // Return data after the payment has been deleted
        res.status(200).json({
            success: true,
            message: "Payment deleted successfully",
            data: {
                payment: null
            }
        })
    } catch (error) {
        return next(new AppError("An error occured, please try again", 500));
    }
})
