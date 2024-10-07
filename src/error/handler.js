const ErrorResponse = require('./response');

const handleInvalidIDError = (err) => {
  return new ErrorResponse(`Invalid ${err.path} : ${err.value}`, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  return new ErrorResponse(
    `Duplicate field value: ${value}. Please use another value!`,
    400
  );
};
const handleJWTError = () =>
  new ErrorResponse('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new ErrorResponse('Your token has expired! Please log in again.', 401);
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  return new ErrorResponse(`Invalid input data. ${errors.join('. ')}`, 400);
};
const prodError = (err, req, res) => {
  // Trusted Error
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //1. LOG error
    console.error('Error::', err);
    //2. Return General Error
    return res.status(500).json({
      error: err,
      status: 'error',
      message: 'Something wrong',
    });
  } else {
    if (err.isOperational) {
      console.error('Error::', err);
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        message: err.message,
      });
    }
    console.error('Error::', err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      message: 'Try Again Later',
    });
  }
};
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  switch (process.env.NODE_ENV) {
    case 'dev':
      if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
          error: err,
          status: err.status,
          message: err.message,
          stack: err.stack,
        });
      }
      //1. LOG error
      console.error('Error::', err);
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        message: err.message,
      });
    case 'prod':
      let error = { ...err, name: err.name, message: err.message };
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
      if (error.name === 'CastError') error = handleInvalidIDError(error);
      if (error.name === 'ValidationError')
        error = handleValidationErrorDB(error);
      if (error.name === 'JsonWebTokenError') error = handleJWTError();
      if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
      prodError(error, req, res);
    default:
      break;
  }
};

module.exports = errorHandler;
