import Schema from "validate";

export const storeValidate = new Schema({
  name: { required: true },
  phone: { required: true },
  address: { required: true },
  minimumPrice: { required: false },
  paymentMethod: { required: true },
  deliveryTime: { required: false },
  deliveryTip: { required: false },
  info: { required: true },
  storeCategoryId: { required: true },
});

export const menuValidate = new Schema({
  menu: [
    {
      name: { required: true },
      price: { required: true },
      options: [
        { required: false },
        {
          name: { required: false },
          price: { required: false },
        },
      ],
    },
  ],
});

export const menuCategoryValidate = new Schema({
  name: {
    required: true,
  },
});

export const storeCategoryValidate = new Schema({
  name: { required: true },
  storeId: [{ required: false }],
});

export const putStoreCategoryValidate = new Schema({
  name: { required: false },
  storeId: [{ required: false }],
});

// export const validate = (query, validateKey, res) => {
//   for (const key in query) {
//     if (!validateKey[key]) {
//       //query키가 validateKey에 없는 경우
//       // ApiError(BAD_REQUEST, res);
//       return false;
//     }
//   }
//
//   for (const key in validateKey) {
//     if (Array.isArray(validateKey[key])) {
//       //validateKey값이 nullable이고 query값이 undefined인 경우
//       validateKey[key].forEach((item) => {
//         if (!item.nullable && !query[key]) {
//           // ApiError(BAD_REQUEST, res);
//           return false;
//         }
//       });
//     } else {
//       if (!validateKey[key].nullable && !query[key]) {
//         // ApiError(BAD_REQUEST, res);
//         return false;
//       }
//     }
//   }
//   return true;
// };
//
// export const filterValidate = (query, validateKey) => {
//   console.log(query);
//   for (const key in query) {
//     if (!validateKey[key]) {
//       //query키가 validateKey에 없는 경우
//       return false;
//     }
//   }
//
//   for (const key in validateKey) {
//     if (Array.isArray(validateKey[key])) {
//       //validateKey값이 nullable이고 query값이 undefined인 경우
//       validateKey[key].forEach((item) => {
//         if (!item.nullable && !query[key]) {
//           return false;
//         }
//       });
//     } else {
//       if (!validateKey[key].nullable && !query[key]) {
//         return false;
//       }
//     }
//   }
//   return true;
// };
