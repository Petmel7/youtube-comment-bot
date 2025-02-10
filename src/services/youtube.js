
const axios = require("axios");
const { getAccessToken } = require('../config/oauth');
const { YOUTUBE_API_KEY, CHANNEL_ID } = require("../config/config");

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

async function getComments() {
    const videoId = await getLatestVideoId();
    console.log("✅ videoId", videoId);
    if (!videoId) return [];

    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data.items.map(item => ({
            id: item.id,
            text: item.snippet.topLevelComment.snippet.textDisplay
        }));
    } catch (error) {
        console.error("❌ Помилка при отриманні коментарів:", error.message);
        return [];
    }
}

async function replyToComment(commentId, responseText) {
    try {

        const accessToken = await getAccessToken();
        console.log("✅ Використовується токен:", accessToken); // Додати для перевірки


        const url = "https://www.googleapis.com/youtube/v3/comments?part=snippet";
        const data = { snippet: { parentId: commentId, textOriginal: responseText } };
        const headers = { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" };

        const response = await axios.post(url, data, { headers });
        // console.log(`📌 Відповідь додана під відео: https://www.youtube.com/watch?v=${response.data.snippet.videoId}`);

        console.log("✅ Відповідь додана:", response.data);
    } catch (error) {
        console.error("❌ Помилка при відповіді на коментар:", error.message);
    }
}

module.exports = { getComments, replyToComment };
