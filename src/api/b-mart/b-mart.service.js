import {
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
  findProductById,
  saveBMartProduct,
} from "./repositories/product.repo.js";

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
  const productSaved = await saveBMartProduct(product);
  await saveBMartProductId(productSaved._id, product.categoryId);
  return { status: true, message: "SUCCESS" };
};

export const findBMartProduct = async (id) => {
  const validateProductId = mongoose.Types.ObjectId.isValid(id);
  if (!validateProductId) {
    return { status: false, message: "INVALID_PRODUCT_ID" };
  }
  const product = await findProductById(id);
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
  const product = await findProductById(id);
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
  return { status: true, message: "SUCCESS" };
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
