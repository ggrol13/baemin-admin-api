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
  aggregateStoreCategoryById,
  editStoreCategory,
  eraseStoreCategory,
  findStoreCategoryById,
  saveCategoryIdStore,
  saveStoreCategory,
  saveStoreIdCategory,
} from "./repositories/store-category.repo.js";

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

  await saveCategoryIdStore(store._id, storeCategoryId);
  await saveStoreIdCategory(store._id, storeCategoryId);
  await saveMenuCategory(store._id, true, "대표 메뉴");
  return { status: true, message: "SUCCESS" };
};

export const createMenu = async (body, categoryId, storeId, paths) => {
  const store = await findStoreById(storeId);
  const menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];

  for (let i in body.menu) {
    body.menu[i].imgPath = paths[i];
  }

  await saveMenu(storeId, body.menu, menuCategory.name);
  return { status: true, message: "SUCCESS" };
};

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

export const createStoreCategory = async (body, path) => {
  body.imgPath = path;
  await saveStoreCategory(body);
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
  const storeOId = mongoose.Types.ObjectId(storeId);
  const findStoreId = await findStoreById(storeOId);
  const findCategoryId = await findStoreCategoryById(storeCategoryId);
  if (!findCategoryId) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  if (!findStoreId) {
    return { status: false, message: "IMPROPER_STORE_ID" };
  }

  await editStore(body, storeOId);
  return { status: true, message: "SUCCESS" };
};

export const updateMenu = async (body, categoryId, storeId, menuId, file) => {
  if (!file) {
    const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
    const validateStoreId = mongoose.Types.ObjectId.isValid(storeId);
    const validateMenuId = mongoose.Types.ObjectId.isValid(menuId);

    if (!validateCategoryId) {
      return { status: false, message: "INVALID_CATEGORY_ID" };
    }
    if (!validateStoreId) {
      return { status: false, message: "INVALID_STORE_ID" };
    }
    if (!validateMenuId) {
      return { status: false, message: "INVALID_MENU_ID" };
    }
  }

  const storeOId = mongoose.Types.ObjectId(storeId);
  const store = await findStoreById(storeOId);
  if (!file) {
    if (!store) {
      return { status: false, message: "IMPROPER_STORE_ID" };
    }
  }
  const menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];
  if (!file) {
    if (!menuCategory) {
      return { status: false, message: "IMPROPER_CATEGORY_ID" };
    }
    const menu = menuCategory.menu.filter(
      (category) => category._id.toString() === menuId
    )[0];
    if (!menu) {
      return { status: false, message: "IMPROPER_MENU_ID" };
    }
  }

  if (file) {
    file.path = process.env.MENU_IMG_URL + file.filename;
    body.menu[0].imgPath = file.path;
  }

  await editMenu(body.menu, storeOId, menuCategory.name, menuId);

  return { status: true, message: "SUCCESS" };
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
  const menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];
  if (!menuCategory) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }

  await editMenuCategory(storeId, categoryId, body);
  return { status: true, message: "SUCCESS" };
};

export const updateStoreCategory = async (body, file, id) => {
  if (!file) {
    const validateCategoryId = mongoose.Types.ObjectId.isValid(id);
    if (!validateCategoryId) {
      return { status: false, message: "INVALID_CATEGORY_ID" };
    }
  }
  const storeCategoryId = mongoose.Types.ObjectId(id);

  const category = await aggregateStoreCategoryById(storeCategoryId);
  if (!file) {
    if (!category) {
      return { status: false, message: "IMPROPER_STORE_CATEGORY_ID" };
    }
  }
  file.path = process.env.STORE_CATEGORY_IMG_URL + file.filename;

  //after or before update should delete existed image
  await editStoreCategory(body.name, file, storeCategoryId);
  return { status: true, message: "SUCCESS", body: category };
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
  await eraseStore(storeId);
  return { status: true, message: "SUCCESS", deleted: store };
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
  await eraseMenu(storeOId, menuCategory.name, menuId, menu.name);
  return { status: true, message: "SUCCESS", deleted: menu };
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
  await eraseMenuCategory(storeId, menuCategory._id);
  return { status: true, message: "SUCCESS", deleted: menuCategory };
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
  await eraseStoreCategory(categoryId);
  return { status: true, message: "SUCCESS", deleted: storeCategory };
};
