const jwt = require('jsonwebtoken');
const ErrorResponse = require('../error/response');
const usersModel = require('../models/users.model');
const { promisify } = require('util');
const { ALLOW_UPDATE_FIELDS } = require('../constants');

const authentication = async (req, res, next) => {
  // Check if token exists
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies) {
      token = req.cookies.jwt;
    }
    // Check user exists
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await usersModel.findById(decoded.userId);
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    return next(new ErrorResponse('Invalid Authentication', 401));
  }
};

//No  Error
const checkLogged = async (req, res, next) => {
  // Check if token exists
  if (req.cookies) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const currentUser = await usersModel.findById(decoded.userId);
      res.locals.user = currentUser;
    } catch (error) {
      return next();
    }
    return next();
  }
  next();
};
const authorization = (...roles) => {
  return (req, res, next) => {
    const { user } = req;
    if (!roles.includes(user.role)) {
      return next(new ErrorResponse('Permission denied', 403));
    }
    next();
  };
};

const sendJWTWithCookie = async (payload, statusCode, res) => {
  const token = jwt.sign({ userId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  const cookieOption = {
    expires: new Date(
      Date.now() + 24 * 60 * 60 * 1000 * process.env.COOKIE_EXPIRES
    ),
    secure: process.env.NODE_ENV === 'prod' ? true : false,
    httpOnly: true,
  };
  // user.password = undefined;
  return res.status(statusCode).cookie('jwt', token, cookieOption).json({
    status: 'success',
    token,
  });
};

const filterUpdate = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (ALLOW_UPDATE_FIELDS.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

module.exports = {
  sendJWTWithCookie,
  authentication,
  authorization,
  filterUpdate,
  checkLogged,
};
