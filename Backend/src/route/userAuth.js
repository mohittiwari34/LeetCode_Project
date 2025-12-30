const express=require('express');
const adminMiddleware=require('../middleware/adminMiddleware');
const userMiddleware=require('../middleware/userMiddleware');

const authRouter=express.Router();
const {register,login,googleLogin,logout,adminRegister,deleteProfile}=require("../controllers/userAuthent")

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/google",googleLogin);
authRouter.post("/logout",userMiddleware,logout);
authRouter.post("/admin/register",adminMiddleware,adminRegister);
authRouter.delete("/deleteprofile",userMiddleware,deleteProfile);
authRouter.get("/check",userMiddleware,(req,res)=>{
    const reply={
        firstName:req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id
    }
    res.status(201).json({
        user:reply,
        message:"Valid User"
    });
})
//authRouter.get("/getProfile",getProfile);

module.exports=authRouter;
