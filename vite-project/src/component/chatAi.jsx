import {useState,useRef,useEffect} from "react"; 
import {useForm} from "react-hook-form"; 
import axiosClient from "../Utils/axiosClient"; 
import {Send} from 'lucide-react'; 

export default function ChatAi({problem}){
    const[messages,setMessages]=useState([
        {role:'model',parts:[{text:"Hello! I'm here to help you with this coding problem. Ask me anything about the problem or for hints!"}]}
    ]);
    const {register,handleSubmit,reset,formState:{errors}}=useForm();
    const messageEndRef=useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(()=>{
        messageEndRef.current?.scrollIntoView({behavior:"smooth"});
    },[messages]);

    const onSubmit=async(data)=>{
        const userMessage = data.message.trim();
        if (!userMessage) return;
        
        setMessages(prev=>[...prev,{role:'user',parts:[{text:userMessage}]}]);
        reset();
        setIsLoading(true);
        
        try{
            const response=await axiosClient.post("/ai/chat",{
                message: [...messages, {role:'user',parts:[{text:userMessage}]}],
                title:problem.title,
                description:problem.descripton,
                testCases: problem.visibleTestCase,
                startCode:problem.startCode
            })
            
            setMessages(prev=>[...prev,{
                role:'model',
                parts:[{text:response.data.message}]
            }]);
        } catch(err){
            console.log("Api error:",err);
            setMessages(prev=>[...prev,{
                role:'model',
                parts:[{text:"Sorry, I'm having trouble responding right now. Please try again."}]
            }]);
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <div className="flex flex-col h-full min-h-[500px]">
            {/* Header */}
            <div className="border-b border-base-300 p-4 bg-base-100">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    AI Assistant
                </h2>
                <p className="text-sm text-gray-500">Ask for hints, explanations, or code review</p>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
                {messages.length === 1 && messages[0].role === 'model' ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <div className="text-2xl">🤖</div>
                        </div>
                        <p className="text-lg font-medium mb-2">Ask me about the problem!</p>
                        <p className="text-sm text-gray-500 text-center max-w-md">
                            I can help you understand the problem, provide hints, review your code, or explain solutions.
                        </p>
                    </div>
                ) : (
                    messages.map((msg,index)=>(
                        <div key={index} className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}>
                            <div className={`max-w-[80%] ${msg.role==="user"?"bg-primary text-primary-content":"bg-base-200"} rounded-2xl px-4 py-3`}>
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {msg.parts[0].text}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-base-200 rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-2">
                                <span className="loading loading-dots loading-xs"></span>
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messageEndRef}/>
            </div>
            
            {/* Input Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="border-t border-base-300 bg-base-100 p-4">
                <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <input 
                            placeholder="Type your question here..." 
                            className="input input-bordered w-full pr-12"
                            {...register("message",{
                                required: "Message is required",
                                minLength: {
                                    value: 2,
                                    message: "Message must be at least 2 characters"
                                }
                            })}
                            disabled={isLoading}
                        />
                        {errors.message && (
                            <div className="absolute -bottom-6 left-0 text-xs text-error">
                                {errors.message.message}
                            </div>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        className={`btn btn-primary ${isLoading ? 'btn-disabled' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <Send size={20}/>
                        )}
                    </button>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                    Press Enter to send • Shift+Enter for new line
                </div>
            </form>
        </div>
    )
}