// =======================================================
// IMPORT DEPENDENCIES
// =======================================================
import express from "express";
import twilio from "twilio";
import { google } from "googleapis";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// =======================================================
// TWILIO CONFIGURATION
// =======================================================
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// =======================================================
// GOOGLE SHEETS CONFIGURATION
// =======================================================
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // service account key file
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

// =======================================================
// ROUTE: SEND WHATSAPP MESSAGES (STREAMING LOGS)
// =======================================================
app.get("/send", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // helper function to send SSE messages
  const sendLog = (msg) => {
    res.write(`data: ${msg}\n\n`);
  };

  try {
    sendLog("📊 Fetching data from Google Sheet...");
    const sheetId = process.env.SHEET_ID;
    const range = "Sheet1!A2:H";

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = result.data.values;
    if (!rows || rows.length === 0) {
      sendLog("⚠️ No data found in Google Sheet.");
      return res.end();
    }

    sendLog(`✅ Found ${rows.length} rows. Preparing to send messages...`);

    for (const row of rows) {
      const [studentName, appetite, sleeping, behaviour, mood, note, phone, messageFromSheet] = row;

      if (!phone) {
        sendLog(`⚠️ Skipping ${studentName || "Unnamed"} (missing phone number)`);
        continue;
      }

      const messageBody =
        messageFromSheet ||
        `
👧 Student: ${studentName || "Unknown"}
🍽 Appetite: ${appetite || "N/A"}
💤 Sleeping: ${sleeping || "N/A"}
😊 Behaviour: ${behaviour || "N/A"}
🎭 Mood: ${mood || "N/A"}
📝 Note: ${note || "No note provided."}
        `;

      sendLog(`➡️ Sending message to ${phone} (${studentName || "Unknown"})...`);

      try {
        await client.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM,
          to: `whatsapp:${phone}`,
          body: messageBody,
        });
        sendLog(`✅ Message sent successfully to ${phone}`);
      } catch (err) {
        sendLog(`❌ Failed to send to ${phone}: ${err.message}`);
      }
    }

    sendLog("🎉 All messages processed successfully!");
    sendLog("[DONE]");
    res.end();
  } catch (error) {
    sendLog(`❌ Error in /send: ${error.message}`);
    sendLog("[DONE]");
    res.end();
  }
});


// =======================================================
// SERVE FRONTEND (SAFE FOR NODE 22+)
// =======================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "client", "dist");
app.use(express.static(distPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// =======================================================
// START SERVER
// =======================================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
