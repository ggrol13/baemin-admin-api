const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  minimumPrice: { type: Number, default: 0, max: 7000 },
  paymentMethod: { type: String, required: true },
  deliveryTime: String,
  deliveryTip: [{ startPrice: Number, endPrice: Number, tip: Number }],
  info: { type: String, required: true },
  menuCategory: [
    {
      name: { type: String, required: true },
      menu: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          imgPath: String,
          options: [
            {
              name: { type: String, required: true },
              price: { type: Number, required: true },
            },
          ],
        },
      ],
    },
  ],
})

module.exports = mongoose.model('Store', storeSchema)
