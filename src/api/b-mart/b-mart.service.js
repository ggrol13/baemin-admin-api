import {
  deleteBMartProductId,
  editBMartCategory,
  eraseBMartCategory,
  findAllBMartProducts,
  findBMartCategoryById,
  saveBMartCategory,
  saveBMartProductId,
} from "./repositories/product-category.repo.js";
import {
  deleteBMartCategoryImage,
  deleteBMartProductImage,
  uploadBMartCategory,
  uploadBMartProduct,
} from "../../middleware/multer.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

import path from "path";
import { updateField } from "../../common/update-field.js";
import {
  editBMartProduct,
  eraseBMartProduct,
  findBMartProductAllExamined,
  findBMartProductById,
  saveBMartProduct,
  setBMartProductExamine,
} from "./repositories/product.repo.js";
import {
  editBMartEvent,
  eraseBMartEvent,
  eraseBMartProductFromEvent,
  findBMartEventAllProducts,
  findBMartEventById,
  findBMartEventByName,
  saveBMartEvent,
} from "./repositories/b-mart-event.repo.js";
import {
  editBMartSaleProduct,
  eraseBMartSaleProduct,
  findAllBMartSaleProducts,
  findSaleProduct,
  saveBMartSaleProduct,
} from "./repositories/product-sale.repo.js";

//bMartProduct
export const createBMartProduct = async (body, files) => {
  const images = files.map((image) => {
    const name = uuidv4() + path.extname(image.originalname);
    return {
      path: process.env.B_MART_PRODUCT_IMG_URL + name,
      imageName: name,
      number: files.indexOf(image) + 1,
    };
  });
  const product = { ...body, imgPath: images };
  await uploadBMartProduct(images, files);
  await saveBMartProduct(product);
  return { status: true, message: "SUCCESS" };
};

export const findBMartProduct = async (id) => {
  const validateProductId = mongoose.Types.ObjectId.isValid(id);
  if (!validateProductId) {
    return { status: false, message: "INVALID_PRODUCT_ID" };
  }
  const product = await findBMartProductById(id);
  if (!product) {
    return { status: false, message: "IMPROPER_PRODUCT_ID" };
  }
  return { status: true, message: "SUCCESS", body: product };
};

export const removeBMartProduct = async (id) => {
  const validateProductId = mongoose.Types.ObjectId.isValid(id);
  if (!validateProductId) {
    return { status: false, message: "INVALID_PRODUCT_ID" };
  }
  const product = await findBMartProductById(id);
  if (!product) {
    return { status: false, message: "IMPROPER_PRODUCT_ID" };
  }

  await eraseBMartProduct(id);
  for (const path of product.imgPath) {
    await deleteBMartProductImage(path);
  }

  return { status: true, message: "SUCCESS", body: product };
};

export const updateBMartProduct = async (body, files, productId, product) => {
  product = JSON.parse(JSON.stringify(product));
  let productBody = { ...body };
  if (Object.keys(files).length) {
    let images;
    if (JSON.parse(productBody.check.edit)) {
      images = files.map((image) => {
        const name = uuidv4() + path.extname(image.originalname);
        return {
          path: process.env.B_MART_PRODUCT_IMG_URL + name,
          imageName: name,
          number: productBody.check.number,
        };
      });
      const match = [];
      const notMatch = product.imgPath.filter((image) => {
        if (image.number.toString() === productBody.check.number) {
          match.push(image);
        }
        return image.number.toString() !== productBody.check.number;
      });

      const array = [...images, ...notMatch];
      array.sort((a, b) => a.number - b.number);
      productBody = { ...body, imgPath: array };
      await deleteBMartProductImage(match[0]);
    }
    if (JSON.parse(productBody.check.push)) {
      images = files.map((image) => {
        const name = uuidv4() + path.extname(image.originalname);
        return {
          path: process.env.B_MART_PRODUCT_IMG_URL + name,
          imageName: name,
          number: product.imgPath.length + 1,
        };
      });
      const array = [...product.imgPath, ...images];
      productBody = { ...body, imgPath: array };
    }
    await uploadBMartProduct(images, files);
  }
  await updateField(productBody, product);
  await editBMartProduct(productBody, productId);
  return { status: true, message: "SUCCESS", body: productBody };
};

//bMartCategory
export const createBMartCategory = async (body, file) => {
  const imageName = `${uuidv4()}${path.extname(file.originalname)}`;
  const imgPath = process.env.B_MART_CATEGORY_IMG_URL + imageName;
  const category = { ...body, imgPath: imgPath };
  await saveBMartCategory(category);
  await uploadBMartCategory(imageName, file);
  return { status: true, message: "SUCCESS", body };
};

export const findBMartCategory = async (categoryId) => {
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  const category = await findBMartCategoryById(categoryId);
  if (!category) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  return { status: true, message: "SUCCESS", body: category };
};

export const removeBMartCategory = async (categoryId) => {
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  const category = await findBMartCategoryById(categoryId);
  if (!category) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }
  await eraseBMartCategory(categoryId);
  await deleteBMartCategoryImage(category);
  return { status: true, message: "SUCCESS", deleted: category };
};

export const updateBMartCategory = async (body, file, id, category) => {
  category = JSON.parse(JSON.stringify(category));
  let editCategory = { ...body };
  if (file) {
    let imageName = `${uuidv4()}${path.extname(file.originalname)}`;
    editCategory.imgPath = process.env.B_MART_CATEGORY_IMG_URL + imageName;

    await deleteBMartCategoryImage(category);
    await uploadBMartCategory(imageName, file);
  }
  updateField(editCategory, category);

  await editBMartCategory(editCategory, id);
  return { status: true, message: "SUCCESS", body: editCategory };
};

export const findBMartProductsFromCategory = async (categoryId) => {
  const validateCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
  if (!validateCategoryId) {
    return { status: false, message: "INVALID_CATEGORY_ID" };
  }
  const category = await findBMartCategoryById(categoryId);
  if (!category) {
    return { status: false, message: "IMPROPER_CATEGORY_ID" };
  }

  const allProducts = await findAllBMartProducts(
    mongoose.Types.ObjectId(categoryId)
  );
  return { status: true, message: "SUCCESS", body: allProducts };
};

//bMartProductExamine
export const examineBMartProductTrue = async (id, body) => {
  const validateProductId = mongoose.Types.ObjectId.isValid(id);
  if (!validateProductId) {
    return { status: false, message: "INVALID_PRODUCT_ID" };
  }

  const product = await findBMartProductById(id);
  if (!product) {
    return { status: false, message: "IMPROPER_PRODUCT_ID" };
  }
  await setBMartProductExamine(id, JSON.parse(body.examineYN));
  if (JSON.parse(body.examineYN)) {
    await saveBMartProductId(product._id, product.categoryId);
  } else {
    await deleteBMartProductId(product._id, product.categoryId);
  }

  return { status: true, message: "SUCCESS", body };
};

//event
export const createBMartEvent = async (body) => {
  if (await findBMartEventByName(body.name)) {
    return { status: false, message: "DUPLICATED_NAME" };
  }
  await saveBMartEvent(body);
  return { status: true, message: "SUCCESS", body };
};

export const findBMartEvent = async (id) => {
  const validateEventId = mongoose.Types.ObjectId.isValid(id);
  if (!validateEventId) {
    return { status: false, message: "INVALID_EVENT_ID" };
  }

  const bMartEvent = await findBMartEventAllProducts(
    mongoose.Types.ObjectId(id)
  );
  if (!bMartEvent) {
    return { status: false, message: "IMPROPER_PRODUCT_ID" };
  }
  return { status: true, message: "SUCCESS", body: bMartEvent };
};

export const removeBMartEvent = async (id) => {
  const validateEventId = mongoose.Types.ObjectId.isValid(id);
  if (!validateEventId) {
    return { status: false, message: "INVALID_EVENT_ID" };
  }
  return { status: true, message: "SUCCESS", body: await eraseBMartEvent(id) };
};

export const updateBMartEvent = async (body, id) => {
  const validateEventId = mongoose.Types.ObjectId.isValid(id);
  if (!validateEventId) {
    return { status: false, message: "INVALID_EVENT_ID" };
  }
  let event = await findBMartEventById(id);
  if (!event) {
    return { status: false, message: "IMPROPER_EVENT_ID" };
  }

  const eventBody = { ...body };
  let products = await findBMartProductAllExamined();
  if (eventBody.productId) {
    products = products.map((a) => a._id.toString());
    products = products.filter((a) => eventBody.productId.includes(a));
    const duplicated = event.productId.filter((id) =>
      products.includes(id.toString())
    );
    if (duplicated.length > 0) {
      return { status: false, message: "DUPLICATED_PRODUCT" };
    }
    eventBody.productId = products;
    for (const id of event.productId) {
      products.indexOf(id) === -1
        ? eventBody.productId.push(id)
        : { status: false, message: "DUPLICATED_PRODUCT" };
    }
  }
  event = JSON.parse(JSON.stringify(event));
  await updateField(eventBody, event);

  await editBMartEvent(eventBody, id);
  return { status: true, message: "SUCCESS", body: eventBody };
};

export const removeBMartProductFromEvent = async (eventId, productId) => {
  const validateEventId = mongoose.Types.ObjectId.isValid(eventId);
  if (!validateEventId) {
    return { status: false, message: "INVALID_EVENT_ID" };
  }
  const validateProductId = mongoose.Types.ObjectId.isValid(productId);
  if (!validateProductId) {
    return { status: false, message: "INVALID_PRODUCT_ID" };
  }
  const event = await findBMartEventById(eventId);
  if (!event) {
    return { status: false, message: "IMPROPER_EVENT_ID" };
  }
  const product = await findBMartProductById(productId);
  if (!product) {
    return { status: false, message: "IMPROPER_PRODUCT_ID" };
  }

  const result = await eraseBMartProductFromEvent(eventId, productId);
  return {
    status: true,
    message: "SUCCESS",
    body: result,
  };
};

//sale
export const createBMartSaleProduct = async (body) => {
  const validateProductId = mongoose.Types.ObjectId.isValid(body.productId);
  if (!validateProductId) {
    return { status: false, message: "INVALID_PRODUCT_ID" };
  }
  const product = await findBMartProductById(body.productId);
  if (!product) {
    return { status: false, message: "IMPROPER_PRODUCT_ID" };
  }
  if (!product.examineYN) {
    return { status: false, message: "EXAMINE_FALSE" };
  }
  const saleProduct = await findSaleProduct(body.productId);
  if (saleProduct) {
    return { status: false, message: "DUPLICATED_PRODUCT" };
  }
  const saved = await saveBMartSaleProduct(body);
  return { status: true, message: "SUCCESS", body: saved };
};

export const findBMartSaleProduct = async () => {
  const allProduct = await findAllBMartSaleProducts();
  return { status: true, message: "SUCCESS", body: allProduct };
};

export const removeBMartSaleProduct = async (id) => {
  return {
    status: true,
    message: "SUCCESS",
    body: await eraseBMartSaleProduct(id),
  };
};

export const updateBMartSaleProduct = async (body, id) => {
  const validateProductId = mongoose.Types.ObjectId.isValid(id);
  if (!validateProductId) {
    return { status: false, message: "INVALID_PRODUCT_ID" };
  }
  let sale = await findSaleProduct(id);
  if (!sale) {
    return { status: false, message: "IMPROPER_PRODUCT_ID" };
  }
  sale = JSON.parse(JSON.stringify(sale));

  const saleBody = { ...body };
  await updateField(saleBody, sale);
  await editBMartSaleProduct(saleBody, id);
  return { status: true, message: "SUCCESS", body: saleBody };
};
