import {
  createMenu,
  createMenuCategory,
  createStore,
  createStoreCategory,
  findMenu,
  findMenuCategory,
  findStore,
  findStoreCategory,
  removeMenu,
  removeMenuCategory,
  removeStore,
  removeStoreCategory,
  updateMenu,
  updateMenuCategory,
  updateStore,
  updateStoreCategory,
} from "./store.service.js";
import {
  menuCategoryValidate,
  menuValidate,
  storeCategoryValidate,
  storeValidate,
} from "./store.validate.js";
import { BAD_REQUEST } from "../../common/http-code.js";
import { ApiError } from "../../common/api-error.js";
import { ApiSuccess } from "../../common/api-response.js";

export const insertStore = async (req, res) => {
  const error = storeValidate.validate(req.body);
  if (error.length > 0) {
    await ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }

  const returnValues = await createStore(req.body);

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, req.body, res); //body: data에 data가 적절히 들어가도록 body정보가져오기
};

export const insertMenu = async (req, res) => {
  if (req.files.length < req.body.menu.length) {
    await ApiError(BAD_REQUEST, res, "No_File");
    return;
  }
  const paths = req.files.map(
    (file) => process.env.MENU_IMG_URL + file.filename
  );
  console.log(paths);
  const returnValues = await createMenu(
    req.body,
    req.params.categoryId,
    req.params.storeId,
    paths
  );

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }

  await ApiSuccess(returnValues, req.body, res);
};

export const insertMenuCategory = async (req, res) => {
  const error = menuCategoryValidate.validate(req.body);
  if (error.length > 0) {
    await ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }

  const returnValues = await createMenuCategory(req.body, req.params.storeId);

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }

  await ApiSuccess(returnValues, req.body, res);
};

export const insertStoreCategory = async (req, res) => {
  if (!req.file) {
    await ApiError(BAD_REQUEST, res, "No_File");
    return;
  }
  req.file.path = process.env.STORE_CATEGORY_IMG_URL + req.file.filename;
  const returnValues = await createStoreCategory(req.body, req.file.path);

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, req.body, res);
};
export const getStore = async (req, res) => {
  const returnValues = await findStore(req.params.storeId);

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const getMenu = async (req, res) => {
  const returnValues = await findMenu(
    req.params.storeId,
    req.params.categoryId,
    req.params.menuId
  );

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const getMenuCategory = async (req, res) => {
  const returnValues = await findMenuCategory(
    req.params.storeId,
    req.params.categoryId
  );

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const getStoreCategory = async (req, res) => {
  const returnValues = await findStoreCategory(req.params.storeCategoryId);

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const putStore = async (req, res) => {
  const error = storeValidate.validate(req.body);
  if (error.length > 0) {
    await ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }

  const returnValues = await updateStore(req.body, req.params.storeId);

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, req.body, res);
};

export const putMenu = async (req, res) => {
  if (!req.file) {
    const obj = JSON.parse(JSON.stringify(req.body));
    const error = menuValidate.validate(obj);
    if (error.length > 0) {
      await ApiError(BAD_REQUEST, res, error[0].message);
      return;
    }
  }

  const returnValues = await updateMenu(
    req.body,
    req.params.categoryId,
    req.params.storeId,
    req.params.menuId,
    req.file
  );

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }

  await ApiSuccess(returnValues, req.body, res);
};

export const putMenuCategory = async (req, res) => {
  const error = menuCategoryValidate.validate(req.body);
  if (error.length > 0) {
    await ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }

  const returnValues = await updateMenuCategory(
    req.body,
    req.params.storeId,
    req.params.menuCategoryId
  );

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }

  await ApiSuccess(returnValues, req.body, res);
};

export const putStoreCategory = async (req, res) => {
  if (!req.file) {
    const error = storeCategoryValidate.validate(req.body);
    if (error.length > 0) {
      await ApiError(BAD_REQUEST, res, error[0].message);
      return;
    }
  }

  const returnValues = await updateStoreCategory(
    req.body,
    req.file,
    req.params.categoryId
  );

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, req.body, res);
};

export const deleteStore = async (req, res) => {
  const returnValues = await removeStore(req.params.storeId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }

  await ApiSuccess(returnValues, returnValues.deleted, res);
};

export const deleteMenu = async (req, res) => {
  const returnValues = await removeMenu(
    req.params.storeId,
    req.params.categoryId,
    req.params.menuId
  );
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }

  await ApiSuccess(returnValues, returnValues.deleted, res);
};

export const deleteMenuCategory = async (req, res) => {
  const returnValues = await removeMenuCategory(
    req.params.storeId,
    req.params.menuCategoryId
  );
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }

  await ApiSuccess(returnValues, returnValues.deleted, res);
};

export const deleteStoreCategory = async (req, res) => {
  const returnValues = await removeStoreCategory(req.params.storeCategoryId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }

  await ApiSuccess(returnValues, returnValues.deleted, res);
};
