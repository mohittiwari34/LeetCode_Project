const express=require('express');
const adminMiddleware=require('../middleware/adminMiddleware');
const profileRouter=express.Router();

const {photoUploadSignature,saveProfileimage}=require("../controllers/profilePhoto");

profileRouter.get("/create-signature",adminMiddleware,photoUploadSignature);
profileRouter.post("/save-photo",adminMiddleware,saveProfileimage);

module.exports=profileRouter