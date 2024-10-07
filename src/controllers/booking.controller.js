const stripe = require('stripe')(process.env.STRIPE_SECRET);
const FactoryHandler = require('../factory');
const bookingModel = require('../models/booking.model');
const toursModel = require('../models/tours.model');
const catchAsync = require('../utils/catchAsync');

const checkOutSession = catchAsync(async (req, res, next) => {
  const tour = await toursModel.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // Payment methods to accept
    customer_email: req.user.email,
    mode: 'payment', // Mode can be 'payment', 'setup', or 'subscription'
    success_url: `http://localhost:8080/overview/?tour=${tour._id}&user=${req.user._id}&price=${tour.price}`, // Redirect URL for success
    cancel_url: `http://localhost:8080/tour/${tour.slug}`,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name}`,
            description: `${tour.summary}`,
            images: [`http://localhost:8080/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100, // $20.00 in cents
        },
        quantity: 1,
      },
    ],
  });
  return res.status(200).json({
    status: 'success',
    session,
  });
});
const getBookingsByUser = catchAsync(async (req, res, next) => {
  const bookings = await bookingModel.find({ user: req.user._id });
  let toursBooked = [];
  for (let b of bookings) {
    let tour = await toursModel.findById(b.tour._id);
    toursBooked.push(tour);
  }
  return res.status(200).render('overview', {
    title: 'My Tour',
    tours: toursBooked,
  });
});
const createBooking = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();
  await bookingModel.create({ tour, user, price });
  return res.redirect(req.originalUrl.split('?')[0]);
});

const getAllBookings = new FactoryHandler(bookingModel).getAll;
const deleteBooking = new FactoryHandler(bookingModel).delete;
const updateBooking = new FactoryHandler(bookingModel).update;
const getOneBooking = new FactoryHandler(bookingModel).getById;

module.exports = {
  checkOutSession,
  createBooking,
  getBookingsByUser,
  getAllBookings,
  deleteBooking,
  updateBooking,
  getOneBooking,
};
