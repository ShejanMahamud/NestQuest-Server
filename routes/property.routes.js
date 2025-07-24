const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');

router.get('/', propertyController.getAllProperties);
router.get('/all', propertyController.getAllPropertiesNoCondition);
router.get('/:id', propertyController.getPropertyById);
router.post('/', propertyController.createProperty);
router.patch('/:id', propertyController.updateProperty);

module.exports = router; 