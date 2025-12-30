const { GoogleGenerativeAI } = require('@google/generative-ai');

const solveDoubt = async (req, res) => {
    try {
        const { message, title, description, testCases, startCode } = req.body;
        
        console.log("Received request with title:", title);

        // Initialize Google Generative AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        
        // Use gemini-1.5-flash model (make sure your API key has access)
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        // Create the prompt with problem context
        const problemContext = `
PROBLEM TITLE: ${title || "Not specified"}
PROBLEM DESCRIPTION: ${description || "Not provided"}
TEST CASES: ${JSON.stringify(testCases || [])}
STARTING CODE: ${startCode || "Not provided"}
`;

        // Get the last user message
        const userMessages = message.filter(msg => msg.role === 'user');
        const lastUserMessage = userMessages[userMessages.length - 1];
        
        if (!lastUserMessage) {
            return res.status(400).json({
                success: false,
                message: "No user message found"
            });
        }

        const prompt = `You are an expert Data Structures and Algorithms (DSA) tutor. Your role is strictly limited to helping with DSA problems.

CURRENT PROBLEM CONTEXT:
${problemContext}

USER'S QUESTION: ${lastUserMessage.parts[0].text}

Please provide helpful guidance, hints, explanations, or code review related ONLY to this DSA problem. Focus on teaching concepts and helping the user understand rather than just giving answers.

Response:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            success: true,
            message: text
        });
        
    } catch (err) {
        console.error("API Error:", err);
        
        // Fallback to a different model if gemini-1.5-flash fails
        if (err.status === 404) {
            return res.status(500).json({
                success: false,
                message: "AI service is currently unavailable. Please try again later."
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
}

module.exports = solveDoubt;

































// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const solveDoubt=async(req,res)=>{
//     try{
//         const {message,title,description,testcases,startCode}=req.body;
//         const ai=new GoogleGenAI({apiKey:process.env.GEMINI_KEY});
//         async function main(){
//             const response=await ai.models.generateContent({
//                 model:"gemini-1.5-flash",
//                 contents:message,
//                 config:{
//                     systemInstruction:`
//                     You are an expert Data Structures and Algorithmn (DSA) tutor specializing in helping users solve Coding problems. your role is strictly limited to DSA-related assistance only.

//                     ##CURRENT PROBLEM CONTEXT:
//                     [PROBLEM_TITLE]:${title}
//                     [PROBLEM_DESCRIPTION]:${description}
//                     [EXAMPLES]:${testcases}
//                     [STARTCODE]:${startCode}

//                     ##YOUR CAPABLITIES:
//                     1.**Hint Provider**:Give step by step by solution without revailing the complete solution
//                     2.**Code Reviewer**:Debug and fix code submission with explanations
//                     3.**Solution Guide**:provide optimal solution with detailed expalanations
//                     4.**Complexity Analyzer**: Explain time and space complexity trade-offs
//                     5.**Approach Suggester**: Recommend different algorithmic approaches (brute force, optimized, etc.)
//                     6.**Test Case Helper**: Help create additional test cases for edge case validation

//                     ##INTERACTION GUIDELINES:

//                     ### When auser ask for Hints:
//                     -Break down the problem into smaller sub-problem
//                     -Ask guiding question to help them think through solution
//                     -Provide algorithmic intuition without giving away the complete approach
//                     -Suggest relevant data stuctures or techniques to consider

//                     ###when user submits code for review :
//                     - Identify bugs and logic errors with clear explanations
//                     - Suggest improvements for readability and efficiency
//                     - Explain why certain approaches work or don't work
//                     - Provide corrected code with line-by-line explanations when needed    
                    
//                     #when user ask for Diffrent approaches:
//                     - List multiple solution strategies (if applicable)
//                     - Compare trade-offs between approaches
//                     - Explain when to use each approach
//                     - Provide complexity analysis for each     
                    
//                     ##RESPONSE FORMAT:
//                     -use clear ,concise expalnation 
//                     -format code with proper syntax highlighting
//                     -use example to illustrate concepts 
//                     -Break complex explanation into digestible parts
//                     -always relate back to current problem context
//                     -always response in the language in which user is comfotable or given the context

//                     ##STRICT LIMITATION:
//                     -only discuss topics related to current dsa problem
//                     -do not help with non DSA TOPICS(web development,databases,etc)
//                     -do not provide solution to diffrent problems
//                     -if asked about unrelated topics,politly redirect : "I can only help with the current dsa problem.what specific aspect of this problem would you like assistance with?

//                     ##  TEACHING PHILOSPHY:
//                     -Encourage understanding over memorization
//                     -Guide users to discover solution rather than just providing answers
//                     -Explain the why behind algorithmic choices
//                     -Help build problem-solving intution
//                     -promote best coding practices
                    
//                     Remember: Your goal is to help users learn and understand DSA concept through the lens of the current problem, not just provide quick answers.   `
//                 }
//             });
//             res.status(201).json({
//                 message:response.text
//             });
//             console.log(response.text);
//         }
//         main();
//     }
//     catch(err){
//         res.status(500).json({
//             message:"Internal server error"
//         })
//     }
// }
// module.exports=solveDoubt;