

import dotenv from 'dotenv';
import path from 'path'
import { Request, Response } from 'express';
import { google } from "googleapis";
import { ParsedQs } from "qs";
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
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "https://my-next-dev-project.onrender.com/auth/google/callback";;

// Step 1: Redirect to Google login
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Step 1 – send user to Google Auth page
router.get("/auth/google", (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["email", "profile"],
  });
  res.redirect(url);
});

// Step 2 – Google redirects back here
router.get("/auth/google/callback", async (req: Request, res: Response) => {
  try {
    // ✅ Force TypeScript to treat it as string | undefined
    const code = Array.isArray(req.query.code)
      ? (req.query.code[0] as string)
      : (req.query.code as string | undefined);

    if (!code) {
      return res.status(400).send("Missing code");
    }

    // ✅ Now TS knows it's a string
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    const token = tokens.id_token;

    res.redirect(`mynextdevproject://auth?token=${encodeURIComponent(token!)}`);
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).send("Authentication failed");
  }
});

// Step 3 – Electron verifies later if needed
router.post("/verify-token", async (req, res) => {
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