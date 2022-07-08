const ErrorHandler = require("../utils/errorHandler")

module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    console.log("finally came to me ")
    
    // wrong mongodb id error
    if(err.name==="CastError"){
        const message = `resoucre not found. Invalid ${err.path}`;

    }
    
    // mongoose duplicate key error
    if(err.code === 11000)
    {
        const message = `dupilicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }

    // wrong jwt error
    if(err.name == "JsonWebTokenError")
    {
        const message = "Json web Token is invalid , try again";
        err = new ErrorHandler(message,400);

    }
    //  jwt Expire error
   

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}
