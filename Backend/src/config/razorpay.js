const Razorpay = require("razorpay");
require("dotenv").config();

let razorpay;
try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    } else {
        console.warn("⚠️ Razorpay keys not found in environment variables. Payment features will be disabled.");
    }
} catch (err) {
    console.error("⚠️ Failed to initialize Razorpay:", err.message);
}

module.exports = razorpay;