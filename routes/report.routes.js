const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

router.get('/', reportController.getAllReports);
router.post('/', reportController.createReport);
router.delete('/:id', reportController.deleteReport);

module.exports = router; 