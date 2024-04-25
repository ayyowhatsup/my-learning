class ApiError extends Error {
  constructor({ status, code, message }) {
    super(message || "Unexpected error!");
    this.status = status;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
