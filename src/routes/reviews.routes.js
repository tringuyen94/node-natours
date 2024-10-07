const express = require('express');
const reviewController = require('../controllers/reviews.controller');
const { authentication, authorization } = require('../auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authentication,
    authorization('user'),
    reviewController.setTourAndUser,
    reviewController.createReviews
  );

router
  .route('/:id')
  .get(reviewController.getReviewById)
  .patch(authentication, authorization('user'), reviewController.updateReview)
  .delete(
    authentication,
    authorization('user', 'admin'),
    reviewController.deleteReview
  );
module.exports = router;
