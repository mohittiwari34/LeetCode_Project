const express = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const profileRouter = express.Router();

const { photoUploadSignature, saveProfileimage } = require("../controllers/profilePhoto");

profileRouter.get("/create-signature", userMiddleware, photoUploadSignature);
profileRouter.post("/save-photo", userMiddleware, saveProfileimage);

module.exports = profileRouter