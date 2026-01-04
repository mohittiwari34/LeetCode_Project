import mongoose from "mongoose";
const paymentSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    orderId:String,
    paymentId:String,
    amount:Number,
    status:{
        type:String,
        enum:["created","paid","failed"],
        default:"created",
    },

},{
    timestamps:true
});

export default mongoose.model("Payment",paymentSchema);