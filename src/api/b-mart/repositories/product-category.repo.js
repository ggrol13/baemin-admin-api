import { bMartCategorySchema } from "../schemas/product-category.schema.js";

export const saveBMartCategory = async (category) => {
  const model = new bMartCategorySchema(category);
  await model.save();
};

export const findBMartCategoryByName = async (name) => {
  return bMartCategorySchema.findOne({ name }).exec();
};

export const findBMartCategoryById = async (id) => {
  return bMartCategorySchema.findOne({ _id: id }).exec();
};

export const eraseBMartCategory = async (id) => {
  return bMartCategorySchema.findOneAndDelete({ _id: id });
};

export const saveBMartProductId = async (productId, categoryId) => {
  await bMartCategorySchema.updateOne(
    { _id: categoryId },
    { $push: { productId: [productId] } }
  );
};

export const deleteBMartProductId = async (productId, categoryId) => {
  await bMartCategorySchema.updateOne(
    {
      _id: categoryId,
    },
    { $pull: { productId: { $in: [productId] } } }
  );
};

export const editBMartCategory = async (editCategory, id) => {
  await bMartCategorySchema
    .findOneAndUpdate(
      {
        _id: id,
      },
      { $set: editCategory }
    )
    .exec();
};

export const findAllBMartProducts = async (categoryId) => {
  return bMartCategorySchema.aggregate([
    { $match: { _id: categoryId } },
    {
      $lookup: {
        from: "bMartProduct",
        localField: "productId",
        foreignField: "_id",
        as: "productId",
      },
    },
  ]);
};
