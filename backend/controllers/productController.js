const Product = require("../modles/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// // create product  - admin
// exports.createProduct = catchAsyncErrors(async (req, res, next) => {
//   req.body.user = req.user.id;
//   const product = await Product.create(req.body);
//   res.status(201).json({
//     success: true,
//     product,
//   });
// });

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [
    {
      public_id: "result.public_id",
      url: "result.secure_url",
    }
  ];

  // for (let i = 0; i < images.length; i++) {
  //   const result = await cloudinary.v2.uploader.upload(images[i], {
  //     folder: "products",
  //   });

  //   imagesLinks.push({
  //     public_id: result.public_id,
  //     url: result.secure_url,
  //   });
  // }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});


// get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  // const resultPerPage = 8;
  // // console.log("get products in backend");
  // const productCount = await Product.countDocuments();
  // const apiFeature = new ApiFeatures(Product.find(), req.query)
  //   .search()
  //   .filter()
  //   .pagination(resultPerPage);

  // // let products = await apiFeature.query;
  // // let filteredProductsCount = products.length;
  // let filteredProductsCount = 0;
  // // apiFeature.pagination();
  // // const products = await Product.find();

  // const products = await apiFeature.query;
  // console.log(products);
  // res.status(200).json({
  //   success: true,
  //   products,
  //   productCount,
  //   resultPerPage,
  //   filteredProductsCount,
  // });


  const resultPerPage = 8;
  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

    console.log(`query was `)
    console.log(req.query);
  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  const abd = await Product.find();
  console.log(`Al  are  ${productCount} `)
  console.log(abd);

  console.log("products are ")
  console.log(products);

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    products:abd,
    productCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// update product - admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ success: false, message: "product was not  found " });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(201).json({
    success: true,
    product,
  });
});

// delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ success: false, message: "product not found " });
  }
  await product.remove();
  res.status(201).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

// get Product Detalis
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // if(!product) {
  //     return res.status(500).json({success:false,message:"product not found "})
  // }
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(201).json({
    success: true,
    product,
  });
});

// create new review and update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    await product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    await product.reviews.push(review);
  }
  product.numberOfReviews = product.reviews.length;
  console.log(`total reviews are : ${product.numberOfReviews}`);

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  console.log("got product success");

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  console.log(`reviews are :  ${reviews.length}`);
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
      useFindAndModify: false,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "delete review success",
  });
});


// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});