import {
  findMenuCategoryByName,
  findStoreById,
  findStoreByName,
  saveMenu,
  saveMenuCategory,
  saveStore,
} from "./repositories/store.repo.js";
import mongoose from "mongoose";
import {
  findStoreCategoryById,
  findStoreCategoryByName,
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
  console.log(storeCategoryId);
  //String을 ObjecId로 바꿈
  const findCategoryId = await findStoreCategoryById(storeCategoryId);
  if (!findCategoryId) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }

  if ((await findStoreByName(body.name)).length !== 0) {
    return { status: false, message: "DUPLICATED_NAME" };
  }
  const store = await saveStore(body);

  await saveCategoryIdStore(store._id, storeCategoryId);
  await saveStoreIdCategory(store._id, storeCategoryId);
  await saveMenuCategory(store._id, true, "대표 메뉴");
  return { status: true, message: "SUCCESS" };
};

export const createMenu = async (body, categoryId, storeId) => {
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  const validateStoreId = mongoose.Types.ObjectId.isValid(storeId);

  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  if (!validateStoreId) {
    return { status: false, message: "INVALID_STORE_ID" };
  }

  const store = await findStoreById(storeId);
  const menuCategory = store.menuCategory.filter(
    (category) => category._id.toString() === categoryId
  )[0];
  if (!menuCategory) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  if (!store) {
    return { status: false, message: "IMPROPER_STORE_ID" };
  }

  const duplicate = [];
  menuCategory.menu.forEach((serverMenu) => {
    const filtered = body.menuCategory.menu.filter(
      (bodyMenu) => bodyMenu.name === serverMenu.name
    );
    duplicate.push(...filtered);
  });
  if (duplicate.length !== 0) {
    return { status: false, message: "DUPLICATED_NAME" };
  }

  await saveMenu(storeId, body.menuCategory.menu, menuCategory.name);
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

export const createStoreCategory = async (body) => {
  if ((await findStoreCategoryByName(body.name)).length !== 0) {
    return { status: false, message: "DUPLICATED_NAME" };
  }
  await saveStoreCategory(body);
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
    return { status: false, message: "IMPROPER_STORE_ID" };
  }
  return { status: true, message: "SUCCESS", body: category };
};
