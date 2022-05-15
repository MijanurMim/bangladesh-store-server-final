const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Unit = require("../models/unitPriceModel");
// const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorhandler.js");

// Create Unit -- Admin
exports.createUnit = catchAsyncErrors(async (req, res, next) => {
  const unit = await Unit.create(req.body);

  res.status(201).json({
    success: true,
    unit,
  });
});

// Get All Units (Admin)
exports.getAdminUnits = catchAsyncErrors(async (req, res) => {
  const units = await Unit.find();

  res.status(200).json({
    success: true,
    units,
  });
});

// Update Units -- Admin
exports.updateUnit = catchAsyncErrors(async (req, res) => {
  let unit = await Unit.findById(req.params.id);

  if (!unit) {
    return next(new ErrorHandler("Unit Not Found", 404));
  }

  unit = await Unit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    unit,
  });
});

// Delete Unit - admin
exports.deleteUnit = catchAsyncErrors(async (req, res, next) => {
  const unit = await Unit.findById(req.params.id);

  if (!unit) {
    return next(new ErrorHandler("Unit Not Found", 404));
  }

  await unit.remove();

  res.status(200).json({
    success: true,
    message: "Unit Deleted Successfully",
  });
});
