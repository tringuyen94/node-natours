const express = require('express');
const router = express.Router();
const tourRouter = require('./tours.routes');
const authRouter = require('./auth.routes');
const userRouter = require('./users.routes');
const reviewRouter = require('./reviews.routes');
const bookingRouter = require('./booking.routes');

router.use('/users', userRouter);
router.use('/tours', tourRouter);
router.use('/auth', authRouter);
router.use('/reviews', reviewRouter);
router.use('/booking', bookingRouter);

module.exports = router;
