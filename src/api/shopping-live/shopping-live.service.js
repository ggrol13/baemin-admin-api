import {
  editShoppingLiveCategory,
  eraseShoppingLiveCategory,
  findShoppingLiveCategoryById,
  getAllProduct,
  saveShoppingLiveCategory,
} from "./repositories/shopping-live-category.repo.js";
import mongoose from "mongoose";

import {
  editDeliciousTrue,
  editDessertTrue,
  editEncoreTrue,
  editFunTrue,
  editShoppingLive,
  eraseShoppingLive,
  findShoppingLiveById,
  saveLiveIdCategory,
  saveShoppingLive,
} from "./repositories/shopping-live.repo.js";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  deleteLiveCategoryImage,
  deleteLiveVideo,
  deleteProductImage,
  uploadLive,
  uploadLiveCategory,
} from "../../middleware/multer.js";
import { updateField } from "../../common/update-field.js";
import {
  eraseProductFromLiveCalender,
  findLiveCalender,
  findLiveCalenderAll,
  findLiveCalenderByProductId,
  putLiveCalender,
  saveLiveCalender,
} from "./repositories/live-calander.repo.js";

//ShoppingLiveProduct
export const createShoppingLiveProduct = async (body, files) => {
  const shoppingLiveCategoryId = mongoose.Types.ObjectId(
    body.shoppingLiveCategoryId
  );

  const videoName = `${uuidv4()}${path.extname(
    files.videoPath[0].originalname
  )}`;
  const videoPath = process.env.SHOPPING_LIVE_PRODUCT_VIDEO_URL + videoName;

  const imageName = [];
  const imagePaths = files.imgPath.map((file) => {
    const image = `${uuidv4()}${path.extname(file.originalname)}`;
    imageName.push(image);
    return process.env.PRODUCT_IMG_URL + image;
  });

  const store = { ...body, videoPath };
  for (let i in store.product) {
    store.product[i].imgPath = imagePaths[i];
  }
  await uploadLive(videoName, imageName, files);
  const shoppingLive = await saveShoppingLive(store);

  await saveLiveIdCategory(shoppingLive._id, shoppingLiveCategoryId);
  return { status: true, message: "SUCCESS" };
};
export const findShoppingLive = async (productId) => {
  const validateProductId = mongoose.Types.ObjectId.isValid(productId);
  if (!validateProductId) {
    return { status: false, message: "INVALID_LIVE_ID" };
  }
  const productOId = mongoose.Types.ObjectId(productId);
  const product = await findShoppingLiveById(productOId);
  if (!product) {
    return { status: false, message: "IMPROPER_LIVE_ID" };
  }
  return { status: true, message: "SUCCESS", body: product };
};

export const removeShoppingLive = async (liveId) => {
  const validateStoreId = mongoose.Types.ObjectId.isValid(liveId);
  if (!validateStoreId) {
    return { status: false, message: "INVALID_LIVE_ID" };
  }
  const shoppingLive = await findShoppingLiveById(liveId);
  if (!shoppingLive) {
    return { status: false, message: "IMPROPER_LIVE_ID" };
  }
  for (const product of shoppingLive.product) {
    await deleteProductImage(product);
  }
  await deleteLiveVideo(shoppingLive.videoPath);
  await eraseShoppingLive(liveId);
  return { status: true, message: "SUCCESS", deleted: shoppingLive };
};

export const updateShoppingLive = async (body, files, liveId, shoppingLive) => {
  shoppingLive = JSON.parse(JSON.stringify(shoppingLive));
  let liveBody = { ...body };
  if (Object.keys(files).length) {
    let videoPath;
    let videoName;
    if (files.videoPath) {
      videoName = `${uuidv4()}${path.extname(files.videoPath[0].originalname)}`;
      videoPath = process.env.SHOPPING_LIVE_PRODUCT_VIDEO_URL + videoName;
      liveBody.videoPath = videoPath;
    }

    let imageName = [];
    let imagePaths;
    if (files.imgPath) {
      imagePaths = files.imgPath.map((file) => {
        const image = `${uuidv4()}${path.extname(file.originalname)}`;
        imageName.push(image);
        return process.env.PRODUCT_IMG_URL + image;
      });
      for (let i in body.product) {
        liveBody.product[i].imgPath = imagePaths[i];
      }
    }
    await deleteLiveVideo(shoppingLive.videoPath);
    for (const product of shoppingLive.product) {
      await deleteProductImage(product);
    }

    await uploadLive(videoName, imageName, files);
  }
  updateField(liveBody, shoppingLive);

  await editShoppingLive(liveBody, liveId);
  return { status: true, message: "SUCCESS", body: shoppingLive };
};

//ShoppingLiveCategory
export const createShoppingLiveCategory = async (body, file) => {
  const imageName = `${uuidv4()}${path.extname(file.originalname)}`;
  const imgPath = process.env.SHOPPING_LIVE_CATEGORY_IMG_URL + imageName;
  const category = { ...body, imgPath };
  await saveShoppingLiveCategory(category);
  await uploadLiveCategory(imageName, file);
  return { status: true, message: "SUCCESS" };
};

export const findShoppingLiveCategory = async (categoryId) => {
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  const category = await findShoppingLiveCategoryById(categoryId);
  if (!category) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  return { status: true, message: "SUCCESS", body: category };
};

export const findProductFromCategory = async (categoryId) => {
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  const category = await findShoppingLiveCategoryById(categoryId);
  if (!category) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  const id = mongoose.Types.ObjectId(categoryId);
  const allLive = await getAllProduct(id);

  return { status: true, message: "SUCCESS", body: allLive };
};

export const removeShoppingLiveCategory = async (categoryId) => {
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  const category = await findShoppingLiveCategoryById(categoryId);
  if (!category) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  await deleteLiveCategoryImage(category);
  await eraseShoppingLiveCategory(categoryId);
  return { status: true, message: "SUCCESS", deleted: category };
};

export const updateShoppingLiveCategory = async (body, file, id, category) => {
  category = JSON.parse(JSON.stringify(category));
  let editCategory = { ...body };
  if (file) {
    let imageName = `${uuidv4()}${path.extname(file.originalname)}`;
    editCategory.imgPath =
      process.env.SHOPPING_LIVE_CATEGORY_IMG_URL + imageName;

    await deleteLiveCategoryImage(category);
    await uploadLiveCategory(imageName, file);
  }
  updateField(editCategory, category);

  await editShoppingLiveCategory(editCategory, id);
  return { status: true, message: "SUCCESS", body: editCategory };
};

//categoryYN
export const updateEncoreTrue = async (id) => {
  const validateShoppingId = mongoose.Types.ObjectId.isValid(id);
  if (!validateShoppingId) {
    return { status: false, message: "INVALID_LIVE_ID" };
  }
  const live = await findShoppingLiveById(id);
  if (!live) {
    return { status: false, message: "IMPROPER_LIVE_ID" };
  }
  if (!live.examineYN) {
    return { status: false, message: "EXAMINE_FALSE" };
  }
  await editEncoreTrue(id);

  return { status: true, message: "SUCCESS" };
};

export const updateFunTrue = async (id) => {
  const validateShoppingId = mongoose.Types.ObjectId.isValid(id);
  if (!validateShoppingId) {
    return { status: false, message: "INVALID_LIVE_ID" };
  }
  const live = await findShoppingLiveById(id);
  if (!live) {
    return { status: false, message: "IMPROPER_LIVE_ID" };
  }
  if (!live.examineYN) {
    return { status: false, message: "EXAMINE_FALSE" };
  }
  await editFunTrue(id);

  return { status: true, message: "SUCCESS" };
};

export const updateDessertTrue = async (id) => {
  const validateShoppingId = mongoose.Types.ObjectId.isValid(id);
  if (!validateShoppingId) {
    return { status: false, message: "INVALID_LIVE_ID" };
  }
  const live = await findShoppingLiveById(id);
  if (!live) {
    return { status: false, message: "IMPROPER_LIVE_ID" };
  }
  if (!live.examineYN) {
    return { status: false, message: "EXAMINE_FALSE" };
  }
  await editDessertTrue(id);

  return { status: true, message: "SUCCESS" };
};

export const updateDeliciousTrue = async (id) => {
  const validateShoppingId = mongoose.Types.ObjectId.isValid(id);
  if (!validateShoppingId) {
    return { status: false, message: "INVALID_LIVE_ID" };
  }
  const live = await findShoppingLiveById(id);
  if (!live) {
    return { status: false, message: "IMPROPER_LIVE_ID" };
  }
  if (!live.examineYN) {
    return { status: false, message: "EXAMINE_FALSE" };
  }
  await editDeliciousTrue(id);

  return { status: true, message: "SUCCESS" };
};

export const updateExamineYN = async (id) => {
  const validateShoppingId = mongoose.Types.ObjectId.isValid(id);
  if (!validateShoppingId) {
    return { status: false, message: "INVALID_LIVE_ID" };
  }
  const live = await findShoppingLiveById(id);
  if (!live) {
    return { status: false, message: "IMPROPER_LIVE_ID" };
  }
  live.examineYN = true;
  await editShoppingLive(live, id);
  return { status: true, message: "SUCCESS", body: live };
};

//liveCalender
export const createLiveCalender = async (body) => {
  let calenderDetail = { ...body };
  let calender = await findLiveCalender(new Date(calenderDetail.detail.date));
  if (calender.length <= 0) {
    calenderDetail["date"] = new Date(calenderDetail.detail.date);
    await saveLiveCalender(calenderDetail);
  } else {
    const nameCheck = calender.detail.filter(
      (product) =>
        product.productId.toString() ===
        calenderDetail.detail.productId.toString()
    );
    if (nameCheck.length > 0) {
      return { status: false, message: "DUPLICATED_NAME" };
    }
    await putLiveCalender(calender._id, calenderDetail);
  }
  return { status: true, message: "SUCCESS", body: calenderDetail };
};

export const findLiveCalenderOrder = async () => {
  const calender = await findLiveCalenderAll();
  calender.sort((a, b) => new Date(a.date) - new Date(b.date));

  return { status: true, message: "SUCCESS", body: calender };
};

export const updateDate = async (body, id) => {
  const validateShoppingId = mongoose.Types.ObjectId.isValid(id);
  if (!validateShoppingId) {
    return { status: false, message: "INVALID_LIVE_ID" };
  }
  let calender = await findLiveCalenderByProductId(id);
  let product = calender.detail.filter(
    (product) => product.productId.toString() === id.toString()
  )[0];
  if (!product) {
    return { status: false, message: "IMPROPER_LIVE_ID" };
  }
  await eraseProductFromLiveCalender(product.date, id);
  product.date = body.date;
  product = { detail: product };
  const duplicatedDate = await findLiveCalender(body.date);
  if (duplicatedDate) {
    await putLiveCalender(duplicatedDate._id, product);
  } else {
    product = { date: new Date(product.date), detail: product };
    await saveLiveCalender(product);
  }
  return { status: true, message: "SUCCESS", body: product };
};
