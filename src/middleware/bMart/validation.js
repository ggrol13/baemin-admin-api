import { BadRequest, FilterError } from "../../common/api-error.js";
import { BAD_REQUEST } from "../../common/http-code.js";
import { imageFilterTypes } from "../multer.js";
import {
  bMartCategoryValidate,
  bMartProductValidate,
  putMartCategoryValidate,
  putMartProductValidate,
} from "../../api/b-mart/b-mart.validation.js";
import {
  findBMartCategoryById,
  findBMartCategoryByName,
} from "../../api/b-mart/repositories/product-category.repo.js";

import mongoose from "mongoose";
import {
  findBMartProductByName,
  findProductById,
} from "../../api/b-mart/repositories/product.repo.js";

export const bMartProductFilter = async (req, file, cb) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const error = bMartProductValidate.validate(obj);
  if (error.length > 0) {
    return cb(new BadRequest(BAD_REQUEST.message, error[0].message));
  }

  if (await findBMartProductByName(req.body.name)) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }

  const validateCategoryId = mongoose.Types.ObjectId.isValid(
    req.body.categoryId
  );
  if (!validateCategoryId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_CATEGORY_ID"));
  }
  if (!(await findBMartCategoryById(req.body.categoryId))) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_CATEGORY_ID"));
  }

  if (imageFilterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "Only images are allowed"));
  }
};

export const putBMartProductFilter = async (req, file, cb) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const error = putMartProductValidate.validate(obj);
  if (error.length > 0) {
    return cb(new BadRequest(BAD_REQUEST.message, error[0].message));
  }

  const id = req.params.productId;
  const validateProductId = mongoose.Types.ObjectId.isValid(id);
  if (!validateProductId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_PRODUCT_ID"));
  }
  const validateCategoryId = mongoose.Types.ObjectId.isValid(
    req.body.categoryId
  );
  if (!validateCategoryId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_CATEGORY_ID"));
  }
  if (!(await findBMartCategoryById(req.body.categoryId))) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_CATEGORY_ID"));
  }
  const productById = await findProductById(id);
  const productByName = await findBMartProductByName(req.body.name);
  console.log(productById);
  if (
    req.body.check.number < 0 ||
    req.body.check.number > productById.imgPath.length
  ) {
    return cb(new BadRequest(BAD_REQUEST.message, "NUMBER_PROBLEM"));
  }

  if (!productById) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_PRODUCT_ID"));
  }

  if (
    productByName &&
    productById._id.toString() !== productByName._id.toString()
  ) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }
  req.multer["bMartProduct"] = productById;

  if (imageFilterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "File Error"));
  }
};

export const bMartCategoryFilter = async (req, file, cb) => {
  const error = bMartCategoryValidate.validate(req.body);
  if (error.length > 0) {
    return cb(new BadRequest(BAD_REQUEST.message, error[0].message));
  }

  if (await findBMartCategoryByName(req.body.name)) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }

  if (imageFilterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "Only images are allowed"));
  }
};

export const putBMartCategoryFilter = async (req, file, cb) => {
  const error = putMartCategoryValidate.validate(req.body);
  if (error.length > 0) {
    FilterError.cause = error[0].message;
    return cb(FilterError);
  }

  const id = req.params.bMartCategoryId;
  const validateCategoryId = mongoose.Types.ObjectId.isValid(id);
  if (!validateCategoryId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_CATEGORY_ID"));
  }

  const categoryById = await findBMartCategoryById(id);
  const categoryByName = await findBMartCategoryByName(req.body.name);

  if (!categoryById) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_CATEGORY_ID"));
  }

  if (
    categoryByName &&
    categoryById._id.toString() !== categoryByName._id.toString()
  ) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }
  req.multer["bMartCategory"] = categoryById;

  if (imageFilterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "File Error"));
  }
};
