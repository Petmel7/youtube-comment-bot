// require('dotenv').config();

// module.exports = {
//     YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
//     YOUTUBE_ACCESS_TOKEN: process.env.YOUTUBE_ACCESS_TOKEN,
//     OPENAI_API_KEY: process.env.OPENAI_API_KEY,
//     CHANNEL_ID: process.env.CHANNEL_ID,
//     GEMINI_API_KEY: process.env.GEMINI_API_KEY
// };

// console.log("YOUTUBE_ACCESS_TOKEN:", process.env.YOUTUBE_ACCESS_TOKEN);




const fs = require("fs");
const path = require("path");
require("dotenv").config();

const TOKEN_PATH = path.join(__dirname, "token.json");

let accessToken = null;

try {
    const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
    accessToken = tokenData.access_token;
} catch (error) {
    console.error("❌ Не вдалося прочитати токен:", error.message);
}

module.exports = {
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    YOUTUBE_ACCESS_TOKEN: accessToken,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    CHANNEL_ID: process.env.CHANNEL_ID,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
};

