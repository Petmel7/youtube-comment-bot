// const { OpenAI } = require("openai");
// const { OPENAI_API_KEY } = require('../config/config');

// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// async function generateResponse(comment) {
//     const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: comment }],
//     });

//     return response.choices[0].message.content;
// }

// module.exports = { generateResponse };



// async function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function generateResponse(comment) {
//     await delay(1000); // 1 секунда паузи перед запитом
//     const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: comment }],
//     });
//     return response.choices[0].message.content;
// }



require("dotenv").config();
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateResponse(comment) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(comment);
        const response = await result.response;
        return response.text(); // Повертаємо відповідь від Gemini AI
    } catch (error) {
        console.error("Помилка виклику Gemini API:", error);
        return "Помилка під час генерації відповіді.";
    }
}

module.exports = { generateResponse };


