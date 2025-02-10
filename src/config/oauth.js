
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const TOKEN_PATH = path.join(__dirname, "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "client_secret.json");

function loadCredentials() {
    return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
}

async function authorize() {
    const credentials = loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
        oAuth2Client.setCredentials(token);

        // Перевіряємо, чи токен прострочений, і оновлюємо його
        if (Date.now() >= token.expiry_date) {
            console.log("🔄 Токен прострочений. Оновлюємо...");
            return refreshAccessToken(oAuth2Client);
        }

        return oAuth2Client;
    }

    return getNewToken(oAuth2Client);
}

// 🔹 Функція для оновлення токена
async function refreshAccessToken(oAuth2Client) {
    try {
        const { credentials } = await oAuth2Client.refreshAccessToken();
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials, null, 2));
        console.log("✅ Токен оновлено!");
        return oAuth2Client;
    } catch (error) {
        console.error("❌ Помилка оновлення токена:", error);
        throw error;
    }
}

async function getAccessToken() {
    const authClient = await authorize();
    return authClient.credentials.access_token;
}

module.exports = { getAccessToken };

