// import crypto from "crypto";
// import User from "../models/user";
// import Payment from "../models/Payment";
export const verifyPayment=async (req,res)=>{
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    }=req.body;
    const body=razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature=crypto
    .createHmac("sha256",process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

    if(expectedSignature!=razorpay_signature){
        return res.status(400).json({messages:"Invalid Payment"});

    }

    const payment=await Payment.findOneAndUpdate(
        {orderId:razorpay_order_id},
        {
            paymentId:razorpay_payment_id,
            status:"paid",
        }
    );

    await User.findByIdAndUpdate(payment.userId,{
        isPremium: true,
    });

    res.json({success: true});
}