import { ApiError } from './api-response.js';
import { BAD_REQUEST } from './http-code.js';

export const validateQuery = (query, validateKey, res) => {
  for (const key in query) {
    if (!validateKey[key]) {
      ApiError(BAD_REQUEST, res);
      return false;
    } else {
      if (!validateKey[key].nullable && !query[key]) {
        ApiError(BAD_REQUEST, res);
        return false;
      }
    }
  }
  return true;
};
