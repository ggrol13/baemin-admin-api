import { NO_CONTENT, OK } from "./http-code.js";

export const ApiError = (error, res, cause) => {
  res.status(error.code).json({
    response: {
      message: error.message,
      cause,
      status: false,
    },
  });
};

export const ApiSuccess = async (status, data, res) => {
  let success = OK;
  if (!data || data.length === 0) {
    success = NO_CONTENT;
  }

  res.status(success.code).json({
    response: {
      message: success.message,
      status: true,
      success: status.message,
      body: data,
    },
  });
};
