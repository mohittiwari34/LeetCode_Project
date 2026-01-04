import razorpay from "../config/razorpay";
import Payment from "../models/Payment";
export const createOrder=async (req,res)=>{
    const amount=9*100;

    const order =await razorpay.orders.create({
        amount,
        currency:"INR",
        receipt:`receipt_${Date.now()}`
    });

    await Payment.create({
        userId:req.user.id,
        orderId:order.id,
        amount:order.amount,
    });

    res.json({
        orderId:order.id,
        amount:order.amount,
        currency:"INR",
        key:process.env.RAZORPAY_KEY_ID,
    });



}