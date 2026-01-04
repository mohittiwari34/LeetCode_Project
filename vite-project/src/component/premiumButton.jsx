import axiosClient from "../Utils/axiosClient";

export default function PremiumButton(){
    const handleUpgrade=async()=>{
        const {data}=await axiosClient.post("/payment/create-order");
        openRazorpay(data);
    }
    const openRazorpay=(order)=>{
        const option={
            key:order.key,
            amount:order.amount,
            currency:order.currency,
            order_id:order.orderId,
            name:"Leetcode-Premium",
            description:"Video Solutions Access",

            handler: async function (response){
                try{
                    await axiosClient.post("/payment/verify",response);
                    alert("🎉 Premium Activated!");
                    window.location.reload();
                }
                catch(err){
                    alert("Payemnt Verification Failed");
                }
            }
        };
        const rzp=new window.Razorpay(options)
        rzp.open();

    }
    return (
        <button onClick={handleUpgrade} className="btn btn-primary">
            Upgrade to premium
        </button>
    )
}