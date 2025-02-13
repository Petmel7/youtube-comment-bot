
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_API_KEY } = require("../config/config");
const { promptTemplate, unwantedPhrases } = require("../config/promptConfig");

if (!GEMINI_API_KEY) {
    console.error("❌ Помилка: GEMINI_API_KEY не встановлений!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function generateResponse(comment, retries = 5) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `${promptTemplate}\nUser: ${comment}\nResponse:`;

        const result = await model.generateContent(prompt);
        let response = await result.response.text();

        // Фільтрація "ботських" фраз
        unwantedPhrases.forEach(phrase => {
            response = response.replace(new RegExp(phrase, "gi"), "");
        });

        return response.trim();
    } catch (error) {
        console.error("❌ Помилка виклику Gemini API:", error.message);

        if (error.status === 503) {
            if (retries > 0) {
                const delay = Math.pow(2, 6 - retries) * 5000; // 5, 10, 20, 40 сек
                console.log(`🔄 Повторний запит через ${delay / 1000} секунд... (Залишилось спроб: ${retries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return generateResponse(comment, retries - 1);
            } else {
                console.log("❌ Сервіс Gemini недоступний навіть після кількох спроб.");
                return "⚠️ Сервіс тимчасово перевантажений. Будь ласка, спробуйте пізніше.";
            }
        }

        if (error.message.includes("Candidate was blocked due to SAFETY")) {
            console.log("⚠️ Відповідь була заблокована Google. Використаємо стандартну відповідь.");
            return "Цікавий запит! Я спробую знайти для тебе відповідь.";
        }

        return "❌ Помилка при генерації відповіді.";
    }
}

module.exports = { generateResponse };


