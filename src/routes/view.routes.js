const express = require('express');
const viewController = require('../controllers/view.controller');
const { checkLogged, authentication } = require('../auth');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

router.get('/account/me', authentication, viewController.getAccountMe);
router.get('/bookings', authentication, bookingController.getBookingsByUser);

router.use(checkLogged);

router.get(
  '/overview',
  bookingController.createBooking,
  viewController.getOverview
);
router.get('/login', viewController.loginPage);
router.get('/tour/:slug', viewController.getDetail);
module.exports = router;
