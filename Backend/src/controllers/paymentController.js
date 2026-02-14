const razorpay = require("../config/razorpay");
const Payment = require("../models/Payment");
const User = require("../models/user");
const crypto = require("crypto");


const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        console.log(amount);

        const options = {
            amount: amount * 100, // convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        console.log(options);
        const order = await razorpay.orders.create(options);
        console.log(order);

        console.log(order.id);
        console.log(order.amount);
        await Payment.create({
            userId: req.result._id,
            orderId: order.id,
            amount: order.amount,
            status: "created",
        });

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Order creation failed",
        });
    }
};


// ================= VERIFY PAYMENT =================
const verifyPayment = async (req, res) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {

            await Payment.findOneAndUpdate(
                { orderId: razorpay_order_id },
                {
                    status: "paid",
                    paymentId: razorpay_payment_id,
                }
            );

            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now

            await User.findByIdAndUpdate(req.result._id, {
                isPremium: true,
                premiumExpiryDate: expiryDate,
            });

            return res.json({
                success: true,
                message: "Payment verified ✅",
            });

        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid signature ❌",
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};


// ✅ IMPORTANT: Export properly
module.exports = { createOrder, verifyPayment };
