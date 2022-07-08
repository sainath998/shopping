const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");

const fileUpload = require("express-fileupload")

// const errorMiddleWear = require("./middleware/error");

const bodyParser = require("body-parser")
// const dotenv = require("dotenv")

var path = require("path")

const errorMiddleWear = require("./middleware/error")
// dotenv.config({ path: "backend/config/config.env" });
if (process.env.NODE_ENV !== "PRODUCTION") {
  require('dotenv').config({
    path: "backend/config/config.env"
  });
}


app.use(express.json());
app.use(errorMiddleWear);
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(fileUpload());






// CROS
var cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  }))
// );

// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });
// END CROS
// Route IMports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute")

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment)

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  console.log("forwarding");
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

module.exports = app;