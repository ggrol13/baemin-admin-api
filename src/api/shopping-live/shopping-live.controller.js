import { ApiError } from "../../common/api-error.js";
import { BAD_REQUEST } from "../../common/http-code.js";
import { ApiSuccess } from "../../common/api-response.js";
import {
  createLiveCalender,
  createShoppingLiveCategory,
  createShoppingLiveProduct,
  findLiveCalenderOrder,
  findProductFromCategory,
  findShoppingLive,
  findShoppingLiveCategory,
  removeShoppingLive,
  removeShoppingLiveCategory,
  updateDate,
  updateDeliciousTrue,
  updateDessertTrue,
  updateEncoreTrue,
  updateExamineYN,
  updateFunTrue,
  updateShoppingLive,
  updateShoppingLiveCategory,
} from "./shopping-live.service.js";
import {
  liveCalenderValidate,
  putCalenderDateValidate,
  putLiveCategoryValidate,
  putLiveValidate,
} from "./shopping-live.validate.js";

export const insertShoppingLiveCategory = async (req, res) => {
  if (!req.file) {
    await ApiError(BAD_REQUEST, res, "No_File");
    return;
  }
  const returnValues = await createShoppingLiveCategory(req.body, req.file);
  await ApiSuccess(returnValues, req.body, res);
};

export const insertShoppingLive = async (req, res) => {
  if (!req.files.videoPath || !req.files.imgPath) {
    await ApiError(BAD_REQUEST, res, "No_File");
    return;
  }

  const returnValues = await createShoppingLiveProduct(req.body, req.files);
  await ApiSuccess(returnValues, req.body, res); //body: data에 data가 적절히 들어가도록 body정보가져오기
};

export const getShoppingLive = async (req, res) => {
  const returnValues = await findShoppingLive(req.params.shoppingLiveId);

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const getShoppingLiveCategory = async (req, res) => {
  const returnValues = await findShoppingLiveCategory(
    req.params.shoppingLiveCategoryId
  );

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const deleteShoppingLive = async (req, res) => {
  const returnValues = await removeShoppingLive(req.params.shoppingLiveId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }

  await ApiSuccess(returnValues, returnValues.deleted, res);
};

export const deleteShoppingLiveCategory = async (req, res) => {
  const returnValues = await removeShoppingLiveCategory(
    req.params.shoppingLiveCategoryId
  );
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }

  await ApiSuccess(returnValues, returnValues.deleted, res);
};

export const putShoppingLive = async (req, res) => {
  let shoppingLive;
  if (!Object.keys(req.files).length) {
    shoppingLive = await putLiveValidate(req, res);
    if (!shoppingLive) {
      return;
    }
  } else {
    shoppingLive = req.multer.shoppingLive;
  }

  const returnValues = await updateShoppingLive(
    req.body,
    req.files,
    req.params.shoppingLiveId,
    shoppingLive
  );

  await ApiSuccess(returnValues, req.body, res);
};

export const putShoppingLiveCategory = async (req, res) => {
  let category;
  if (!req.file) {
    category = await putLiveCategoryValidate(req, res);
    if (!category) {
      return;
    }
  } else {
    category = req.multer.shoppingLiveCategory;
  }

  const returnValues = await updateShoppingLiveCategory(
    req.body,
    req.file,
    req.params.shoppingLiveCategoryId,
    category
  );

  await ApiSuccess(returnValues, req.body, res);
};

export const getProductFromCategory = async (req, res) => {
  const returnValues = await findProductFromCategory(
    req.params.shoppingLiveCategoryId
  );

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};
export const putEncoreTrue = async (req, res) => {
  const returnValues = await updateEncoreTrue(req.params.shoppingId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const putFunTrue = async (req, res) => {
  const returnValues = await updateFunTrue(req.params.shoppingId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const putDessertTrue = async (req, res) => {
  const returnValues = await updateDessertTrue(req.params.shoppingId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const putDeliciousTrue = async (req, res) => {
  const returnValues = await updateDeliciousTrue(req.params.shoppingId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const putExamineTrue = async (req, res) => {
  const returnValues = await updateExamineYN(req.params.shoppingId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const enrollLiveCalender = async (req, res) => {
  const error = liveCalenderValidate.validate(req.body);
  if (error.length > 0) {
    await ApiError(BAD_REQUEST, res, error[0].message);
  }

  const returnValues = await createLiveCalender(req.body);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const getLiveCalender = async (req, res) => {
  const returnValues = await findLiveCalenderOrder();
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const putCalenderDate = async (req, res) => {
  const error = putCalenderDateValidate.validate(req.body);
  if (error.length > 0) {
    await ApiError(BAD_REQUEST, res, error[0].message);
  }
  const returnValues = await updateDate(req.body, req.params.shoppingId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};
