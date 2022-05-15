const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Accessories = require("../models/accessoriesModel");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorhandler.js");
var cloudinary = require("cloudinary");

// Create Accessories -- Admin
exports.createAccessories = catchAsyncErrors(async (req, res, next) => {
  let images = req.body.images;

  // if (typeof req.body.images === "string") {
  //   images.push(req.body.images);
  // } else {
  //   images = req.body.images;
  // }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "accessories",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  // console.log(imagesLinks);

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  // console.log(req.body.images);

  const accessories = await Accessories.create(req.body);

  // console.log(Accessories);

  res.status(201).json({
    success: true,
    accessories,
  });
});

// Get All Accessories
exports.getAllAccessories = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 8;
  const accessoriesCount = await Accessories.countDocuments();

  const apiFeature = new ApiFeatures(Accessories.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const accessories = await apiFeature.query;

  res.status(200).json({
    success: true,
    accessories,
    accessoriesCount,
    resultPerPage,
  });
});

// Get All Accessories (Admin)
exports.getAdminAccessories = catchAsyncErrors(async (req, res) => {
  const accessories = await Accessories.find();

  res.status(200).json({
    success: true,
    accessories,
  });
});

// Get Single Accessories Details
exports.getAccessoriesDetails = catchAsyncErrors(async (req, res, next) => {
  const accessory = await Accessories.findById(req.params.id);

  if (!accessory) {
    return next(new ErrorHandler("Accessory Not Found", 404));
  }

  res.status(200).json({
    success: true,
    accessory,
  });
});

// Update Accessories -- Admin
exports.updateAccessories = catchAsyncErrors(async (req, res) => {
  let accessories = await Accessories.findById(req.params.id);

  if (!accessories) {
    return next(new ErrorHandler("Accessories Not Found", 404));
  }

  // cloudinary Settings
  let images = req.body.images;

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < accessories.images.length; i++) {
      await cloudinary.v2.uploader.destroy(accessories.images[i].public_id);
    }
  }
  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "accessories",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

  accessories = await Accessories.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    accessories,
  });
});

// Delete Accessories -
exports.deleteAccessories = catchAsyncErrors(async (req, res, next) => {
  const accessories = await Accessories.findById(req.params.id);

  if (!accessories) {
    return next(new ErrorHandler("Accessories Not Found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < accessories.images.length; i++) {
    await cloudinary.v2.uploader.destroy(accessories.images[i].public_id);
  }
  await accessories.remove();

  res.status(200).json({
    success: true,
    message: "Accessories Deleted Successfully",
  });
});
