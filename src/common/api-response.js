import { NO_CONTENT, OK } from './http-code.js';

export const ApiError = (error, res) => {
  res.status(error.code).json({
    response: {
      message: error.message,
      status: false,
    },
  });
};

export const ApiSuccess = async (callback, res) => {
  let success = OK;
  const data = await callback();
  if (!data || data.length === 0) {
    success = NO_CONTENT;
  }

  res.status(success.code).json({
    response: {
      message: success.message,
      status: true,
      body: data,
    },
  });
};
