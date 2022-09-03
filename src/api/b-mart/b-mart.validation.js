import { ApiError } from "../../common/api-error.js";
import { BAD_REQUEST } from "../../common/http-code.js";
import { findBMartCategoryById } from "./repositories/product-category.repo.js";
import Schema from "validate";
import mongoose from "mongoose";
import { findProductById } from "./repositories/product.repo.js";

export const bMartProductValidate = new Schema({
  name: { required: true },
  price: { required: true },
  imgPath: [{ required: true }],
  deliveryTime: { required: true },
  information: { required: true },
  infoDetail: { required: true },
  refundReturn: {
    deliveryInfo: { required: true },
    sellerInfo: { required: true },
    refundReturnInfo: { required: true },
  },
  categoryId: { required: true },
});

export const putMartProductValidate = new Schema({
  name: { required: false },
  price: { required: false },
  imgPath: [{ required: false }],
  deliveryTime: { required: false },
  information: { required: false },
  infoDetail: { required: false },
  refundReturn: {
    deliveryInfo: { required: false },
    sellerInfo: { required: false },
    refundReturnInfo: { required: false },
  },
  check: {
    edit: { required: true },
    push: { required: true },
    number: { required: true },
  },
  categoryId: { required: false },
});

export const putBMartProductValidate = async (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const error = putMartProductValidate.validate(obj);
  if (error.length > 0) {
    ApiError(BAD_REQUEST, res, error[0].message);
  }
  const validateProductId = mongoose.Types.ObjectId.isValid(
    req.params.productId
  );
  if (!validateProductId) {
    ApiError(BAD_REQUEST, res, "INVALID_PRODUCT_ID");
    return;
  }

  const product = findProductById(req.params.productId);
  if (!product) {
    ApiError(BAD_REQUEST, res, "IMPROPER_PRODUCT_ID");
    return;
  }
  return product;
};

export const bMartCategoryValidate = new Schema({
  name: { required: true },
  productId: [{ required: false }],
});

export const putMartCategoryValidate = new Schema({
  name: { required: false },
  storeId: [{ required: false }],
});

export const putBMartCategoryValidate = async (req, res) => {
  const error = putMartCategoryValidate.validate(req.body);
  if (error.length > 0) {
    ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }
  const validateCategoryId = mongoose.Types.ObjectId.isValid(
    req.params.bMartCategoryId
  );
  if (!validateCategoryId) {
    ApiError(BAD_REQUEST, res, "INVALID_CATEGORY_ID");
    return;
  }

  let category = await findBMartCategoryById(req.params.bMartCategoryId);
  if (!category) {
    ApiError(BAD_REQUEST, res, "IMPROPER_CATEGORY_ID");
    return;
  }

  return category;
};
