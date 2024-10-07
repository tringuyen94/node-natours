const reviewModel = require('../models/reviews.model');
const FactoryHandler = require('../factory');

const getAllReviews = async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const allReviews = await reviewModel.find(filter);

  return res.status(200).json({
    status: 'success',
    result: allReviews.length,
    data: { allReviews },
  });
};
const setTourAndUser = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
const createReviews = new FactoryHandler(reviewModel).create;
const getReviewById = new FactoryHandler(reviewModel).getById;
const updateReview = new FactoryHandler(reviewModel).update;
const deleteReview = new FactoryHandler(reviewModel).delete;
module.exports = {
  createReviews,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourAndUser,
  getReviewById,
};
