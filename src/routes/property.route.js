const express = require('express');
const propertyController = require("../controllers/property.controller")
const authController = require('../controllers/auth.controller');

const router = express()

router.get("/getpropertys", propertyController.getAll)

router.get("/getproperty/:id", propertyController.getProperty)

// Protect all routes after this middleware
// router.use(authController.protect);

router.get("/", propertyController.ping)

router.get("/getallcomments", propertyController.GetComments)

router.get("/getPropertyComments/:id", propertyController.GetPropertyComments)

router.post("/postproperty" ,propertyController.postProperty)

router.post("/postcomment" ,propertyController.createComment)

router.get("/propertys", propertyController.getBasedOnTime)

router.delete("/deleteproperty/:id", authController.restrict("Individual") ,propertyController.deleteProperty)

module.exports = router;