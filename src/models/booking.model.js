const mongoose = require('mongoose');

const COLLECTION_NAME = 'bookings';
const DOCUMENT_NAME = 'booking';

const bookingSchema = new mongoose.Schema(
  {
    tour: { type: mongoose.Types.ObjectId, ref: 'tour', required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    price: { type: Number, required: true },
    paid: { type: Boolean, default: true },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
  }).populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

module.exports = mongoose.model(DOCUMENT_NAME, bookingSchema);
