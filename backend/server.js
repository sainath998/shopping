const app = require("./app");
const cloudinary = require("cloudinary")
// const dotenv = require("dotenv");
const coludinary = require("cloudinary");
const connectDatabase = require("./config/database");

// for localhost 
if (process.env.NODE_ENV !== "PRODUCTION") {
  require('dotenv').config({
    path: "backend/config/config.env"
  });
}
// connecting to database
connectDatabase();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
});

// unhandled promise rejections (if we not writer catch)
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit();
  });
});

// uncaught exception (using withoug declearing)
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");
  process.exit(1);
});

// wrong mongodb id error