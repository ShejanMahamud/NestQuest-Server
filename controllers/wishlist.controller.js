const Wishlist = require('../models/wishlist.model');

// Get wishlist by user email
exports.getWishlistByUserEmail = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user_email: req.params.email });
    res.send(wishlist);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Create wishlist
exports.createWishlist = async (req, res) => {
  try {
    const wishlist = new Wishlist(req.body);
    const result = await wishlist.save();
    res.send({ success: true, wishlist: result });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Delete wishlist by id
exports.deleteWishlist = async (req, res) => {
  try {
    const result = await Wishlist.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}; 