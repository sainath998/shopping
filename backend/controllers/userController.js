const Product = require("../modles/productModel");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../modles/userModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

  console.log("called register")
  console.log(req.body.avatar);

  // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //   folder: "avatars",
  // });
  console.log("registerd pic in server")

  const {
    name,
    email,
    password
  } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    //  CLOUD NOT DONE
    // avatar: {
    //   public_id: "myCloud.public_id",
    //   url: "myCloud.secure_url",
    // },
    avatar: {
      public_id: "myCloud.public_id",
      url:" myCloud.secure_url",
    },
  });

  // const token = user.getJWTToken();
  // res.status(201).json({
  //     success:true,
  //     user,
  // })
  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please Enter Email and Password", 400));

  const user = await User.findOne({
    email
  }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid email or password", 401));

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched)
    return next(new ErrorHandler("password not matched", 401));

  // const token = user.getJWTToken();
  // res.status(200).json({
  //     success:true,
  //     user,
  // })
  sendToken(user, 200, res);
});

// logout user

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  console.log("message to console that user is logged out");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Forgot Password
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email
  });

  console.log("got requires");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }


  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({
    validateBeforeSave: false
  });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  console.log(`message is :  ${message}`);
  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({
      validateBeforeSave: false
    });
    return next(new ErrorHandler(error.message, 500));
  }
});

// reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now()
    },
  });

  if (!user)
    return next(
      new ErrorHandler("reset Password token is invalid or expired", 404)
    );

  // if (req.body.password != req.body.conformPassword)
  //   return next(new ErrorHandler("password doesn't match", 404));

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});
// get user Details

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  if(!req.user.id) return  res.status(401).json({
    success: false,
    user:null,
    token:null,
  });
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  console.log("req.user is ");
  console.log(req.user);
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched)
    return next(new ErrorHandler("old password is incorrect", 400));

  // if (req.body.newPassword != req.body.conformPassword) {
  //   return next(new ErrorHandler("password doesn't match"));
  // }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// get all users (admin)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
// get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("user doesnot exist with this id "));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  console.log("called backend of updateprofile");
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.body.avatar !== "") {
    console.log("updating avatar");
    const user = await User.findById(req.user.id);
    // const imageId = user.avatar.public_id;
    console.log('got user');
    // await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    console.log("uploaded into server")
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  console.log("new user data");
  console.log(newUserData);

  res.status(200).json({
    success: true,
  });
});

// update User Profile
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  console.log("called backend of updateprofile");
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new ErrorHandler("user not foind", 400));

  await user.remove();

  res.status(200).json({
    success: true,
    message: "user deleted successfully",
  });
});