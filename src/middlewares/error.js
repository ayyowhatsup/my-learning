import httpStatus from "http-status";
import ApiError from "../utils/api-error";
import { ERROR_CODES } from "../constants";
import logger from "../utils/logger"

export const responseHandler = (err, req, res, next) => {
  let error = err;
  if (error instanceof Error) {
    if (!(error instanceof ApiError)) {
      error = new ApiError({
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: err.message,
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return next(error);
  }

  const { status, code, message, data } = error;
  const resp = {
    code: code || "success",
    message: message || "The request has succeeded.",
    data: data || null,
  };
  // TODO: Log response
  logger.info({
    method: req.method,
    url: req.url,
    query: req.query,
    params: req.params,
    body: req.body,
    user: req.user,
    response: resp,
  });
  return res.status(status || httpStatus.OK).send(resp);
};


export const errorHandler = (err, req, res, next) => {
  const resp = {
    code: err.code,
    message: `${err.name}: ${err.message}`,
  };
  // TODO: Log error
  logger.error({
    method: req.method,
    url: req.url,
    query: req.query,
    params: req.params,
    body: req.body,
    user: req.user,
    response: resp,
  });
  res.status(err.status || 500).send(resp);
};
