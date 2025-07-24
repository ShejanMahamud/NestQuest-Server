const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');

router.get('/:email', wishlistController.getWishlistByUserEmail);
router.post('/', wishlistController.createWishlist);
router.delete('/:id', wishlistController.deleteWishlist);

module.exports = router; 