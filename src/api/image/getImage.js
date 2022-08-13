import fs from "fs";
import { BAD_REQUEST } from "../../common/http-code.js";
import { ApiError } from "../../common/api-error.js";

export const getImage = async (req, res) => {
  const split = req.url.split("/");
  const fileRoute = split[2] + "/" + split[3];
  fs.readFile(process.env.IMG_PATH + fileRoute, async function (err, data) {
    if (err) {
      await ApiError(BAD_REQUEST, res, "URL_ERROR");
    }
    res.end(data);
  });
};
