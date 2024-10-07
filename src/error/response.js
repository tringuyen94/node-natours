class ErrorResponse extends Error {
  constructor(mesasge, statusCode) {
    super(mesasge);
    this.statusCode = statusCode;
    this.status = `${String(statusCode).startsWith(4) ? 'fail' : 'error'}`;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorResponse;
