const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    orderId: String,
    paymentId: String,
    amount: Number,
    status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created",
    },

}, {
    timestamps: true
});

module.exports = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);