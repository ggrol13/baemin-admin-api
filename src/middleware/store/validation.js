import {
  findStoreCategoryById,
  findStoreCategoryByName,
} from "../../api/store/repositories/store-category.repo.js";
import {
  menuValidate,
  putStoreCategoryValidate,
  storeCategoryValidate,
} from "../../api/store/store.validate.js";
import { filterTypes } from "../multer.js";
import mongoose from "mongoose";
import { findStoreById } from "../../api/store/repositories/store.repo.js";
import { BadRequest, FilterError } from "../../common/api-error.js";
import { BAD_REQUEST } from "../../common/http-code.js";

export const storeCategoryFilter = async (req, file, cb) => {
  const error = storeCategoryValidate.validate(req.body);
  if (error.length > 0) {
    FilterError.cause = error[0].message;
    return cb(FilterError);
  }

  if (await findStoreCategoryByName(req.body.name)) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }

  if (filterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "Only images are allowed"));
  }
};

export const menuFilter = async (req, file, cb) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const error = menuValidate.validate(obj);
  if (error.length > 0) {
    FilterError.cause = error[0].message;
    return cb(FilterError);
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

  // for (let i in req.body.menu) {
  //   req.body.menu[i].imgPath = paths[i];
  // }

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

  if (filterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "File Error"));
  }
};

export const putStoreCategoryFilter = async (req, file, cb) => {
  const error = putStoreCategoryValidate.validate(req.body);
  if (error.length > 0) {
    FilterError.cause = error[0].message;
    return cb(FilterError);
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

  if (categoryByName && categoryById[0]._id !== categoryByName._id) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }

  if (filterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "File Error"));
  }
};

export const putMenuFilter = async (req, file, cb) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const error = menuValidate.validate(obj);
  if (error.length > 0) {
    FilterError.cause = error[0].message;
    return cb(FilterError);
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
  const menuCategoryById = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];

  if (!menuCategoryById) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_CATEGORY_ID"));
  }
  const menuById = menuCategoryById.menu.filter(
    (category) => category._id.toString() === menuId
  )[0];
  const menuByName = menuCategoryById.menu.filter((category) => {
    return category.name === req.body.menu[0].name;
  });

  if (!menuById) {
    return cb(new BadRequest(BAD_REQUEST.message, "IMPROPER_MENU_ID"));
  }

  if (menuByName.length > 0 && menuById._id !== menuByName._id) {
    return cb(new BadRequest(BAD_REQUEST.message, "DUPLICATED_NAME"));
  }

  if (filterTypes(req, file)) {
    cb(null, true);
  } else {
    return cb(new BadRequest(BAD_REQUEST.message, "File Error"));
  }
};
