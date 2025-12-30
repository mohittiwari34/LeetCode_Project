import {useState,useRef,useEffect} from "react";
import {useForm} from "react-hook-form";
import axiosClient from "../Utils/axiosClient";
import {Send} from 'lucide-react';


export default function ChatAi({problem}){
    const[messages,setMessages]=useState([
        {role:'model',parts:[{text:"Hi How are you"}]},
        {role:'user',parts:[{text:"I am Good"}]}
    ]);
    const {register,handleSubmit,reset,formState:{errors}}=useForm();
    const messageEndRef=useRef(null);

    useEffect(()=>{
        messageEndRef.current?.scrollIntoView({behavior:"smooth"});

    },[messages]);

    const onSubmit=async(data)=>{
        setMessages(prev=>[...prev,{role:'user',parts:[{text:data.message}] }]);
        reset();
        try{
            
            console.log(messages);
            //console.log(typeof messages);
            console.log(problem.title);
            //console.log(problem.descripton);
            //console.log(problem.visibleTestCase);
            //console.log(problem.startCode);

            const response=await axiosClient.post("/ai/chat",{
                message: messages,
                title:problem.title,
                description:problem.descripton,
                testCases: problem.visibleTestCase,
                startCode:problem.startCode
            })
            setMessages(prev=>[...prev,{
                role:'model',
                parts:[{text:response.data.message}]
            }]);
        }
        catch(err){
            console.log("Api error:",err);
            setMessages(prev=>[...prev,{
                role:'model',
                parts:[{text:"Error from AI Chatbot"}]
            }]);
        }
    }

    return(
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg,index)=>(
                    <div key={index} className={`chat ${msg.role==="user"?"chat-end":"chat-start"}`}>
                        <div className="chat-buble bg-base-200 text-base-content"
                        >{msg.parts[0].text}</div>

                    </div>
                ))}
                <div ref={messageEndRef}/>
            </div>
            


            <form onSubmit={handleSubmit(onSubmit)}
            className="sticky bottom-0 p-4 bg-base-100 border-t">
                <div className="flex items-center">
                    <input
                    placeholder="Ask me anything"
                    className="input input-bordered flex-1"
                    {...register("message",{required:true,minLength:2})}/>
                    <button type="submit" className="btn btn-ghost ml-2" disable={errors.mesage}><Send size={20}/></button>
                </div>

            </form>
        </div>
    )

}