const express = require('express');
const router = express.Router();
const offeredController = require('../controllers/offered.controller');

router.get('/agent/:email', offeredController.getOfferedByAgentEmail);
router.get('/:id', offeredController.getOfferedById);
router.post('/', offeredController.createOffered);
router.patch('/:id', offeredController.updateOffered);

module.exports = router; 