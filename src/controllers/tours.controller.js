const tourModel = require('../models/tours.model');
const FactoryHandler = require('../factory');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../error/response');

const tourStats = async (req, res) => {
  const stats = await tourModel.aggregate([
    {
      $group: {
        _id: '$difficulty',
        totalTour: { $sum: 1 },
        avgRatingQuantity: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgPrice: { $avg: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
    { $addFields: { difficulty: '$_id' } },
    { $project: { _id: 0 } },
  ]);
  return res.status(200).json({ status: 'success', data: stats });
};

const monthlyPlan = async (req, res) => {
  const plan = await tourModel.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${req.params.year}-01-01`),
          $lte: new Date(`${req.params.year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        totalTour: { $sum: 1 },
        tourName: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { month: 1 } },
  ]);
  return res
    .status(200)
    .json({ status: 'success', result: plan.length, data: plan });
};
const aliasTop5Cheap = (req, res, next) => {
  req.query.sort = 'price';
  req.query.limit = '5';
  req.query.fields = 'name,price,duration,difficulty,ratingsAverage';
  return next();
};
//10.842418923235542, 106.81057469822612
const toursWithin = catchAsync(async (req, res, next) => {
  const { distance, coordinates, unit } = req.params;

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const [lat, lng] = coordinates.split(',');
  if (!lat || !lng) {
    return next(new ErrorResponse('Invalid Coordinates', 400));
  }
  const tours = await tourModel.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });
  return res.status(200).json({
    status: 'success',
    result: tours.length,
    data: { tours },
  });
});
const getDistance = catchAsync(async (req, res, next) => {
  const { coordinates, unit } = req.params;
  const [lat, lng] = coordinates.split(',');
  if (!lat || !lng) {
    return next(new ErrorResponse('Invalid Coordinates', 400));
  }
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  const tours = await tourModel.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        name: true,
        distance: true,
      },
    },
  ]);
  return res.status(200).json({
    status: 'success',
    result: tours.length,
    data: { tours },
  });
});
const createTour = new FactoryHandler(tourModel).create;
const deleteTour = new FactoryHandler(tourModel).delete;
const updateTour = new FactoryHandler(tourModel).update;
const getAllTours = new FactoryHandler(tourModel).getAll;
const getTourById = new FactoryHandler(tourModel).getById;

module.exports = {
  getAllTours,
  aliasTop5Cheap,
  deleteTour,
  updateTour,
  tourStats,
  monthlyPlan,
  getTourById,
  createTour,
  toursWithin,
  getDistance,
};
