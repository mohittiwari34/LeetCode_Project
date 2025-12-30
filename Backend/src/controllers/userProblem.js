const {submitBatch,getLanguageById,submittoken}=require("../utils/problemutiiity")

const Problem=require("../models/problem")
const User=require("../models/user");
const SolutionVideo=require("../models/solutionVideo");
const Submission = require("../models/submission");
const createProblem=async (req,res)=>{
    const {title,descripton,difficulty,tags,visibleTestCase,
        hiddenTestCase,startCode,refrenceSolution,
        problemCreator
    }=req.body;
    console.log("mohituuuuuu......");



try{
    for(const {language,completeCode} of refrenceSolution){
        console.log(language);
        let b;
        if(language=="c++"){
            b="cpp";
        }
        else{
            b=language;
        }
        const languageId=getLanguageById(b);
        console.log(languageId);
        ///console.log("hi mohit yaha tak request pahuch rhi")
        
        console.log(title);
        console.log(descripton);
        console.log(difficulty);
        console.log(tags);
        console.log(visibleTestCase);
        console.log(hiddenTestCase);
        console.log(startCode);
        console.log(refrenceSolution);
        //console.log(problemCreator);
        
        const submissions=visibleTestCase.map((testcases)=>({
            source_code:completeCode,
            language_id:languageId,
            stdin:testcases.input,
            expected_output:testcases.output

        }));

        //console.log(submissions);
        const submitResult=await submitBatch(submissions);
        console.log(submitResult);
        const resultToken=submitResult.map((value)=>value.token);
        
        //  we doing this bcz in judge0 its is the best practice to first get token then again making the request["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        const testResult=await submittoken(resultToken);
        console.log(testResult);
        

        for(const test of testResult){
            //console.log(test);
            if(test.status_id!=3){
                return res.status(400).send("there may be some thing");

            }
        }
        
    }
    const userProblem=await Problem.create({...req.body,
        problemCreator:req.result._id
    })
    res.status(201).send("Problem saved suucessfully");

}
catch(err){
    console.log("error: "+err);

}

}
const updateProblem=async(req,res)=>{
    const {title,descripton,difficulty,tags,visibleTestCase,
        hiddenTestCase,startCode,refrenceSolution,
        problemCreator
    }=req.body;



try{
    if(!id){
        return res.status(400).send("Missing ID Field");
    }
    const DsaProblem=await Problem.findById(id);
    if(!DsaProblem){
        return res.status(404).send("Id is not present in srver");
    }
    for(const {language,completeCode} of refrenceSolution){
        const languageId=getLanguageById(language);
        const submissions=visibleTestCase.map((testcases)=>({
            source_code:completeCode,
            language_id:languageId,
            stdin:testcases.input,
            expected_output:testcases.output

        }));
        const submitResult=await submitBatch(submissions);
        const resultToken=submitResult.map((value)=>value.token);
        //  we doing this bcz in judge0 its is the best practice to first get token then again making the request["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        const testResult=await submittoken(resultToken);

        for(const test of testResult){
            if(test.status_id!=3){
                return res.status(400).send("Error Occured");

            }
        }
    }
    const newProblem=await problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
    res.status(201).send(newProblem);

}
catch(err){
    res.status(500).send("Error: "+err);

}

}
const deletedProblem=async(req,res)=>{
    const {id}=req.params;
    try{
        if(!id){
            return res.status(400).send("ID i Missing");
        }

        const deletedProblem=await Problem.findByIdAndDelete(id);
        if(!deletedProblem){
            return res.status(404).send("Problem is Missing");
        }
        res.status(200).send("Succesfully Deleted");
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
}

const getProblemById=async(req,res)=>{
    const {id}=req.params;
    try{
        if(!id){
            return res.ststus(400).send("Id is Missing");
        }
        const getProblem=await Problem.findById(id).select('_id title descripton difficulty tags visibleTestCase startCode refrenceSolution');
        //console.log(getProblem);
        //video ka jo bhi url wagera le aao
        if(!getProblem){
            return res.status(404).send("problem is missing");
        }
        const Video=await SolutionVideo.findOne({problemId:id});
        console.log(Video);
        if(Video){
            // getProblem.secureUrl=secureUrl;
            // getProblem.cloudinaryPublicId=cloudinaryPublicId;
            // getProblem.thumbnailUrl=thumbnailUrl;
            // getProblem.duration=duartion;
            // return res.status(200).send(getProblem); 
            const responseData={
                ...getProblem.toObject(),
                secureUrl:Video.secureUrl,
                thumbnailUrl:Video.thumbnailUrl,
                duration:Video.duration,
            }
            return res.status(200).send(responseData);
        }
        res.status(200).send(getProblem);
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }

}
const getAllProblem=async(req,res)=>{
    try{
        const getProblem=await Problem.find({}).select('title difficulty tags');
        if(getProblem.length==0){
            return res.status(404).send("problem is Missing");
        }
        res.status(200).send(getProblem);
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
}

const solvedAllProblembyUser=async(req,res)=>{
    try{
        const userId=req.result._id;
        const user=await User.findById(userId).populate({
            path:"problemSolved",
            select:"_id title difficulty tags"
        });
        const reply={
            problemSolved:user.problemSolved,
            profilePhoto:user.profilePhoto
        }
        res.status(200).send(reply);
    }
    catch(err){
        res.status(500).send("server Eroor");
    }
}
const submittedProblem=async(req,res)=>{
    try{
        const userId=req.result._id;
        const problemId=req.params.pid;
        const ans=await Submission.find({userId,problemId});
        if(ans.length==0){
            res.status(200).send("No Submission is present");
        }
        res.status(200).send(ans);
    }
    catch(err){
        res.status(500).send("Internal Server Error");

    }
}
module.exports={createProblem,updateProblem,deletedProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem};














// {
//   "submissions": [
//     {
//       "language_id": 46,
//       "stdout": "hello from Bash\n",
//       "status_id": 3,
//       "stderr": null,
//       "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
//     },
//     {
//       "language_id": 71,
//       "stdout": "hello from Python\n",
//       "status_id": 3,
//       "stderr": null,
//       "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
//     },
//     {
//       "language_id": 72,
//       "stdout": "hello from Ruby\n",
//       "status_id": 3,
//       "stderr": null,
//       "token": "1b35ec3b-5776-48ef-b646-d5522bdeb2cc"
//     }
//   ]
// }