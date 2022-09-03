import Schema from "validate";
import { ApiError } from "../../common/api-error.js";
import { BAD_REQUEST } from "../../common/http-code.js";
import mongoose from "mongoose";
import { findShoppingLiveById } from "./repositories/shopping-live.repo.js";
import { findShoppingLiveCategoryById } from "./repositories/shopping-live-category.repo.js";

export const shoppingLiveCategoryValidate = new Schema({
  name: { required: true },
  shoppingId: [{ required: false }],
});

export const putShoppingLiveCategoryValidate = new Schema({
  name: { required: false },
  storeId: [{ required: false }],
});

export const shoppingLiveValidate = new Schema({
  name: { required: true },
  product: [
    {
      name: { required: true },
      price: { required: true },
      count: { required: true },
    },
  ],
  shoppingLiveCategoryId: { required: true },
});

export const putShoppingLiveValidate = new Schema({
  name: { required: false },
  product: [
    {
      name: { required: false },
      price: { required: false },
      count: { required: false },
    },
  ],
  shoppingLiveCategoryId: { required: false },
});

export const liveCalenderValidate = new Schema({
  detail: {
    productId: { required: true },
    name: { required: true },
    info: { required: true },
    date: { required: true },
  },
});

export const putLiveValidate = async (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const error = putShoppingLiveValidate.validate(obj);
  if (error.length > 0) {
    await ApiError(BAD_REQUEST, res, error[0].message);
  }
  const validateLiveId = mongoose.Types.ObjectId.isValid(
    req.params.shoppingLiveId
  );
  if (!validateLiveId) {
    ApiError(BAD_REQUEST, res, "INVALID_LIVE_ID");
    return;
  }
  let shoppingLive = await findShoppingLiveById(req.params.shoppingLiveId);
  if (!shoppingLive) {
    ApiError(BAD_REQUEST, res, "IMPROPER_SHOPPING_LIVE_ID");
    return;
  }
  return shoppingLive;
};

export const putLiveCategoryValidate = async (req, res) => {
  const error = putShoppingLiveCategoryValidate.validate(req.body);
  if (error.length > 0) {
    ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }
  const validateCategoryId = mongoose.Types.ObjectId.isValid(
    req.params.shoppingLiveCategoryId
  );
  if (!validateCategoryId) {
    ApiError(BAD_REQUEST, res, "INVALID_CATEGORY_ID");
    return;
  }

  let category = await findShoppingLiveCategoryById(
    req.params.shoppingLiveCategoryId
  );
  if (!category) {
    ApiError(BAD_REQUEST, res, "IMPROPER_CATEGORY_ID");
    return;
  }

  return category;
};

export const putCalenderDateValidate = new Schema({
  date: { required: true },
});
