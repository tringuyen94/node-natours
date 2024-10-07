const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tours.controller');
const { authentication, authorization } = require('../auth');
const reviewRouter = require('./reviews.routes');
const upload = require('../utils/uploadFile');
const resize = require('../utils/resize');

//NESTED ROUTE WITH REVIEW ROUTER
router.use('/:tourId/reviews', reviewRouter);

router.get(
  '/top-5-cheap',
  tourController.aliasTop5Cheap,
  tourController.getAllTours
);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authentication,
    authorization('admin', 'lead-guide'),
    tourController.createTour
  );
router.get('/tours-stats', tourController.tourStats);
router.get(
  '/monthly-plan/:year',
  authentication,
  authorization('admin', 'lead-guide', 'guide'),
  tourController.monthlyPlan
);
router.get(
  '/tours-within/:distance/center/:coordinates/unit/:unit',
  tourController.toursWithin
);
router.get('/distance/:coordinates/unit/:unit', tourController.getDistance);
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(
    authentication,
    authorization('admin', 'lead-guide'),
    upload.fields([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),
    resize('tour'),
    tourController.updateTour
  )
  .delete(
    authentication,
    authorization('admin', 'lead-guide'),
    tourController.deleteTour
  );
module.exports = router;
