// const axios = require('axios');
// const { YOUTUBE_API_KEY, VIDEO_ID, YOUTUBE_ACCESS_TOKEN } = require('../config/config');

// async function getLatestVideoId(channelId) {
//     const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=id&type=video&maxResults=1`;
//     const response = await axios.get(url);
//     return response.data.items[0].id.videoId;
// }

// async function getComments() {
//     const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${VIDEO_ID}&key=${YOUTUBE_API_KEY}`;
//     const response = await axios.get(url);
//     return response.data.items.map(item => ({
//         id: item.id,
//         text: item.snippet.topLevelComment.snippet.textDisplay
//     }));
// }

// async function replyToComment(commentId, responseText) {
//     const url = `https://www.googleapis.com/youtube/v3/comments?part=snippet&key=${YOUTUBE_API_KEY}`;
//     const data = { snippet: { parentId: commentId, textOriginal: responseText } };

//     await axios.post(url, data, { headers: { Authorization: `Bearer ${YOUTUBE_ACCESS_TOKEN}` } });
//     console.log("Відповідь додана:", responseText);
// }

// module.exports = { getComments, replyToComment };




const axios = require('axios');
const { YOUTUBE_API_KEY, YOUTUBE_ACCESS_TOKEN, CHANNEL_ID } = require('../config/config');

async function getLatestVideoId() {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=id&type=video&maxResults=1`;

    try {
        const response = await axios.get(url);
        const videoId = response.data.items[0]?.id?.videoId;

        if (!videoId) throw new Error("Не вдалося отримати VIDEO_ID");

        console.log("✅ Отримано VIDEO_ID:", videoId);
        return videoId;
    } catch (error) {
        console.error("❌ Помилка при отриманні VIDEO_ID:", error.response ? error.response.data : error.message);
        return null;
    }
}

async function getComments() {
    const videoId = await getLatestVideoId();
    if (!videoId) return [];

    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data.items.map(item => ({
            id: item.id,
            text: item.snippet.topLevelComment.snippet.textDisplay
        }));
    } catch (error) {
        console.error("❌ Помилка при отриманні коментарів:", error.response ? error.response.data : error.message);
        return [];
    }
}

async function replyToComment(commentId, responseText) {
    const url = "https://www.googleapis.com/youtube/v3/comments?part=snippet";

    const data = { snippet: { parentId: commentId, textOriginal: responseText } };

    const headers = {
        Authorization: `Bearer ${YOUTUBE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log("✅ Відповідь додана:", response.data);
    } catch (error) {
        console.error("❌ Помилка при відповіді на коментар:", error.response ? error.response.data : error.message);
    }
}

module.exports = { getComments, replyToComment };
