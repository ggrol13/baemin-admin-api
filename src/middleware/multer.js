import multer from "multer";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  menuFilter,
  putMenuFilter,
  putStoreCategoryFilter,
  storeCategoryFilter,
} from "./store/validation.js";

const storeCategory = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.IMG_PATH + "storeCategory");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname)); // 파일 원본이름 저장
  },
});

const menu = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.IMG_PATH + "menu");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname)); // 파일 원본이름 저장
  },
});

export const filterTypes = (req, file) => {
  const types = /png|jpg|jpeg|gif|webp|svg/;
  const extName = types.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = types.test(file.mimetype);
  return extName && mimetype;
};

// const fileFilter = (req, file, cb) => {
//   // mime type 체크하여 원하는 타입만 필터링
//   // 여기에 validation 추가
//   //문제:fileFilter를 여러개 만들어야함;
//   //validate 할 로직 작성
//
//   if (filterTypes(req, file)) {
//     cb(null, true);
//   } else {
//     req.storeCategoryValidation = "Error!Error! Error!";
//     return cb(null, false);
//   }
// };

export const uploadStoreCategory = multer({
  storage: storeCategory,
  fileFilter: storeCategoryFilter,
});

export const uploadMenu = multer({
  storage: menu,
  fileFilter: menuFilter,
});

export const uploadPutStoreCategory = multer({
  storage: storeCategory,
  fileFilter: putStoreCategoryFilter,
});

export const uploadPutMenu = multer({
  storage: menu,
  fileFilter: putMenuFilter,
});
