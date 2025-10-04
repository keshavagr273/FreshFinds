const express = require('express');
const router = express.Router();
const { upload, uploadProfileImage, deleteProfileImage } = require('../controllers/uploadController');
const { auth } = require('../middleware/auth');

// Upload profile image
router.post('/profile-image', auth, upload.single('image'), uploadProfileImage);

// Delete profile image
router.delete('/profile-image', auth, deleteProfileImage);

module.exports = router;