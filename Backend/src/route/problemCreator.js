const express=require('express');
const problemRouter=express.Router();
const adminMiddleware=require("../middleware/adminMiddleware");
const userMiddleware=require("../middleware/userMiddleware");
const {createProblem,updateProblem,deletedProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem}=require("../controllers/userProblem");
//create
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.patch("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deletedProblem);

problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem);
// fetch
// update
// delete 
module.exports=problemRouter;