 const express = require("express");    
// import { verifyPayment } from "../controllers/verifyController";
// import { createOrder } from "../controllers/paymentController"
const {createOrder,verifyPayment} = require("../controllers/paymentController");
 const Paymentrouter=express.Router();
const userMiddleware=require("../middleware/userMiddleware");
Paymentrouter.post("/create-order",userMiddleware,createOrder);
Paymentrouter.post("/verifyPayment",userMiddleware,verifyPayment);

module.exports=Paymentrouter;