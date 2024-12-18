const express = require('express');
const authController = require('../controllers/auth.controller');
const contractController = require('../controllers/contract.controller')

const router = express()

// Protect all routes after this middleware
router.use(authController.protect);

router.get("/getcontracts", contractController.getAll)

router.get("/getcontract/:id", contractController.getContract)

// Protect all routes after this middleware
// router.use(authController.restrict('Admin'));

router.get("/", contractController.ping)

router.post("/postcontract",  contractController.postContract)

router.put("/editcontract/:id", contractController.editContract)

router.delete("/deletecontract/:id",contractController.deleteContract)

module.exports = router;