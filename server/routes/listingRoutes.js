const express = require('express');
const router = express.Router();
const { createListing, getListings, getListingById, updateListing, deleteListing, getMyListings } = require('../controllers/listingController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.post('/', protect, upload.single('photo'), createListing);
router.get('/', protect, getListings);
router.get('/my-listings', protect, getMyListings);
router.get('/:id', protect, getListingById);
router.put('/:id', protect, upload.single('photo'), updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;
