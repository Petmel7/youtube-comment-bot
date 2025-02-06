const { OpenAI } = require("openai");
const { OPENAI_API_KEY } = require('../config/config');

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function generateResponse(comment) {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: comment }],
    });

    return response.choices[0].message.content;
}

module.exports = { generateResponse };
