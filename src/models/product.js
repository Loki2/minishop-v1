const mongoose = require('mongoose');


const productSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true
    },
    name_lao: {
      type: String,
      required: true
    },
    name_eng: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Product = mongoose.model("Product", productSchema);

module.exports = Product;