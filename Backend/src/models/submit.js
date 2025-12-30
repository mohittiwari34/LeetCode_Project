const express=require('express');
const submitRouter=express.Router();
const userMiddleware=require("../middleware/userMiddleware");
const {submitCode,runcode}=require("../controllers/userSubmission");
//const {submitCode,runCpde}

submitRouter.post("/submit/:id",userMiddleware,submitCode);
submitRouter.post("/run/:id",userMiddleware,runcode);

module.exports=submitRouter;
