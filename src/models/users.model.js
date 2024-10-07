const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { USER_ROLES } = require('../constants');
const COLLECTION_NAME = 'users';
const DOCUMENT_NAME = 'user';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name must be provided'],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Email must be provided'],
      lowercase: true,
      validate: [validator.isEmail],
    },
    photo: { type: String, default: 'default.jpg' },
    password: {
      type: String,
      required: [true, 'Password must be provided'],
      minlength: [8, 'Password must be longer than 8'],
      select: false,
    },
    passwordConfirmed: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: 'Passwords not match',
      },
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'user',
    },
    passwordUpdatedAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date,
    active: { type: Boolean, default: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirmed = undefined;
  } catch (error) {
    next();
  }
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordUpdatedAt = new Date();
  next();
});

userSchema.methods.generateResetPasswordToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.resetPasswordTokenExpires = new Date(new Date().getTime() + 60000 * 10);
  return token;
};
userSchema.methods.comparePassword = async function (inputPassword) {
  try {
    return await bcrypt.compare(inputPassword, this.password);
  } catch (error) {
    console.log(error);
  }
};
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
