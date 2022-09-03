import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  menuFilter,
  putMenuFilter,
  putStoreCategoryFilter,
  storeCategoryFilter,
} from "./store/validation.js";

import { fileURLToPath } from "url";
import {
  putShoppingLiveCategoryFilter,
  putShoppingLiveFilter,
  shoppingLiveCategoryFilter,
  shoppingLiveFilter,
} from "./shoppingLive/validation.js";
import {
  bMartCategoryFilter,
  bMartProductFilter,
  putBMartCategoryFilter,
  putBMartProductFilter,
} from "./bMart/validation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

aws.config.loadFromPath(__dirname + "/../config/s3.json");

const s3 = new aws.S3();

//Store
// const storeCategory = multerS3({
//   s3: s3,
//   bucket: "baeminclone/storeCategory",
//   acl: "public-read",
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   //key: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
//   key: (req, file, cb) =>
//     cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
// });

export const uploadCategoryStore = async (imageName, file) => {
  const imageParam = {
    Bucket: "baeminclone/storeCategory",
    Key: imageName,
    ACL: "public-read",
    ContentType: `image/${path.extname(imageName).substring(1)}`,
  };

  const base64data = Buffer.from(file.buffer, "binary");
  imageParam.Body = base64data;
  await s3.upload(imageParam).promise();
};
// const menu = multerS3({
//   s3: s3,
//   bucket: "baeminclone/menu",
//   acl: "public-read",
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   key: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
// });

export const deleteStoreCategoryImage = async (category) => {
  const stringArray = category.imgPath.split("/");
  const filePath = stringArray[4];
  const params = { Bucket: "baeminclone/storeCategory", Key: filePath };

  await s3
    .deleteObject(params, (err, data) => {
      if (err) {
        return err;
      } else {
        return data;
      }
    })
    .promise();
};

export const uploadMenuStore = async (imageName, files) => {
  for (const i in imageName) {
    const imageParams = {
      Bucket: "baeminclone/menu",
      Key: imageName[i],
      ACL: "public-read",
      ContentType: `image/${path.extname(imageName[i].substring(1))}`,
    };

    if (imageName[i]) {
      const base64data = Buffer.from(files[i].buffer, "binary");
      imageParams.Body = base64data;
      await s3.upload(imageParams).promise();
    }
  }
};

export const uploadPutMenuStore = async (imageName, file) => {
  const imageParam = {
    Bucket: "baeminclone/menu",
    Key: imageName,
    ACL: "public-read",
    ContentType: `image/${path.extname(imageName).substring(1)}`,
  };

  const base64data = Buffer.from(file.buffer, "binary");
  imageParam.Body = base64data;
  await s3.upload(imageParam).promise();
};

export const deleteMenuImage = async (menu) => {
  const stringArray = menu.imgPath.split("/");
  const filePath = stringArray[stringArray.length - 1];
  const params = { Bucket: "baeminclone/menu", Key: filePath };

  await s3
    .deleteObject(params, (err, data) => {
      if (err) {
        return err;
      } else {
        return data;
      }
    })
    .promise();
};

export const deletePutMenuImage = async (imgPath) => {
  const stringArray = imgPath.split("/");
  const filePath = stringArray[4];
  const params = { Bucket: "baeminclone/menu", Key: filePath };

  await s3
    .deleteObject(params, (err, data) => {
      if (err) {
        return err;
      } else {
        return data;
      }
    })
    .promise();
};

//ShoppingLive
export const uploadLive = async (videoName, imageName, files) => {
  if (videoName) {
    const videoParams = {
      Bucket: "baeminclone/shoppingLiveProduct/videoPath",
      Key: videoName,
      ACL: "public-read",
      ContentType: `video/${path.extname(videoName).substring(1)}`,
    };
    const base64data = Buffer.from(files.videoPath[0].buffer, "binary");
    videoParams.Body = base64data;
    await s3.upload(videoParams).promise();
  }
  for (const i in imageName) {
    const imageParams = {
      Bucket: "baeminclone/shoppingLiveProduct/imgPath",
      Key: imageName[i],
      ACL: "public-read",
      ContentType: `image/${path.extname(imageName[i]).substring(1)}`,
    };

    if (imageName) {
      const base64data = Buffer.from(files.imgPath[i].buffer, "binary");
      imageParams.Body = base64data;
      await s3.upload(imageParams).promise();
    }
  }
};

export const uploadLiveCategory = async (imageName, file) => {
  const imageParam = {
    Bucket: "baeminclone/shoppingLiveCategory",
    Key: imageName,
    ACL: "public-read",
    ContentType: `image/${path.extname(imageName).substring(1)}`,
  };

  const base64data = Buffer.from(file.buffer, "binary");
  imageParam.Body = base64data;
  await s3.upload(imageParam).promise();
};

export const deleteLiveVideo = async (videoPath) => {
  const stringArray = videoPath.split("/");
  const filePath = stringArray[stringArray.length - 1];
  const params = {
    Bucket: "baeminclone/shoppingLiveProduct/videoPath",
    Key: filePath,
  };

  await s3
    .deleteObject(params, (err, data) => {
      if (err) {
        return err;
      } else {
        return data;
      }
    })
    .promise();
};
export const deleteProductImage = async (product) => {
  const stringArray = product.imgPath[0].split("/");
  const filePath = stringArray[stringArray.length - 1];
  const params = {
    Bucket: "baeminclone/shoppingLiveProduct/imgPath",
    Key: filePath,
  };

  await s3
    .deleteObject(params, (err, data) => {
      if (err) {
        return err;
      } else {
        return data;
      }
    })
    .promise();
};

export const deleteLiveCategoryImage = async (category) => {
  const stringArray = category.imgPath.split("/");
  const filePath = stringArray[4];
  const params = { Bucket: "baeminclone/shoppingLiveCategory", Key: filePath };

  await s3
    .deleteObject(params, (err, data) => {
      if (err) {
        return err;
      } else {
        return data;
      }
    })
    .promise();
};

//BMart
export const uploadBMartProduct = async (images, files) => {
  for (const i in images) {
    const imageParams = {
      Bucket: "baeminclone/bMartProduct",
      Key: images[i].imageName,
      ACL: "public-read",
      ContentType: `image/${path.extname(images[i].imageName.substring(1))}`,
    };

    if (images[i].imageName) {
      const base64data = Buffer.from(files[i].buffer, "binary");
      imageParams.Body = base64data;
      await s3.upload(imageParams).promise();
    }
  }
};

export const deleteBMartProductImage = async (imgPath) => {
  const stringArray = imgPath.path.split("/");
  const filePath = stringArray[4];
  const params = { Bucket: "baeminclone/bMartProduct", Key: filePath };

  await s3
    .deleteObject(params, (err, data) => {
      if (err) {
        return err;
      } else {
        return data;
      }
    })
    .promise();
};

export const uploadBMartCategory = async (imageName, file) => {
  const imageParam = {
    Bucket: "baeminclone/bMartCategory",
    Key: imageName,
    ACL: "public-read",
    ContentType: `image/${path.extname(imageName).substring(1)}`,
  };

  const base64data = Buffer.from(file.buffer, "binary");
  imageParam.Body = base64data;
  await s3.upload(imageParam).promise();
};

export const deleteBMartCategoryImage = async (category) => {
  const stringArray = category.imgPath.split("/");
  const filePath = stringArray[4];
  const params = { Bucket: "baeminclone/bMartCategory", Key: filePath };

  await s3
    .deleteObject(params, (err, data) => {
      if (err) {
        return err;
      } else {
        return data;
      }
    })
    .promise();
};

//FilterTypes
export const imageFilterTypes = (req, file) => {
  const types = /png|jpg|jpeg|gif|webp|svg/;
  const extName = types.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = types.test(file.mimetype);
  return extName && mimetype;
};

export const videoFilterTypes = (req, file) => {
  const types = /mp4/;
  const extName = types.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = types.test(file.mimetype);

  return extName && mimetype;
};

//store
export const uploadStoreCategory = multer({
  fileFilter: storeCategoryFilter,
});
export const uploadMenu = multer({
  fileFilter: menuFilter,
});
export const uploadPutStoreCategory = multer({
  fileFilter: putStoreCategoryFilter,
});
export const uploadPutMenu = multer({
  fileFilter: putMenuFilter,
});

//shoppingLive
export const uploadShoppingLive = multer({
  fileFilter: shoppingLiveFilter,
});

export const uploadShoppingLiveCategory = multer({
  fileFilter: shoppingLiveCategoryFilter,
});

export const uploadPutShoppingLive = multer({
  fileFilter: putShoppingLiveFilter,
});
export const uploadPutShoppingLiveCategory = multer({
  fileFilter: putShoppingLiveCategoryFilter,
});

//bMart
export const uploadMartProduct = multer({
  fileFilter: bMartProductFilter,
});

export const putUploadMartProduct = multer({
  fileFilter: putBMartProductFilter,
});
export const uploadMartCategory = multer({
  fileFilter: bMartCategoryFilter,
});

export const uploadPutMartCategory = multer({
  fileFilter: putBMartCategoryFilter,
});
