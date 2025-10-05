const express = require('express');
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { upload } = require('../controllers/uploadController');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/avatar', upload.single('avatar'), userController.uploadAvatar);
router.put('/password', userController.changePassword);
router.delete('/account', userController.deleteAccount);

module.exports = router;