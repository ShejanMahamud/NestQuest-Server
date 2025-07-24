const Review = require('../models/review.model');

// Get reviews by property id (with aggregation if needed)
exports.getReviewsByPropertyId = async (req, res) => {
  try {
    const reviews = await Review.find({ property_id: req.params.id });
    res.send(reviews);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Get reviews by user email
exports.getReviewsByUserEmail = async (req, res) => {
  try {
    const reviews = await Review.find({ user_email: req.params.email });
    res.send(reviews);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.send(reviews);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Create review
exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    const result = await review.save();
    res.send({ success: true, review: result });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const result = await Review.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}; 