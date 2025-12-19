

import dotenv from 'dotenv';
import path from 'path'
import { Request, Response } from 'express';
import axios from "axios";

// Point to the correct location of .env manually
dotenv.config({ path: path.resolve(__dirname, '../.env') }) // ✅
import { router } from './project_ideas_db';
import cors from 'cors';
import express from 'express'
import listEndpoints from "express-list-endpoints";

const app = express();
const PORT = 4000
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
  "https://my-next-dev-project.onrender.com/oauth2callback"; // hosted redirect

app.get("/auth/google", (req, res) => {
  const code_challenge = req.query.code_challenge;

  if (!code_challenge) return res.status(400).send("Missing code_challenge");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=openid%20profile%20email` +
    `&code_challenge=${code_challenge}` +
    `&code_challenge_method=S256` +
    `&access_type=offline`;

  res.json({ authUrl });
});

app.get("/refresh-token", async (req, res) => {
  const refresh_token = req.query.refresh_token;

 if (typeof refresh_token !== "string") {
    return res.status(400).send("Missing or invalid refresh token");
  }

  try {
    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("refresh_token", refresh_token);
    params.append("grant_type", "refresh_token");

    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.json(tokenRes.data); // returns new access_token
  } catch (err) {
   // console.error(err.response?.data || err.message);
   console.error(err)
    res.status(500).json({ error: "Failed to refresh token" });
  }
});
//import { OAuth2Client } from "google-auth-library";


app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const code_verifier = req.query.code_verifier;

  if (!code || !code_verifier)
    return res.status(400).send("Missing code or verifier");
if (typeof code !== "string" || typeof code_verifier !== "string") {
    return res.status(400).send("Missing code or verifier");
  }
  try {
    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET); // Optional for PKCE
    params.append("code", code);
    params.append("code_verifier", code_verifier);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("grant_type", "authorization_code");

    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
   

    res.json(tokenRes.data);
  } catch (err) {
   // console.error("Token exchange failed:", err.response?.data || err.message);
    res
      .status(500)
      .json({ error: "Token exchange failed", details: err });
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