const Problem=require("../models/problem");
const Submission=require("../models/submission");

const User=require("../models/user");
const {getLanguageById,submitBatch,submittoken}=require("../utils/problemutiiity");





const submitCode=async (req,res)=>{
    try{
        const userId=req.result._id;
        const problemId=req.params.id;
        const {code,language}=req.body;
        console.log(userId);
        console.log(code);
        console.log(language);
        if(!userId||!code||!problemId||!language){
            return res.status(400).send("some field missing");
        }
        const problem=await Problem.findById(problemId);
        // console.log(problem);
        //kya apne submission store kar du pehle....
        const submittedResult=await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:'pending',
            testCaseTotal:problem.hiddenTestCase.length

        })
        console.log(submittedResult);
        const languageId=getLanguageById(language);

        const submissions=problem.hiddenTestCase.map((testcases)=>({
            source_code:code,
            language_id:languageId,
            stdin:testcases.input,
            expected_output:testcases.output
        }));
//         [
//   { input: "1 2", output: "3" },
//   { input: "5 10", output: "15" }
// ]
        const submitResult=await submitBatch(submissions);
        const resultToken=submitResult.map((value)=>value.token);
        const testResult=await submittoken(resultToken);
        console.log(testResult);

        let testCasesPassed=0;
        let runtime=0;
        let memory=0;
        let status='accepted';
        let errorMessage=null;

        for(const test of testResult){
            if(test.status_id==3){
                testCasesPassed++;
                runtime=runtime+parseFloat(test.time)
                memory=Math.max(memory,test.memory);
            }
            else{
                if(test.status_id==4){
                    status='error'
                    errorMessage=test.stderr

                }
                else{
                    status='wrong'
                    errorMessage=test.stderr
                }

            }
        }
        submittedResult.status=status;
        submittedResult.testCasePassed=testCasesPassed;
        submittedResult.errorMessage=errorMessage;
        submittedResult.runtime=runtime;
        submittedResult.memory=memory;

        await submittedResult.save();
        if(!req.result.problemSolved.includes(problemId)){
        req.result.problemSolved.push(problemId);
        await req.result.save();
        }
        const accepted=(status=='accepted')
        res.status(201).json({
            accepted,
            totalTestCases:submittedResult.testCaseTotal,
            passedTestCases:testCasesPassed,
            runtime,
            memory
        });
    }
    catch(err){
      res.status(500).send("Internal Server Error "+ err);
    }
}
const runcode=async(req,res)=>{
    try{
        const userId=req.result._id;
        const problemId=req.params.id;
        //return res.status(400).send(problemId);
        console.log(userId);
        console.log(problemId);
        //console.log(problemId);
        console.log("hi mohit");
        const {code,language}=req.body;
        console.log(code);
        console.log(language);

        if(!userId||!code||!problemId||!language){
            return res.status(400).send("some field missing");
        }
        const problem=await Problem.findById(problemId);
        //console.log(problem);
        //console.log("hi");
        //console.log(problemId);
        //kya apne submission store kar du pehle....
       
        const languageId=getLanguageById(language);
        console.log(languageId);
        console.log(languageId);
        //console.log(problem.testcases.output)

        const submissions=problem.visibleTestCase.map((testcases)=>({
            source_code:code,
            language_id:languageId,
            stdin:testcases.input,
            expected_output:testcases.output
        }));
        //console.log(submissions);
//         [
//   { input: "1 2", output: "3" },
//   { input: "5 10", output: "15" }
// ]
        const submitResult=await submitBatch(submissions);
        // console.log(submitResult);
        const resultToken=submitResult.map((value)=>value.token);
        
        const testResult=await submittoken(resultToken);
        
        // console.log(testResult);
        
        let testCasesPassed=0;
        let runtime=0;
        let memory=0;
        let status=true;
        let errorMessage=null;
        for(const test of testResult){
            if(test.status_id==3){
                testCasesPassed++;
                runtime=runtime+parseFloat(test.time);
                memory=Math.max(memory,test.memory);
            }
            else{
                if(test.status_id==4){
                    status=false
                    errorMessage=test.stderr
                }
                else{
                    status=false;
                    errorMessage=test.stderr
                }
            }
        }

        res.status(201).json({
            success:status,
            testCases:testResult,
            runtime,
            memory
        });
    }
    catch(err){
      res.status(500).send(" problem mohit Internal Server Error "+ err);
    }
}
module.exports={submitCode,runcode};

//in runCode testResult is look like this
// [
// {
//         "source_code": "I2luY2x1ZGUgPGlvc3RyZWFtPgp1c2luZyBuYW1lc3BhY2Ugc3RkOwoKaW50IG1haW4oKSB7CiAgICBpbnQgYSwgYjsKICAgIGNpbiA+PiBhID4+IGI7CiAgICBjb3V0IDw8IGEgKyBiOwogICAgcmV0dXJuIDA7Cn0=",
//         "language_id": 54,
//         "stdin": "MyA1",
//         "expected_output": "OA==",
//         "stdout": "OA==",
//         "status_id": 3,
//         "created_at": "2025-11-07T04:02:45.644Z",
//         "finished_at": "2025-11-07T04:02:46.219Z",
//         "time": "0.002",
//         "memory": 1620,
//         "stderr": null,
//         "token": "27aee823-2c54-420b-a557-7ec2e63f8ccd",
//         "number_of_runs": 1,
//         "cpu_time_limit": "5.0",
//         "cpu_extra_time": "1.0",
//         "wall_time_limit": "10.0",
//         "memory_limit": 256000,
//         "stack_limit": 64000,
//         "max_processes_and_or_threads": 128,
//         "enable_per_process_and_thread_time_limit": false,
//         "enable_per_process_and_thread_memory_limit": false,
//         "max_file_size": 5120,
//         "compile_output": null,
//         "exit_code": 0,
//         "exit_signal": null,
//         "message": null,
//         "wall_time": "0.012",
//         "compiler_options": null,
//         "command_line_arguments": null,
//         "redirect_stderr_to_stdout": false,
//         "callback_url": null,
//         "additional_files": null,
//         "enable_network": true,
//         "post_execution_filesystem": "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",
//         "status": {
//             "id": 3,
//             "description": "Accepted"
//         },
//         "language": {
//             "id": 54,
//             "name": "C++ (GCC 9.2.0)"
//         }
//     }
// ]