
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_API_KEY } = require("../config/config");

if (!GEMINI_API_KEY) {
    console.error("❌ Помилка: GEMINI_API_KEY не встановлений!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function generateResponse(comment, retries = 5) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(comment);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("❌ Помилка виклику Gemini API:", error.message);

        // Якщо помилка 503 (перевантаження сервера), повторюємо з довшим інтервалом
        if (error.status === 503 && retries > 0) {
            const delay = Math.pow(2, 6 - retries) * 5000; // 5, 10, 20, 40 сек
            console.log(`🔄 Повторний запит через ${delay / 1000} секунд... (Залишилось спроб: ${retries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateResponse(comment, retries - 1);
        }

        // Якщо відповідь заблоковано системою безпеки
        if (error.message.includes("Candidate was blocked due to SAFETY")) {
            console.log("⚠️ Відповідь була заблокована Google. Використаємо стандартну відповідь.");
            return "Вибачте, але я не можу відповісти на це питання.";
        }

        return "❌ Помилка при генерації відповіді.";
    }
}

module.exports = { generateResponse };
