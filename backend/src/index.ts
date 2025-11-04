

import dotenv from 'dotenv';
import path from 'path'
import { Request, Response } from 'express';
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";
// Point to the correct location of .env manually
dotenv.config({ path: path.resolve(__dirname, '../.env') }) // ✅
import { router } from './project_ideas_db';
import cors from 'cors';
import express from 'express'
import listEndpoints from "express-list-endpoints";
const app = express();
const PORT = 3000
// 👇 Serve your built React files
console.log("tehe static start")
app.use(express.static(path.join(__dirname, "out/renderer")));
console.log("the /* route")


console.log("🧭 Registered routes:", listEndpoints(app));
// Start the server
console.log("server is staring")
app.use(cors())
app.use(express.json())
app.use("/database",router)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

app.get("/start-auth", async (req: Request, res: Response) => {
  try {
    // Generate a Firebase custom token or session redirect
    // For example, redirect to Google login page:
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=https://my-next-dev-project.onrender.com/auth/redirect&response_type=token&scope=email%20profile`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("🔥 Error starting auth:", error);
    res.status(500).send("Error starting authentication");
  }
});
app.get("/auth/redirect", (req, res) => {
  const token = req.query.token;

  res.send(`
    <html>
      <body>
        <script>
          // Redirect back to your Electron app using a custom scheme
          window.location.href = "mynextdevproject://auth?token=${token}";
        </script>
      </body>
    </html>
  `);
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