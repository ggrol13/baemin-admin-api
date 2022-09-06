import express from "express";
import {
  deleteBMartCategory,
  deleteBMartEvent,
  deleteBMartProduct,
  deleteBMartProductFromEvent,
  deleteBMartSaleProduct,
  examineBMartProduct,
  getBMartCategory,
  getBMartEvent,
  getBMartProduct,
  getBMartProductsFromCategory,
  getBMartSaleProduct,
  insertBMartCategory,
  insertBMartEvent,
  insertBMartProduct,
  insertBMartSaleProduct,
  putBMartCategory,
  putBMartEvent,
  putBMartProduct,
  putBMartSaleProduct,
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

  //productExamine
  router.put("/product/examine/:productId", examineBMartProduct);

  //event
  router.post("/event", insertBMartEvent);
  router.get("/event/:eventId", getBMartEvent);
  router.delete("/event/:eventId", deleteBMartEvent);
  router.put("/event/:eventId", putBMartEvent);
  router.delete(
    "/event/product/:eventId/:productId",
    deleteBMartProductFromEvent
  );

  //sale
  router.post("/sale", insertBMartSaleProduct);
  router.get("/sale", getBMartSaleProduct);
  router.put("/sale/:productId", putBMartSaleProduct);
  router.delete("/sale/:productId", deleteBMartSaleProduct);
  return router;
};
