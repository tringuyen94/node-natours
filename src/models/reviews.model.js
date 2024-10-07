const mongoose = require('mongoose');
const tourModel = require('./tours.model');

const COLLECTION_NAME = 'reviews';
const DOCUMENT_NAME = 'review';
const reviewSchema = new mongoose.Schema(
  {
    review: { type: String },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'tour', required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// reviewSchema.pre(/^find/, function (next) {
//   this.select('-tour')
//   next();
// });
reviewSchema.index({ tour: 1, user: 1 });

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name email photo' });
  next();
});

reviewSchema.statics.calcAvgRating = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        totalRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await tourModel.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].totalRating,
    });
  }
};

reviewSchema.post('save', async function () {
  this.constructor.calcAvgRating(this.tour);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  await this.model.calcAvgRating(doc.tour);
});
module.exports = mongoose.model(DOCUMENT_NAME, reviewSchema);
