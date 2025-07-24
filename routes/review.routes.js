const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.get('/property/:id', reviewController.getReviewsByPropertyId);
router.get('/user/:email', reviewController.getReviewsByUserEmail);
router.get('/all', reviewController.getAllReviews);
router.post('/', reviewController.createReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router; 