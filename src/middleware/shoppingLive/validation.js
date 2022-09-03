import { BadRequest, FilterError } from "../../common/api-error.js";
import { BAD_REQUEST } from "../../common/http-code.js";
import { imageFilterTypes, videoFilterTypes } from "../multer.js";
import {
  putShoppingLiveCategoryValidate,
  putShoppingLiveValidate,
  shoppingLiveCategoryValidate,
  shoppingLiveValidate,
} from "../../api/shopping-live/shopping-live.validate.js";
import {
  findShoppingLiveCategoryById,
  findShoppingLiveCategoryByName,
} from "../../api/shopping-live/repositories/shopping-live-category.repo.js";
import mongoose from "mongoose";
import {
  findShoppingLiveById,
  findShoppingLiveByName,
} from "../../api/shopping-live/repositories/shopping-live.repo.js";

export const shoppingLiveCategoryFilter = async (req, file, cb) => {
  const error = shoppingLiveCategoryValidate.validate(req.body);
  if (error.length > 0) {
    FilterError.cause = error[0].message;
    return cb(FilterError);
  }

  if (await findShoppingLiveCategoryByName(req.body.name)) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }

  if (imageFilterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "Only images are allowed"));
  }
};

export const shoppingLiveFilter = async (req, file, cb) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const error = shoppingLiveValidate.validate(obj);
  if (error.length > 0) {
    FilterError.cause = error[0].message;
    return cb(FilterError);
  }
  const validateCategoryId = mongoose.Types.ObjectId.isValid(
    req.body.shoppingLiveCategoryId
  );
  if (!validateCategoryId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_CATEGORY_ID"));
  }
  const shoppingLiveCategoryId = mongoose.Types.ObjectId(
    req.body.shoppingLiveCategoryId
  );

  const findCategoryId = await findShoppingLiveCategoryById(
    shoppingLiveCategoryId
  );
  if (!findCategoryId) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_CATEGORY_ID"));
  }
  if (await findShoppingLiveByName(req.body.name)) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }

  if (imageFilterTypes(req, file)) {
    cb(null, true);
  } else if (videoFilterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "File Error"));
  }
};

export const putShoppingLiveCategoryFilter = async (req, file, cb) => {
  const error = putShoppingLiveCategoryValidate.validate(req.body);
  if (error.length > 0) {
    FilterError.cause = error[0].message;
    return cb(FilterError);
  }

  const id = req.params.shoppingLiveCategoryId;
  const validateCategoryId = mongoose.Types.ObjectId.isValid(id);
  if (!validateCategoryId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_CATEGORY_ID"));
  }
  const categoryId = mongoose.Types.ObjectId(id); //String을 ObjecId로 바꿈

  const categoryById = await findShoppingLiveCategoryById(categoryId);
  const categoryByName = await findShoppingLiveCategoryByName(req.body.name);

  if (!categoryById) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_CATEGORY_ID"));
  }

  if (
    categoryByName &&
    categoryById._id.toString() !== categoryByName._id.toString()
  ) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }
  req.multer["shoppingLiveCategory"] = categoryById;

  if (imageFilterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "File Error"));
  }
};

export const putShoppingLiveFilter = async (req, file, cb) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const error = putShoppingLiveValidate.validate(obj);
  if (error.length > 0) {
    FilterError.cause = error[0].message;
    return cb(FilterError);
  }

  if (req.body.shoppingLiveCategoryId) {
    const validateCategoryId = mongoose.Types.ObjectId.isValid(
      req.body.shoppingLiveCategoryId
    );
    if (!validateCategoryId) {
      return cb(new BadRequest(BAD_REQUEST.message, "INVALID_CATEGORY_ID"));
    }
    const shoppingLiveCategoryId = mongoose.Types.ObjectId(
      req.body.shoppingLiveCategoryId
    );

    const findCategoryId = await findShoppingLiveCategoryById(
      shoppingLiveCategoryId
    );
    if (!findCategoryId) {
      return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_CATEGORY_ID"));
    }
  }

  const validateLiveId = mongoose.Types.ObjectId.isValid(
    req.params.shoppingLiveId
  );
  if (!validateLiveId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_LIVE_ID"));
  }

  const shoppingLiveId = mongoose.Types.ObjectId(req.params.shoppingLiveId);

  const findLiveId = await findShoppingLiveById(shoppingLiveId);
  const findLiveName = await findShoppingLiveByName(req.body.name);
  if (!findLiveId) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_LIVE_ID"));
  }

  if (
    findLiveName &&
    findLiveId._id.toString() !== findLiveName._id.toString()
  ) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }
  req.multer["shoppingLive"] = findLiveId;

  if (imageFilterTypes(req, file)) {
    cb(null, true);
  } else if (videoFilterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "File Error"));
  }
};
