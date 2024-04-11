import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import ApiError from "../utils/api-error";
import { ERROR_CODES } from "../constants";
import { default as redisClient } from "../db";

const decodeToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
};
export default async function requireAuth(req, res, next) {
  req.user = {};
  let token;
  let payload;
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[0] !== "Bearer" ||
    !(payload = decodeToken((token = req.headers.authorization.split(" ")[1])))
  ) {
    return next(
      new ApiError({
        status: httpStatus.UNAUTHORIZED,
        code: ERROR_CODES.UNAUTHORIZED,
        message: "Authentication required!",
      })
    );
  }
  req.user = {
    id: payload.sub,
    token: req.headers.authorization.split(" ")[1],
  };
  next();
}
