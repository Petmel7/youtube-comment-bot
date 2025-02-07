// const fs = require("fs");
// const path = require("path");
// const { google } = require("googleapis");

// const SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"];
// const TOKEN_PATH = path.join(__dirname, "../src/config/token.json");
// const CREDENTIALS_PATH = path.join(__dirname, "../src/config/client_secret.json");

// async function getAccessToken() {
//     const auth = new google.auth.GoogleAuth({
//         keyFile: CREDENTIALS_PATH,
//         scopes: SCOPES,
//     });

//     const authClient = await auth.getClient();
//     const token = await authClient.getAccessToken();

//     fs.writeFileSync(TOKEN_PATH, JSON.stringify({ access_token: token.token }, null, 2));
//     console.log("✅ Новий токен збережено!");
// }

// getAccessToken().catch(console.error);




const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"];
const TOKEN_PATH = path.join(__dirname, "../src/config/token.json");
const CREDENTIALS_PATH = path.join(__dirname, "../src/config/service_account.json"); // Використовуємо Service Account

async function getAccessToken() {
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH, // Правильний шлях до service_account.json
        scopes: SCOPES,
    });

    const authClient = await auth.getClient();
    const token = await authClient.getAccessToken();

    fs.writeFileSync(TOKEN_PATH, JSON.stringify({ access_token: token.token }, null, 2));
    console.log("✅ Новий токен збережено!");
}

getAccessToken().catch(console.error);

