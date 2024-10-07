const ErrorResponse = require('../error/response');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeature');

class FactoryHandler {
  constructor(model) {
    this.model = model;
  }
  //CREATE
  create = catchAsync(async (req, res, next) => {
    const doc = await this.model.create(req.body);
    return res.status(201).json({
      status: 'success',
      doc,
    });
  });
  // DELETE Operation
  delete = catchAsync(async (req, res, next) => {
    const doc = await this.model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new ErrorResponse('Not found', 404));
    return res.status(204).json({
      status: 'success',
    });
  });

  // UPDATE Operation
  update = catchAsync(async (req, res, next) => {
    const doc = await this.model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new ErrorResponse('Not found', 404));
    return res.status(200).json({
      status: 'success',
      doc,
    });
  });
  getAll = catchAsync(async (req, res) => {
    //Excute query
    const features = new APIFeatures(this.model.find(), req.query)
      .filter()
      .limitFields()
      .sort()
      .paginate();

    const docs = await features.query;

    // Return Response
    return res.status(200).json({
      status: 'success',
      result: docs.length,
      docs,
    });
  });
  getById = catchAsync(async (req, res, next) => {
    const doc = await this.model.findById(req.params.id).select('-__v');

    if (!doc) return next(new ErrorResponse('Not found', 404));
    return res.status(200).json({
      status: 'success',
      doc,
    });
  });
}
module.exports = FactoryHandler;
