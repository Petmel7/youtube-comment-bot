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