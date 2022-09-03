import express from "express";
import {
  deleteShoppingLive,
  deleteShoppingLiveCategory,
  enrollLiveCalender,
  getLiveCalender,
  getProductFromCategory,
  getShoppingLive,
  getShoppingLiveCategory,
  insertShoppingLive,
  insertShoppingLiveCategory,
  putCalenderDate,
  putDeliciousTrue,
  putDessertTrue,
  putEncoreTrue,
  putExamineTrue,
  putFunTrue,
  putShoppingLive,
  putShoppingLiveCategory,
} from "./shopping-live.controller.js";
import {
  uploadPutShoppingLive,
  uploadPutShoppingLiveCategory,
  uploadShoppingLive,
  uploadShoppingLiveCategory,
} from "../../middleware/multer.js";

export const shoppingLiveRouter = () => {
  const router = express.Router();
  //shoppingLive
  router.post(
    "/",
    uploadShoppingLive.fields([{ name: "videoPath" }, { name: "imgPath" }]),
    insertShoppingLive
  );
  router.get("/:shoppingLiveId", getShoppingLive);
  router.delete("/:shoppingLiveId", deleteShoppingLive);
  router.put(
    "/:shoppingLiveId",
    uploadPutShoppingLive.fields([{ name: "videoPath" }, { name: "imgPath" }]),
    putShoppingLive
  );

  //shoppingLiveCategory
  router.post(
    "/category",
    uploadShoppingLiveCategory.single("imgPath"),
    insertShoppingLiveCategory
  );
  router.get("/category/:shoppingLiveCategoryId", getShoppingLiveCategory);
  router.delete(
    "/category/:shoppingLiveCategoryId",
    deleteShoppingLiveCategory
  );
  router.put(
    "/category/:shoppingLiveCategoryId",
    uploadPutShoppingLiveCategory.single("imgPath"),
    putShoppingLiveCategory
  );

  //liveCalender
  router.post("/liveCalender", enrollLiveCalender);
  router.get(
    "/category/product/:shoppingLiveCategoryId",
    getProductFromCategory
  );
  router.put("/liveCalender/date/:shoppingId", putCalenderDate);

  router.get("/liveCalender/all", getLiveCalender);
  router.put("/examine/:shoppingId", putExamineTrue);
  router.put("/specialCategory/encore/:shoppingId", putEncoreTrue);
  router.put("/specialCategory/fun/:shoppingId", putFunTrue);
  router.put("/specialCategory/dessert/:shoppingId", putDessertTrue);
  router.put("/specialCategory/delicious/:shoppingId", putDeliciousTrue);

  return router;
};
