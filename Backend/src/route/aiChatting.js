const express=require('express');
const aiRouter=express.Router();
const userMiddleware=require("../middleware/userMiddleware");
const SolveDoubt=require("../controllers/solveDoubt");

aiRouter.post('/chat',userMiddleware,SolveDoubt);
module.exports=aiRouter;