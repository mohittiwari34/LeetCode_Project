const cloudinary=require('cloudinary').v2;
const problem=require("../models/problem");
const User=require("../models/user");


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const photoUploadSignature=async(req,res)=>{
    try{
        const timestamp=Math.round(new Date().getTime()/1000)
        //const{problemId}=req.params;
        const userId=req.result._id;
        console.log(userId);
        const public_id=`profile_${userId}`;
        const folder="leetcode_profile";
        const signature=cloudinary.utils.api_sign_request(
            {
                timestamp,
                public_id,
                
            },
            process.env.CLOUDINARY_API_SECRET
        );
        
        res.json({
            signature,
            timestamp,
            public_id,
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
            api_key:process.env.CLOUDINARY_API_KEY,
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,

        })

    }
    catch(err){
        console.log("Eroor in generating signature ",err);
        res.status(500).json({err:"Failed to genrate signature"});
        
    }
}
const saveProfileimage=async(req,res)=>{
    try{
        const {publicId,secureUrl}=req.body;
        const user=await User.findByIdAndUpdate(
            req.result._id,
            {profilePhoto:secureUrl},
            {new:true}
        );
        console.log(user);
        res.json({success:true,user});
    }
    catch(err){
        console.log("saving profilephoto error",err);
        res.status(500).json({err:"Failed to save video meta data"});
    }

}
module.exports={photoUploadSignature,saveProfileimage};