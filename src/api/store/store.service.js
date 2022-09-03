import {
  editMenu,
  editMenuCategory,
  editStore,
  eraseMenu,
  eraseMenuCategory,
  eraseStore,
  findMenuCategoryByName,
  findStoreById,
  findStoreByName,
  saveMenu,
  saveMenuCategory,
  saveStore,
} from "./repositories/store.repo.js";
import mongoose from "mongoose";
import {
  editStoreCategory,
  eraseStoreCategory,
  findStoreCategoryById,
  saveStoreCategory,
  saveStoreIdCategory,
} from "./repositories/store-category.repo.js";
import {
  deleteMenuImage,
  deletePutMenuImage,
  deleteStoreCategoryImage,
  uploadCategoryStore,
  uploadMenuStore,
  uploadPutMenuStore,
  uploadPutStoreCategory,
} from "../../middleware/multer.js";
import { updateField } from "../../common/update-field.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

//Store
export const createStore = async (body) => {
  const validateCategoryId = mongoose.Types.ObjectId.isValid(
    body.storeCategoryId
  );
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }

  const storeCategoryId = mongoose.Types.ObjectId(body.storeCategoryId);
  const findCategoryId = await findStoreCategoryById(storeCategoryId);
  if (!findCategoryId) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  if (await findStoreByName(body.name)) {
    return { status: false, message: "DUPLICATED_NAME" };
  }
  const store = await saveStore(body);

  // await saveCategoryIdStore(store._id, storeCategoryId);
  await saveStoreIdCategory(store._id, storeCategoryId);
  await saveMenuCategory(store._id, true, "대표 메뉴");
  return { status: true, message: "SUCCESS" };
};

export const findStore = async (id) => {
  const validateStoreId = mongoose.Types.ObjectId.isValid(id);
  const storeId = mongoose.Types.ObjectId(id); //String을 ObjecId로 바꿈
  if (!validateStoreId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  const store = await findStoreById(storeId);
  if (!store) {
    return { status: false, message: "IMPROPER_STORE_CATEGORY_ID" };
  }
  return { status: true, message: "SUCCESS", body: store };
};

export const updateStore = async (body, storeId) => {
  const validateCategoryId = mongoose.Types.ObjectId.isValid(
    body.storeCategoryId
  );
  const validateStoreId = mongoose.Types.ObjectId.isValid(storeId);
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  if (!validateStoreId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  const storeCategoryId = mongoose.Types.ObjectId(body.storeCategoryId);
  let store = await findStoreById(storeId);
  const findCategoryId = await findStoreCategoryById(storeCategoryId);
  if (!findCategoryId) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  if (!store) {
    return { status: false, message: "IMPROPER_STORE_ID" };
  }
  store = JSON.parse(JSON.stringify(store));
  let storeBody = { ...body };
  updateField(storeBody, store);

  await editStore(storeBody, storeId);
  return { status: true, message: "SUCCESS" };
};

export const removeStore = async (storeId) => {
  const validateStoreId = mongoose.Types.ObjectId.isValid(storeId);
  if (!validateStoreId) {
    return { status: false, message: "INVALID_STORE_ID" };
  }
  const store = await findStoreById(storeId);
  if (!store) {
    return { status: false, message: "IMPROPER_STORE_ID" };
  }
  for (const category of store.menuCategory) {
    for (const menu of category.menu) {
      await deleteMenuImage(menu);
    }
  }
  await eraseStore(storeId);
  return { status: true, message: "SUCCESS", deleted: store };
};

//Menu
export const createMenu = async (body, categoryId, storeId, files) => {
  const store = await findStoreById(storeId);
  const menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];
  const menuBody = { ...body };
  const imageName = files.map(
    (file) => `${uuidv4()}${path.extname(file.originalname)}`
  );
  const paths = imageName.map((name) => process.env.MENU_IMG_URL + name);

  for (let i in body.menu) {
    menuBody.menu[i].imgPath = paths[i];
  }
  await uploadMenuStore(imageName, files);
  await saveMenu(storeId, menuBody.menu, menuCategory.name);

  return { status: true, message: "SUCCESS" };
};

export const findMenu = async (storeId, categoryId, menuId) => {
  const validateStoreId = mongoose.Types.ObjectId.isValid(storeId);
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  const validateMenuId = mongoose.Types.ObjectId.isValid(menuId);

  if (!validateStoreId) {
    return { status: false, message: "INVALID_STORE_ID" };
  }
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  if (!validateMenuId) {
    return { status: false, message: "INVALID_MENU_ID" };
  }

  const storeOId = mongoose.Types.ObjectId(storeId);
  const store = await findStoreById(storeOId);
  const menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];
  const menu = menuCategory.menu.filter(
    (category) => category._id.toString() === menuId
  )[0];
  if (!menuCategory) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  if (!store) {
    return { status: false, message: "IMPROPER_STORE_ID" };
  }
  if (!menu) {
    return { status: false, message: "IMPROPER_MENU_ID" };
  }
  return { status: true, message: "SUCCESS", body: menu };
};

export const updateMenu = async (
  body,
  categoryId,
  storeId,
  menuId,
  file,
  menuCategory
) => {
  let menu = menuCategory.menu.filter(
    (category) => category._id.toString() === menuId
  )[0];
  menu = JSON.parse(JSON.stringify(menu));
  let menuBody = { ...body };

  updateField(menuBody, menu);

  if (file) {
    const imageName = `${uuidv4()}${path.extname(file.originalname)}`;
    const imgPath = process.env.MENU_IMG_URL + imageName;
    menuBody.menu.imgPath = imgPath;
    await deletePutMenuImage(imgPath);
    await uploadPutMenuStore(imageName, file);
  }
  menuCategory = JSON.parse(JSON.stringify(menuCategory));
  for (const i in menuCategory.menu) {
    if (menuCategory.menu[i]._id === menuId) {
      menuCategory.menu[i] = JSON.parse(JSON.stringify(menuBody.menu));
    }
  }

  await editMenu(menuCategory.menu, storeId, menuCategory.name);

  return { status: true, message: "SUCCESS" };
};
export const removeMenu = async (storeId, categoryId, menuId) => {
  const validateStoreId = mongoose.Types.ObjectId.isValid(storeId);
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  const validateMenuId = mongoose.Types.ObjectId.isValid(menuId);

  if (!validateStoreId) {
    return { status: false, message: "INVALID_STORE_ID" };
  }
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  if (!validateMenuId) {
    return { status: false, message: "INVALID_MENU_ID" };
  }

  const storeOId = mongoose.Types.ObjectId(storeId);
  const store = await findStoreById(storeOId);
  const menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];
  const menu = menuCategory.menu.filter(
    (category) => category._id.toString() === menuId
  )[0];
  if (!menuCategory) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  if (!store) {
    return { status: false, message: "IMPROPER_STORE_ID" };
  }
  if (!menu) {
    return { status: false, message: "IMPROPER_MENU_ID" };
  }
  await deleteMenuImage(menu);
  await eraseMenu(storeOId, menuCategory.name, menuId, menu.name);
  return { status: true, message: "SUCCESS", deleted: menu };
};

//menuCategory

export const createMenuCategory = async (body, id) => {
  //storeId요청시 store가 있는 지 없는지 확인
  const validateStoreId = mongoose.Types.ObjectId.isValid(id);
  if (!validateStoreId) {
    return { status: false, message: "INVALID_STORE_ID" };
  }

  const storeById = await findStoreById(id);
  if (!storeById) {
    return { status: false, message: "IMPROPER_STORE_ID" };
  }

  const menuCategory = await findMenuCategoryByName(body.name, id);
  if (menuCategory) {
    return { status: false, message: "DUPLICATED_NAME" };
  }

  await saveMenuCategory(id, false, body.name);
  return { status: true, message: "SUCCESS" };
}; //메뉴 카테고리 중복이름 걸러내기

export const findMenuCategory = async (storeId, categoryId) => {
  const validateStoreId = mongoose.Types.ObjectId.isValid(storeId);
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);

  if (!validateStoreId) {
    return { status: false, message: "INVALID_STORE_ID" };
  }
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }

  const storeOId = mongoose.Types.ObjectId(storeId);
  const store = await findStoreById(storeOId);
  const menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];
  if (!menuCategory) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  if (!store) {
    return { status: false, message: "IMPROPER_STORE_ID" };
  }
  return { status: true, message: "SUCCESS", body: menuCategory };
};

export const updateMenuCategory = async (body, storeId, categoryId) => {
  //storeId요청시 store가 있는 지 없는지 확인
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  const validateStoreId = mongoose.Types.ObjectId.isValid(storeId);
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  if (!validateStoreId) {
    return { status: false, message: "INVALID_STORE_ID" };
  }
  const store = await findStoreById(storeId);
  if (!store) {
    return { status: false, message: "IMPROPER_STORE_ID" };
  }
  let menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];
  if (!menuCategory) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  menuCategory = JSON.parse(JSON.stringify(menuCategory));
  let categoryBody = { ...body };
  updateField(categoryBody, menuCategory);

  await editMenuCategory(storeId, categoryId, categoryBody);
  return { status: true, message: "SUCCESS" };
};

export const removeMenuCategory = async (storeId, categoryId) => {
  const validateStoreId = mongoose.Types.ObjectId.isValid(storeId);
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);

  if (!validateStoreId) {
    return { status: false, message: "INVALID_STORE_ID" };
  }
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }

  const store = await findStoreById(storeId);
  const menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];
  if (!store) {
    return { status: false, message: "IMPROPER_STORE_ID" };
  }
  if (!menuCategory) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  for (const menu of menuCategory.menu) {
    await deleteMenuImage(menu);
  }
  await eraseMenuCategory(storeId, menuCategory._id);
  return { status: true, message: "SUCCESS", deleted: menuCategory };
};

//storeCategory

export const createStoreCategory = async (body, file) => {
  const imageName = `${uuidv4()}${path.extname(file.originalname)}`;
  const imgPath = process.env.STORE_CATEGORY_IMG_URL + imageName;
  const category = { ...body, imgPath: imgPath };
  await saveStoreCategory(category);
  await uploadCategoryStore(imageName, file);
  return { status: true, message: "SUCCESS" };
};

export const findStoreCategory = async (id) => {
  const validateCategoryId = mongoose.Types.ObjectId.isValid(id);
  const storeCategoryId = mongoose.Types.ObjectId(id); //String을 ObjecId로 바꿈
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  const category = await findStoreCategoryById(storeCategoryId);
  if (!category) {
    return { status: false, message: "IMPROPER_STORE_CATEGORY_ID" };
  }
  return { status: true, message: "SUCCESS", body: category };
};

export const updateStoreCategory = async (body, file, id, category) => {
  category = JSON.parse(JSON.stringify(category));
  let editCategory = { ...body };
  if (file) {
    let imageName = `${uuidv4()}${path.extname(file.originalname)}`;
    editCategory.imgPath =
      process.env.SHOPPING_LIVE_CATEGORY_IMG_URL + imageName;

    await deleteStoreCategoryImage(category);
    await uploadCategoryStore(imageName, file);
  }
  updateField(editCategory, category);
  await editStoreCategory(editCategory, id);
  return { status: true, message: "SUCCESS", body: category };
};

export const removeStoreCategory = async (categoryId) => {
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);

  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  const storeCategory = await findStoreCategoryById(categoryId);
  if (!storeCategory) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  await deleteStoreCategoryImage(storeCategory);

  await eraseStoreCategory(categoryId);
  return { status: true, message: "SUCCESS", deleted: storeCategory };
};
