export const ApiError = (error, res) => {
  res.status(error.code).json({
    response: {
      message: error.message,
      status: false,
    },
  });
};

export const ApiSuccess = (callback, code) => {};
