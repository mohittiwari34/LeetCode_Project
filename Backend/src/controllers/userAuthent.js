
const User=require("../models/user");
const validate=require("../utils/validator");
const bcrypt=require('bcrypt');
const redisClient=require("../config/redis");
const { OAuth2Client } = require("google-auth-library");
const jwt=require('jsonwebtoken');

const register=async(req,res)=>{
    try{
        console.log("request yaha tak pahuch rha");
        console.log(req.body);
        validate(req.body);
        const {firstName,emailId,password}=req.body;
        req.body.password=await bcrypt.hash(password,10);
        console.log(req.body.password);
        req.body.role='user';
        const user=await User.create(req.body);
        console.log(user);
        const token=jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:60*60});
        console.log(token);
        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role,
        }
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).json({
            user:reply,
            message:"Register Succesfully"
        })
        
    }
    catch(err){
        console.log("register error mohit")
        res.status(400).send("Error: mohit"+err);

    }
}
const login=async(req,res)=>{
    try{
        
        const {emailId,password}=req.body;
        console.log(emailId);
        console.log(password);
        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");
        
        const user=await User.findOne({emailId});
        console.log(user);
        console.log(user.password);
        const match= await bcrypt.compare(password,user.password);
        console.log(match);
        if(!match){
            throw new Error("Invalid Credentials");
        }
        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role,
            profilePhoto:user.profilePhoto,
        }

        const token=jwt.sign({_id:user._id,emailId:emailId,profilePhoto:user.profilePhoto,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
        
        res.status(201).json({
            user:reply,
            message:"Login Succesfully"
        })
        

    }
    catch(err){
        res.status(401).send("Error: "+err);

    }
}
const client1=new OAuth2Client("744154804557-9e4d3llkuqss6en0a5iqodtqltnopl32.apps.googleusercontent.com")
const googleLogin=async(req,res)=>{
    console.log("google");
    const {token1}=req.body;
    try{
        const ticket =await client1.verifyIdToken({
            idToken:token1,
            audience:"744154804557-9e4d3llkuqss6en0a5iqodtqltnopl32.apps.googleusercontent.com"
        })
        const payload=ticket.getPayload();
        console.log(payload);
        const {name,email,picture}=payload;
        console.log(name);
        console.log(email);
        console.log(picture);
        const emailId=email;
        const firstName=name;
        let user =await User.findOne({emailId});
        
        console.log(user);
        
        if(!user){
            user=await User.create({
                firstName,
                emailId,
                provider:"google",
                profilePhoto:picture
            })
        }
        console.log(user);
        
        const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
        // if (user){
        //     return res.status(200).json({
        //         message:"User logged in",
        //         user,
        //         token,
        //     })
        // }
        console.log(token);
        res.cookie('token',token,{maxAge:60*60*1000});
        
        
        res.status(200).json({
            message:"Google login successful",
            token:token,
            user,
        });

    }
    catch(err){
        res.status(401).json({message:"Invalid Google token",mohit:"hlo",err});
    }
}
const logout=async(req,res)=>{
    try{
        const {token}=req.cookies;
        const payload=jwt.decode(token);
        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);
        res.cookie("token",null,{expires:new Date(Date.now())});
        res.send("Logged Out Succesfully");

    }
    catch(err){
        console.log("Error: "+err);
    }
}
const adminRegister=async(req,res)=>{
    try{
        validate(req.body);
        const{firstName,emailId,password}=req.body;
        req.body.password=await bcrypt.hash(password,14);
        const user=await User.create(req.body);
        user.role="admin";
        await user.save();
        const token =jwt.sign({_id:user._id,emailId:emailId,role:'admin'},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).send("User Registered Succesfully");

    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}
const deleteProfile=async(req,res)=>{
    try{
        const userId=req.result._id;
        await User.findByIdAndDelete(userId);
        res.status(200).send("Deleted Suceesfully");

    }
    catch(err){
        res.status(500).send("Internal Server Error");

    }
}
module.exports={register,login,googleLogin,logout,adminRegister,deleteProfile};