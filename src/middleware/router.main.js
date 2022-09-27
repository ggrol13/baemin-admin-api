import { storeRouter } from "../api/store/store.router.js";
import { ApiError } from "../common/api-error.js";
import { shoppingLiveRouter } from "../api/shopping-live/shopping-live.router.js";
import { bMartRouter } from "../api/b-mart/b-mart.router.js";
import express from "express";

export const routerV1 = (app) => {
  const router = express.Router();
  app.use("/admin", router);
  router.use("/api/v1/store", storeRouter());
  router.use("/api/v1/shoppingLive", shoppingLiveRouter());
  router.use("/api/v1/bMart", bMartRouter());

  app.use((err, req, res, next) => {
    ApiError(err, res, err.cause);
    next();
  });
};
