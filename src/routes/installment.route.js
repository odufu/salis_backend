const express = require('express');
const installmentController = require("../controllers/installment.controller")
const authController = require('../controllers/auth.controller');

const router = express()


// Protect all routes after this middleware
router.use(authController.protect);

router.get("/", installmentController.ping)
router.get("/getinstallments", installmentController.getAll)
router.get("/getinstallment/:id", installmentController.getInstallment)
router.post("/postinstallment" , installmentController.postInstallment)
router.get("/edit/:id", installmentController.editInstallment)
router.get("/delete/:id", installmentController.deleteInstallment)

module.exports = router;