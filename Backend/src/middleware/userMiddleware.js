const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require("../config/redis");

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is not persent");
        }
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;
        if (!_id) {
            throw new Error("Invalid token");
        }
        const result = await User.findById(_id);


        if (!result) {
            throw new Error("User Doesn't Exist");
        }


        const IsBlocked = await redisClient.exists(`token:${token}`);
        if (IsBlocked) {
            throw new Error("Invalid Token");
        }
        req.result = result;

        // Check for Premium Expiry
        if (result.isPremium && result.premiumExpiryDate && new Date() > new Date(result.premiumExpiryDate)) {
            result.isPremium = false;
            result.premiumExpiryDate = null;
            await result.save();
            console.log(`User ${result._id} premium expired.`);
        }

        next();

    }
    catch (err) {
        res.status(401).send("Error: " + err.message)
    }
}
module.exports = userMiddleware;