const mongoose = require("mongoose");

const unitPriceSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: [true, "Please Enter Unit Name"],
  //   trim: true,
  // },

  price: {
    type: Number,
    required: [true, "Please Enter Unit Price"],
  },
  type: {
    type: String,
  },


  weight: {
    type: Number,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Unit", unitPriceSchema);
