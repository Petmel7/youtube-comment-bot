// const fs = require("fs");
// const path = require("path");
// const readline = require("readline");
// const { google } = require("googleapis");

// // Шляхи до файлів
// const TOKEN_PATH = path.join(__dirname, "token.json");
// const CREDENTIALS_PATH = path.join(__dirname, "client_secret.json");

// // Завантажуємо облікові дані
// function loadCredentials() {
//     return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
// }

// // Запускаємо OAuth2 авторизацію
// async function authorize() {
//     const credentials = loadCredentials();
//     const { client_secret, client_id, redirect_uris } = credentials.installed;
//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//     if (fs.existsSync(TOKEN_PATH)) {
//         const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
//         oAuth2Client.setCredentials(token);
//         return oAuth2Client;
//     }

//     return getNewToken(oAuth2Client);
// }

// // Отримуємо новий токен
// function getNewToken(oAuth2Client) {
//     const authUrl = oAuth2Client.generateAuthUrl({
//         access_type: "offline",
//         scope: ["https://www.googleapis.com/auth/youtube.force-ssl"],
//     });

//     console.log("🔗 Перейди за цим посиланням для авторизації:", authUrl);

//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });

//     return new Promise((resolve) => {
//         rl.question("👉 Встав код авторизації: ", (code) => {
//             rl.close();
//             oAuth2Client.getToken(code, (err, token) => {
//                 if (err) {
//                     console.error("❌ Помилка отримання токена:", err);
//                     return;
//                 }
//                 oAuth2Client.setCredentials(token);
//                 fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2));
//                 console.log("✅ Токен збережено в", TOKEN_PATH);
//                 resolve(oAuth2Client);
//             });
//         });
//     });
// }

// // Виконуємо отримання токена
// authorize().catch(console.error);





// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");
// const { getAccessToken } = require("../config/oauth");
// const { YOUTUBE_API_KEY, CHANNEL_ID } = require("../config/config");

// // Шлях до файлу оброблених коментарів
// const REPLIED_COMMENTS_FILE = path.join(__dirname, "replied_comments.json");

// // Завантажуємо список оброблених коментарів
// function loadRepliedComments() {
//     try {
//         if (fs.existsSync(REPLIED_COMMENTS_FILE)) {
//             return JSON.parse(fs.readFileSync(REPLIED_COMMENTS_FILE, "utf-8"));
//         }
//     } catch (error) {
//         console.error("❌ Помилка при читанні файлу з обробленими коментарями:", error.message);
//     }
//     return [];
// }

// // Зберігаємо ID оброблених коментарів
// function saveRepliedComments(comments) {
//     try {
//         fs.writeFileSync(REPLIED_COMMENTS_FILE, JSON.stringify(comments, null, 2));
//     } catch (error) {
//         console.error("❌ Помилка при збереженні оброблених коментарів:", error.message);
//     }
// }

// // Отримуємо останнє відео
// async function getLatestVideoId() {
//     const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=id&type=video&maxResults=1`;
//     try {
//         const response = await axios.get(url);
//         return response.data.items[0]?.id?.videoId || null;
//     } catch (error) {
//         console.error("❌ Помилка при отриманні VIDEO_ID:", error.message);
//         return null;
//     }
// }

// // Отримуємо список коментарів
// async function getComments() {
//     const videoId = await getLatestVideoId();
//     console.log("✅ videoId", videoId);
//     if (!videoId) return [];

//     const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`;
//     try {
//         const response = await axios.get(url);
//         const repliedComments = loadRepliedComments();

//         return response.data.items
//             .map(item => ({
//                 id: item.id,
//                 text: item.snippet.topLevelComment.snippet.textDisplay
//             }))
//             .filter(comment => !repliedComments.includes(comment.id)); // Фільтруємо оброблені коментарі
//     } catch (error) {
//         console.error("❌ Помилка при отриманні коментарів:", error.message);
//         return [];
//     }
// }

// async function addHeartToComment(commentId, accessToken) {
//     try {
//         const url = "https://www.googleapis.com/youtube/v3/comments?part=snippet";
//         const headers = { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" };

//         const data = {
//             id: commentId,
//             snippet: {
//                 viewerRating: "like" // Додає сердечко "сподобалось автору"
//             }
//         };

//         const response = await axios.put(url, data, { headers });
//         console.log(`❤️ Сердечко сподобалось автору додано на коментар: ${commentId}`);
//     } catch (error) {
//         console.error("❌ Помилка при додаванні сердечка:", error.response?.data || error.message);
//     }
// }

// // Відповідаємо на коментар
// async function replyToComment(commentId, responseText, accessToken) {
//     try {
//         const url = "https://www.googleapis.com/youtube/v3/comments?part=snippet";
//         const data = { snippet: { parentId: commentId, textOriginal: responseText } };
//         const headers = { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" };

//         const response = await axios.post(url, data, { headers });
//         console.log(`✅ Відповідь додана на коментар ${commentId}:`, response.data);
//     } catch (error) {
//         console.error("❌ Помилка при відповіді на коментар:", error.response?.data || error.message);
//     }
// }

// // Основна функція обробки коментарів
// async function processComments() {
//     const comments = await getComments();
//     if (!comments || comments.length === 0) {
//         console.log("✅ Немає нових коментарів для обробки.");
//         return;
//     }

//     const accessToken = await getAccessToken();

//     for (const comment of comments) {
//         console.log(`🔄 Обробка коментаря: ${comment.id}`);

//         // 1. Додаємо сердечко "сподобалось автору"
//         await addHeartToComment(comment.id, accessToken);

//         // 2. Чекаємо 2 секунди перед відповіддю
//         await new Promise(resolve => setTimeout(resolve, 2000));

//         // 3. Відповідаємо на коментар
//         await replyToComment(comment.id, "Дякую за коментар! ❤️", accessToken);

//         // 4. Додаємо коментар у список оброблених
//         const repliedComments = loadRepliedComments();
//         repliedComments.push(comment.id);
//         saveRepliedComments(repliedComments);
//     }
// }

// module.exports = { processComments, replyToComment };










// const { processComments, replyToComment } = require('./services/youtube');
// const { generateResponse } = require('./services/geminiai');

// (async () => {
//     const comments = await processComments();
//     for (const comment of comments) {
//         const responseText = await generateResponse(comment.text);
//         await replyToComment(comment.id, responseText);
//     }
// })();

// const { processComments } = require('./services/youtube');

// (async () => {
//     await processComments();
// })();