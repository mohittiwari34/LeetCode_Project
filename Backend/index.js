require('dotenv').config();
const express = require('express');
const app = express();
const main = require('./src/config/db');
const cookieParser = require('cookie-parser');
const authRouter = require('./src/route/userAuth');
const problemRouter = require("./src/route/problemCreator");
const reddisClient = require('./src/config/redis');
const submitRouter = require('./src/models/submit');
const aiRouter = require('./src/route/aiChatting');
const videRouter = require("./src/route/videoCreator");
const profileRouter = require("./src/route/profilephotoCreator");
const PaymentRouter = require("./src/route/paymentRoutes");
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("LeetCode Project Backend is Running 🚀");
});

app.use("/user", authRouter);
app.use("/auth", authRouter);
app.use("/problem", problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use("/video", videRouter);
app.use("/profile", profileRouter);
app.use("/payment", PaymentRouter);

const InitalizeConnection = async () => {
  try {
    await main();
    console.log("Database Connected successfully");
  } catch (err) {
    console.error("Database Connection Error:", err.message || err);
  }

  try {
    if (process.env.REDIS_URL || process.env.REDDIS_URL || process.env.REDDIS_HOST) {
      await reddisClient.connect();
      console.log("Redis Connected successfully");
    } else {
      console.log("No Redis configuration found, running without Redis cache.");
    }
  } catch (err) {
    console.warn("Redis Connection Failed (continuing without Redis):", err.message || err);
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("Server listening at port number: " + port);
  });
};

InitalizeConnection();
