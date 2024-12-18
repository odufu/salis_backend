const express = require('express');
const authController = require('../controllers/auth.controller');
const coOwnershipPlanController = require('../controllers/coOwnershipPlan.controller')

const router = express()

// Protect all routes after this middleware
router.use(authController.protect);

router.get("/", coOwnershipPlanController.ping)
router.get("/getcoOwnershipPlans", coOwnershipPlanController.getAll)
router.get("/getcoOwnershipPlan/:id", coOwnershipPlanController.getCoOwnershipPlan)

// Protect all routes after this middleware
router.use(authController.restrict('Admin'));
router.delete("/deletecoOwnershipPlan/:id",coOwnershipPlanController.deleteCoOwnershipPlan)

module.exports = router;
