// =======================================================
// IMPORT DEPENDENCIES
// =======================================================
import express from "express";
import twilio from "twilio";
import { google } from "googleapis";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // serve frontend files from /public

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
// ROUTE: SEND WHATSAPP MESSAGES
// =======================================================
app.post("/send", async (req, res) => {
  try {
    console.log("📊 Fetching data from Google Sheet...");
    const sheetId = process.env.SHEET_ID;

    // Adjust this if your sheet tab has a different name
    const range = "Sheet1!A2:H"; 
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = result.data.values;

    if (!rows || rows.length === 0) {
      console.log("⚠️ No data found in Google Sheet.");
      return res.status(400).send("❌ No data found in Google Sheet.");
    }

    console.log(`✅ Found ${rows.length} rows. Preparing to send messages...`);

    for (const row of rows) {
      // Expected columns (A–H)
      // A - Student Name
      // B - Appetite
      // C - Sleeping
      // D - Behaviour
      // E - Mood
      // F - Note
      // G - Parent Number
      // H - Message (optional if generated in Sheets)
      const [studentName, appetite, sleeping, behaviour, mood, note, phone, messageFromSheet] = row;

      if (!phone) {
        console.log(`⚠️ Skipping ${studentName || "Unnamed"} (missing phone number)`);
        continue;
      }

      // If your sheet already generates the message (H column), use it.
      // Otherwise, build it dynamically here:
      const messageBody =
        messageFromSheet ||
        `
🌞 Good evening, dear parent!

Here’s today’s daily report for your little one 🧸💕

👧 Student: ${studentName || "Unknown"}

🍽 Appetite: ${appetite || "N/A"}
💤 Sleeping: ${sleeping || "N/A"}
😊 Behaviour: ${behaviour || "N/A"}
🎭 Mood: ${mood || "N/A"}
📝 Note: ${note || "No note provided."}

Your child had a wonderful day at school today! 💖
- The Kindergarten Team 🏫✨
        `;

      try {
        console.log(`➡️ Sending message to ${phone} (${studentName || "Unknown"})...`);
        await client.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM, // e.g., whatsapp:+14155238886
          to: `whatsapp:${phone}`,
          body: messageBody,
        });
        console.log(`✅ Message sent successfully to ${phone}`);
      } catch (err) {
        console.error(`❌ Failed to send to ${phone}: ${err.message}`);
      }
    }

    res.send("✅ All messages processed successfully!");
  } catch (error) {
    console.error("❌ Error in /send:", error);
    res.status(500).send("⚠️ Internal Server Error: " + (error.message || "Unknown error"));
  }
});

// =======================================================
// START THE SERVER
// =======================================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
