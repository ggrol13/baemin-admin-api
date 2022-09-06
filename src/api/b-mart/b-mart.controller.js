import { ApiError } from "../../common/api-error.js";
import { BAD_REQUEST } from "../../common/http-code.js";
import { ApiSuccess } from "../../common/api-response.js";
import {
  createBMartCategory,
  createBMartEvent,
  createBMartProduct,
  createBMartSaleProduct,
  examineBMartProductTrue,
  findBMartCategory,
  findBMartEvent,
  findBMartProduct,
  findBMartProductsFromCategory,
  findBMartSaleProduct,
  removeBMartCategory,
  removeBMartEvent,
  removeBMartProduct,
  removeBMartProductFromEvent,
  removeBMartSaleProduct,
  updateBMartCategory,
  updateBMartEvent,
  updateBMartProduct,
  updateBMartSaleProduct,
} from "./b-mart.service.js";
import {
  bMartEventValidate,
  bMartSaleValidate,
  examineBMartProductValidate,
  putBMartCategoryValidate,
  putBMartEventValidate,
  putBMartProductValidate,
  putBMartSaleValidate,
} from "./b-mart.validation.js";

//bMartProduct
export const insertBMartProduct = async (req, res) => {
  if (!Object.keys(req.files).length) {
    await ApiError(BAD_REQUEST, res, "No_File");
    return;
  }
  const returnValues = await createBMartProduct(req.body, req.files);

  await ApiSuccess(returnValues, req.body, res);
};

export const getBMartProduct = async (req, res) => {
  const returnValues = await findBMartProduct(req.params.productId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const deleteBMartProduct = async (req, res) => {
  const returnValues = await removeBMartProduct(req.params.productId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const putBMartProduct = async (req, res) => {
  let product;
  if (!Object.keys(req.files).length) {
    product = await putBMartProductValidate(req, res);
    if (!product) {
      return;
    }
  } else {
    product = req.multer.bMartProduct;
  }
  const returnValues = await updateBMartProduct(
    req.body,
    req.files,
    req.params.productId,
    product
  );
  await ApiSuccess(returnValues, returnValues.body, res);
};

//bMartCategory
export const insertBMartCategory = async (req, res) => {
  if (!req.file) {
    await ApiError(BAD_REQUEST, res, "No_File");
    return;
  }
  const returnValues = await createBMartCategory(req.body, req.file);
  await ApiSuccess(returnValues, req.body, res);
};
export const getBMartCategory = async (req, res) => {
  const returnValues = await findBMartCategory(req.params.bMartCategoryId);

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const deleteBMartCategory = async (req, res) => {
  const returnValues = await removeBMartCategory(req.params.bMartCategoryId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }

  await ApiSuccess(returnValues, returnValues.deleted, res);
};

export const putBMartCategory = async (req, res) => {
  let category;
  if (!req.file) {
    category = await putBMartCategoryValidate(req, res);
    if (!category) {
      return;
    }
  } else {
    category = req.multer.bMartCategory;
  }

  const returnValues = await updateBMartCategory(
    req.body,
    req.file,
    req.params.bMartCategoryId,
    category
  );

  await ApiSuccess(returnValues, req.body, res);
};

export const getBMartProductsFromCategory = async (req, res) => {
  const returnValues = await findBMartProductsFromCategory(
    req.params.bMartCategoryId
  );

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

//productExamine
export const examineBMartProduct = async (req, res) => {
  const error = examineBMartProductValidate.validate(req.body);
  if (error.length > 0) {
    await ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }

  const returnValues = await examineBMartProductTrue(
    req.params.productId,
    req.body
  );
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

//event
export const insertBMartEvent = async (req, res) => {
  const error = bMartEventValidate.validate(req.body);
  if (error.length > 0) {
    await ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }

  const returnValues = await createBMartEvent(req.body);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const getBMartEvent = async (req, res) => {
  const returnValues = await findBMartEvent(req.params.eventId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const deleteBMartEvent = async (req, res) => {
  const returnValues = await removeBMartEvent(req.params.eventId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const putBMartEvent = async (req, res) => {
  const error = putBMartEventValidate.validate(req.body);
  if (error.length > 0) {
    await ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }
  const returnValues = await updateBMartEvent(req.body, req.params.eventId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const deleteBMartProductFromEvent = async (req, res) => {
  const returnValues = await removeBMartProductFromEvent(
    req.params.eventId,
    req.params.productId
  );
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

//sale
export const insertBMartSaleProduct = async (req, res) => {
  const error = bMartSaleValidate.validate(req.body);
  if (error.length > 0) {
    await ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }
  const returnValues = await createBMartSaleProduct(req.body);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const getBMartSaleProduct = async (req, res) => {
  const returnValues = await findBMartSaleProduct();
  await ApiSuccess(returnValues, returnValues.body, res);
};
export const deleteBMartSaleProduct = async (req, res) => {
  const returnValues = await removeBMartSaleProduct(req.params.productId);
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};

export const putBMartSaleProduct = async (req, res) => {
  const error = putBMartSaleValidate.validate(req.body);
  if (error.length > 0) {
    await ApiError(BAD_REQUEST, res, error[0].message);
    return;
  }

  const returnValues = await updateBMartSaleProduct(
    req.body,
    req.params.productId
  );
  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};
