const express = require('express');
const router = express.Router();
const advertiseController = require('../controllers/advertise.controller');

router.get('/', advertiseController.getAllAdvertises);
router.post('/', advertiseController.createAdvertise);

module.exports = router; 