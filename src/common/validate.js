import { ApiError } from "./api-response.js";
import { BAD_REQUEST } from "./http-code.js";

export const validate = (query, validateKey, res) => {
  for (const key in query) {
    if (!validateKey[key]) {
      //query키가 validateKey에 없는 경우
      ApiError(BAD_REQUEST, res);
      return false;
    }
  }

  for (const key in validateKey) {
    //validateKey값이 nullable이고 query값이 undefined인 경우
    if (!validateKey[key].nullable && !query[key]) {
      ApiError(BAD_REQUEST, res);
      return false;
    }
  }
  return true;
};
