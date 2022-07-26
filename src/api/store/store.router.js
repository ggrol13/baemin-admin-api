import express from "express";
import {
  getStoreCategory,
  insertMenu,
  insertMenuCategory,
  insertStore,
  insertStoreCategory,
} from "./store.controller.js";

export const storeRouter = () => {
  const router = express.Router();
  router.get("/storeCategory/:storeCategoryId", getStoreCategory);
  router.post("/", insertStore); //들어갈 데이터는 path param으로 쓰지 않음
  router.post("/menuCategory/:storeId", insertMenuCategory);
  router.post("/menu/:storeId/:categoryId", insertMenu);
  router.post("/storeCategory", insertStoreCategory);
  return router;
};
