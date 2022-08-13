import { storeRouter } from "../api/store/store.router.js";
import { ApiError } from "../common/api-error.js";

export const routerV1 = (app) => {
  app.use("/api/v1/store", storeRouter());
  app.use((err, req, res, next) => {
    ApiError(err, res, err.cause);
    next();
  });
};
