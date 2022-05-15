const ErrorHandler = require('../utils/errorhandler.js')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const crypto = require('crypto')

const User = require('../models/userModel')
const sendToken = require('../utils/jwtToken.js')
const sendEmail = require('../utils/sendEmail.js')

// new
exports.CreateOrUpdateUser = async (req, res) => {
  const { name, email } = req.user
  // const { name } = req.body.data
  console.log(req.user)
  const user = await User.findOneAndUpdate(
    { email },
    { name, email },
    { new: true },
  )
  if (user) {
    res.json(user)
  } else {
    const newUser = await new User({ name, email }).save()
    res.json(newUser)
  }
}

exports.CurrentUser = (req, res) => {
  // console.log("user", req.user);
  const { email } = req.user
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error(err)
    res.json(user)
  })
}

// Register User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password,
  })

  sendToken(user, 201, res)
})

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body

  //   Checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler('Please Enter Email & Password', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorHandler('Invalid Email or Password', 401))
  }

  //   Matching Password
  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Email or Password', 401))
  }

  sendToken(user, 200, res)
})

// Log Out User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: 'logged Out',
  })
})

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorHandler('User not Found', 404))
  }

  //   Get ResetPassword Token

  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  const resetPasswordUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/password/reset/${resetToken}`

  const message = `Your Password Reset Token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, Please ignore it    `

  try {
    await sendEmail({
      email: user.email,
      subject: `Bangladesh Store Password Recovery`,
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(error.message, 500))
  }
})

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Creating Token Hash
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })
  if (!user) {
    return next(
      new ErrorHandler(
        'Reset Password Token is Invalid or Has Been Expired',
        400,
      ),
    )
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password Does Not Password', 400))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  sendToken(user, 200, res)
})

// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    user,
  })
})

// Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  //   Matching Password
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Old Password is incorrect', 400))
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password Does Not Match', 400))
  }

  user.password = req.body.newPassword

  await user.save()

  sendToken(user, 200, res)
})

// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  }
  // Will add cloudinary later for avatar

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})

// Get All Users -- ADMIN
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    success: true,
    users,
  })
})

// Get Single User Details  -- ADMIN
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id : ${req.params.id}`, 400),
    )
  }

  res.status(200).json({
    success: true,
    user,
  })
})

// Update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})

// Delete User  -- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  // Will Remove user data from cloudinary

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id : ${req.params.id}`, 400),
    )
  }

  await user.remove()

  res.status(200).json({
    success: true,
    message: 'User Deleted Successfully ',
  })
})
