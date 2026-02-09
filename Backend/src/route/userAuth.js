const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');
const User = require("../models/user");

const authRouter = express.Router();
const { register, login, googleLogin, logout, adminRegister, deleteProfile, updateStreak, getUserStats } = require("../controllers/userAuthent")

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/google", googleLogin);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post("/admin/register", adminMiddleware, adminRegister);
authRouter.delete("/deleteprofile", userMiddleware, deleteProfile);
authRouter.get("/check", userMiddleware, async (req, res) => {
  // const reply={
  //     firstName:req.result.firstName,
  //     emailId:req.result.emailId,
  //     _id:req.result._id,
  //     lastname:req.lastName,
  //     role:req.role,
  //     problemsolved:req.problemSolved,
  //     profilePhoto:req.profilePhoto,
  // }
  // res.status(201).json({
  //     user:reply,
  //     message:"Valid User"
  // });
  try {
    // user id came from token (middleware already decoded it)
    const userId = req.result._id;

    // fetch FULL user from database
    const user = await User.findById(userId).select(
      "firstName emailId role profilePhoto problemSolved currentStreak longestStreak lastActiveDate"
    );

    if (!user) {
      return res.status(401).json({ user: null });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        role: user.role,
        profilePhoto: user.profilePhoto,
        problemSolved: user.problemSolved,

      },
    });
  } catch (err) {
    res.status(401).json({ user: null });
  }
})


//authRouter.get("/getProfile",getProfile);
authRouter.post("/save/streak", userMiddleware, updateStreak);
authRouter.get("/stats", userMiddleware, getUserStats);

module.exports = authRouter;
