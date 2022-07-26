import { ApiError, ApiSuccess } from "../../common/api-response.js";
import {
  createMenu,
  createMenuCategory,
  createStore,
  createStoreCategory,
  findStoreCategory,
} from "./store.service.js";
import { validate } from "../../common/validate.js";
import { BAD_REQUEST } from "../../common/http-code.js";

export const insertStore = async (req, res) => {
  const validateKey = {
    name: { nullable: false },
    phone: { nullable: false },
    address: { nullable: false },
    minimumPrice: { nullable: true },
    paymentMethod: { nullable: false },
    deliveryTime: { nullable: true },
    deliveryTip: { nullable: true },
    info: { nullable: false },
    storeCategoryId: { nullable: false },
  };

  if (!validate(req.body, validateKey, res)) {
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
  //categoryId가 없는경우도 생각
  const validateKey = {
    menuCategory: {
      menu: [
        {
          name: { nullable: false },
          price: { nullable: false },
          imgPath: { nullable: true },
          options: [
            {
              name: { nullable: false },
              price: { nullable: false },
            },
          ],
        },
      ],
    },
  };
  if (!validate(req.body, validateKey, res)) {
    return;
  }

  const returnValues = await createMenu(
    req.body,
    req.params.categoryId,
    req.params.storeId
  );

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }

  await ApiSuccess(returnValues, req.body, res);
};

export const insertMenuCategory = async (req, res) => {
  const validateKey = { name: { nullable: false } };
  if (!validate(req.body, validateKey, res)) {
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
  const validateKey = {
    name: { nullable: false },
    imgPath: { nullable: false },
    storeId: [{ nullable: true }],
  };

  if (!validate(req.body, validateKey, res)) {
    return;
  }

  const returnValues = await createStoreCategory(req.body);

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, req.body, res);
};

export const getStoreCategory = async (req, res) => {
  const returnValues = await findStoreCategory(req.params.storeCategoryId);

  if (!returnValues.status) {
    await ApiError(BAD_REQUEST, res, returnValues.message);
    return;
  }
  await ApiSuccess(returnValues, returnValues.body, res);
};
