const mongoose = require('mongoose');
const slugify = require('slugify');
const COLLECTION_NAME = 'tours';
const DOCUMENT_NAME = 'tour';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
    },
    slug: { type: String },
    duration: { type: Number, required: true },
    maxGroupSize: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'difficult'],
      required: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.3,
      min: [1, 'Rating must between 1 and 5'],
      max: [5, 'Rating must between 1 and 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: { type: Number, required: true },
    priceDiscount: Number,
    summary: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    imageCover: { type: String, required: true },
    startLocation: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
      description: String,
      address: String,
    },
    locations: [
      {
        type: { type: String, default: 'Point' },
        coordinates: [Number],
        description: String,
        address: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    images: { type: [String] },
    // premium: { type: Boolean },
    startDates: [Date],
  },
  {
    collection: COLLECTION_NAME,
    timesktamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
//VIRTUAL
tourSchema.virtual('durationInWeek').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'guides', select: 'name email photo role' });
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

module.exports = mongoose.model(DOCUMENT_NAME, tourSchema);
