import express from "express";
import {
  deleteMenu,
  deleteMenuCategory,
  deleteStore,
  deleteStoreCategory,
  getMenu,
  getMenuCategory,
  getStore,
  getStoreCategory,
  insertMenu,
  insertMenuCategory,
  insertStore,
  insertStoreCategory,
  putMenu,
  putMenuCategory,
  putStore,
  putStoreCategory,
} from "./store.controller.js";
import {
  uploadMenu,
  uploadPutMenu,
  uploadPutStoreCategory,
  uploadStoreCategory,
} from "../../middleware/multer.js";
import { getImage } from "../image/getImage.js";

export const storeRouter = () => {
  const router = express.Router();
  router.get("/storeCategory/:storeCategoryId", getStoreCategory);
  router.get("/:storeId", getStore);
  router.get("/menu/:storeId/:categoryId/:menuId", getMenu);
  router.get("/menuCategory/:storeId/:categoryId", getMenuCategory);
  router.get("/image/menu/:name", getImage);
  router.get("/image/storeCategory/:name", getImage);

  router.post("/", insertStore); //들어갈 데이터는 path param으로 쓰지 않음
  router.post("/menuCategory/:storeId", insertMenuCategory);
  router.post(
    "/menu/:storeId/:categoryId",
    uploadMenu.array("imgPath"),
    insertMenu
  );
  router.post(
    "/storeCategory",
    uploadStoreCategory.single("imgPath"),
    insertStoreCategory
  );

  router.put("/:storeId", putStore);
  router.put(
    "/storeCategory/:categoryId",
    uploadPutStoreCategory.single("imgPath"),
    putStoreCategory
  );
  router.put(
    "/menu/:storeId/:categoryId/:menuId",
    uploadPutMenu.single("imgPath"),
    putMenu
  );
  router.put("/menuCategory/:storeId/:menuCategoryId", putMenuCategory);

  router.delete("/:storeId", deleteStore);
  router.delete("/storeCategory/:storeCategoryId", deleteStoreCategory);
  router.delete("/menuCategory/:storeId/:menuCategoryId", deleteMenuCategory);
  router.delete("/menu/:storeId/:categoryId/:menuId", deleteMenu);

  return router;
};
