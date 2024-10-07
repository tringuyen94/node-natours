const express = require('express');
const authController = require('../controllers/auth.controller');
const { authentication } = require('../auth');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/signout', authController.signout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch('/update-password', authentication, authController.updatePassword);
module.exports = router;
