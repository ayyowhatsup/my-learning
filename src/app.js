import express from "express";
import helmet from "helmet";
import xss from "xss-clean";
import compression from "compression";
import cors from "cors";
import httpStatus from "http-status";
import { responseHandler, errorHandler } from "./middlewares/error";
import router from "./routes";
import ApiError from "./utils/api-error";
import { ERROR_CODES } from "./constants";

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
// app.options('*', cors());

// v1 api routes
app.use("/v1", router);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(
    new ApiError({
      status: httpStatus.NOT_FOUND,
      code: ERROR_CODES.NOT_FOUND,
      message: "Request not found!",
    })
  );
});

// convert error to ApiError, if needed
app.use(responseHandler);

// handle error
app.use(errorHandler);

export default app;
