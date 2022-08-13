import { BAD_REQUEST } from "./http-code.js";

export class HttpException extends Error {
  constructor(code, message, cause) {
    super(message);
    this.code = code;
    this.message = message;
    this.cause = cause;
  }
}

export class BadRequest extends HttpException {
  constructor(message = "잘못된 요청", cause) {
    super(400, message, cause);
  }
}

export const ApiError = (error, res, cause) => {
  res.status(error.code).json({
    response: {
      message: error.message,
      cause,
      status: false,
    },
  });
};

export const FilterError = {
  code: BAD_REQUEST.code,
  message: BAD_REQUEST.message,
  cause: "",
};
