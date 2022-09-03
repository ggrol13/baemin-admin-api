import express from "express";
import {
  deleteBMartCategory,
  deleteBMartProduct,
  getBMartCategory,
  getBMartProduct,
  getBMartProductsFromCategory,
  insertBMartCategory,
  insertBMartProduct,
  putBMartCategory,
  putBMartProduct,
} from "./b-mart.controller.js";
import {
  putUploadMartProduct,
  uploadMartCategory,
  uploadMartProduct,
  uploadPutMartCategory,
} from "../../middleware/multer.js";
export const bMartRouter = () => {
  const router = express.Router();
  //bMartProduct
  router.post(
    "/product",
    uploadMartProduct.array("imgPath"),
    insertBMartProduct
  );
  router.get("/product/:productId", getBMartProduct);
  router.delete("/product/:productId", deleteBMartProduct);
  router.put(
    "/product/:productId",
    putUploadMartProduct.array("imgPath"),
    putBMartProduct
  );

  //bMartCategory
  router.post(
    "/category",
    uploadMartCategory.single("imgPath"),
    insertBMartCategory
  );
  router.get("/category/:bMartCategoryId", getBMartCategory);
  router.delete("/category/:bMartCategoryId", deleteBMartCategory);
  router.put(
    "/category/:bMartCategoryId",
    uploadPutMartCategory.single("imgPath"),
    putBMartCategory
  );

  router.get(
    "/category/allProduct/:bMartCategoryId",
    getBMartProductsFromCategory
  );
  return router;
};
