

import dotenv from 'dotenv';
import path from 'path'
import { Request, Response } from 'express';
import { google } from "googleapis";

// Point to the correct location of .env manually
dotenv.config({ path: path.resolve(__dirname, '../.env') }) // ✅
import { router } from './project_ideas_db';
import cors from 'cors';
import express from 'express'
import listEndpoints from "express-list-endpoints";
const app = express();
const PORT = 3000
// 👇 Serve your built React files
app.use(express.static(path.join(__dirname, "out/renderer")));

console.log("🧭 Registered routes:", listEndpoints(app));
// Start the server
console.log("server is staring")
app.use(cors())
app.use(express.json())
app.use("/database",router)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI =
  "https://my-next-dev-project.onrender.com/auth/google/callback"; // hosted redirect
const SCOPES = ["openid", "email", "profile"];

// Step 1: Redirect to Google login
export const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Step 1 – send user to Google Auth page
app.get("/auth/google", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  console.log("🌐 Redirecting to Google:", authUrl);
  res.redirect(authUrl);
});

// Step 2 – Google redirects back here
app.get("/auth/google/callback", async (req: Request, res: Response) => {
  try {
    const code =
      typeof req.query.code === "string" ? req.query.code : undefined;

    if (!code) {
      console.error("❌ Missing authorization code");
      return res.status(400).send("Missing authorization code");
    }

    // Exchange the code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Verify ID token (optional but good for extracting profile info)
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    console.log("✅ User authenticated:", payload?.email);

    // ✅ Redirect back to your Electron app
     const redirectDeepLink = `mynextdevproject://auth?token=${encodeURIComponent(
      tokens.id_token!
    )}`;

    console.log("🔁 Redirecting to:", redirectDeepLink);

    // ✅ Send small HTML that auto-forwards to your Electron app
    res.send(`
      <html>
        <head><title>Logging you in...</title></head>
        <body style="font-family: sans-serif; text-align: center; margin-top: 40px;">
          <h2>✅ Login successful!</h2>
          <p>You can now return to the app.</p>
          <script>
            window.location.href = "${redirectDeepLink}";
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("❌ Google Auth Error:", err);
    res.status(500).send("Authentication failed");
  }
});

// Step 3 – Electron verifies later if needed
app.post("/verify-token", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    res.json({ user: payload });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});
app.use((req: Request,res:Response)=>{
  res.status(404).json({message:"end point not found"})
})
app.get('/', (req:Request, res:Response) => {
  res.send('Hello from backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


console.log("🧭 Registered routes:", listEndpoints(app));