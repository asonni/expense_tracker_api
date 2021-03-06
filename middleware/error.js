/* eslint-disable no-param-reassign */
const ErrorResponse = require('../utils/errorResponse');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ErrorResponse(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ErrorResponse(message, 400);
};
const handleValidationErrorDB = err => {
  const message = Object.values(err.errors).map(el => el.message);
  return new ErrorResponse(message, 400);
};

const sendErrorDev = (err, res) => {
  const msg = Object.values(err.errors)
    .map(el => el.message)
    .join();
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: msg,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    // eslint-disable-next-line no-console
    console.error('ERROR 💥', err);
    // 2) Send generic message
    res.status(500).json({
      success: false,
      message: 'Something went very wrong!'
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Server Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;
