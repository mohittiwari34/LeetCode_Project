
const express =require('express');
const app=express();
const main=require('./src/config/db')
require('dotenv').config();
const cookieParser=require('cookie-parser');
const authRouter=require('./src/route/userAuth');
const problemRouter=require("./src/route/problemCreator");
const reddisClient=require('./src/config/redis');
const submitRouter=require('./src/models/submit');
const aiRouter=require('./src/route/aiChatting')
const videRouter =require("./src/route/videoCreator");
const profileRouter=require("./src/route/profilephotoCreator")
const cors = require('cors')
// const PaymentRouter=require("./src/route/paymentRoutes");

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://leet-code-project-gpua.vercel.app"
    ];

    // allow requests with no origin (like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("LeetCode Project Backend is Running 🚀");
});
app.use("/user",authRouter);
app.use("/auth",authRouter);
app.use("/problem",problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videRouter);
app.use("/profile",profileRouter);
// app.use("/payment",PaymentRouter);

const InitalizeConnection=async()=>{
    try{
        await Promise.all([main(),reddisClient.connect()]);
        console.log("Db Connected");
        app.listen(process.env.PORT,()=>{
            console.log("server listening at port number: "+process.env.PORT);
        })

    }
    
    catch(err){
        console.log("Error: "+err);
    }
}
InitalizeConnection();
