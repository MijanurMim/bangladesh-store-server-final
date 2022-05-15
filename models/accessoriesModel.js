const mongoose = require("mongoose");

const accessoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Accessories Name"],
    trim: true,
  },

  description: {
    type: String,
    required: [true, "Please Enter Accessories Description"],
  },

  price: {
    type: Number,
    required: [true, "Please Enter Accessories Price"],
  },

  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],

  category: {
    type: String,
    required: [true, "Please Enter Accessories Category"],
  },

  Stock: {
    type: Number,
    required: [true, "Please Enter Accessories Stock"],
    default: 1,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Accessories", accessoriesSchema);
