const mongoose = require('mongoose');

async function Main() {
    if (!process.env.DB_CONNECT_STRING) {
        throw new Error("DB_CONNECT_STRING environment variable is missing. Please set it in your .env file or hosting provider.");
    }
    await mongoose.connect(process.env.DB_CONNECT_STRING);
}

module.exports = Main;
