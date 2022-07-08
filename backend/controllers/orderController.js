const Order = require("../modles/orderModel");
const Product = require("../modles/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// create new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// get Single Order

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order)
    return next(new ErrorHandler("order not found with this id", 404));

  res.status(200).json({
    success: true,
    order,
  });
});

// get loggedin user orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  console.log("called my orders");
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

async  function updateStock(id,quantity){

    const product = await Product.findById(id);
    console.log("product is")
    console.log(product); 
    product.stock = product.stock-quantity;

    await product.save({validateBeforeSave:false});
    
}


// update  order status   - admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if(!order)return next(new ErrorHandler("order not found with this id"))


  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have delivered this order", 404));
  }

  order.orderItems.forEach(async(o) => {
    await updateStock(o.product, o.quantity);
  });

  order.orderStatus = req.body.orderStatus;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  console.log("delevering theorder");

  await order.save({validateBeforeSave:false})

  res.status(200).json({
    success: true,
  });
});


// delete  order  - Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if(!order)return next(new ErrorHandler("order not found with this id"))
  
  await order.remove()
  
  res.status(200).json({
    success: true,
  });
});