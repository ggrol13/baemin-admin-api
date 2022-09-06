import { bMartEventSchema } from "../schemas/b-mart-event.schema.js";

export const saveBMartEvent = async (body) => {
  const model = new bMartEventSchema(body);
  return await model.save();
};

export const findBMartEventByName = async (name) => {
  return bMartEventSchema.findOne({ name }).exec();
};

export const findBMartEventById = async (id) => {
  return bMartEventSchema.findOne({ _id: id }).exec();
};

export const findBMartEventAllProducts = async (id) => {
  return bMartEventSchema
    .aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "bMartProduct",
          localField: "productId",
          foreignField: "_id",
          as: "productId",
        },
      },
    ])
    .exec();
};

export const eraseBMartEvent = async (id) => {
  return bMartEventSchema.findOneAndDelete({ _id: id }).exec();
};

export const editBMartEvent = async (body, id) => {
  return bMartEventSchema.findOneAndUpdate({ _id: id }, { $set: body }).exec();
};

export const eraseBMartProductFromEvent = async (eventId, productId) => {
  return bMartEventSchema.updateOne(
    {
      _id: eventId,
    },
    { $pull: { productId: { $in: [productId] } } }
  );
};
