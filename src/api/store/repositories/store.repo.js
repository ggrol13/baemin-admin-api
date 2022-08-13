import { storeSchema } from "../schemas/store.schema.js";

export const saveStore = async (store) => {
  const model = new storeSchema(store, { strict: false });
  return await model.save();
};

export const saveMenuCategory = async (storeId, isRepresent, name) => {
  await storeSchema.updateOne(
    { _id: storeId },
    { $push: { menuCategory: { isRepresent, name } } }
  );
};

export const saveMenu = async (storeId, body, name) => {
  await storeSchema.updateOne(
    { _id: storeId },
    { $push: { "menuCategory.$[a].menu": body } },
    { arrayFilters: [{ "a.name": name }] }
  );
};

export const findStoreByName = async (name) => {
  return await storeSchema.findOne({ name }).exec();
};

export const findStoreById = async (storeId) => {
  return await storeSchema.findOne({ _id: storeId }).exec();
};

export const findMenuCategoryByName = async (name, id) => {
  try {
    return await storeSchema
      .findOne({ _id: id, menuCategory: { $elemMatch: { name } } }) //projection빼고 filter에 name추가
      .exec();
  } catch (e) {
    console.log(e);
  }
};

// export const findMenuCategoryById = async (categoryId, storeId) => {
//   try {
//     return await storeSchema
//       .findOne({
//         _id: storeId,
//         menuCategory: { $elemMatch: { _id: categoryId } },
//       }) //projection빼고 filter에 name추가
//       .exec();
//   } catch (e) {
//     console.log(e);
//   }
// };

export const editStore = async (body, id) => {
  await storeSchema.findOneAndUpdate({ _id: id }, { $set: body });
};

export const editMenu = async (menu, storeId, name, menuId) => {
  await storeSchema.findOneAndUpdate(
    { _id: storeId },
    { $set: { "menuCategory.$[a].menu.$[b]": menu } },
    {
      arrayFilters: [{ "a.name": name }, { "b._id": menuId }],
    }
  );
};

export const editMenuCategory = async (storeId, categoryId, body) => {
  await storeSchema.findOneAndUpdate(
    { _id: storeId },
    { $set: { "menuCategory.$[a]": body } },
    { arrayFilters: [{ "a._id": categoryId }] }
  );
};

export const eraseStore = async (id) => {
  await storeSchema.findOneAndDelete({ _id: id });
};

export const eraseMenuCategory = async (storeId, categoryId) => {
  await storeSchema.findOneAndUpdate(
    { _id: storeId },
    { $pull: { menuCategory: { _id: categoryId } } }
  );
};

export const eraseMenu = async (storeId, categoryName, menuId, menuName) => {
  await storeSchema.findOneAndUpdate(
    { _id: storeId },
    { $pull: { "menuCategory.$[].menu": { name: menuName } } }
  );
};
