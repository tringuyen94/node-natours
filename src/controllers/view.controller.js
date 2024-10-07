const ErrorResponse = require('../error/response');
const toursModel = require('../models/tours.model');
const bookingModel = require('../models/booking.model');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res, next) => {
  const tours = await toursModel.find();
  return res.status(200).render('overview', {
    title: 'All tour',
    tours,
  });
});
const getAccountMe = catchAsync(async (req, res, next) => {
  return res.status(200).render('account', {
    title: 'Account',
    user: req.user,
  });
});
const getDetail = catchAsync(async (req, res, next) => {
  const tour = await toursModel.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review user rating createdAt',
  });
  if (!tour) return next(new ErrorResponse('Tour Not Found', 404));
  return res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
const loginPage = catchAsync(async (req, res, next) => {
  return res.status(200).render('login', {
    title: 'Login',
  });
});
module.exports = {
  getOverview,
  getDetail,
  loginPage,
  getAccountMe,
};
