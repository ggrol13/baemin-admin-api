import {
  findStoreCategoryById,
  findStoreCategoryByName,
} from "../../api/store/repositories/store-category.repo.js";
import {
  menuValidate,
  putMenuValidate,
  putStoreCategoryValidate,
  storeCategoryValidate,
} from "../../api/store/store.validate.js";
import { imageFilterTypes } from "../multer.js";
import mongoose from "mongoose";
import { findStoreById } from "../../api/store/repositories/store.repo.js";
import { BadRequest } from "../../common/api-error.js";
import { BAD_REQUEST } from "../../common/http-code.js";

export const storeCategoryFilter = async (req, file, cb) => {
  const error = storeCategoryValidate.validate(req.body);
  if (error.length > 0) {
    return cb(new BadRequest(BAD_REQUEST.message, error[0].message));
  }

  if (await findStoreCategoryByName(req.body.name)) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }

  if (imageFilterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "Only images are allowed"));
  }
};

export const menuFilter = async (req, file, cb) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const error = menuValidate.validate(obj);
  if (error.length > 0) {
    return cb(new BadRequest(BAD_REQUEST.message, error[0].message));
  }

  const storeId = req.params.storeId;
  const categoryId = req.params.categoryId;
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  const validateStoreId = mongoose.Types.ObjectId.isValid(storeId);

  if (!validateCategoryId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_CATEGORY_ID"));
  }
  if (!validateStoreId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_STORE_ID"));
  }

  const store = await findStoreById(storeId);
  if (!store) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_STORE_ID"));
  }
  const menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];
  if (!menuCategory) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_CATEGORY_ID"));
  }

  const duplicate = [];

  menuCategory.menu.forEach((serverMenu) => {
    const filtered = req.body.menu.filter(
      (bodyMenu) => bodyMenu.name === serverMenu.name
    );
    duplicate.push(...filtered);
  });

  if (duplicate.length !== 0) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }

  if (imageFilterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "File Error"));
  }
};

export const putStoreCategoryFilter = async (req, file, cb) => {
  const error = putStoreCategoryValidate.validate(req.body);
  if (error.length > 0) {
    return cb(new BadRequest(BAD_REQUEST.message, error[0].message));
  }

  const id = req.params.categoryId;
  const validateCategoryId = mongoose.Types.ObjectId.isValid(id);
  if (!validateCategoryId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_CATEGORY_ID"));
  }
  const storeCategoryId = mongoose.Types.ObjectId(id); //String을 ObjecId로 바꿈

  const categoryById = await findStoreCategoryById(storeCategoryId);
  const categoryByName = await findStoreCategoryByName(req.body.name);

  if (!categoryById) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_CATEGORY_ID"));
  }

  if (
    categoryByName &&
    JSON.stringify(categoryById._id) !== JSON.stringify(categoryByName._id)
  ) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }
  req.multer["storeCategory"] = categoryById;

  if (imageFilterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "File Error"));
  }
};

export const putMenuFilter = async (req, file, cb) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const error = putMenuValidate.validate(obj);
  if (error.length > 0) {
    return cb(new BadRequest(BAD_REQUEST.message, error[0].message));
  }
  const categoryId = req.params.categoryId;
  const storeId = req.params.storeId;
  const menuId = req.params.menuId;

  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  const validateStoreId = mongoose.Types.ObjectId.isValid(storeId);
  const validateMenuId = mongoose.Types.ObjectId.isValid(menuId);

  if (!validateCategoryId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_CATEGORY_ID"));
  }
  if (!validateStoreId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_STORE_ID"));
  }
  if (!validateMenuId) {
    return cb(new BadRequest(BAD_REQUEST.message, "INVALID_MENU_ID"));
  }

  const storeOId = mongoose.Types.ObjectId(storeId);
  const store = await findStoreById(storeOId);
  if (!store) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_STORE_ID"));
  }
  const menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];

  if (!menuCategory) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_CATEGORY_ID"));
  }
  const menuById = menuCategory.menu.filter(
    (category) => category._id.toString() === menuId
  )[0];
  const menuByName = menuCategory.menu.filter((category) => {
    return category.name === req.body.menu.name;
  });

  if (!menuById) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_MENU_ID"));
  }

  if (menuByName.length > 0 && menuById._id !== menuByName._id) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }
  req.multer["menuCategory"] = menuCategory;

  if (imageFilterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "File Error"));
  }
};
