const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, saveListing } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, upload.single('photo'), updateUserProfile);
router.post('/save-listing/:id', protect, saveListing);

module.exports = router;
