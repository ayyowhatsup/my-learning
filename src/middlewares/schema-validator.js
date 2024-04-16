import _ from "lodash";
import Joi from "joi";
import httpStatus from "http-status";
import ApiError from "../utils/api-error";
import { ERROR_CODES } from "../constants";

const validateSchema = (schema) => (req, res, next) => {
  const validateOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  const validSchema = _.pick(schema, ["query", "params", "body"]);
  const validateData = _.pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema).validate(
    validateData,
    validateOptions
  );

  if (error) {
    next(
      new ApiError({
        code: ERROR_CODES.BAD_REQUEST,
        message: error.message,
        status: httpStatus.BAD_REQUEST,
      })
    );
  }

  Object.assign(req, value);
  next();
};

export default validateSchema;
