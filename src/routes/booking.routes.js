const express = require('express');
const { authentication, authorization } = require('../auth');
const bookingController = require('../controllers/booking.controller');
const router = express.Router();

router.use(authentication);

//CREATE BOOKING
router.get(
  '/checkout-session/:tourId',
  authorization('user'),
  bookingController.checkOutSession
);

//MODIFY BOOKING
router.use(authorization('admin', 'lead-guide'));
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getOneBooking);
router.delete('/:id', bookingController.deleteBooking);
router.patch('/:id', bookingController.updateBooking);

module.exports = router;
