const { sendJWTWithCookie } = require('../auth');
const Email = require('../utils/email');
const crypto = require('crypto');
const ErrorResponse = require('../error/response');
const userModel = require('../models/users.model');

const signup = async (req, res, next) => {
  const newUser = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmed: req.body.passwordConfirmed,
  });
  const url = 'http://localhost:8080/account/me';
  await new Email(newUser, url).sendWelcome();
  sendJWTWithCookie(newUser._id, 201, res);
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  //1. Check Email Password not emppty
  if (!email || !password) {
    return next(new ErrorResponse('Email and Password must be provided', 400));
  }
  //2. Check Email exists
  const user = await userModel.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Email not exists', 400));
  }
  //3. Check Password Correct
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Wrong password', 400));
  }
  //4  Signing JWT
  sendJWTWithCookie(user._id, 200, res);
};
const signout = async (req, res, next) => {
  const options = { expires: new Date(Date.now() + 1000), httpOnly: true };
  return res.status(200).cookie('jwt', 'singout', options).json({
    status: 'success',
  });
};
const forgotPassword = async (req, res, next) => {
  //1.Check User exists?
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse('Email not exists', 400));
  }
  //2.Generate  resetPasswordToken
  const token = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/reset-password/${token}`;
    //3. Sent token to User By email
    await new Email(user, resetURL).sendResetPassword();
    return res.status(200).json({
      status: 'success',
      message: 'Reset token is sent to your email',
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    next(new ErrorResponse('Something went wrong', 500));
  }
};
const resetPassword = async (req, res, next) => {
  //1 Get user based on token
  //Check Token Expires, User Exists
  const encodedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const currentTime = new Date();
  const user = await userModel.findOne({
    resetPasswordToken: encodedToken,
    resetPasswordTokenExpires: { $gt: currentTime },
  });
  if (!user) {
    return next(new ErrorResponse('Invalid Token'), 400);
  }
  //3 Update password
  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });
  //5 send JWT, make user logged
  sendJWTWithCookie(user._id, 200, res);
};
const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;
  const user = await userModel.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Wrong old password', 400));
  }
  user.password = newPassword;
  user.passwordConfirmed = newPasswordConfirm;
  await user.save();
  sendJWTWithCookie(user._id, 200, res);
};

module.exports = {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  updatePassword,
};
