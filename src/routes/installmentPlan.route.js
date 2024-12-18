const express = require('express');
const installmentPlanController = require("../controllers/installmentPlan.controller")
const authController = require('../controllers/auth.controller');

const router = express()


// Protect all routes after this middleware
router.use(authController.protect);

router.get("/", installmentPlanController.ping)
router.get("/getinstallmentPlans", installmentPlanController.getAll)
router.get("/getinstallmentPlan/:id", installmentPlanController.getInstallmentPlan)
router.get("/editInstallmentPlan/:id", installmentPlanController.editInstallmentPlan)
// router.post("/postinstallment" , installmentPlanController.postInstallment)

module.exports = router;
