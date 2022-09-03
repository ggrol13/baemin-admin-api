import { storeRouter } from "../api/store/store.router.js";
import { ApiError } from "../common/api-error.js";
import { shoppingLiveRouter } from "../api/shopping-live/shopping-live.router.js";
import { bMartRouter } from "../api/b-mart/b-mart.router.js";

export const routerV1 = (app) => {
  app.use("/api/v1/store", storeRouter());
  app.use("/api/v1/shoppingLive", shoppingLiveRouter());
  app.use("/api/v1/bMart", bMartRouter());

  app.use((err, req, res, next) => {
    ApiError(err, res, err.cause);
    next();
  });
};
