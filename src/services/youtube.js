
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { getAccessToken } = require("../config/oauth");
const { YOUTUBE_API_KEY, CHANNEL_ID } = require("../config/config");

// Шлях до файлу, де зберігаються оброблені коментарі
const REPLIED_COMMENTS_FILE = path.join(__dirname, "replied_comments.json");

// Завантажуємо список оброблених коментарів
function loadRepliedComments() {
    try {
        if (fs.existsSync(REPLIED_COMMENTS_FILE)) {
            return JSON.parse(fs.readFileSync(REPLIED_COMMENTS_FILE, "utf-8"));
        }
    } catch (error) {
        console.error("❌ Помилка при читанні файлу з обробленими коментарями:", error.message);
    }
    return [];
}

// Зберігаємо ID оброблених коментарів
function saveRepliedComments(comments) {
    try {
        fs.writeFileSync(REPLIED_COMMENTS_FILE, JSON.stringify(comments, null, 2));
    } catch (error) {
        console.error("❌ Помилка при збереженні файлу з обробленими коментарями:", error.message);
    }
}

// Отримуємо останнє відео з каналу
async function getLatestVideoId() {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=id&type=video&maxResults=1`;
    try {
        const response = await axios.get(url);
        return response.data.items[0]?.id?.videoId || null;
    } catch (error) {
        console.error("❌ Помилка при отриманні VIDEO_ID:", error.message);
        return null;
    }
}

// Отримуємо список коментарів
async function getComments() {
    const videoId = await getLatestVideoId();
    console.log("✅ videoId", videoId);
    if (!videoId) return [];

    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`;
    try {
        const response = await axios.get(url);
        const repliedComments = loadRepliedComments();

        return response.data.items
            .map(item => ({
                id: item.id,
                text: item.snippet.topLevelComment.snippet.textDisplay
            }))
            .filter(comment => !repliedComments.includes(comment.id)); // Фільтруємо вже оброблені коментарі
    } catch (error) {
        console.error("❌ Помилка при отриманні коментарів:", error.message);
        return [];
    }
}

async function replyToComment(commentId, responseText) {
    try {
        const accessToken = await getAccessToken();
        console.log("✅ Використовується токен:", accessToken);

        const url = "https://www.googleapis.com/youtube/v3/comments?part=snippet";
        const data = { snippet: { parentId: commentId, textOriginal: responseText } };
        const headers = { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" };

        // Відповідаємо на коментар
        const response = await axios.post(url, data, { headers });
        console.log("✅ Відповідь додана:", response.data);

        // Зберігаємо коментар у список оброблених
        const repliedComments = loadRepliedComments();
        repliedComments.push(commentId);
        saveRepliedComments(repliedComments);
    } catch (error) {
        if (error.response) {
            console.error("❌ Помилка при відповіді на коментар:", error.response.data);
        } else {
            console.error("❌ Помилка:", error.message);
        }
    }
}

module.exports = { getComments, replyToComment };