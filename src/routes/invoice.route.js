const express = require('express');
const authController = require('../controllers/auth.controller');
const invoiceController = require('../controllers/invoice.controller')

const router = express()

// Protect all routes after this middleware
router.use(authController.protect);

router.get("/", invoiceController.ping)
router.get("/getinvoices", invoiceController.getAll)

router.get("/getinvoice/:id", invoiceController.getInvoice)

// Protect all routes after this middleware
// router.use(authController.restrict('Admin'));

router.get("/", invoiceController.ping)

router.post("/postOutrightInvoice",  invoiceController.postInvoice)
router.post("/postInstallmentInvoice",  invoiceController.postInvoice)
router.post("/postOwnershipSlotInvoice",  invoiceController.postInvoice)

router.put("/editinvoice/:id", invoiceController.editInvoice)

router.delete("/deleteinvoice/:id",invoiceController.deleteInvoice)

module.exports = router;