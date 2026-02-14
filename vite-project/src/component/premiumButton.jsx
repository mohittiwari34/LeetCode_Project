import React from "react";
import axiosClient from "../Utils/axiosClient";

const PaymentButton = ({ className = "" }) => {

  const handlePayment = async () => {
    try {
      const response = await axiosClient.post("/payment/create-order", {
        amount: 4
      });
      console.log(response);

      const order = response.data;
      console.log(order);

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "CodeForge Premium",
        description: "Premium Plan",

        handler: async function (response) {
          console.log("verify payment");
          try {
            const verifyRes = await axiosClient.post("/payment/verifyPayment", response);
            console.log(verifyRes);
            const data = verifyRes.data;

            if (data.success) {
              alert("Payment Successful 🎉 Premium Unlocked");
              window.location.reload();
            } else {
              alert("Payment Verification Failed ❌");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment Verification Failed ❌");
          }
        },

        theme: {
          color: "#2563eb"
        }
      };
      console.log(options);

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Could not initiate payment. Please try again.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className={`relative group px-6 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg font-bold text-white shadow-lg shadow-orange-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50 hover:from-amber-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-[#1e1e1e] ${className}`}
    >
      <span className="flex items-center gap-2 text-sm md:text-base">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-100" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 5a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0v-1H3a1 1 0 010-2h1v-1a1 1 0 011-1zm5-5a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 011-1zm0 5a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 010-2h1v-1a1 1 0 011-1zM6 10a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0v-1H3a1 1 0 010-2h1v-1a1 1 0 011-1zm5 0a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 010-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.312-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.312.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
        Unlock Premium – ₹49 / month
      </span>
      <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
    </button>
  );
};

export default PaymentButton;
