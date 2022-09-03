import Schema from "validate";
import { ApiError } from "../../common/api-error.js";
import { BAD_REQUEST } from "../../common/http-code.js";
import mongoose from "mongoose";
import { findStoreCategoryById } from "./repositories/store-category.repo.js";
import { findStoreById } from "./repositories/store.repo.js";

export const storeValidate = new Schema({
  name: { required: true },
  phone: { required: true },
  address: { required: true },
  minimumPrice: { required: false },
  paymentMethod: { required: true },
  deliveryTime: { required: false },
  deliveryTip: { required: false },
  info: { required: true },
  storeCategoryId: { required: true },
});

export const menuValidate = new Schema({
  menu: [
    {
      name: { required: true },
      price: { required: true },
      options: [
        { required: false },
        {
          name: { required: false },
          price: { required: false },
        },
      ],
    },
  ],
});

export const storeCategoryValidate = new Schema({
  name: { required: true },
  storeId: [{ required: false }],
});

export const menuCategoryValidate = new Schema({
  name: {
    required: true,
  },
});

export const putStoreValidate = new Schema({
  name: { required: false },
  phone: { required: false },
  address: { required: false },
  minimumPrice: { required: false },
  paymentMethod: { required: false },
  deliveryTime: { required: false },
  deliveryTip: { required: false },
  info: { required: false },
  storeCategoryId: { required: false },
});

export const putMenuValidate = new Schema({
  menu: {
    name: { required: false },
    price: { required: false },
    options: [
      { required: false },
      {
        name: { required: false },
        price: { required: false },
      },
    ],
  },
});

export const putStoreCategoryValidate = new Schema({
  name: { required: false },
  storeId: [{ required: false }],
});

export const putMenuCategoryValidate = new Schema({
  name: {
    required: false,
  },
});

export const putValidateStoreCategory = async (req, res) => {
  const error = storeCategoryValidate.validate(req.body);
  if (error.length > 0) {
    ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }
  const validateCategoryId = mongoose.Types.ObjectId.isValid(
    req.params.categoryId
  );
  if (!validateCategoryId) {
    ApiError(BAD_REQUEST, res, "INVALID_CATEGORY_ID");
    return;
  }
  let category = await findStoreCategoryById(req.params.categoryId);
  if (!category) {
    ApiError(BAD_REQUEST, res, "IMPROPER_CATEGORY_ID");
    return;
  }

  return category;
};

export const putValidateMenu = async (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const error = putMenuValidate.validate(obj);
  if (error.length > 0) {
    ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }
  const categoryId = req.params.categoryId;
  const storeId = req.params.storeId;
  const menuId = req.params.menuId;

  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  const validateStoreId = mongoose.Types.ObjectId.isValid(storeId);
  const validateMenuId = mongoose.Types.ObjectId.isValid(menuId);

  if (!validateCategoryId) {
    ApiError(BAD_REQUEST, res, "INVALID_CATEGORY_ID");
    return;
  }
  if (!validateStoreId) {
    ApiError(BAD_REQUEST, res, "INVALID_STORE_ID");
    return;
  }
  if (!validateMenuId) {
    ApiError(BAD_REQUEST, res, "INVALID_MENU_ID");
    return;
  }

  const storeOId = mongoose.Types.ObjectId(storeId);
  const store = await findStoreById(storeOId);
  if (!store) {
    ApiError(BAD_REQUEST, res, "IMPROPER_STORE_ID");
    return;
  }
  const menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];

  if (!menuCategory) {
    ApiError(BAD_REQUEST, res, "IMPROPER_CATEGORY_ID");
    return;
  }
  const menuById = menuCategory.menu.filter(
    (category) => category._id.toString() === menuId
  )[0];
  const menuByName = menuCategory.menu.filter((category) => {
    return category.name === req.body.menu.name;
  });

  if (!menuById) {
    ApiError(BAD_REQUEST, res, "IMPROPER_MENU_ID");
    return;
  }

  if (menuByName.length > 0 && menuById._id !== menuByName._id) {
    ApiError(BAD_REQUEST, res, "DUPLICATED_NAME");
    return;
  }

  return menuCategory;
};
