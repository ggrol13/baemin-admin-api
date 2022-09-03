import { fileURLToPath } from "url";
import * as path from "path";
import aws from "aws-sdk";
import { ApiError } from "../../common/api-error.js";
import { BAD_REQUEST } from "../../common/http-code.js";

export const getImage = async (req, res) => {
  const split = req.url.split("/");
  const fileRoute = split[2] + "/" + split[3];

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  aws.config.loadFromPath(__dirname + "/../../config/s3.json");

  const s3 = new aws.S3();
  const params = { Bucket: process.env.BUCKET_NAME, Key: fileRoute };
  s3.getObject(params, async function (err, data) {
    if (err) {
      await ApiError(BAD_REQUEST, res, "URL_ERROR");
    }
    res.end(data.Body);
  });
};
